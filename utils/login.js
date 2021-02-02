const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.UserLogin = (nickname, email, pageUrl, address) => {
    return new Promise(async (resolve, reject) => {
        try {
            // （已知用户名！）查询用户邮箱是否正确 
            // const user = await User.findOne({ nickname, email })
            const user = await User.findOne({ $or: [{ nickname }, { email }] })
            //如果用户存在 更新用户信息
            if (user) {
                if (user.nickname === nickname) {
                    if (user.email === email) {
                        const userinfo = await User.findByIdAndUpdate(user._id, { nickname, email, pageUrl })
                        resolve({ status: 200, message: `登录成功!`, userinfo })
                    } else {
                        resolve({ status: 401, message: '邮箱错误,请重新输入!', userinfo: {} })
                    }
                } else {
                    resolve({ status: 401, message: '昵称错误,请重新输入!', userinfo: {} })
                }
            } else {
                // 否则创建新用户
                const user = new User({
                    nickname,
                    email,
                    pageUrl,
                    address
                })
                const userinfo = await user.save()
                resolve({ status: 200, message: `注册成功!`, userinfo })
            }
            next()
        } catch (err) {
            reject(err)
        }
    })
}