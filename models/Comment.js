const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const { ObjectId } = mongoose.SchemaTypes

const ChildrenSchema = new mongoose.Schema({

})

const CommentSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        user: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    replys: {
        type: ObjectId,
        ref: 'Reply'
    },
    children: [ChildrenSchema],
    isDel: {
        type: Boolean,
        required: true,
        default: false
    }
})

CommentSchema.plugin(timestamp)
const Comment = mongoose.model('Comment', CommentSchema, 'comment')
module.exports = Comment