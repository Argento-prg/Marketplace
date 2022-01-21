const Router = require('koa-router')
//import routers
const authorRouter = require('./authorRouter')
const basketRouter = require('./basketRouter')
const bookRouter = require('./bookRouter')
const ratingRouter = require('./ratingRouter')
const reviewRouter = require('./reviewRouter')
const userRouter = require('./userRouter')

const router = Router({prefix: '/api'})

router.use('/author', authorRouter.routes(), authorRouter.allowedMethods())
router.use('/basket', basketRouter.routes(), basketRouter.allowedMethods())
router.use('/book', bookRouter.routes(), bookRouter.allowedMethods())
router.use('/rating', ratingRouter.routes(), ratingRouter.allowedMethods())
router.use('/review', reviewRouter.routes(), reviewRouter.allowedMethods())
router.use('/user', userRouter.routes(), userRouter.allowedMethods())


module.exports = router