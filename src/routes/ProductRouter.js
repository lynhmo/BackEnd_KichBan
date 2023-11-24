const express = require("express");
const router = express.Router();
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");
const ProductController = require("../controller/ProductController")

router.post('/create', ProductController.createProduct)
router.put('/update/:id', authMiddleWare, ProductController.updateProduct)
router.get('/detail/:id', ProductController.getDetailProduct)
router.delete('/delete/:id', authMiddleWare, ProductController.deteleProduct)
router.get('/getall', ProductController.getAllProduct)


module.exports = router