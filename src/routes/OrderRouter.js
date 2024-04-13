const express = require("express");
const router = express.Router();
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const OrderController = require("../controller/OrderController")

router.post('/create', authUserMiddleWare, OrderController.createOrder)
// router.get('/getall', authMiddleWare, OrderController.getAllOrder)
router.get('/vnpay:money', OrderController.createPay)


module.exports = router