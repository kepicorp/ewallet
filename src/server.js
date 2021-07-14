const path = require('path');
const express = require('express');
const Authorization = require('./authorization.js');
const FFDC = require('./ffdc.js');
const CORS = require('cors');

const app = express();
const B2C = new Authorization();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(
    path.resolve(__dirname, '../dist'),
    { maxAge: '1y', etag: false})
);
app.use(CORS());

app.get('/api/login',(req, res) => {
    // Redirecting to the right URL
    var URL = B2C.getURL();
    res.redirect(URL);
})

app.get('/refresh', async (req, res) => {
    try {
        var token = await B2C.refreshToken();
        res.setHeader('Content-Type', 'application/json');
        res.json(token);
    } catch(err) {
        res.status(500).send(err);
    };   
})


app.get('/callback', async (req, res) => {
    console.log(req.query);
    if (req.query.code) {
        try {
            var token = await B2C.getToken(req.query.code);
            console.log(token);
            res.setHeader('Content-Type', 'application/json');
            res.json(token);
        } catch(err) {
            res.status(500).send(err);
        };   

    } else {
        res.status(500)
        res.send("could not get authorization code");
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})


app.post('/api/payment', async (req, res) => {
    console.log("in payment");
    var data = 
    {
        "sourceId": "Fake Web Payment",
        "initiatingParty": "LOCALOFFICEUS1",
        "paymentInformationId": req.body.paymentInformationId,
        "requestedExecutionDate": "2018-12-06",
        "instructedAmount": 
        {
            
            "amount": req.body.amount,
            "currency": req.body.currency
            
        },
        "paymentIdentification": 
        {
            
            "endToEndId": "1545922187435"
            
        },
        "debtor": 
        {
            
            "name": req.body.debtor
            
        },
        "debtorAgent": 
        {
            
            "identification": "020010001"
            
        },
        "debtorAccountId": 
        {
            
            "identification": "745521145"
            
        },
        "creditor": 
        {
            
            "name": req.body.creditor
            
        },
        "creditorAgent": 
        {
            
            "identification": "131000000"
            
        },
        "creditorAccountId": 
        
        {
            "identification": "1111111111"
        },
        "remittanceInformationUnstructured": "RmtInf1234"
        
    }
    const url = "https://api.fusionfabric.cloud/payment/payment-initiation/realtime-payments/v2/us-real-time-payment/tch-rtps/initiate"

    try {
        if (!req.body.token) {
            res.status(500).send("Missing token!");
        }else {
            const ffdc = new FFDC(req.body.token);
            const result = await ffdc.callAPI(url, data);

            res.status(200).send(result);
        }
    } catch (err) {
        res.status(500).send(err);
    }
    
})

app.listen(process.env.BACK_PORT || 8000, () => {
    console.log(`Server is listening on port ${process.env.BACK_PORT}`);
});
