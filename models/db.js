const mongoose = require('mongoose')
const user = require('./user.js')
const article = require('./article.js')
const project = require('./project.js')


// 链接wang-website-DB
mongoose.connect('mongodb://localhost:27017/wangWebDB', {useNewUrlParser:true}, function (err) {
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
    project
}

module.exports = model
