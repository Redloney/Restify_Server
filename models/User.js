const mongoose = require('../db/db')
const timestamp = require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    weburl: {
        type: String
    },
    address: {
        type: Object
    }
})

UserSchema.plugin(timestamp)
const User = mongoose.model('User', UserSchema, 'user')
module.exports = User