const methods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
];

class Router {
  constructor() {
    this.routes = {};

    methods.forEach((method) => {
      if (!this.routes[method]) this.routes[method] = {};

      this[method.toLowerCase()] = (url, ...handlers) => {
        const params = url.match(/:([a-z]+)/ig);
        const path = url.replace(/:[a-z]+/ig, '([0-9a-z]+)');
        this.routes[method][`^${path}$`] = { params, handlers};
      };
    });
  }

  getHandlers(req) {
    const routesWithMethod = Object.keys(this.routes[req.method] || {});
    const paths = routesWithMethod.filter(route => {
      const re = new RegExp(route, 'ig');
      return re.test(req.url);
    });

    let tmpHandlers = undefined;
    if (paths.length > 0) {
      const { params, handlers } = this.routes[req.method][paths[0]];
      const [_, ...paramsValues] = new RegExp(paths[0], 'ig').exec(req.url);
      req.setParams(params, paramsValues);
      tmpHandlers = handlers;
    }

    return tmpHandlers;
  }

  on404(req, res) {
    res.status(404).end(`${req.method} ${req.url} 404 Not Found`);
  }

  on500(req, res) {
    res.status(500).end(`${req.method} ${req.url} 500 Internal Server Error`);
  }

  async handle(req, res) {
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
