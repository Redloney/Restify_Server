const errors = require('restify-errors')
const User = require('../db/user')
const Comment = require('../db/comment')
const { _filter } = require('../utils')
const dayjs = require('dayjs')

module.exports = server => {
    // 获取所有评论
    server.get('/api/comment/allComments', async (req, res, next) => {
        try {
            let { page, size, sorter, ...obj } = req.query
            const comments = await Comment.queryAll(obj, { page, size, sorter })
            const count = await Comment.countAll({})
            comments ? res.send({
                comments,
                count,
                code: 200,
            }) : res.send({
                code: 0,
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
            comments,
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
                res.send({ code: 0 })
                return
            }
            const userinfo = await User.queryById(_id)
            const createdAt = dayjs().format()
            const updatedAt = dayjs().format()
            const commentInfo = { userinfo, content, createdAt, updatedAt, address, isDel: false }
            let comments = replyId ?
                await Comment.update(replyId, { ...commentInfo }) :
                await Comment.create(commentInfo)
            res.send({
                comments,
                code: 200,
            })
            next()
        } catch (err) {
            res.send({ code: 0 })
        }
    })
    // 删除评论 
    server.post('/api/comment/delete', async (req, res, next) => {
        if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type as application/json'))
        try {
            const { uId, _id, fId } = req.body
            if (uId && _id) {
                const result = await Comment.delete(fId, _id)
                result ? res.send({
                    code: 200
                }) : res.send({
                    code: 0
                })
                return
            }
            res.send({
                code: 0
            })
            next()
        } catch (err) {
            res.send(err)
        }
    })

}