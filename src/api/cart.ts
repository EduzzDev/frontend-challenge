import { apiClient } from '@/lib/api/client'
import { request } from './client'
import type { Cart, CartItem } from '@/types/domain'

export const getCart = () => request(apiClient.get<Cart>('/cart'))
export const addCartItem = (nftId: string, quantity = 1) => request(apiClient.post<Cart>('/cart/items', { nftId, quantity }))
export const updateCartItem = (nftId: string, quantity: number) => request(apiClient.patch<Cart>(`/cart/items/${encodeURIComponent(nftId)}`, { quantity }))
export const removeCartItem = (nftId: string) => request(apiClient.delete<Cart>(`/cart/items/${encodeURIComponent(nftId)}`))
export const setCart = (items: CartItem[]) => request(apiClient.put<Cart>('/cart/items', { items }))
