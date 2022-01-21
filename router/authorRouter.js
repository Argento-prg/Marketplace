const Router = require('koa-router')
const authorController = require('../controllers/authorController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = Router()

router.get('/getall', authorController.getAll)
router.post('/create', authMiddleware, checkRoleMiddleware('admin'), authorController.create)
router.post('/edit', authMiddleware, checkRoleMiddleware('admin'), authorController.update)
router.post('/del', authMiddleware, checkRoleMiddleware('admin'), authorController.delete)


module.exports = router