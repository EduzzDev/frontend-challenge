import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addFavorite, getFavorites, removeFavorite } from '@/api/favorites'
import type { Favorite } from '@/types/domain'
import { useCurrentUserKey } from './use-cart'

export function useFavorite(nftId: string) {
  const userId = useCurrentUserKey()
  const queryClient = useQueryClient()
  const queryKey = ['favorites', userId] as const
  const query = useQuery({ queryKey, queryFn: getFavorites, enabled: Boolean(nftId && window.localStorage.getItem('kurio-session-token')) })
  const mutation = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await removeFavorite(nftId)
      else await addFavorite(nftId)
    },
    onMutate: async (isFavorite) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Favorite[]>(queryKey) ?? []
      queryClient.setQueryData<Favorite[]>(queryKey, isFavorite
        ? previous.filter((favorite) => favorite.nftId !== nftId)
        : [...previous, { nftId, createdAt: new Date().toISOString() }])
      return { previous }
    },
    onError: (_error, _isFavorite, context) => {
      if (context) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
  const isFavorite = query.data?.some((favorite) => favorite.nftId === nftId) ?? false
  return { isFavorite, toggleFavorite: () => mutation.mutate(isFavorite), error: mutation.error, isPending: mutation.isPending }
}
