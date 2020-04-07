function injectResponse(res) {
  res.status = (code=200) => {
    if (typeof code !== 'number' && process.env.NODE_ENV === 'development') {
      console.log('Cannot set status code with given code');
    }

    res.statusCode = code;

    return res;
  };

  res.send = (param) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(param);
  };

  res.json = (param) => {
    let json = typeof param === 'object' ? JSON.stringify(param) : param;
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  }
}

module.exports = injectResponse;
