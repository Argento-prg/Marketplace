const Router = require('koa-router')
const ratingController = require('../controllers/ratingController')
const authMiddleware = require('../middleware/authMiddleware')
const router = Router()

router.post('/set', authMiddleware, ratingController.setRating)
router.get('/getone', authMiddleware, ratingController.getOne)
router.post('/del', authMiddleware, ratingController.deleteRating)


module.exports = router