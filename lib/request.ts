import { Req } from './typings/req'
import url from 'url'

/**
 * Inject some methods into req object
 * @param req request instance
 */
export = function injectRequest(req: Req) {
  /**
   * List of query parameters
   * @type paired key-value query parameters
   */
  req.query = (() => {
    const parsedurl = url.parse(`${req.headers.host}${req.url}`)
    if (parsedurl.query) {
      const assocQueries = parsedurl.query.split('&')
      const queries = {}
      assocQueries.forEach((query) => {
        const pair = query.split('=')
        queries[pair[0]] = pair[1]
      })
      return queries
    }

    return {}
  })()

  /**
   * Set URL parameters
   * @param params list of parameters name
   * @param values list of parameters value
   */
  req.setParams = (params, values) => {
    req.params = {}

    if (params && params.length > 0 && values && values.length === params.length) {
      const vals = values.map((val) => val.replace('/', ''))
      params
        .map((param) => param.replace(':', ''))
        .forEach((param, i) => {
          req.params[param] = vals[i]
        })
    }
  }
}
