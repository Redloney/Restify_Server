const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const { ObjectId } = mongoose.SchemaTypes

const CommentSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'users'
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    replys: {
        type: ObjectId,
        ref: 'reply'
    }
})

CommentSchema.plugin(timestamp)
const Comment = mongoose.model('Comment', CommentSchema, 'comment')
module.exports = Comment