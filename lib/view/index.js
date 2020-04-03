const defaultconfig = {
  engine: 'handlebars',
  dir: '',
};

class View {
  constructor(config={}) {
    this.config = {
      ...defaultconfig,
      ...config,
    };

    this.engine = require(`./${this.config.engine || defaultconfig.engine}`);
  }

  getConfig(name) {
    return this.config[name];
  }

  build(res) {
    res.render = (path, data) => res.send(this.engine.render(this.config.dir, path, data));
  }
}

module.exports = View;
