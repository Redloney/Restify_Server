const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const { ObjectId } = mongoose.SchemaTypes

const ReplySchema = mongoose.Schema({
    comment: {
        type: ObjectId,
        ref: 'comment',
        required: true,
    },
    user: {
        type: ObjectId,
        ref: 'user',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
})

ReplySchema.plugin(timestamp)
const Reply = mongoose.model('Reply', ReplySchema, 'reply')
module.exports = Reply