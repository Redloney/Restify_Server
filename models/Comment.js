const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const { Schema } = mongoose

const ChildrenSchema = new Schema({
    userinfo: {
        type: Object,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    address: {
        type: Object,
        required: true
    },
    isDel: {
        type: Boolean,
        required: true,
        default: false
    }
})

const CommentSchema = new Schema({
    userinfo: {
        type: Object,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    address: {
        type: Object,
        required: true
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