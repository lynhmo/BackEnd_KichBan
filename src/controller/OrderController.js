const OrderService = require('../services/OrderService')
const JWTService = require('../services/JwtService')
const createPay = async (req, res) => {
    try {
        const response = await OrderService.createPay(request.params.money)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body
        if (!paymentMethod || !itemsPrice || shippingPrice < 0 || !totalPrice || !fullName || !address || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllOrder = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await OrderService.getAllOrder(limit || 8, page || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
module.exports = {
    createOrder,
    getAllOrder,
    createPay
}