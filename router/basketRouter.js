const Router = require('koa-router')
const authMiddleware  = require('../middleware/authMiddleware')
const basketController = require('../controllers/basketController')
const router = Router()

router.get('/getall', authMiddleware, basketController.getAll)
router.post('/add', authMiddleware, basketController.add)
router.post('/setquantity', authMiddleware, basketController.setQuantity)
router.post('/buyall', authMiddleware, basketController.buyAll)
router.post('/del', authMiddleware, basketController.delete)



module.exports = router