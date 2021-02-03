const errors = require('restify-errors');

const Comment = require('../models/Comment')

module.exports = server => {

    // 获取评论列表
    server.get('/comments', async (req, res, next) => {
        try {
            // const comments = await Comment.aggregate([
            //   {
            //     $lookup: {
            //       from: "users",
            //       localField: "user_id",
            //       foreignField: "_id",
            //       as: "userinfo"
            //     }
            //   }, {
            //     $project: {
            //       user_id: 1,
            //       content: 1,
            //       createdAt: 1,
            //       'userinfo._id': 1,
            //       'userinfo.nickname': 1,
            //       'userinfo.email': 1,
            //       'userinfo.pageUrl': 1,
            //     }
            //   }
            // ])

            const comments = await Comment.find().populate(['user', 'reply'])
            // const comments = await Comment.find().populate({
            //     path: 'user',
            //     model: 'User',
            //     select: '_id nickname email pageUrl createdAt',
            //     populate: {
            //         path: 'replys',
            //         model: 'Reply',
            //     }
            // })

            res.send(comments)
            next()
        } catch (error) {
            console.log(new errors.InvalidContentError(error));
        }
    })

    // 添加评论
    server.post('/comment/insert', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError('参数不是json类型'))
        }
        const { user_id: user, content } = req.body
        try {
            const comment = new Comment({ user, content })
            const feedback = await comment.save()
            console.log(feedback)
            res.send({ status: 201, message: '留言成功!' })
        } catch (err) {
            res.send(err)
        }
    })

    // 删除评论
    server.post('/comment/delete', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError('参数不是json类型'))
        }
        const { _id } = req.body
        try {
            const feedback = await Comment.findByIdAndRemove(_id)
            res.send({ status: 200, message: '删除成功！' })
        } catch (error) {
            console.log(error)
        }
    })

}