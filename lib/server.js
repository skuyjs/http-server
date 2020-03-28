const http = require('http');
const Request = require('./request');
const Response = require('./response');
const Router = require('./router');

class Server {
  constructor() {
    this._router = new Router();
    Object.assign(this, this._router);

    this.server = http.createServer((req, res) => {
      let reqbody = [];
      req
        .on('data', (c) => {
          reqbody.push(c);
        })
        .on('end', () => {
          req.body = Buffer.concat(reqbody).toString();
          const request = new Request(req);
          const response = new Response(res);

          this._router.handle(request, response);
        });
    });

    this.server.on('clientError', this.onClientError);
  }

  onClientError(err, socket) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }

  listen(port=8080) {
    this.server.listen(port);
  }
}

module.exports = Server;
