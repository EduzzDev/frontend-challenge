import { io, type Socket } from 'socket.io-client'

let socket: Socket | undefined

export function getSocketClient(): Socket {
  socket ??= io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
  })
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
}
