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
