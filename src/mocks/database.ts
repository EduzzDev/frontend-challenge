import { nfts } from '@/lib/nfts'
import type { Cart, Favorite, NFT, Order, User, Wallet } from '@/types/domain'
import { createId } from '@/lib/id'

type Account = { user: User; passwordHash: string; favorites: Favorite[]; cart: Cart; wallets: Wallet[]; orders: Order[] }
type Database = { accounts: Account[]; sessions: Record<string, { userId: string; expiresAt: string }>; nfts?: NFT[] }

const DB_KEY = 'kurio-mock-database-v1'
const nftRecords: NFT[] = nfts.map((nft) => ({
  ...nft,
  id: `${nft.name.toLowerCase().replaceAll(' ', '-')}-${nft.number}`,
  availability: 50,
  edition: '1/50',
  version: 1,
}))
export const allNfts = nftRecords
const nftBaseline = nftRecords.map((nft) => ({ ...nft }))

export function hashPassword(password: string, userId: string) {
  let hash = 2166136261
  for (const character of `${userId}:${password}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16)
}

function makeCart(userId: string, ids: string[] = []): Cart {
  return {
    userId,
    items: ids.flatMap((id) => {
      const nft = nftRecords.find((entry) => entry.id === id)
      return nft ? [{ nft, quantity: id === 'ivory-baron-008' ? 6 : 2 }] : []
    }),
    coupon: null,
    updatedAt: new Date().toISOString(),
  }
}

function initialDatabase(): Database {
  const makeAccount = (user: User, passwordHash: string, ids: string[]): Account => ({
    user,
    passwordHash,
    favorites: [],
    cart: makeCart(user.id, ids),
    wallets: [
      { id: `${user.id}-wallet-main`, name: 'Coinbase Wallet', address: '0xA91F...E82C', network: 'Ethereum', isPrimary: true },
      { id: `${user.id}-wallet-reserve`, name: 'MetaMask', address: '0x7A2...19C4', network: 'Polygon', isPrimary: false },
    ],
    orders: [],
  })
  return {
    accounts: [
      makeAccount({ id: 'user-a', email: 'colecionador@kurio.test', displayName: 'Colecionador Kurio', username: 'colecionador' }, hashPassword('Kurio123!', 'user-a'), []),
      makeAccount({ id: 'user-b', email: 'artista@kurio.test', displayName: 'Artista Kurio', username: 'artista' }, hashPassword('Artista123!', 'user-b'), []),
    ],
    sessions: {},
  }
}

let database: Database | undefined

function readDatabase(): Database {
  if (database) return database
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(DB_KEY)
    if (saved) {
      try {
        database = JSON.parse(saved) as Database
        if (database.nfts?.length === allNfts.length) database.nfts.forEach((nft, index) => Object.assign(allNfts[index], nft))
      } catch { database = undefined }
    }
  }
  database ??= initialDatabase()
  return database
}

export function saveDatabase() {
  if (typeof window !== 'undefined') {
    const current = readDatabase()
    current.nfts = allNfts.map((nft) => ({ ...nft }))
    window.localStorage.setItem(DB_KEY, JSON.stringify(current))
  }
}

export function resetDatabase() {
  nftBaseline.forEach((nft, index) => Object.assign(allNfts[index], nft))
  database = initialDatabase()
  saveDatabase()
}

export function getAccount(userId: string) {
  return readDatabase().accounts.find((account) => account.user.id === userId)
}

export function findAccountByEmail(email: string) {
  return readDatabase().accounts.find((account) => account.user.email.toLowerCase() === email.toLowerCase())
}

export function addAccount(user: User, passwordHash: string) {
  const account = { ...initialDatabase().accounts[0], user, passwordHash, favorites: [], cart: makeCart(user.id), wallets: [], orders: [] }
  readDatabase().accounts.push(account)
  saveDatabase()
  return account
}

export function getSession(token: string | null) {
  if (!token) return undefined
  const session = readDatabase().sessions[token]
  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    if (session) delete readDatabase().sessions[token]
    return undefined
  }
  const account = getAccount(session.userId)
  return account ? { token, user: account.user, expiresAt: session.expiresAt } : undefined
}

export function createSession(userId: string) {
  const token = `kurio-${createId()}`
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString()
  readDatabase().sessions[token] = { userId, expiresAt }
  saveDatabase()
  return { token, user: getAccount(userId)!.user, expiresAt }
}

export function deleteSession(token: string | null) {
  if (token) delete readDatabase().sessions[token]
  saveDatabase()
}

export function getDatabase() { return readDatabase() }
