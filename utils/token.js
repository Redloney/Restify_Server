const config = require('../config')
const jwt = require('jsonwebtoken')

exports.getToken = (userinfo) => {
    console.log(userinfo)
    const token = jwt.sign(userinfo.toJSON(), config.JWT_SECRET, { expiresIn: '3m' })
    const { iat, exp } = jwt.decode(token)
    return { token, iat, exp }
}