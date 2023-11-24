const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const genneralAccessToken = (payload) => {
    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
    return access_token
}
const genneralRefreshToken = (payload) => {
    const refresh_token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}
const refreshTokenService = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(token);
            jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
                if (err) {
                    resolve({
                        status: "ERR",
                        message: "The authentication"
                    })
                }
                const { payload } = user
                const access_token = genneralAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin
                })
                // console.log(access_token);
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    access_token
                })
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenService
}