const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
dotenv.config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001

app.use(cors())

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

app.use(bodyParser.json())
app.use(cookieParser())

routes(app);


mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log("Ket not thanh cong")
    }).catch((err) => {
        console.log(err)
    });




app.get('/', (req, res) => {
    res.send('This is the backend page dont go in further. get out!!!!')
})

app.listen(port, () => {
    console.log('Server is running at: http://localhost:' + port)
});