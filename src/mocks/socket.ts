import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import { allNfts } from './database'
import type { Order } from '@/types/domain'

type SubscribePayload = { userId?: string; nftIds?: string[]; scenario?: string }
const socketLink = ws.link('/socket.io/')
const connections = new Map<ReturnType<typeof toSocketIo>, string>()

const socketHandler = socketLink.addEventListener('connection', (connection) => {
  const socket = toSocketIo(connection)
  connections.set(socket, 'guest')
  socket.server.on('subscribe', (_event, payload: SubscribePayload) => {
    const userId = payload?.userId || 'guest'
    connections.set(socket, userId)
    const nft = allNfts.find((item) => payload?.nftIds?.includes(item.id))
    if (!nft || !payload?.scenario) return

    if (payload.scenario === 'price-changed') {
      nft.price = (Number(nft.price) + 0.25).toFixed(2)
      nft.version += 1
    } else if (payload.scenario === 'availability-changed') {
      nft.availability = 0
      nft.version += 1
    } else if (payload.scenario === 'duplicate-old') {
      nft.version += 2
      socket.server.emit('nft.updated', { nftId: nft.id, price: nft.price, availability: nft.availability, version: nft.version })
      socket.server.emit('nft.updated', { nftId: nft.id, price: nft.price, availability: nft.availability, version: nft.version - 1 })
      return
    }

    if (payload.scenario === 'price-changed' || payload.scenario === 'availability-changed') {
      socket.server.emit('nft.updated', { nftId: nft.id, price: nft.price, availability: nft.availability, version: nft.version })
    }
  })
  socket.server.on('disconnect', () => connections.delete(socket))
})

export const socketHandlers = [socketHandler]

export function publishOrderUpdate(order: Order) {
  for (const [socket, userId] of connections) {
    if (userId !== order.userId) continue
    socket.server.emit('order.updated', {
      orderId: order.id,
      userId: order.userId,
      status: order.status,
      version: order.version + 1,
    })
  }
}
