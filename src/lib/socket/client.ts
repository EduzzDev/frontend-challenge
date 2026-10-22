import type { Socket } from 'socket.io-client'

let socket: Socket | undefined

export async function getSocketClient(): Promise<Socket> {
  if (!socket) {
    const { io } = await import('socket.io-client')
    socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
  })
  }
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
}
