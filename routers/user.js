const errors = require('restify-errors')
const User = require('../db/user')
const { getToken } = require('../utils/token')

module.exports = server => {
    // 获取用户列表
    server.get('/user/list', async (req, res, next) => {
        try {
            const { page, size, ...info } = req.query
            const list = await User.query(info, { page, size })
            res.send({
                list: list ? list : [],
                count: list.length,
                code: 200,
            })
            next()
        } catch (error) {
            console.log(new errors.InvalidContentError(error));
        }
    })
    // 获取用户 by id
    server.get('/user/info/:id', async (req, res, next) => {
        try {
            const _id = req.params.id
            const user = await User.queryById(_id)
            res.send(user)
            next()
        } catch (error) {
            console.log(new errors.InvalidContentError(error));
        }
    })
    // 创建用户
    server.post('/user/insert', async (req, res, next) => {
        if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type as application/json'))
        try {
            const { info } = req.body
            const result = await User.create(info)
            res.send(result)
            next()
        } catch (err) {
            console.warn(err);
        }
    })
    // 验证用户信息
    server.post('/user/validate', async (req, res, next) => {
        if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type as application/json'))
        try {
            const validate = req.body
            const users = await User.query(validate)
            users && users[0] ?
                res.send({
                    code: 200,
                    count: users.length
                }) :
                res.send({
                    code: 0
                })
            next()
        } catch (err) {
            res.send(err)
        }
    })
    // 用户登录
    server.post('/user/login', async (req, res, next) => {
        if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type be application/json'))
        try {
            const { nickname, email, weburl, address } = req.body
            const username = await User.query({ nickname })
            const useremail = await User.query({ email })
            const userinfo = await User.query({ nickname, email })

            // 若用户不存在
            if (!Boolean(username[0] && useremail[0])) {
                const user = await User.create({ nickname, email, weburl, address })
                res.send({
                    msg: '注册成功！',
                    user,
                    ...getToken(user),
                    code: 201
                })
                return
            }

            // 判断
            username[0] ? useremail[0] ? res.send({
                msg: '登录成功！',
                user: userinfo[0],
                ...getToken(userinfo[0]),
                code: 200
            }) : res.send({
                msg: "邮箱不匹配！",
                code: 0
            }) : res.send({
                msg: "用户不匹配！",
                code: 0
            })

            next()
        } catch (err) {
            console.log(err)
            res.send({
                msg: "登录错误！",
                code: 0
            })
        }
    })
}