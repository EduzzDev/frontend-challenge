import { apiClient } from '@/lib/api/client'
import { request } from './client'
import type { User } from '@/types/domain'

export const getProfile = () => request(apiClient.get<User>('/profile'))
export const saveProfile = (data: Partial<Pick<User, 'displayName' | 'username' | 'avatarUrl'>>) =>
  request(apiClient.patch<User>('/profile', data))
export const changePassword = (currentPassword: string, newPassword: string) =>
  request(apiClient.post<{ success: true }>('/profile/password', { currentPassword, newPassword }))
