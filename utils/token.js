const config = require('../config')
const jwt = require('jsonwebtoken')

exports.getToken = (userinfo) => {
    const token = jwt.sign(userinfo, config.JWT_SECRET, { expiresIn: '3m' })
    const { iat, exp } = jwt.decode(token)
    console.log({ token, iat, exp })
    return { token, iat, exp }
}