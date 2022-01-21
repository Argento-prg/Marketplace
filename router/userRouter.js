const Router = require('koa-router')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = Router()

router.post('/register', userController.register('user'))
//только авторизованный админ, может создавать других админов
router.post('/newadmin', authMiddleware, checkRoleMiddleware('admin'), userController.register('admin'))
router.post('/login', userController.login)


module.exports = router