const momo = async (req, res, callback) => {
    try {
        const { money } = req.body;
        //parameters
        var partnerCode = "MOMO";
        var accessKey = "F8BBA842ECF85";
        var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "pay with MoMo";
        var redirectUrl = "http://localhost:3000/payment"; // <=============== Quay về giao diện thanh toán <=============== 
        var ipnUrl = "https://callback.url/notify";
        var amount = money;   // <=============== Số tiền <=============== 
        var requestType = "payWithATM" // <=============== Thanh toán bằng ATM <=============== 
        var extraData = "";

        //Xử lý chữ ký bằng HMAC SHA256 khi mà không format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" +
            extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" +
            orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" +
            requestId + "&requestType=" + requestType
        //puts raw signature
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');


        //Json Object gửi cho Momo
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'vi'
        });
        //Create the HTTPS objects
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }

        return new Promise((resolve, reject) => {
            const reqMomo = https.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (body) => {
                    const response = JSON.parse(body);
                    resolve(response.payUrl); // Resolve promise with payUrl from response
                });
            });

            reqMomo.on('error', reject); // Reject promise on error
            reqMomo.write(requestBody);
            reqMomo.end();
        });
    } catch (e) {
        return res.status(404).json({ message: e }); // Handle errors
    }
};



const paypay = async (req, res) => {
    try {
        const returnUrl = await momo(req, res);
        res.send(returnUrl);
    } catch (e) {
        res.status(500).json({ message: 'Error processing MoMo payment' });
    }
}

module.exports = {
    paypay
}



