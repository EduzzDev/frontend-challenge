import { http, HttpResponse } from 'msw'
import { allNfts, addAccount, createSession, deleteSession, findAccountByEmail, getAccount, getSession, hashPassword, saveDatabase } from './database'
import { publishOrderUpdate, socketHandlers } from './socket'
import { fromUnits, toUnits } from '@/lib/money'
import type { Cart, CartItem, Order, Quote, User, Wallet } from '@/types/domain'
import { createId } from '@/lib/id'

const fail = (status: number, code: string, message: string) => HttpResponse.json({ code, message }, { status })
function sessionFor(request: Request) {
  return getSession(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null)
}

function accountFor(request: Request) {
  const session = sessionFor(request)
  return session ? getAccount(session.user.id) : undefined
}

function cartFor(request: Request): Cart {
  const account = accountFor(request)
  if (account) return account.cart
  const guestId = request.headers.get('x-user-id') || 'guest'
  const key = `kurio-guest-cart-${guestId}`
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(key)
    if (saved) {
      try { return JSON.parse(saved) as Cart } catch { /* reset invalid guest data */ }
    }
  }
  return {
    userId: guestId,
    items: guestId === 'guest' ? ['emerald-ape-042', 'violet-nomad-314', 'ivory-baron-008'].flatMap((id) => {
      const nft = allNfts.find((entry) => entry.id === id)
      const quantity = id === 'emerald-ape-042' ? 2 : id === 'violet-nomad-314' ? 6 : 9
      return nft ? [{ nft, quantity }] : []
    }) : [],
    coupon: null,
    updatedAt: new Date().toISOString(),
  }
}

function storeCart(request: Request, cart: Cart) {
  cart.updatedAt = new Date().toISOString()
  const account = accountFor(request)
  if (account) account.cart = cart
  else if (typeof window !== 'undefined') window.localStorage.setItem(`kurio-guest-cart-${cart.userId}`, JSON.stringify(cart))
  saveDatabase()
  return cart
}

function mergeGuestCart(request: Request, account: NonNullable<ReturnType<typeof accountFor>>) {
  const guestCart = cartFor(request)
  for (const guestItem of guestCart.items) {
    const existing = account.cart.items.find((item) => item.nft.id === guestItem.nft.id)
    const quantity = Math.min(guestItem.nft.availability, guestItem.quantity + (existing?.quantity ?? 0))
    account.cart.items = existing
      ? account.cart.items.map((item) => item.nft.id === guestItem.nft.id ? { ...item, quantity } : item)
      : [...account.cart.items, { ...guestItem, quantity: Math.min(guestItem.quantity, guestItem.nft.availability) }]
  }
  storeCart(request, { ...guestCart, items: [] })
  saveDatabase()
}

