const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const jwt = require('jsonwebtoken');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "The email is already in use",
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdUser
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = userLogin

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser == null) {
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại!",
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "Tài khoản hoặc mật khẩu sai!"
                })
            }
            //khoi tao token
            const access_token = genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            // console.log("checkUser", checkUser);
            if (checkUser == null) {
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại",
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            // console.log(updatedUser);
            resolve({
                status: "OK",
                message: "SUCCESS",
                updatedUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser == null) {
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại",
                })
            }
            await User.findByIdAndDelete(id)
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

const deteleManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: "OK",
                message: "DELETE MANY SUCCESS"
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: "OK",
                message: "All Users",
                data: allUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user_detail = await User.findOne({
                _id: id
            })
            // console.log(user_detail);
            if (user_detail == null) {
                resolve({
                    status: "ERR",
                    message: "Tài khoản không tồn tại",
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user_detail
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    deteleManyUser
}