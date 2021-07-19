const path = require('path');
const express = require('express');
const Coinbase = require('./coinbase.js');
const CORS = require('cors');

const app = express();
const cb = new Coinbase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(
    path.resolve(__dirname, '../dist'),
    { maxAge: '1y', etag: false})
);
app.use(CORS());

app.get('/api/accounts', async (req, res) => {
    try {
        const result = await cb.getUrl('/accounts');
        res.status(200).json(result);
    } catch (err) {
        res.send(err);
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
        res.send(err);
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
    if (req.body && req.body.size && req.body.price && req.body.side && req.body.product_id) {
        // assuming I have a data that contains a trade
        // Trade should have a size, price, side, product_id
        console.log(req.body);
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})

app.listen(process.env.BACK_PORT || 8000, () => {
    console.log(`Server is listening on port ${process.env.BACK_PORT}`);
});
