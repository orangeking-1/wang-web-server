const express = require('express')
const bodyParse = require('body-parser')
const router = require('./router/router')
const cors = require('cors')
const path = require('path')
const app = express()

//设置允许跨域访问该服务.
app.use(cors())

const resolve = file => path.resolve(__dirname, file)
app.use('/assets', express.static(resolve('./assets')))
app.use('/', express.static(resolve('./view')))

// 解析 application/json
app.use(bodyParse.json())
// 解析 application/x-www-form-urlencoded
app.use(bodyParse.urlencoded({limit: '20mb', extended: true}))

// 加载路由
app.use(router)

// 部署端口
app.listen(3333, '0.0.0.0', () => {
    console.log('my servers is running at port 3333!')
})
