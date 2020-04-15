// const bodyParser = require('./body-parser');
const url = require('url');

/**
 * Inject some methods into req object
 * @param {http.IncomingMessage} req request instance
 */
function injectRequest(req) {

  // req.parseBody = () => {
  //   let body;
  //   switch(req.headers['content-type']) {
  //     case 'application/json':
  //       body = bodyParser.json(req);
  //       break;
  //     default:
  //       body = bodyParser.json(req);
  //   }
  //   req.body;
  // }

  /**
   * List of query parameters
   * @type {object} paired key-value query parameters
   */
  req.query = (() => {
    const parsedurl = url.parse(`${req.headers.host}${req.url}`);
    if (!!parsedurl.query) {
      const assocQueries = parsedurl.query.split('&');
      const queries = {};
      assocQueries.forEach(query => {
        const pair = query.split('=');
        queries[pair[0]] = pair[1];
      });
      return queries;
    }

    return null;
  })();

  /**
   * Set URL parameters
   * @param {array} params list of parameters name
   * @param {array} values list of parameters value
   */
  req.setParams = (params, values) => {
    req.params = {};

    if (
      params != null &&
      params.length > 0 &&
      values != null &&
      values.length === params.length
    ) {
      const vals = values.map(val => val.replace('/', ''));
      const pars = params
        .map(param => param.replace(':', ''))
        .forEach((param, i) => {
          req.params[param] = vals[i];
        });
    }
  }
}

module.exports = injectRequest;
