const Stream = require('stream');
const bodyParser = require('./body-parser');

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
