// 文章模板
const mongoose = require('mongoose')
const moment = require('moment')


let Schema = mongoose.Schema

let messageBoardSchema = mongoose.Schema({
    // 留言人
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    // 类型：1网站留言，2是文章评价，3项目评价，4对他人的评论
    type: {
        type: String
    },
    // 关联的文章id
    articleId: {
        type: Schema.Types.ObjectId,
        ref: 'article'
    },
    // 关联的项目的id
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    // 关联对他评论的id
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'comment'
    },
    // 留言内容
    content: {
        type: String
    },
    // 创建时间
    created_time: {
        type: String,
        default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
})

const comment = mongoose.model('comment', messageBoardSchema)

module.exports = comment
