const Server = require('../..');
const server = new Server();

server.view({
  engine: 'handlebars',
  dir: `${__dirname}/views`
});

server.get('/:name', (req, res) => {
  res.render('index.hbs', {
    name: req.params.name,
  });
});

server.listen(8080);
