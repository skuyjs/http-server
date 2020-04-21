const Server = require('../dist')
const server = new Server()

server.get('/', (req, res) => {
  res.json({
    message: 'welcome'
  })
})

server.post('/', (req, res) => {
  res.json(req.body)
})

server.listen(8081)
