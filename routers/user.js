const errors = require('restify-errors');
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const config = require('../config')
const login = require('../utils/login');

module.exports = server => {

    // 获取用户列表
    server.get('/users', async (req, res, next) => {
        try {
            const users = await User.find({})
            res.send(users)
            next()
        } catch (error) {
            console.log(new errors.InvalidContentError(error));
        }
    })

    // 检查用户是否存在 by nickname
    server.post('/user/exist', async (req, res, next) => {
        // check for json
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError('参数不是json类型'))
        }
        const { nickname } = req.body
        try {
            const user = await User.find({ nickname })
            res.send(user)
            next()
        } catch (error) {
            return next(new errors.InvalidContentError(error.message))
        }

    })

    // 检查用户是否存在 by email
    server.post('/email/exist', async (req, res, next) => {
        // check for json
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError('参数不是json类型'))
        }
        const { email } = req.body
        try {
            const user = await User.find({ email })
            res.send(user)
            next()
        } catch (error) {
            return next(new errors.InvalidContentError(error.message))
        }

    })


    // 登录 || 添加用户 && return token 
    server.post('/user/login', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError('expect content-type be application/json'))
        }
        const { nickname, email, pageUrl, address } = req.body
        try {
            const feedback = await login.UserLogin(nickname, email, pageUrl, address)
            console.log('feedback', feedback)
            if (feedback.status === 200) {
                const token = jwt.sign(feedback.userinfo.toJSON(), config.JWT_SECRET, { expiresIn: '3m' })
                const { iat, exp } = jwt.decode(token)
                res.send({ iat, exp, token, ...feedback })
            } else {
                res.send(feedback)
            }
            next()
        } catch (err) {
            return next(new errors.InvalidContentError(err.message))
        }
    })


}