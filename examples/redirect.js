const Server = require('../dist');
const server = new Server();

server.get('/', (req, res) => {
  res.json({
    message: 'welcome'
  });
});

server.get('/redirect', (req, res) => {
  res.redirect('/');
});

server.get('/redirect-301', (req, res) => {
  res.redirect('/', 301);
});

server.listen(8080);
