const Server = require('..');
const server = new Server();

server.get('/', (req, res) => {
  res.send('mantap');
});

server.listen(8080);
