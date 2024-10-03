const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
dotenv.config();
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const allowedOrigins = ['http://localhost:3000/'];
const app = express();
const port = process.env.PORT || 3001

// app.use(cors());
app.use(cors(
//     {
//     origin: function (origin, callback) {
//         if (!origin) {
//             return callback(null, true);
//         }

//         if (allowedOrigins.includes(origin)) {
//             const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     }

// }
));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

app.use(bodyParser.json())
app.use(cookieParser())

routes(app);


mongoose.connect(`${process.env.MONGO_DB}`).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);
app.post("/gemini", async (req, res) => {
    const { history, message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
        history: req.body.history,
    });
    const msg = req.body.message;

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);
});

app.get('/', (req, res) => {
    res.send('This is the backend page dont go in further. get out!!!!')
})


app.listen(port, () => {
    console.log('Server is running at: http://localhost:' + port)
});