function injectResponse(res) {
  res.status = (code=200) => {
    if (typeof code !== 'number' && process.env.NODE_ENV === 'development') {
      console.log('Cannot set status code with given code');
    }

    res.statusCode = code;

    return res;
  };

  const sendByType = (type, body) => {
    res.setHeader('Content-Type', type);
    res.end(body);
  }

  res.send = (param) => {
    sendByType('text/html', param);
  };

  res.json = (param) => {
    let json = typeof param === 'object' ? JSON.stringify(param) : param;
    sendByType('application/json', json);
  }
}

module.exports = injectResponse;
