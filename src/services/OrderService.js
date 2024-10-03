const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createPay = (money) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve({
                status: 'OK',
                message: `OKE`
            })
        } catch (e) {
            reject(e)
        }
    })
}

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        // const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        if (!paymentMethod || !itemsPrice || shippingPrice < 0 || !totalPrice || !fullName || !address || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount } //$gte là querry trong MongoDB so sánh xem có đủ countiStock để bán không
                    },
                    {
                        $inc: { //$inc tương tự thì sẽ tăng sốlượng bán đc lên và giảm stock xuống
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)

            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${arrId.join(',')} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        phone,
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid,
                    paidAt
                })
                if (createdOrder) {
                    // await EmailService.sendEmailCreateOrder(email, orderItems)
                    resolve({
                        status: 'OK',
                        message: 'success',
                        data: createdOrder
                    })
                }
            }






        } catch (e) {
            reject(e)
        }
    })
}
const getAllOrder = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalOrder = await Order.countDocuments()
            // MongoDB chuyển sang countDocuments() count() không dùng được
            // filter theo gia tri id,name,....
            if (filter) {
                const label = filter[0];
                // '$options': 'i' fuzzy matching cua MongoDB
                const allOrderFilter = await Order.find({ [label]: { '$regex': filter[1], '$options': 'i' } }).limit(limit).skip(page * limit)
                resolve({
                    status: "OK",
                    message: "All Products1",
                    data: allOrderFilter,
                    total: totalOrder,
                    pageCurent: Number(page) + 1,
                    totalPage: Math.ceil(totalOrder / Number(limit))
                })
            }
            // phan trang
            if (sort) {
                // khoi tao objsort gia tri cua no khi truyen vao se la (giatri : DESC/ASC) vi du ==> soluong : DESC
                const objectSort = {}
                objectSort[sort[1]] = sort[0]

                const allOrderSort = await Order.find()
                    .limit(limit) // gioi han 1 trang
                    .skip(page * limit) // bo qua bao nhieu san phan de duoc 1 trang tiep theo
                    .sort(objectSort) // su dung gia tri objsort de xep san pham theo gia tri DESC/ASC
                resolve({
                    status: "OK",
                    message: "All Products2",
                    data: allOrderSort,
                    total: totalOrder,
                    pageCurent: Number(page) + 1, // trang ve trang hien tai
                    totalPage: Math.ceil(totalOrder / Number(limit)) // tra ve tong so trang
                })
            }
            const allOrder = await Product.find().limit(limit).skip(page * limit)
            resolve({
                status: "OK",
                message: "All Products3",
                data: allOrder,
                total: totalOrder,
                pageCurent: Number(page) + 1,
                totalPage: Math.ceil(totalOrder / Number(limit))
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrder,
    createPay
}