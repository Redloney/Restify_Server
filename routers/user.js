const errors = require('restify-errors')
const User = require('../db/user')
const { getToken } = require('../utils/token')

module.exports = server => {
    // 获取用户列表
    server.get('/api/user/list', async (req, res, next) => {
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
    server.get('/api/user/info/:id', async (req, res, next) => {
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
    server.post('/api/user/insert', async (req, res, next) => {
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
    server.post('/api/user/validate', async (req, res, next) => {
        if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type as application/json'))
        try {
            const info = req.body
            const users = await User.query(info)
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
    server.post('/api/user/login', async (req, res, next) => {
        try {
            if (!req.is('application/json')) return next(new errors.InvalidContentError('expect content-type be application/json'))
            const { nickname, email, weburl, address } = req.body
            const username = await User.query({ nickname })
            const useremail = await User.query({ email })
            const userinfo = await User.query({ nickname, email })

            // 若用户不存在
            if (!username[0] && !useremail[0] && !userinfo[0]) {
                const user = await User.create({ nickname, email, weburl, address })
                res.send({
                    data: {
                        msg: '注册成功！',
                        user,
                        ...getToken(userinfo[0])
                    },
                    code: 201
                })
                return
            }

            // 判断
            username[0] ? useremail[0] ? res.send({
                data: {
                    msg: '登录成功！',
                    user: userinfo[0],
                    ...getToken(userinfo[0])
                },
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
            res.send(err)
        }
    })
    // 用户注销
    // server.post('/api/user/logout',async (req, res, next) => {
    //     try {
    //     } catch (err) {
    //         res.send(err)
    //     }
    // })
}