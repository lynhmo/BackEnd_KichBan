const userRouter = require('../routes/UserRouter');
const routes = (app) => {
    app.use('/api/user', userRouter)
}
module.exports = routes;