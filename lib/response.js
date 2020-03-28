class Response {
  constructor(res) {
    this.stream = res;
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

  end(param) {
    this.stream.end(param);
  }
}

module.exports = Response;
