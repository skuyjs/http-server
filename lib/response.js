/**
 * Inject some methods into res object
 * @param {http.ServerResponse} res response instance
 */
function injectResponse(res) {

  /**
   * Set response status code
   * @param {number} code response status code
  */
  res.status = (code=200) => {
    if (typeof code !== 'number' && process.env.NODE_ENV === 'development') {
      console.log('Cannot set status code with given code');
    }

    res.statusCode = code;

    return res;
  };

  /**
   * Send response by content type
   * @param {string} type response content type
   * @param {any} body response body
  */
  const sendByType = (type, body) => {
    res.setHeader('Content-Type', type);
    res.end(body);
  }

  /**
   * Send response with html content type
   * @param {any} param response body (html)
  */
  res.send = (param) => {
    sendByType('text/html', param);
  };

  /**
   * Send response with json content type
   * @param {any} param response body (json)
  */
  res.json = (param) => {
    let json = typeof param === 'object' ? JSON.stringify(param) : param;
    sendByType('application/json', json);
  }
}

module.exports = injectResponse;
