const http = require('http');
const Router = require('./router');

const injectRequest = require('./request');
const injectResponse = require('./response');

/**
 * Server class
 */
class Server {
  /**
   * Contructor for Server class
   * @return {Server}
   */
  constructor() {
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
          await this._router.handle(req, res);
        });
    });

    this.server.on('clientError', this.onClientError);
  }

  /**
   * OnClientError handler
   * @param  {Error} err error object
   * @param  {http.Server} socket server instance
   * @return {void}
   */
  onClientError(err, socket) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }

  /**
   * Listener
   * @param  {Number} port port to listen on
   * @param  {Array<any>} args some arguments to pass to the server listener
   * @return {void}
   */
  listen(port=8080, ...args) {
    this.server.listen(port, ...args);
  }
}

module.exports = Server;
module.exports.Router = Router;
