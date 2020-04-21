import Router from './router'
import http from 'http'

import injectRequest from './request'
import injectResponse from './response'
import { Req } from './typings/req'
import { Res } from './typings/res'

/**
 * Server class
 */
class Server extends Router {
  static Router = Router
  server: http.Server
  /**
   * Contructor for Server class
   */
  constructor() {
    super()
    this.server = http.createServer((req: Req, res: Res) => {
      const reqbody: any[] = []
      req
        .on('data', (c) => {
          reqbody.push(c)
        })
        .on('end', async () => {
          req.body = Buffer.concat(reqbody).toString()
          injectRequest(req)
          injectResponse(res)
          await this.handle(req, res)
        })
    })

    this.server.on('clientError', (_err, socket) => socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'))
  }

  /**
   * Listener
   * @param port port to listen on
   * @param args some arguments to pass to the server listener
   * @return
   */
  listen(port = 8080, ...args: any[]) {
    this.server.listen(port, ...args)
  }
}

export = Server
