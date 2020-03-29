class Response {
  constructor(res) {
    this.stream = res;
  }

  setHeader(key, value) {
    this.stream.setHeader(key, value);
  }

  status(code=200) {
    if (typeof code !== 'number' && process.env.NODE_ENV === 'development') {
      console.log('Cannot set status code with given code');
    }

    this.stream.statusCode = code;

    return this;
  }

  send(param) {
    this.stream.setHeader('Content-Type', 'text/html');
    this.end(param);
  }

  json(param) {
    const json = JSON.stringify(param);
    this.stream.setHeader('Content-Type', 'application/json');
    this.end(json);
  }

  end(param) {
    this.stream.end(param);
  }
}

module.exports = Response;
