const Server = require('../dist')
const server = new Server()

server.get('/hi/:name', (req, res) => {
  res.send(`hello, ${req.params.name}`)
})

server.listen(8080)
