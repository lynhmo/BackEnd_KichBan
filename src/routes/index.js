const userRouter = require('./UserRouter');
const productRouter = require('./ProductRouter');
const orderRouter = require('./OrderRouter');

const routes = (app) => {
    app.use('/v1/api/user', userRouter)
    app.use('/v1/api/product', productRouter)
    app.use('/v1/api/order', orderRouter)
}
module.exports = routes;