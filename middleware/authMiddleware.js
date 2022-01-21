const jwt = require('jsonwebtoken')
const {SecretKey} = require('../config.json').CONSTANT

module.exports = (ctx, next) => {
    try {
        const token = ctx.headers.authorization.split(' ')[1]//Bearer token
        if (!token) {
            ctx.response.status = 400
            return ctx.body = {error: 'Не авторизованный пользователь', status: false}
        }
        const decoded = jwt.verify(token, SecretKey)
        ctx.request.body.user = decoded
        return next()
    } catch (e) {
        ctx.response.status = 400
        return ctx.body = {error: e, status: false}
    }
}