const User = require('../models/User')

// 封装操作数据库方法

const _filter = { '__v': 0, }

const initKeys = {
    page: 0,
    size: 15,
    sorter: 'createtime_descend'
}

class Mongodb {
    // 查询 by id
    queryById(_id) {
        return new Promise((resolve, reject) => {
            User.findById(_id, _filter, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    // 查询
    query(info, keys) {
        let { page = 0, size = 15, sorter = 'createdAt_descend' } = keys ? keys : initKeys
        size = parseInt(size)
        const sortKey = sorter.split('_')[0]
        const sortVal = sorter.split('_')[1] === 'ascend' ? 1 : -1
        return new Promise((resolve, reject) => {
            User.aggregate([
                    { '$match': info },
                    {
                        '$project': _filter,
                    }
                ])
                .sort({
                    [sortKey]: sortVal
                })
                .skip(page * size)
                .limit(size)
                .exec((err, res) => {
                    if (err) reject(err)
                    res && res.length == 0 ? resolve([]) : resolve(res)
                })
        })
    }
    // 创建
    create(info = {}) {
        const user = new User(info)
        return new Promise((resolve, reject) => {
            user.save((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    // 更新
    update(_id, info) {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(_id, info, { new: true, fields: _filter }, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    // 统计注册人数
    count(options) {
        return new Promise((resolve, reject) => {
            User.find({ ...options }, _filter)
                .exec((err, res) => {
                    if (err) reject(err)
                    res && res.length ? resolve(res.length) : resolve(0)
                })
        })
    }
}

module.exports = new Mongodb()