import { apiClient } from '@/lib/api/client'
import { request } from './client'
import type { Favorite } from '@/types/domain'

export const getFavorites = () => request(apiClient.get<Favorite[]>('/favorites'))
export const addFavorite = (nftId: string) => request(apiClient.put<Favorite>(`/favorites/${encodeURIComponent(nftId)}`))
export const removeFavorite = (nftId: string) => request(apiClient.delete<{ success: true }>(`/favorites/${encodeURIComponent(nftId)}`))
