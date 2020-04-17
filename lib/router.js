const url = require('url');

/**
 * @type {Array.<string>} list of http methods
 */
const methods = require('http').METHODS.filter(method=> {
  return [
    'DELETE',
    'GET',
    'HEAD',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
  ].indexOf(method) > 0;
});


/**
 * Router class
 */
class Router {

  /**
   * Constructor of Router class
   * @return {Router}
   */
  constructor() {
    this.routes = {};
    this.middlewares = [];

    methods.forEach((method) => {
      if (!this.routes[method]) this.routes[method] = {};

      this[method.toLowerCase()] = (url, ...handlers) => {
        const params = url.match(/:([a-z]+)/ig);
        const path = `${url.replace(/:[a-z]+/ig, '([0-9a-z]+)')}\\/?`;
        this.routes[method][`^${path}$`] = { params, handlers};
      };
    });

    /**
     * Register function to default handler
     * @param {Array<any>} params it can be a function or route path and router instance
     */
    this.use = (...params) => {
      if (params.length === 1) {
        this.middlewares.push(params[0]);
      } else {
        if (params[1] instanceof Router) {
          // TODO: add router to sub route
        }
      }
    };
  }

  /**
   * Get all routes
   * @return {Object} all routes
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * Get handlers for current route
   * @param {http.IncomingMessage} req request instance
   */
  getHandlers(req) {
    const { pathname } = url.parse(req.url);

    const routesWithMethod = Object.keys(this.routes[req.method] || {});
    const paths = routesWithMethod.filter(route => {
      const re = new RegExp(route, 'ig');
      const test = re.test(pathname);
      return test;
    });

    let tmpHandlers = undefined;
    if (paths.length > 0) {
      const { params, handlers } = this.routes[req.method][paths[0]];
      const [_, ...paramsValues] = new RegExp(paths[0], 'ig').exec(pathname);
      req.setParams(params, paramsValues);
      tmpHandlers = handlers;
    }

    return tmpHandlers;
  }

  /**
   * Run all default handlers (middlewares)
   * @param {http.IncomingMessage} req request instance
   * @param {http.ServerResponse} res response instance
   */
  async runMiddlewares(req, res) {
    for (let middleware of this.middlewares) {
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

  /**
   * On 404 error raised
   * @param {http.IncomingMessage} req request instance
   * @param {http.ServerResponse} res response instance
   */
  on404(req, res) {
    res.status(404).end(`${req.method} ${req.url} 404 Not Found`);
  }

  /**
   * On 500 error raised
   * @param {http.IncomingMessage} req request instance
   * @param {http.ServerResponse} res response instance
   */
  on500(req, res) {
    res.status(500).end(`${req.method} ${req.url} 500 Internal Server Error`);
  }

  /**
   * Handle current request
   * @param {http.IncomingMessage} req request instance
   * @param {http.ServerResponse} res response instance
   */
  async handle(req, res) {
    await this.runMiddlewares(req, res);

    if (req.method.toLowerCase() === 'options') {
      res.status(200).end();
      return;
    }

    const handlers = this.getHandlers(req);
    if (!handlers) return this.on404(req, res);

    for (let handler of handlers) {
      try {
        await handler(req, res);
      } catch(e) {
        if (process.env.NODE_ENV === 'development') {
          console.log(e.message);
        }
        return this.on500(req, res);
      }
    }
  }
}

module.exports = Router;
