import { nfts, type Nft } from '@/lib/nfts'

export type CartItem = {
  nft: Nft
  quantity: number
}

const CART_STORAGE_KEY = 'kurio-cart'

const initialCart: CartItem[] = [
  { nft: nfts[0], quantity: 2 },
  { nft: nfts[4], quantity: 6 },
  { nft: nfts[5], quantity: 9 },
]

export function getCartItems(): CartItem[] {
  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
  if (!storedCart) return initialCart

  const parsedCart: unknown = JSON.parse(storedCart)
  if (!Array.isArray(parsedCart)) {
    throw new Error('O conteúdo salvo no carrinho é inválido.')
  }

  return parsedCart.map((entry): CartItem => {
    if (typeof entry !== 'object' || entry === null || !('nft' in entry) || !('quantity' in entry)) {
      throw new Error('Um item salvo no carrinho é inválido.')
    }

    const { nft: storedNft, quantity } = entry
    if (
      typeof storedNft !== 'object' ||
      storedNft === null ||
      !('name' in storedNft) ||
      !('number' in storedNft) ||
      typeof storedNft.name !== 'string' ||
      typeof storedNft.number !== 'string' ||
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error('Um item salvo no carrinho é inválido.')
    }

    const nft = nfts.find((item) => item.name === storedNft.name && item.number === storedNft.number)
    if (!nft) {
      throw new Error(`O NFT ${storedNft.name} #${storedNft.number} não foi encontrado.`)
    }
    return { nft, quantity }
  })
}

export function saveCartItems(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function addToCart(nft: Nft, quantity: number) {
  const items = getCartItems()
  const existingItem = items.find((item) => item.nft.name === nft.name && item.nft.number === nft.number)

  if (existingItem) {
    saveCartItems(items.map((item) =>
      item === existingItem ? { ...item, quantity: item.quantity + quantity } : item,
    ))
    return
  }

  saveCartItems([...items, { nft, quantity }])
}
