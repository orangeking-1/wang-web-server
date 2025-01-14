const mongoose = require('mongoose')
const user = require('./user.js')
const article = require('./article.js')
const project = require('./project.js')
const comment = require('./comment.js')

// 连接本地数据库中的wangWebDB数据库
const options = {
    // 不自动创建_id
    autoIndex: false,
    // 允许socket最大连接数，同时进行一个操作
    poolSize: 10,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    bufferMaxEntries: 0,
    // 对于长期运行的后台应用，启用毫秒级 keepAlive 是一个精明的操作。不这么做你可能会经常 收到看似毫无原因的 "connection closed" 错误。
    keepAlive: 120
}

// 链接wang-website-DB
mongoose.connect('mongodb://localhost:27017/wangWebDB', options, function (err) {
    if (err) {
        console.log('connection db error,Error:' + err)
    }
})
const db = mongoose.connection
db.on('error', console.log.bind(console, 'connection db error'))
db.on('open', function () {
    // connection success!
    console.log(' =========== MongoDB is Opened! ===========')
})


let model = {
    user,
    article,
    project,
    comment
}

module.exports = model
