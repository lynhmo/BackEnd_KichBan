const Product = require('../models/ProductModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const jwt = require('jsonwebtoken');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
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
const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find()
            resolve({
                status: "OK",
                message: "All Products",
                data: allProduct
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