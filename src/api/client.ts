import axios from 'axios'
import { apiClient } from '@/lib/api/client'
import type { ApiError } from '@/types/domain'

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('kurio-session-token')
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  config.headers.set('x-user-id', window.localStorage.getItem('kurio-user-id') ?? 'guest')
  const scenario = window.localStorage.getItem('kurio-mock-scenario')
  if (scenario) config.headers.set('x-mock-scenario', scenario)
  return config
})

export async function request<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await promise
    return response.data
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error) && error.response?.data) {
      throw Object.assign(new Error(error.response.data.message), error.response.data, { status: error.response.status })
    }
    throw error
  }
}
