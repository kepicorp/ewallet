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

app.get('/accounts', async (req, res) => {
    try {
        const result = await cb.getUrl('/accounts');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})


app.post('/api/payment', async (req, res) => {
    console.log("in payment");
    var data = 
    {
    }
    const url = "";

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
