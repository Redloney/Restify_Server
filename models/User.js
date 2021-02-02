const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    pageUrl: {
        type: String,
        trim: true
    },
    address: {
        type: Object
    }
})

UserSchema.plugin(timestamp)
const User = mongoose.model('User', UserSchema, 'user')
module.exports = User