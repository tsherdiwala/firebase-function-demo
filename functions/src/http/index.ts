import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/create-checksum', (req, response) => {
    response.json({
        message: 'Created checksum'
    });
});

app.get('/verify-checksum', (request, response) => {
    response.json({
        message: 'Verified checksum'
    });
})

app.post('/echo', (req, res) => {
    res.json(req.body);
})

export const httpServer = functions.https.onRequest(app);
