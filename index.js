const restify = require('restify')
const mongoose = require('mongoose');
const config = require('./config');

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser())

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

const db = mongoose.connection

db.on('error', (error) => console.log(error))

db.once('open', () => {
    require('./routers/user')(server)
    require('./routers/comment')(server)
    console.log('Server started on prot', config.URL)
})