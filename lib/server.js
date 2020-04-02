const http = require('http');
const Request = require('./request');
const Response = require('./response');
const Router = require('./router');

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
          const request = new Request(req);
          const response = new Response(res);

          await this.runMiddlewares(req, res);
          await this._router.handle(request, response);
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
        return this.on500(req, res);
      }
    }
  }

  listen(port=8080, callback=null) {
    this.server.listen(port);
    !!callback ? callback() : null;
  }
}

module.exports = Server;
