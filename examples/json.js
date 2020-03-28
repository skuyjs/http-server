const Server = require('..');
const server = new Server();

server.post('/', (req, res) => {
  res.json(req.body);
});

server.listen(8080);
