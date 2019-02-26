const mongoose = require('mongoose')

// 连接本地数据库中的wangWebDB数据库
const options = {
    // 不自动创建_id
    autoIndex: false,
    // 允许socket最大连接数，同时进行一个操作
    poolSize: 10,
    bufferMaxEntries: 0,
    // 对于长期运行的后台应用，启用毫秒级 keepAlive 是一个精明的操作。不这么做你可能会经常 收到看似毫无原因的 "connection closed" 错误。
    keepAlive: 120
}
const db = mongoose.connect('mongodb://localhost/wangWebDB', options)
