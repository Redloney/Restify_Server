const restify = require('restify')

const server = restify.createServer();

const user = require('./routers/user')
const comment = require('./routers/comment')

// Middleware
server.use(restify.plugins.bodyParser())
server.use(restify.plugins.queryParser())

server.listen(8082, () => {
    user(server)
    comment(server)
    console.log('Restify Server 已经运行在 8082 端口')
    console.log('http://localhost:8082')
})