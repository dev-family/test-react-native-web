import app from '@adonisjs/core/services/app'
import WS from '#services/ws'

app.ready(() => {
  WS.boot()

  WS.io?.on('connection', (socket) => {
    console.info('[WS] A new connection', socket.id)

    socket.on('join:post', ({ postId }) => {
      socket.join(`post-${postId}`)
      console.info('[WS] Joined post : ', postId)
    })

    socket.on('disconnect', () => {
      console.info('[WS] Disconnected from socket: ', socket.id)
    })
  })
})
