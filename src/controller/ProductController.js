const ProductService = require('../services/ProductService')
const JWTService = require('../services/JwtService')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = req.body
        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required!',
                // data: req.body
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Product ID is required'
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'productId is required'
            })
        }
        const response = await ProductService.getDetailProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const deteleProduct = async (req, res) => {
    try {
        const ProductId = req.params.id
        if (!ProductId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'ProductId is required'
            })
        }
        const response = await ProductService.deleteProduct(ProductId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const deteleManyProduct = async (req, res) => {
    try {
        const products_ID = req.body
        if (!products_ID) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Product IDs is required'
            })
        }
        const response = await ProductService.deleteManyProduct(products_ID)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductService.getAllProduct(limit || 8, page || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deteleProduct,
    getAllProduct,
    deteleManyProduct
}