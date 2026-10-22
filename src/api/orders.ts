import { apiClient } from '@/lib/api/client'
import { request } from './client'
import type { Order, Quote, Wallet } from '@/types/domain'

export const getQuote = (coupon?: string) => request(apiClient.post<Quote>('/quote', { coupon }))
export const getOrders = () => request(apiClient.get<Order[]>('/orders'))
export const getOrder = (id: string) => request(apiClient.get<Order>(`/orders/${encodeURIComponent(id)}`))
export const createOrder = (payload: { walletId: string; quoteVersion: string; coupon?: string }, idempotencyKey: string) =>
  request(apiClient.post<Order>('/orders', payload, { headers: { 'Idempotency-Key': idempotencyKey } }))
export const getWallets = () => request(apiClient.get<Wallet[]>('/wallets'))
