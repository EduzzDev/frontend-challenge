import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSession, logout } from '@/api/auth'
import { useCurrentUserKey } from '@/hooks/use-cart'

export function useSession() {
  const queryClient = useQueryClient()
  const userId = useCurrentUserKey()
  const token = window.localStorage.getItem('kurio-session-token')
  const queryKey = ['session', userId] as const
  const query = useQuery({ queryKey, queryFn: getSession, enabled: Boolean(token), retry: false })
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      window.localStorage.removeItem('kurio-session-token')
      window.localStorage.removeItem('kurio-user-id')
      window.dispatchEvent(new Event('kurio-session-changed'))
      queryClient.removeQueries({ predicate: (query) => ['session', 'cart', 'favorites', 'orders', 'profile', 'wallets'].includes(String(query.queryKey[0])) })
    },
  })

  useEffect(() => {
    const activeUserId = window.localStorage.getItem('kurio-user-id') ?? 'guest'
    const hasActiveToken = Boolean(window.localStorage.getItem('kurio-session-token'))
    if (
      query.error &&
      'status' in query.error &&
      query.error.status === 401 &&
      userId === activeUserId &&
      hasActiveToken &&
      !query.data
    ) {
      window.localStorage.removeItem('kurio-session-token')
      window.localStorage.removeItem('kurio-user-id')
      window.dispatchEvent(new Event('kurio-session-changed'))
      queryClient.removeQueries({ predicate: (entry) => ['session', 'cart', 'favorites', 'orders', 'profile', 'wallets'].includes(String(entry.queryKey[0])) })
    }
  }, [query.data, query.error, queryClient, userId])

  return { session: query.data, isLoading: query.isPending, logout: logoutMutation.mutate, isLoggingOut: logoutMutation.isPending }
}
