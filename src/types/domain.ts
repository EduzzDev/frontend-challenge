export type User = {
  id: string
  email: string
  displayName: string
  username: string
  avatarUrl?: string
}

export type Session = {
  token: string
  user: User
  expiresAt: string
}

export type NFT = {
  id: string
  name: string
  number: string
  price: string
  image: string
  collection: string
  network: string
  availability: number
  edition: string
  version: number
}

export type Favorite = { nftId: string; createdAt: string }
export type CartItem = { nft: NFT; quantity: number }
export type Cart = { userId: string; items: CartItem[]; coupon: Coupon | null; updatedAt: string }
export type Coupon = { code: string; discountPercent: number; expiresAt: string }
export type Quote = {
  items: CartItem[]
  subtotal: string
  discount: string
  networkFee: string
  total: string
  version: string
  validUntil: string
}
export type Wallet = { id: string; name: string; address: string; network: string; isPrimary: boolean }
export type OrderItem = CartItem & { unitPrice: string; subtotal: string }
export type Transaction = { id: string; network: string; walletId: string; status: 'pending' | 'confirmed' | 'declined' }
export type Order = {
  id: string
  idempotencyKey: string
  requestFingerprint: string
  userId: string
  status: 'pending' | 'confirmed' | 'declined'
  items: OrderItem[]
  quote: Quote
  transaction: Transaction
  createdAt: string
  version: number
}

export type ApiError = { code: string; message: string; details?: Record<string, string> }
