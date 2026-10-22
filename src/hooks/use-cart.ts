import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'
import { addCartItem, getCart, setCart } from '@/api/cart'
import type { Cart, NFT } from '@/types/domain'

export function currentUserKey() {
  return window.localStorage.getItem('kurio-user-id') ?? 'guest'
}

function subscribeToSessionChanges(onChange: () => void) {
  window.addEventListener('kurio-session-changed', onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener('kurio-session-changed', onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function useCurrentUserKey() {
  return useSyncExternalStore(subscribeToSessionChanges, currentUserKey, () => 'guest')
}

export function useCart() {
  const userId = useCurrentUserKey()
  const queryClient = useQueryClient()
  const queryKey = ['cart', userId] as const
  const query = useQuery({ queryKey, queryFn: getCart })
  const update = useMutation({
    mutationFn: (items: Cart['items']) => setCart(items),
    onMutate: async (items) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Cart>(queryKey)
      queryClient.setQueryData<Cart>(queryKey, (cart) => cart ? { ...cart, items, updatedAt: new Date().toISOString() } : cart)
      return { previous }
    },
    onError: (_error, _items, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey })
      void queryClient.invalidateQueries({ queryKey: ['quote', userId] })
    },
  })
  return { ...query, cart: query.data, updateItems: update.mutate, isUpdating: update.isPending, updateError: update.error }
}

export function useAddToCart() {
  const userId = useCurrentUserKey()
  const queryClient = useQueryClient()
  const queryKey = ['cart', userId] as const
  return useMutation({
    mutationFn: ({ nft, quantity }: { nft: NFT; quantity: number }) => addCartItem(nft.id, quantity),
    onMutate: async ({ nft, quantity }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Cart>(queryKey)
      queryClient.setQueryData<Cart>(queryKey, (cart) => {
        if (!cart) return cart
        const found = cart.items.find((item) => item.nft.id === nft.id)
        return { ...cart, items: found
          ? cart.items.map((item) => item.nft.id === nft.id ? { ...item, quantity: item.quantity + quantity } : item)
          : [...cart.items, { nft, quantity }] }
      })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSuccess: (cart) => queryClient.setQueryData(queryKey, cart),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey })
      void queryClient.invalidateQueries({ queryKey: ['quote', userId] })
    },
  })
}
