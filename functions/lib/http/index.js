"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
let paytmChecksum = require('./paytm/checksum');
let payConfig = require('./paytm/paytm_config');
const paytmConfig = payConfig.paytm_config;
const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/create-checksum', (req, response) => {
    const params = {
        MID: paytmConfig.MID,
        ORDER_ID: 'ORDER00001',
        CUST_ID: 'CUST0001',
        INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID,
        CHANNEL_ID: 'WAP',
        TXN_AMOUNT: '1.00',
        WEBSITE: paytmConfig.WEBSITE,
        CALLBACK_URL: 'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp',
        EMAIL: 'abc@gmail.com',
        MOBILE_NO: '9999999999' // customer 10 digit mobile no.
    };
    paytmChecksum.genchecksum(params, paytmConfig.MERCHANT_KEY, (error, data) => {
        response.send(data);
    });
});
app.post('/verify-checksum', (request, response) => {
    if (paytmChecksum.verifychecksum(request.body, paytmConfig.MERCHANT_KEY)) {
        response.status(200).json({
            message: 'Checksum verified'
        });
    }
    else {
        response.status(400).json({
            message: 'Invalid checksum'
        });
    }
});
app.post('/echo', (req, res) => {
    res.json(req.body);
});
exports.httpServer = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map