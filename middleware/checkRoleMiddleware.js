module.exports = (role) => {
    return (ctx, next) => {
        try {
            const {user} = ctx.request.body
            if (user.role !== role) {
                ctx.response.status = 400
                return ctx.body = {error: 'Нет прав', status: false}
            }
            return next()
        } catch (e) {
            ctx.response.status = 400
            return ctx.body = {error: e, status: false}
        }
    }
}