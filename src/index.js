const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001


mongoose.connect('mongodb://0.0.0.0:27017/botstoreMERN')
    .then(() => {
        console.log("Ket not thanh cong")
    }).catch((err) => {
        console.log(err)
    });




app.get('/', (req, res) => {
    res.send('Hello World !!!!!!')
})

app.listen(port, () => {
    console.log('Server is running at: ' + port)
});