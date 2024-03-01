const router = require("express").Router();

const { verifyToken } = require("../../middleware");
const OrderController = require('../controllers/orderController');

router.post('/orders/:id', [verifyToken],OrderController.store)
router.get('/orders',[verifyToken], OrderController.index)
router.delete('/orders/:id', [verifyToken],OrderController.destroy)

module.exports = router