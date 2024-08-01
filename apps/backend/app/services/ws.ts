import appServer from '@adonisjs/core/services/server'
import { HttpServerService } from '@adonisjs/core/types'
import { Server } from 'socket.io'

export class WS {
  constructor(private server: HttpServerService) {
    this.server = server
  }

  io: Server | undefined
  booted: boolean = false

  boot() {
    if (this.booted) return

    this.booted = true

    this.io = new Server(this.server.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })
  }
}

export default new WS(appServer)
