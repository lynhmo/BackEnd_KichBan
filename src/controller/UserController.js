const UserService = require('../services/UserService')
const JWTService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        // console.log(req.body)
        const { name, email, password, confirmPassword, phone } = req.body;
        const regex = /^\S+@\S+\.\S+$/
        const isCheckEmail = regex.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required! reg'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email sai!'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mat khau nhap lai sai!'
            })
        }
        // console.log('isCheckEmail', isCheckEmail)
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const regex = /^\S+@\S+\.\S+$/
        const isCheckEmail = regex.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required! login'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email sai!'
            })
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            HttpOnly: true,
            Secure: false,
            SameSite: 'none'
        })
        return res.status(200).json(newResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: "Logout"
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'User ID is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        // const token = req.headers
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'User ID is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        // const token = req.headers
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'User ID is required'
            })
        }
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'token is required'
            })
        }
        const response = await JWTService.refreshTokenService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    logoutUser
}