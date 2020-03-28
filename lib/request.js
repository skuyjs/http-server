const Stream = require('stream');

class Response extends Stream {
  constructor(req) {
    super(req);
    this.stream = req;

    this.createProperties();
  }

  createProperties() {
    Object.assign(this, this.stream);
  }
}

module.exports = Response;
