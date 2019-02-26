// 用户模板
const mongoose = require('mongoose')
const moment = require('moment')

let userSchema = mongoose.Schema({
    // 账号
    account: {
        type: String
    },
    // 密码
    password: {
        type: String
    },
    // 邮箱
    email: {
        type: String,
        default: ''
    },
    // 头像
    avatar: {
        type: String,
        default: ''
    },
    // 个人描述（签名）
    profile: {
        type: String,
        default: ''
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
    },
    // 位置
    location: {
        type: String,
        default: ''
    },
    // 是否管理员
    admin: {
        type: Boolean,
        default: false
    },
    // 是否超级管理员
    // super_admin: {
    //     type: Boolean,
    //     default: false
    // }
})

const user = mongoose.model('user', userSchema)

module.exports = user
