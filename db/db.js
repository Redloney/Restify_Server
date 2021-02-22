const mongoose = require('mongoose')

const Mongo_Url = `mongodb://redloney:redloney233@localhost:27017/redloney?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

mongoose.connect(Mongo_Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection connected')
    // console.log('Mongoose connection open to ' + config.MONGODB_URL)
})

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected')
})

module.exports = mongoose