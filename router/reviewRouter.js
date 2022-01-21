const Router = require('koa-router')
const reviewController = require('../controllers/reviewController')
const authMiddleware = require('../middleware/authMiddleware')
const router = Router()

router.get('/getallofbook', reviewController.getAllofBook)
router.get('/getalluser', authMiddleware, reviewController.getAllUser)
router.post('/create', authMiddleware, reviewController.create)
router.post('/edit', authMiddleware, reviewController.update)
router.post('/del', authMiddleware, reviewController.delete)

module.exports = router