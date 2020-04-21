const Server = require('../dist')
const server = new Server()

server.get('/', (req, res) => {
  res.send('hello')
})

// sub-routing for /users/*
const usersRoute = new Server.Router()

usersRoute.get('/', (req, res) => {
  res.send('users')
})

usersRoute.get('/:id', (req, res) => {
  res.json(req.params)
})

server.use('/users', usersRoute)

server.listen(8080)
