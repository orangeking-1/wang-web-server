// 文章模板
const mongoose = require('mongoose')
const moment = require('moment')


let Schema = mongoose.Schema

let airicleSchema = mongoose.Schema({
    // 文章标题
    title: {
        type: String
    },
    // 作者
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    // 标签
    // tags: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'tag'
    // }],
    // 文章内容
    content: {
        type: String
    },
    // 封面图
    cover: {
        type: String,
        default: ''
    },
    // 评论数目
    comment_count: {
        type: Number
    },
    // 注册时间
    created_time: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    // 更新时间
    update_time: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
})

const aritcle = mongoose.model('aritcle', airicleSchema)

module.exports = aritcle
