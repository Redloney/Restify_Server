const config = require('../config')
const jwt = require('jsonwebtoken')
const FastScan = require('fastscan')

const words = [
    "fuck",
    "shit",
    "草你妈的",
    "操你妈的",
    "操尼玛的",
    "草尼玛的",
    "去死",
    "垃圾",
    "......",
    "nm",
    "cnm"
]
const scanner = new FastScan(words)

exports._filter = (content) => {
    content = content.toUpperCase()
    const offWords = scanner.search(content, option = { quick: true });
    return offWords.length > 0 ? false : true;
}


exports.getToken = (userinfo) => {
    const token = jwt.sign(userinfo, config.JWT_SECRET, { expiresIn: '3m' })
    const { iat, exp } = jwt.decode(token)
    console.log({ token, iat, exp })
    return { token, iat, exp }
}