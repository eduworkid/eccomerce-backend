const router = require('express').Router();

const { verifyToken } = require('../../middleware');
const productController = require('../controllers/prodcutController')

router.post('/products',[verifyToken], productController.store)
router.get('/products', productController.index)
router.put('/product/:id',[verifyToken], productController.update)
router.delete('/product/:id',[verifyToken],productController.destroy)
router.get('/product/:id',[verifyToken],productController.show)

module.exports = router