const Stream = require('stream');
const bodyParser = require('./body-parser');

class Response extends Stream {
  constructor(req) {
    super(req);
    this.stream = req;

    this.createProperties();
    this.parseBody();
  }

  createProperties() {
    Object.assign(this, this.stream);
  }

  parseBody() {
    switch(this.stream.headers['content-type']) {
      case 'application/json':
        this.body = bodyParser.json(this.stream);
        break;
      default:
        this.body = bodyParser.json(this.stream);
    }
  }

  setParams(params, values) {
    this.params = {};

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
          this.params[param] = vals[i];
        });
    }
  }
}

module.exports = Response;
