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
        this.routes[method][url] = handlers;
      };
    });
  }

  on404(req, res) {
    res.status(404).end(`${req.method} ${req.url} 404 Not Found`);
  }

  on500(req, res) {
    res.status(500).end(`${req.method} ${req.url} 500 Internal Server Error`);
  }

  async handle(req, res) {
    const handlers = this.routes[req.method][req.url];

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
