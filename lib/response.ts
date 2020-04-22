import { Res } from './typings/res';

/**
 * Inject some methods into res object
 * @param res response instance
 */
export = function injectResponse(res: Res) {
  /**
   * Set response status code
   * @param code response status code
   */
  res.status = (code: number = 200) => {
    // tslint:disable-next-line: strict-type-predicates
    if (typeof code !== 'number' && process.env.NODE_ENV === 'development') {
      console.log('Cannot set status code with given code');
    }

    res.statusCode = code;

    return res;
  };

  /**
   * Send response by content type
   * @param type response content type
   * @param body response body
   */
  const sendByType = (type: string, body: any) => {
    res.setHeader('Content-Type', type);
    res.end(body);
  };

  /**
   * Send response with html content type
   * @param param response body (html)
   */
  res.send = (param: any) => {
    sendByType('text/html', param);
  };

  /**
   * Send response with json content type
   * @param param response body (json)
   */
  res.json = (param: any) => {
    const json = typeof param === 'object' ? JSON.stringify(param) : param;
    sendByType('application/json', json);
  };
};
