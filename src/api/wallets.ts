import { apiClient } from '@/lib/api/client'
import { request } from './client'
import type { Wallet } from '@/types/domain'

export const getWallets = () => request(apiClient.get<Wallet[]>('/wallets'))
export const saveWallets = (wallets: Wallet[]) => request(apiClient.put<Wallet[]>('/wallets', wallets))
