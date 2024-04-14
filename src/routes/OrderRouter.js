const express = require("express");
const router = express.Router();
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const OrderController = require("../controller/OrderController")
const MomoController = require("../controller/MomoPayment")

router.post('/create', authUserMiddleWare, OrderController.createOrder)
// router.get('/getall', authMiddleWare, OrderController.getAllOrder)
router.get('/vnpay:money', OrderController.createPay)
router.post('/momo', MomoController.paypay)


module.exports = router