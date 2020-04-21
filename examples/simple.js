const Server = require('../dist')
const server = new Server()

server.get('/', (req, res) => {
  res.send('hello')
})

server.listen(8080)
