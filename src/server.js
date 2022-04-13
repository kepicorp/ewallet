const path = require('path');
const express = require('express');
const Coinbase = require('./coinbase.js');
const FFDC = require('./authenticator.js');
const CORS = require('cors');

const app = express();
const cb = new Coinbase();
const ffdc = new FFDC();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(
    path.resolve(__dirname, '../dist'),
    { maxAge: '1y', etag: false})
);
app.use(CORS());

app.get('/api/token', async (req, res) => {
    try {
        var token = await ffdc.getToken();
        if (token.token) {
            res.status(200).json(token);
        } else {
            res.status(500).send(token);
        }
    } catch (err) {
        res.send(err);
    }
})

app.get('/api/essence', async (req, res) => {
    if (req.query.token) {
        var data = 
        [{
            id: "01210PTY00100",
            currency: "EUR",
            balance: "5720.25"
        },
        {
            id: "03111PTY00100",
            currency: "GBP",
            balance: "22859.15"
        }
        ]
        res.json(data);
    }else {
        res.send(500).send("Token is missing");
    }
})

app.get('/api/accounts', async (req, res) => {
    try {
        const result = await cb.getUrl('/accounts');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send(err.response.data.message);
    }
})

app.get('/api/currencies', async (req,res) => {
    try {
        const result = await cb.getUrl('/currencies');
        res.status(200).json(result);
    } catch (err) {
        res.send(err);
    }
})

app.get('/api/products', async (req,res) => {
    try {
        const result = await cb.getUrl('/products');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send(err.response.data.message);
    }
})

app.get('/api/orders', async (req,res) => {
    try {
        const result = await cb.getUrl('/orders');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send(err.response.data.message);
    }
})

app.get('/api/price', async (req,res) => {
    if (req.query.product) {
        try {
            const result = await cb.getUrl('/products/'+req.query.product+'/ticker');
            res.status(200).json(result);
        } catch (err) {
            res.send(err);
        }
    } else {
        res.status(500).send("product is missing");
    }
    
})

app.post('/api/trade', async (req,res) => {
    console.log(req.body);
    if (req.body && req.body.size && req.body.side && req.body.product_id) {
        // assuming I have a data that contains a trade
        // Trade should have a size, price, side, product_id
        try {
            const result = await cb.postUrl('/orders', req.body);
            //console.log(result);
            res.status(200).json(result);
        } catch (err) {
            console.log("error 500 " + err.response);
            res.status(500).send(err.response.data.message);
        }
    }else {
        console.log("error !");
        res.status(500).send("Trading data is missing");
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})

app.listen(process.env.BACK_PORT || 8000, () => {
    console.log(`Server is listening on port ${process.env.BACK_PORT}`);
});
