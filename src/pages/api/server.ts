import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { createServer } from 'http'

export default (req: NextApiRequest, res: NextApiResponse) => {
  // Create an HTTP server and pass it to the socket.io server
  const httpServer = createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Socket.io server running')
  })

  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('a user connected')

    // Handle incoming messages
    socket.on('message', (message) => {
      console.log(`Received message: ${message}`)
      io.emit('message', message)
    })

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('a user disconnected')
    })
  })

  // Start the server
  httpServer.listen(3000, () => {
    console.log('Socket.io server listening on port 3000')
  })
}
