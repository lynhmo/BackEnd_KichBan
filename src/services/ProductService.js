const Product = require('../models/ProductModel')

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: "The name of the product already exists"
                })
            }
            const createProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description
            })
            if (createProduct) {
                resolve({
                    status: 'OK',
                    message: "Product created successfully",
                    data: createProduct
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct == null) {
                resolve({
                    status: "OK",
                    message: "Product not found",
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                updatedProduct
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product_detail = await Product.findOne({
                _id: id
            })
            if (product_detail == null) {
                resolve({
                    status: "OK",
                    message: "Product not found",
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: product_detail
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct == null) {
                resolve({
                    status: "OK",
                    message: "Product not found",
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "DELETE SUCCESS"
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()
            // MongoDB chuyển sang countDocuments() count() không dùng được
            // filter theo gia tri id,name,....
            if (filter) {
                const label = filter[0];
                const allProductFilter = await Product.find({
                    [label]: { '$regex': filter[1] }
                })
                    .limit(limit).skip(page * limit)
                resolve({
                    status: "OK",
                    message: "All Products",
                    data: allProductFilter,
                    total: totalProduct,
                    pageCurent: Number(page) + 1,
                    totalPage: Math.ceil(totalProduct / Number(limit))
                })
            }
            // phan trang
            if (sort) {
                // khoi tao objsort gia tri cua no khi truyen vao se la (giatri : DESC/ASC) vi du ==> soluong : DESC
                const objectSort = {}
                objectSort[sort[1]] = sort[0]

                const allProductSort = await Product.find()
                    .limit(limit) // gioi han 1 trang
                    .skip(page * limit) // bo qua bao nhieu san phan de duoc 1 trang tiep theo
                    .sort(objectSort) // su dung gia tri objsort de xep san pham theo gia tri DESC/ASC
                resolve({
                    status: "OK",
                    message: "All Products",
                    data: allProductSort,
                    total: totalProduct,
                    pageCurent: Number(page) + 1, // trang ve trang hien tai
                    totalPage: Math.ceil(totalProduct / Number(limit)) // tra ve tong so trang
                })
            }
            const allProduct = await Product.find().limit(limit).skip(page * limit)
            resolve({
                status: "OK",
                message: "All Products",
                data: allProduct,
                total: totalProduct,
                pageCurent: Number(page) + 1,
                totalPage: Math.ceil(totalProduct / Number(limit))
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct
}