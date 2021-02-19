const Comment = require('../models/Comment')

// 封装操作数据库方法

const _filter = {
    '__v': 0,
    'isDel': 0,
    'children.isDel': 0
}

const initKeys = {
    page: 0,
    size: 15,
    sorter: 'createdAt_descend'
}

class Mongodb {

    // 统计全部评论
    countAll(obj) {
        return new Promise((resolve, reject) => {
            console.log('count')
            Comment.find({ ...obj }, _filter).exec((err, res) => {
                if (err) reject(err)
                res && res.length ? resolve(res.length) : resolve(0)
            })
        })
    }

    // 统计未被删除评论
    count(obj) {
        return new Promise((resolve, reject) => {
            Comment.find({ ...obj, isDel: false }, _filter).exec((err, res) => {
                if (err) reject(err)
                res && res.length ? resolve(res.length) : resolve(0)
            })
        })
    }

    // 查询评论 by id
    queryById(_id) {
        return new Promise((resolve, reject) => {
            Comment.findById(_id, (err, res) => {
                if (err) reject(err)
                res ? resolve(res) : resolve(null)
            })
        })
    }

    query(obj, keys) {
        const { page = 0, size = 15, sorter = 'createdAt_descend' } = keys ? keys : initKeys
        const sortKey = sorter.split('_')[0];
        const sortVal = sorter.split('_')[1] === 'ascend' ? 1 : -1;
        return new Promise((resolve, reject) => {
            Comment.aggregate([
                    { $match: { ...obj, isDel: false } },
                    {
                        $project: {
                            'content': 1,
                            'createdAt': 1,
                            'ip': 1,
                            'city': 1,
                            'userinfo': 1,
                            'children': {
                                $filter: {
                                    input: "$children",
                                    as: "children",
                                    cond: {
                                        $eq: ["$$children.isDel", false],
                                    }
                                }
                            }
                        }
                    }
                ])
                .sort({
                    [sortKey]: sortVal
                })
                .skip(page * size)
                .limit(size)
                .exec((err, res) => {
                    if (err) reject(err)
                    res && res.length === 0 ? resolve([]) : resolve(res)
                })
        })
    }

    queryAll(obj, keys) {
        const { page = 0, size = 15, sorter = 'createdAt_descend' } = keys ? keys : initKeys
        const sortKey = sorter.split('_')[0];
        const sortVal = sorter.split('_')[1] === 'ascend' ? 1 : -1;
        return new Promise((resolve, reject) => {
            Comment.aggregate([
                    { "$match": obj },
                    { '$project': _filter }
                ])
                .sort({
                    [sortKey]: sortVal
                })
                .skip(page * size)
                .limit(size)
                .exec((err, res) => {
                    if (err) reject(err)
                    res && res.length === 0 ? resolve([]) : resolve(res)
                })
        })
    }

    create(obj) {
        return new Promise((resolve, reject) => {
            console.log(1)
            console.log(obj)
            const comment = new Comment(obj)
            comment.save((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    // fId 父级ID 
    delete(fId, _id) {
        return new Promise((resolve, reject) => {
            let result
            fId == _id ?
                result = Comment.findByIdAndUpdate(fId, { isDel: true }) :
                result = Comment.findOneAndUpdate({
                    _id: fId,
                    children: { $elemMatch: { _id } }
                }, {
                    $set: { "children.$.isDel": true }
                }, {
                    upsert: true,
                    new: true,
                    fields: _filter
                })
            result.exec((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    update(_id, obj) {
        return new Promise((resolve, reject) => {
            Comment.findByIdAndUpdate(_id, {
                    $push: {
                        children: { ...obj }
                    }
                }, {
                    upsert: true,
                    new: true,
                    fields: _filter
                })
                .exec((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        })
    }







}

module.exports = new Mongodb()