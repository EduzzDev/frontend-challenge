import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Socket } from 'socket.io-client'
import { getSocketClient } from '@/lib/socket/client'
import { currentUserKey } from '@/hooks/use-cart'
import type { CatalogResponse } from '@/api/nfts'
import type { Cart, NFT, Order } from '@/types/domain'

type NftUpdatedEvent = { nftId: string; price: string; availability: number; version: number }
type OrderUpdatedEvent = { orderId: string; userId: string; status: Order['status']; version: number }

export function useRealtimeSocket() {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | undefined>(undefined)
  const [userId, setUserId] = useState(currentUserKey)

  useEffect(() => {
    const syncUser = () => setUserId(currentUserKey())
    window.addEventListener('kurio-session-changed', syncUser)
    return () => window.removeEventListener('kurio-session-changed', syncUser)
  }, [])

  useEffect(() => {
    let disposed = false
    let socket: Socket | undefined

    const onNftUpdated = (event: NftUpdatedEvent) => {
      if (!event?.nftId || !Number.isInteger(event.version)) return
      queryClient.setQueriesData<CatalogResponse>({ queryKey: ['nfts'] }, (response) => {
        if (!response) return response
        return { ...response, items: response.items.map((nft) => nft.id === event.nftId && event.version > nft.version
          ? { ...nft, price: event.price, availability: event.availability, version: event.version }
          : nft) }
      })
      queryClient.setQueryData<NFT>(['nft', event.nftId], (nft) => nft && event.version > nft.version
        ? { ...nft, price: event.price, availability: event.availability, version: event.version }
        : nft)
      queryClient.setQueryData<Cart>(['cart', userId], (cart) => cart ? {
        ...cart,
        items: cart.items.map((item) => item.nft.id === event.nftId && event.version > item.nft.version
          ? { ...item, nft: { ...item.nft, price: event.price, availability: event.availability, version: event.version } }
          : item),
      } : cart)
    }

    const onOrderUpdated = (event: OrderUpdatedEvent) => {
      if (!event?.orderId || event.userId !== userId) return
      queryClient.setQueryData<Order>(['order', event.orderId], (order) => order && event.version > order.version
        ? { ...order, status: event.status, version: event.version }
        : order)
      void queryClient.invalidateQueries({ queryKey: ['orders', userId] })
      if (event.status === 'confirmed' || event.status === 'declined') void queryClient.invalidateQueries({ queryKey: ['cart', userId] })
    }

    const onConnect = () => {
      sendSubscription()
      void queryClient.invalidateQueries({ queryKey: ['nfts'] })
      void queryClient.invalidateQueries({ queryKey: ['nft'] })
      void queryClient.invalidateQueries({ queryKey: ['cart', userId] })
    }

    let lastSubscription = ''
    const sendSubscription = () => {
      if (!socket?.connected) return
      const cachedCatalogs = queryClient.getQueriesData<CatalogResponse>({ queryKey: ['nfts'] })
      const nftIds = cachedCatalogs.flatMap(([, value]) => value?.items.map((nft) => nft.id) ?? [])
      const cart = queryClient.getQueryData<Cart>(['cart', userId])
      const subscription = { userId, nftIds: [...new Set([...nftIds, ...(cart?.items.map((item) => item.nft.id) ?? [])])], scenario: window.localStorage.getItem('kurio-mock-scenario') }
      const signature = JSON.stringify(subscription)
      if (signature === lastSubscription) return
      lastSubscription = signature
      socket.emit('subscribe', subscription)
    }

    const stopWatchingQueries = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'success') sendSubscription()
    })

    void getSocketClient().then((client) => {
      if (disposed) return
      socket = client
      socketRef.current = client
      client.on('nft.updated', onNftUpdated)
      client.on('order.updated', onOrderUpdated)
      client.on('connect', onConnect)
      client.connect()
    })

    return () => {
      disposed = true
      if (!socket) return
      socket.off('nft.updated', onNftUpdated)
      socket.off('order.updated', onOrderUpdated)
      socket.off('connect', onConnect)
      stopWatchingQueries()
      socket.disconnect()
      socketRef.current = undefined
    }
  }, [queryClient, userId])
}
