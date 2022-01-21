const Router = require('koa-router')
const bookController = require('../controllers/bookController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = Router()

router.get('/getall', bookController.getAll)
router.get('/getone', bookController.getOne)
router.post('/create', authMiddleware, checkRoleMiddleware('admin'), bookController.create)
router.post('/edit', authMiddleware, checkRoleMiddleware('admin'), bookController.update)
router.post('/del', authMiddleware, checkRoleMiddleware('admin'), bookController.delete)


module.exports = router