const http = require('http');
const Router = require('./router');

const injectRequest = require('./request');
const injectResponse = require('./response');

class Server {
  constructor() {
    this._middlewares = [];
    this._router = new Router();
    Object.assign(this, this._router);

    this.server = http.createServer((req, res) => {
      let reqbody = [];
      req
        .on('data', (c) => {
          reqbody.push(c);
        })
        .on('end', async () => {
          req.body = Buffer.concat(reqbody).toString();
          injectRequest(req);
          injectResponse(res);

          await Promise.all([
            await this.runMiddlewares(req, res),
            await this._router.handle(req, res),
          ]);
        });
    });

    this.server.on('clientError', this.onClientError);
  }

  onClientError(err, socket) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }

  use(middleware) {
    this._middlewares.push(middleware);
  }

  async runMiddlewares(req, res) {
    for (let middleware of this._middlewares) {
      try {
        await middleware(req, res);
      } catch(e) {
        if (process.env.NODE_ENV === 'development') {
          console.log(e.message);
        }
        return this._router.on500(req, res);
      }
    }
  }

  listen(port=8080, ...args) {
    this.server.listen(port, ...args);
  }
}

module.exports = Server;
