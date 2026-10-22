import { apiClient } from '@/lib/api/client'
import { request } from './client'
import type { NFT } from '@/types/domain'

export type CatalogParams = {
  search?: string
  collection?: string
  network?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: number
  pageSize?: number
}
export type CatalogResponse = { items: NFT[]; total: number; page: number; pageSize: number }

export const getNfts = (params: CatalogParams, signal?: AbortSignal) =>
  request(apiClient.get<CatalogResponse>('/nfts', { params, signal }))
export const getNft = (id: string) => request(apiClient.get<NFT>(`/nfts/${encodeURIComponent(id)}`))
