const Server = require('../dist');
const server = new Server();

server.get(
  '/',
  (req, res) => {
    res.status(404);
  },
  (req, res) => {
    res.end('not found but found :v');
  }
);

server.listen(8080);
