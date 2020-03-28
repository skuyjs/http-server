const Server = require('..');
const server = new Server();

server.get('/', (req, res) => {
  res.json({
    'message': 'hello',
  });
});

server.listen(8080);
