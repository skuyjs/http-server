# @hamjs/http-server
Mini http server framework for NodeJS

## Installation
To install `@hamjs/http-server`, run this command using terminal inside your project.
```bash
npm install https://github.com/hadihammurabi/hamjs-http-server
```

## Usage
To use this framework, you can follow this example.
```javascript
const Server = require('@hamjs/http-server');
const server = new Server();

server.get('/', (req, res) => {
  res.send('hello');
});

server.listen(8080);
```

<details><summary>More Examples</summary>
You can see more examples <a href="./examples">here</a>.
</details>

## License
[MIT](./LICENSE)
