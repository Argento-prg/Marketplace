//основной фреймворк - Коа
const Koa = require('koa')
//порт из конфига
const {PORT} = require('./config.json').ListenerConfig
//подключаем БД
require('./bd')
//парсинг url
const koaBody = require('koa-body')
//маршруты
const router = require('./router')
//работа со статикой
const serve = require('koa-static')

const path = require('path')

const app = new Koa()

app.use(koaBody({
    multipart: true, 
    formidable: {
        uploadDir: path.resolve(__dirname, '.', 'static')
    },
    urlencoded: true
}))
app.use(serve(path.resolve(__dirname, '.', 'static')))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
    console.log('Server has been started')
})