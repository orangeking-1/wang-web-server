const express = require('express')
let db = require('../models/db.js')
const moment = require('moment')
const router = express.Router()

// 请求的路径
// 登陆的接口
router.post('/api/login', (req, res) => {
    try {
        db.user.findOne({ account: req.body.account}, (err, doc) => {
            if (err) return console.error('数据库出错（user查询数据出错），错误为：' + err)
            // 如果没有查到该账号
            if (!doc) return res.send(sendDataFormat('没有该账号，这核对你的账号', 2))
            // 输入密码不正确
            if (req.body.password !== doc.password) {
                return res.send(sendDataFormat('密码输入错误，请重新输入密码', 3))
            }
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('登陆接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 注册的接口
router.post('/api/register', (req, res) => {
    try {
        // 验证两次密码是否一致
        if (req.body.password !== req.body.againPassword) {
            return res.send(sendDataFormat('两次输入密码不一致'))
        }
        // 查询数据库中是否存在该账户
        let seachPromise = new Promise((resolve, reject) => {
            db.user.findOne({ account: req.body.account}, (err, doc) => {
                if (err) return console.error('数据库出错（user查询数据出错），错误为：' + err)
                // 如果没有查到该账号
                if (doc) {
                    res.send(sendDataFormat('该账号已被注册', 2))
                } else {
                    resolve()
                }
            })
        })
        seachPromise.then(() => {
            // 获取注册的帐户名跟密码
            let info = {
                account: req.body.account,
                password: req.body.password,
                location: req.body.addr
            }
            // 构建model实例
            let userData = new db.user(info)
            userData.save((err, doc) => {
                if (err) return console.error('数据库出错（user保存数据出错），错误为：' + err)
                res.send(sendDataFormat(doc))
            })
        }).catch(e => {
            console.log('注册接口的promise错误：' + e)
        })
    } catch (e) {
        console.log('注册接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 修改个人信息
router.post('/api/modifyUserInfo', (req, res) => {
    try {
        let userInfo = req.body.userInfo
        userInfo.update_time = moment().format('YYYY-MM-DD HH:mm:ss')
        db.user.findOneAndUpdate({_id: userInfo._id}, userInfo, {new: true}, (err, doc) => {
            if (err) return console.error('数据库出错（user修改数据出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('添加文章接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 添加文章
router.post('/api/addArticle', (req, res) => {
    try {
        // 获取文章标题，内容
        let info = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        }
        // 构建model实例
        new db.article(info).save(err => {
            if (err) return console.error('数据库出错（aritcle保存数据出错），错误为：' + err)
            res.send(sendDataFormat('添加成功！'))
        })
    } catch (e) {
        console.log('添加文章接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 获取文章列表
router.post('/api/getArticleList', (req, res) => {
    try {
        let pageSize = Number(req.body.pageSize)
        let currentPage = Number(req.body.currentPage)
        let search = req.body.search
        let sendData = {}
        // db.article.estimatedDocumentCount({$or: [{title: {$regex: search}}, {content: {$regex: search}}]}, (err, count) => {
        //     sendData.total = count
        //     console.log(count)
            db.article.find({$or: [{title: {$regex: search}}, {content: {$regex: search}}]}).count((err, doc) => {
                if (err) return console.error('数据库出错（article查询数据出错），错误为：' + err)
                sendData.total = doc
            })

            db.article.find({$or: [{title: {$regex: search}}, {content: {$regex: search}}]})
                .sort({_id: -1}) // 按照 _id倒序排列
                .limit(pageSize)  // 限制每页查询数量
                .skip((currentPage - 1) * pageSize)  // 从第几个查询
                .populate('author')
                .exec((err, doc) => {
                    if (err) return console.error('数据库出错（article查询数据出错），错误为：' + err)
                    // 查到列表为空
                    if (!doc) return res.send(sendDataFormat('当前没有发表得文章', 2))

                    sendData.listData = doc
                    res.send(sendDataFormat(sendData))
                })
        // })
    } catch (e) {
        console.log('文章列表接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 获取文章详情
router.post('/api/getArticleDetail', (req, res) => {
    try {
        let _id = req.body.articleId
        db.article.findOne({_id: _id}).populate('author').exec((err, doc) => {
            if (err) return console.error('数据库出错（article查询数据出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('文章详情接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 删除文章
router.post('/api/deleteArticle', (req, res) => {
    try {
        let _id = req.body.articleId
        db.article.findByIdAndRemove({_id: _id}, (err, doc) => {
            if (err) return console.error('数据库出错（article删除数据出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('文章删除接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 修改文章
router.post('/api/editArticle', (req, res) => {
    try {
        let _id = req.body.articleId
        let updateData = {
            title: req.body.title,
            content: req.body.content,
            update_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        db.article.updateOne({_id: _id}, updateData, (err, doc) => {
            if (err) return console.error('数据库出错（article删除数据出错），错误为：' + err)
            res.send(sendDataFormat('修改成功！'))
        })
    } catch (e) {
        console.log('文章删除接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 添加项目
router.post('/api/addProject', (req, res) => {
    try {
        new db.project(req.body).save(err => {
            if (err) return console.error('数据库出错（project保存数据出错），错误为：' + err)
            res.send(sendDataFormat('添加成功！'))
        })
    } catch (e) {
        console.log('文章删除接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 获取项目列表
router.post('/api/getProjectList', (req, res) => {
    try {
        db.project.find({}).exec((err, doc) => {
            if (err) return console.error('数据库出错（project查询列表数据出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('文章删除接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 获取项目的详情信息
router.post('/api/getProjectDetail', (req, res) => {
    try {
        db.project.findOne({_id: req.body._id}).exec((err, doc) => {
            if (err) return console.error('数据库出错（project查询详情数据出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('文章删除接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 删除项目
router.post('/api/deleteProject', (req, res) => {
    try {
        db.project.findByIdAndRemove({_id: req.body._id}, (err, doc) => {
            if (err) return console.error('数据库出错（article删除数据出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('文章删除接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 修改项目
router.post('/api/editProject', (req, res) => {
    try {
        let updateData = req.body
        updateData.update_time = moment().format('YYYY-MM-DD HH:mm:ss')
        db.project.updateOne({_id: updateData._id}, updateData, (err, doc) => {
            if (err) return console.error('数据库出错（article删除数据出错），错误为：' + err)
            res.send(sendDataFormat('修改成功！'))
        })
    } catch (e) {
        console.log('文章删除接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 添加评论
router.post('/api/addComment', (req, res) => {
    try {
        new db.comment(req.body).save(err => {
            if (err) return console.error('数据库出错（commnet保存数据出错），错误为：' + err)
            res.send(sendDataFormat('添加成功！'))
        })
    } catch (e) {
        console.log('添加评论接口出错，错误为：' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 获取评论列表
router.post('/api/getCommentList', (req, res) => {
    try {
        // 类型：1网站留言，2是文章评价，3项目评价，4对他人的评论
        let type = req.body.type
        let articleId = req.body.articleId
        db.comment.find({type, articleId}).populate('author').sort({_id: -1}).exec((err, doc) => {
            if (err) return console.error('数据库出错（comment查询出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('获取评论列表出错，错误为' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 删除评论列表
router.post('/api/deleteComment', (req, res) => {
    try {
        db.comment.findByIdAndRemove({_id: req.body._id}, (err, doc) => {
            if (err) return console.error('数据库出错（comment删除数据出错），错误为：' + err)
            res.send(sendDataFormat(doc))
        })
    } catch (e) {
        console.log('删除评论出错，错误为' + e)
        res.send(sendDataFormat(e, -1))
    }
})

// 封装发送的数据格式
// 成功
function sendDataFormat(data, code) {
    if (code) {
        return {
            code,
            data
        }
    } else {
        return {
            code: 0,
            data
        }
    }
}

module.exports = router

