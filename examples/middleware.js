const Server = require('..');
const server = new Server();

server.use((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
});

server.get('/', (req, res) => {
  res.json({
    message: 'halo',
  });
});

server.listen(8080);
