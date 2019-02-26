// 项目的文档
const mongoose = require('mongoose')
const moment = require('moment')

let projectSchema = mongoose.Schema({
    // 名称
    name: {
        type: String
    },
    // 开发周期
    cycle: {
        type: String,
        default: ''
    },
    // 项目介绍
    introduce: {
        type: String
    },
    //负责模块
    doit: {
        type: String
    },
    // 所用到的技能，以后改成==》tags标签表
    skill: {
        type: String
    },
    // 项目介绍的img
    img: [{
        id: String,
        url: String
    }],
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

const project = mongoose.model('project', projectSchema)

module.exports = project
