import url from 'url';
import { Req } from './typings/req';
import { Res } from './typings/res';
import { Middleware, RouterParam, Routes, HttpMethod } from './typings/route';

/**
 * Router class
 */
class Router {
  routes: Routes;
  middlewares: Middleware[];
  private methods: HttpMethod[];
  /**
   * Constructor of Router class
   */
  constructor() {
    this.routes = {
      GET: {},
      HEAD: {},
      OPTIONS: {},
      PATCH: {},
      POST: {},
      PUT: {},
      DELETE: {}
    };
    this.middlewares = [];
    this.methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
  }

  /**
   * Register function to default handler
   * @param params it can be a function or route path and router instance
   */
  use(...params: RouterParam[]) {
    if (params.length === 1) {
      this.middlewares.push(params[0] as Middleware);
    } else {
      const subroute = params[1];
      if (subroute instanceof Router) {
        const parent = params[0];
        const subrouteRoutes = subroute.getRoutes();
        const routes = this.getRoutes();
        this.methods.forEach((method) => {
          Object.keys(subrouteRoutes[method]).forEach((subrouteRoute) => {
            let currentRoute = subrouteRoute;
            if (currentRoute === '\\/') currentRoute = '';
            const { regex } = this.createRouteRegex(`${parent}${currentRoute}`);
            routes[method][regex] = subrouteRoutes[method][subrouteRoute];
          });
        });
      }
    }
  }

  get(route: string, ...handlers: Middleware[]) {
    this.registerRoute('GET', route, ...handlers);
  }

  post(route: string, ...handlers: Middleware[]) {
    this.registerRoute('POST', route, ...handlers);
  }

  put(route: string, ...handlers: Middleware[]) {
    this.registerRoute('PUT', route, ...handlers);
  }

  patch(route: string, ...handlers: Middleware[]) {
    this.registerRoute('PATCH', route, ...handlers);
  }

  delete(route: string, ...handlers: Middleware[]) {
    this.registerRoute('DELETE', route, ...handlers);
  }

  head(route: string, ...handlers: Middleware[]) {
    this.registerRoute('HEAD', route, ...handlers);
  }
  options(route: string, ...handlers: Middleware[]) {
    this.registerRoute('OPTIONS', route, ...handlers);
  }
  private registerRoute(method: HttpMethod, route: string, ...handlers: Middleware[]) {
    if (!this.routes[method]) this.routes[method] = {};
    const { params, regex } = this.createRouteRegex(route);
    this.routes[method][regex] = { params, handlers };
  }

  createRouteRegex(route: string) {
    const params = route.match(/:([a-z]+)/gi);
    const regex = route.replace(/:[a-z]+/gi, '([0-9a-z]+)').replace('/', '\\/');
    return {
      regex,
      params
    };
  }

  /**
   * Get all routes
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * Get handlers for current route
   * @param req request instance
   */
  getHandlers(req: Req) {
    const { pathname } = url.parse(req.url!);

    const routesWithMethod = Object.keys(this.routes[req.method!] || {});
    const paths = routesWithMethod.filter((route) => {
      const re = new RegExp(`^${route}\\/?$`, 'ig');
      const test = re.test(pathname!);
      return test;
    });

    let tmpHandlers: Middleware[] | undefined;
    if (paths.length > 0) {
      const { params, handlers } = this.routes[req.method!][paths[0]];
      const [, ...paramsValues] = new RegExp(paths[0], 'ig').exec(pathname!)!;
      req.setParams(params, paramsValues);
      tmpHandlers = handlers;
    }

    return tmpHandlers;
  }

  /**
   * Run all default handlers (middlewares)
   * @param req request instance
   * @param res response instance
   */
  async runMiddlewares(req: Req, res: Res) {
    for (const middleware of this.middlewares) {
      try {
        await middleware(req, res);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.log(e.message);
        }
        return this.on500(req, res);
      }
    }
  }

  /**
   * On 404 error raised
   * @param req request instance
   * @param {http.ServerResponse} res response instance
   */
  on404(req: Req, res: Res) {
    res.status(404).end(`${req.method} ${req.url} 404 Not Found`);
  }

  /**
   * On 500 error raised
   * @param req request instance
   * @param  res response instance
   */
  on500(req: Req, res: Res) {
    res.status(500).end(`${req.method} ${req.url} 500 Internal Server Error`);
  }

  /**
   * Handle current request
   * @param req request instance
   * @param res response instance
   */
  async handle(req: Req, res: Res) {
    await this.runMiddlewares(req, res);

    if (req.method!.toLowerCase() === 'options') {
      res.status(200).end();
      return;
    }

    const handlers = this.getHandlers(req);
    if (!handlers) return this.on404(req, res);

    for (const handler of handlers) {
      try {
        await handler(req, res);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.log(e.message);
        }
        return this.on500(req, res);
      }
    }
  }
}

export = Router;
