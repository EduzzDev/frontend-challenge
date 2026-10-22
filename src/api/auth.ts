import { apiClient } from '@/lib/api/client'
import { request } from './client'
import type { Session, User } from '@/types/domain'

export const getSession = () => request(apiClient.get<Session>('/auth/session'))
export const login = (email: string, password: string) =>
  request(apiClient.post<Session>('/auth/login', { email, password }))
export const signup = (displayName: string, email: string, password: string) =>
  request(apiClient.post<Session>('/auth/signup', { displayName, email, password }))
export const logout = () => request(apiClient.post<{ success: true }>('/auth/logout'))
export const updateProfile = (payload: Partial<Pick<User, 'displayName' | 'username'>>) =>
  request(apiClient.patch<User>('/profile', payload))
