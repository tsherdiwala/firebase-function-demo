import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

let paytmChecksum = require('./paytm/checksum');
let payConfig = require('./paytm/paytm_config');
const paytmConfig = payConfig.paytm_config

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/create-checksum', (req, response) => {

    const params = {
        MID: paytmConfig.MID, //Provided by Paytm
        ORDER_ID: 'ORDER00001', //unique OrderId for every request
        CUST_ID: 'CUST0001',  // unique customer identifier 
        INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID, //Provided by Paytm
        CHANNEL_ID: 'WAP', //Provided by Paytm
        TXN_AMOUNT: '1.00', // transaction amount
        WEBSITE: paytmConfig.WEBSITE, //Provided by Paytm
        CALLBACK_URL: 'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp',//Provided by Paytm
        EMAIL: 'abc@gmail.com', // customer email id
        MOBILE_NO: '9999999999' // customer 10 digit mobile no.
    }

    paytmChecksum.genchecksum(params, paytmConfig.MERCHANT_KEY, (error: any, data: any) => {
        response.send(data)
    })

});

app.post('/verify-checksum', (request, response) => {

    if(paytmChecksum.verifychecksum(request.body, paytmConfig.MERCHANT_KEY)){
        response.status(200).json({
            message: 'Checksum verified'
        })
    }else{
        response.status(400).json({
            message: 'Invalid checksum'
        })
    }
});

app.post('/echo', (req, res) => {
    res.json(req.body);
});

export const httpServer = functions.https.onRequest(app);
