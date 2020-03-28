const Server = require('..');
const server = new Server();

server.get('/hi/:name', (req, res) => {
  res.send(`hello, ${req.params.name}`);
});

server.listen(8080);