async function scenarioResponse(request: Request) {
  const scenario = new URL(request.url).searchParams.get('scenario') ?? request.headers.get('x-mock-scenario')
  if (scenario === 'slow') await new Promise((resolve) => setTimeout(resolve, 1200))
  if (scenario === 'variable-latency') {
    const delay = [...new URL(request.url).pathname].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 900
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
  if (scenario === 'network-error') return HttpResponse.error()
  if (scenario === 'timeout') await new Promise((resolve) => setTimeout(resolve, 11_000))
  if (scenario === 'server-error') return fail(500, 'INTERNAL_ERROR', 'Falha simulada. Tente novamente.')
  if (scenario === 'unauthorized') return fail(401, 'UNAUTHORIZED', 'Sua sessão expirou. Entre novamente.')
  if (scenario === 'bad-request') return fail(400, 'BAD_REQUEST', 'A solicitação simulada está inválida.')
  if (scenario === 'forbidden') return fail(403, 'FORBIDDEN', 'Você não possui permissão para esta ação.')
  if (scenario === 'not-found') return fail(404, 'NOT_FOUND', 'O recurso solicitado não foi encontrado.')
  if (scenario === 'conflict') return fail(409, 'CONFLICT', 'O estado do recurso mudou. Atualize e tente novamente.')
  return undefined
}

async function jsonBody<T>(request: Request): Promise<T> {
  return await request.json() as T
}

function calculateQuote(cart: Cart): Quote {
  const subtotalUnits = cart.items.reduce((sum, item) => sum + toUnits(item.nft.price) * BigInt(item.quantity), 0n)
  const discountUnits = cart.coupon ? subtotalUnits * BigInt(cart.coupon.discountPercent) / 100n : 0n
  const feeUnits = cart.items.length ? toUnits('0.016') : 0n
  const nftVersion = cart.items.reduce((value, item) => value + item.nft.version, 0)
  return {
    items: cart.items,
    subtotal: fromUnits(subtotalUnits),
    discount: fromUnits(discountUnits),
    networkFee: fromUnits(feeUnits),
    total: fromUnits(subtotalUnits - discountUnits + feeUnits),
    version: `quote-${nftVersion}-${cart.updatedAt}`,
    validUntil: new Date(Date.now() + 60_000).toISOString(),
  }
}

export const handlers = [
  http.get('/api/auth/session', async ({ request }) => {
    const scenario = await scenarioResponse(request)
    if (scenario) return scenario
    const session = sessionFor(request)
    return session ? HttpResponse.json(session) : fail(401, 'UNAUTHORIZED', 'Sessão não encontrada.')
  }),
  http.post('/api/auth/login', async ({ request }) => {
    const scenario = await scenarioResponse(request)
    if (scenario) return scenario
    const body = await jsonBody<{ email: string; password: string }>(request)
    const account = findAccountByEmail(body.email)
    const accepted = Boolean(account && account.passwordHash === hashPassword(body.password, account.user.id))
    return account && accepted
      ? (() => { mergeGuestCart(request, account); return HttpResponse.json(createSession(account.user.id)) })()
      : fail(401, 'INVALID_CREDENTIALS', 'E-mail ou senha incorretos.')
  }),
  http.post('/api/auth/signup', async ({ request }) => {
    const body = await jsonBody<{ displayName: string; email: string; username?: string; password: string }>(request)
    if (!body.displayName?.trim() || !body.email?.includes('@') || body.password.length < 8) return fail(400, 'VALIDATION_ERROR', 'Confira os dados informados.')
    if (findAccountByEmail(body.email)) return fail(409, 'EMAIL_EXISTS', 'Este e-mail já possui uma conta.')
    const user: User = { id: `user-${createId()}`, email: body.email, displayName: body.displayName.trim(), username: body.username ?? body.email.split('@')[0] }
    addAccount(user, hashPassword(body.password, user.id))
    const account = getAccount(user.id)
    if (account) mergeGuestCart(request, account)
    saveDatabase()
    return HttpResponse.json(createSession(user.id), { status: 201 })
  }),
  http.post('/api/auth/logout', ({ request }) => {
    deleteSession(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null)
    return HttpResponse.json({ success: true })
  }),
  http.get('/api/nfts', async ({ request }) => {
    const scenario = await scenarioResponse(request)
    if (scenario) return scenario
    const params = new URL(request.url).searchParams
    if (params.get('scenario') === 'empty' || request.headers.get('x-mock-scenario') === 'empty') return HttpResponse.json({ items: [], total: 0, page: 1, pageSize: 9 })
    const search = params.get('search')?.trim().toLowerCase()
    const collection = params.get('collection')
    const network = params.get('network')
    const minimum = Number(params.get('minPrice') ?? 0)
    const maximum = Number(params.get('maxPrice') ?? Number.MAX_SAFE_INTEGER)
    let items = allNfts.filter((nft) => (!search || `${nft.name} ${nft.number}`.toLowerCase().includes(search)) &&
      (!collection || nft.collection === collection) && (!network || nft.network === network) &&
      Number(nft.price) >= minimum && Number(nft.price) <= maximum)
    if (params.get('sort') === 'price-low') items = [...items].sort((a, b) => Number(a.price) - Number(b.price))
    if (params.get('sort') === 'price-high') items = [...items].sort((a, b) => Number(b.price) - Number(a.price))
    const page = Math.max(1, Number(params.get('page') ?? 1))
    const pageSize = Math.min(36, Math.max(1, Number(params.get('pageSize') ?? 9)))
    return HttpResponse.json({ items: items.slice((page - 1) * pageSize, page * pageSize), total: items.length, page, pageSize })
  }),
  http.get('/api/nfts/:id', async ({ params, request }) => {
    const scenario = await scenarioResponse(request)
    if (scenario) return scenario
    const nft = allNfts.find((item) => item.id === params.id)
    return nft ? HttpResponse.json(nft) : fail(404, 'NFT_NOT_FOUND', 'NFT não encontrado.')
  }),
  http.get('/api/favorites', async ({ request }) => {
    const account = accountFor(request)
    return account ? HttpResponse.json(account.favorites) : fail(401, 'UNAUTHORIZED', 'Entre para ver seus favoritos.')
  }),
  http.put('/api/favorites/:nftId', ({ params, request }) => {
    const account = accountFor(request)
    if (!account) return fail(401, 'UNAUTHORIZED', 'Entre para salvar favoritos.')
    if (!allNfts.some((nft) => nft.id === params.nftId)) return fail(404, 'NFT_NOT_FOUND', 'NFT não encontrado.')
    let favorite = account.favorites.find((entry) => entry.nftId === params.nftId)
    if (!favorite) { favorite = { nftId: String(params.nftId), createdAt: new Date().toISOString() }; account.favorites.push(favorite); saveDatabase() }
    return HttpResponse.json(favorite)
  }),
  http.delete('/api/favorites/:nftId', ({ params, request }) => {
    const account = accountFor(request)
    if (!account) return fail(401, 'UNAUTHORIZED', 'Entre para alterar favoritos.')
    account.favorites = account.favorites.filter((entry) => entry.nftId !== params.nftId)
    saveDatabase()
    return HttpResponse.json({ success: true })
  }),
  http.get('/api/cart', ({ request }) => HttpResponse.json(cartFor(request))),
  http.post('/api/cart/items', async ({ request }) => {
    const body = await jsonBody<{ nftId: string; quantity: number }>(request)
    const nft = allNfts.find((entry) => entry.id === body.nftId)
    if (!nft) return fail(404, 'NFT_NOT_FOUND', 'NFT não encontrado.')
    if (!Number.isInteger(body.quantity) || body.quantity < 1) return fail(400, 'INVALID_QUANTITY', 'Quantidade inválida.')
    const cart = cartFor(request)
    const current = cart.items.find((item) => item.nft.id === nft.id)
    const next = (current?.quantity ?? 0) + body.quantity
    if (next > nft.availability) return fail(409, 'OUT_OF_STOCK', 'Quantidade acima da disponibilidade.')
    cart.items = current ? cart.items.map((item) => item.nft.id === nft.id ? { ...item, quantity: next } : item) : [...cart.items, { nft, quantity: body.quantity }]
    return HttpResponse.json(storeCart(request, cart))
  }),
  http.put('/api/cart/items', async ({ request }) => {
    const body = await jsonBody<{ items: CartItem[] }>(request)
    const cart = cartFor(request)
    cart.items = body.items.flatMap(({ nft, quantity }) => {
      const current = allNfts.find((entry) => entry.id === nft.id)
      return current && Number.isInteger(quantity) && quantity > 0 ? [{ nft: current, quantity: Math.min(quantity, current.availability) }] : []
    })
    return HttpResponse.json(storeCart(request, cart))
  }),
  http.patch('/api/cart/items/:nftId', async ({ params, request }) => {
    const body = await jsonBody<{ quantity: number }>(request)
    const cart = cartFor(request)
    const nft = allNfts.find((entry) => entry.id === params.nftId)
    if (!nft || !cart.items.some((item) => item.nft.id === nft.id)) return fail(404, 'CART_ITEM_NOT_FOUND', 'Item não encontrado no carrinho.')
    if (!Number.isInteger(body.quantity) || body.quantity < 1) return fail(400, 'INVALID_QUANTITY', 'Quantidade inválida.')
    if (body.quantity > nft.availability) return fail(409, 'OUT_OF_STOCK', 'Quantidade acima da disponibilidade.')
    cart.items = cart.items.map((item) => item.nft.id === nft.id ? { nft, quantity: body.quantity } : item)
    return HttpResponse.json(storeCart(request, cart))
  }),
  http.delete('/api/cart/items/:nftId', ({ params, request }) => {
    const cart = cartFor(request)
    cart.items = cart.items.filter((item) => item.nft.id !== params.nftId)
    return HttpResponse.json(storeCart(request, cart))
  }),
  http.post('/api/quote', async ({ request }) => {
    const body = await jsonBody<{ coupon?: string }>(request)
    const cart = cartFor(request)
    if (body.coupon?.trim()) {
      if (body.coupon.toUpperCase() === 'EXPIRED') return fail(400, 'COUPON_EXPIRED', 'Este cupom expirou.')
      if (body.coupon.toUpperCase() !== 'KURIO10') return fail(400, 'COUPON_INVALID', 'Cupom inválido.')
      cart.coupon = { code: 'KURIO10', discountPercent: 10, expiresAt: new Date(Date.now() + 86400000).toISOString() }
    } else cart.coupon = null
    storeCart(request, cart)
    return HttpResponse.json(calculateQuote(cart))
  }),
  http.get('/api/profile', ({ request }) => {
    const account = accountFor(request)
    return account ? HttpResponse.json(account.user) : fail(401, 'UNAUTHORIZED', 'Entre para ver seu perfil.')
  }),
  http.patch('/api/profile', async ({ request }) => {
    const account = accountFor(request)
    if (!account) return fail(401, 'UNAUTHORIZED', 'Entre para editar seu perfil.')
    const body = await jsonBody<Partial<User>>(request)
    if (body.displayName !== undefined) account.user.displayName = body.displayName.trim()
    if (body.username !== undefined) account.user.username = body.username.trim()
    if (body.avatarUrl !== undefined) account.user.avatarUrl = body.avatarUrl
    saveDatabase()
    return HttpResponse.json(account.user)
  }),
  http.post('/api/profile/password', async ({ request }) => {
    const account = accountFor(request)
    if (!account) return fail(401, 'UNAUTHORIZED', 'Entre para alterar sua senha.')
    const body = await jsonBody<{ currentPassword: string; newPassword: string }>(request)
    if (account.passwordHash !== hashPassword(body.currentPassword, account.user.id)) return fail(400, 'INVALID_PASSWORD', 'A senha atual está incorreta.')
    if (body.newPassword.length < 8) return fail(400, 'WEAK_PASSWORD', 'A nova senha precisa ter pelo menos 8 caracteres.')
    account.passwordHash = hashPassword(body.newPassword, account.user.id)
    saveDatabase()
    return HttpResponse.json({ success: true })
  }),
  http.get('/api/wallets', ({ request }) => {
    const account = accountFor(request)
    return account ? HttpResponse.json(account.wallets) : fail(401, 'UNAUTHORIZED', 'Entre para ver suas carteiras.')
  }),
  http.put('/api/wallets', async ({ request }) => {
    const account = accountFor(request)
    if (!account) return fail(401, 'UNAUTHORIZED', 'Entre para editar suas carteiras.')
    const wallets = await jsonBody<Wallet[]>(request)
    account.wallets = wallets
    saveDatabase()
    return HttpResponse.json(account.wallets)
  }),
  http.get('/api/orders', ({ request }) => {
    const account = accountFor(request)
    return account ? HttpResponse.json(account.orders) : fail(401, 'UNAUTHORIZED', 'Entre para ver seus pedidos.')
  }),
  http.post('/api/orders', async ({ request }) => {
    const account = accountFor(request)
    if (!account) return fail(401, 'UNAUTHORIZED', 'Entre antes de concluir a compra.')
    const body = await jsonBody<{ walletId: string; quoteVersion: string; coupon?: string }>(request)
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey) return fail(400, 'IDEMPOTENCY_KEY_REQUIRED', 'Chave de idempotência obrigatória.')
    const existing = account.orders.find((order) => order.idempotencyKey === idempotencyKey)
    const requestFingerprint = `${body.walletId}|${body.quoteVersion}`
    if (existing) return existing.requestFingerprint === requestFingerprint
      ? HttpResponse.json(existing)
      : fail(409, 'IDEMPOTENCY_CONFLICT', 'A chave foi reutilizada com dados diferentes.')
    if (!account.wallets.some((wallet) => wallet.id === body.walletId)) return fail(400, 'WALLET_REQUIRED', 'Selecione uma carteira válida.')
    const quote = calculateQuote(account.cart)
    if (!account.cart.items.length) return fail(400, 'EMPTY_CART', 'Seu carrinho está vazio.')
    if (body.quoteVersion !== quote.version) return fail(409, 'QUOTE_CHANGED', 'Os valores foram atualizados. Revise a compra.')
    const scenario = new URL(request.url).searchParams.get('scenario') ?? request.headers.get('x-mock-scenario')
    const status: Order['status'] = scenario === 'payment-declined' ? 'declined' : 'confirmed'
    const items = account.cart.items.map((item) => ({ ...item, unitPrice: item.nft.price, subtotal: fromUnits(toUnits(item.nft.price) * BigInt(item.quantity)) }))
    const order: Order = {
      id: `order-${createId()}`,
      idempotencyKey,
      requestFingerprint,
      userId: account.user.id,
      status,
      items,
      quote,
      transaction: { id: `0x${createId().replaceAll('-', '').slice(0, 16)}`, network: account.wallets.find((wallet) => wallet.id === body.walletId)!.network, walletId: body.walletId, status },
      createdAt: new Date().toISOString(),
      version: 1,
    }
    account.orders.push(order)
    if (status === 'confirmed') account.cart.items = []
    saveDatabase()
    publishOrderUpdate(order)
    if (scenario === 'timeout-after-create') return fail(504, 'ORDER_TIMEOUT', 'Pedido criado. Consulte novamente usando a mesma chave.')
    return HttpResponse.json(order, { status: 201 })
  }),
  http.get('/api/orders/:id', ({ params, request }) => {
    const account = accountFor(request)
    if (!account) return fail(401, 'UNAUTHORIZED', 'Entre para consultar seus pedidos.')
    const order = account.orders.find((entry) => entry.id === params.id)
    return order ? HttpResponse.json(order) : fail(404, 'ORDER_NOT_FOUND', 'Pedido não encontrado.')
  }),
  ...socketHandlers,
]
