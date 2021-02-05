const errors = require('restify-errors')
const User = require('../db/User')
const Comment = require('../db/comment')
const { _filter } = require('../utils')

module.exports = server => {
    // 获取所有评论
    server.get('/api/comment/allComments', async (req, res, next) => {
        try {
            let { page, size, sorter, ...obj } = req.query
            const comments = await Comment.queryAll(obj, { page, size, sorter })
            console.log(comments)
            const count = await Comment.countAll({})
            console.log(count)
            comments ? res.send({
                comments,
                count,
                code: 200,
                msg: '数据获取成功！'
            }) : res.send({
                code: 0,
                msg: '数据获取失败！'
            })
        } catch (err) {
            res.send(err)
        }
    })
    // 获取所有未删除评论
    server.get('/api/comment/comments', async (req, res, next) => {
        const { page, size, sorter, ...obj } = req.query
        const comments = await Comment.query(obj, { page, size, sorter })
        const count = await Comment.count({})
        comments ? res.send({
            comments: comments ? comments : [],
            code: 200,
            count
        }) : res.send({
            code: 0
        })
        next()
    })
    // 添加评论
    server.post('/api/comment/insert', async (req, res, next) => {
        if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type as application/json'))
        try {
            let { _id, content, replyId, address } = req.body
            let isPass = _filter(content)
            if (!isPass) {
                res.send({ code: 0, msg: '关键词过滤,请检查后重新提交！' })
                return
            }
            const userinfo = await User.queryById(_id)
            const commentInfo = { userinfo, content, address, isDel: false }
            let comments = replyId ?
                await Comment.update(replyId, { ...commentInfo }) :
                await Comment.create(commentInfo)
            res.send({
                comments,
                code: 200,
                msg: '评论成功!'
            })
            next()
        } catch (err) {
            res.send(err)
        }
    })
    // 删除评论 
    server.post('/api/comment/delete', async (req, res, next) => {
        if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type as application/json'))
        try {
            const { userId, parentId, commentId } = req.body
            if (userId && commentId) {
                const result = await Comment.delete(parentId, commentId)
                res.send({
                    result,
                    msg: '评论删除成功！',
                    code: 200
                })
                return
            }
            res.send({
                msg: '评论删除失败！',
                code: 0
            })
        } catch (err) {
            res.send(err)
        }
    })

}