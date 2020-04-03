const fs = require('fs');
const path = require('path');
const Hbs = require("handlebars");

const render = (root, file, data) => {
  const viewFile = path.resolve(root, file);
  const viewContent = fs.readFileSync(viewFile).toString();
  const template = Hbs.compile(viewContent);
  return template(data);
};

module.exports = {
  render,
};
