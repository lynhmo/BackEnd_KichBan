const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);
const chatAI = async (req, res) => {
    try {
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
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    chatAI
}