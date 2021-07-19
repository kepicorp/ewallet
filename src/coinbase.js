"use strict";
const { default: axios } = require('axios');
// const axios = require('axios');
// const qs = require('qs');
const crypto = require('crypto');


class Coinbase {
    constructor(key, secret, pass, path) {
        this.key = process.env.KEY || key;
        this.secret = process.env.SECRET || secret;
        this.pass = process.env.PASS || pass;
        this.urlpath = process.env.API || path;
        this.setTime();
        console.log("Initiate coinbase connectivity with key: "+this.key+"\nAPI Url: "+this.urlpath);
    }

    setTime() {
        this.timestamp = Date.now() / 1000;
    }

    getHeaders(method, body, requestUrl) {
        
        var headers= {
            'CB-ACCESS-KEY': this.key,
            'CB-ACCESS-SIGN': this.getSign(method, body, requestUrl),
            'CB-ACCESS-TIMESTAMP': this.timestamp,
            'CB-ACCESS-PASSPHRASE': this.pass
        }
        return headers;
    }

    getSign(method, body, requestUrl) {
        // create the prehash string by concatenating required parts
        var what = this.timestamp + method + requestUrl + JSON.stringify(body);
        // decode the base64 secret
        var key = Buffer.from(this.secret, 'base64');

        // create a sha256 hmac with the secret
        var hmac = crypto.createHmac('sha256', key);

        // sign the require message with the hmac
        // and finally base64 encode the result
        return hmac.update(what).digest('base64');
    }

    async getUrl(url) {
        this.setTime();
        var fullUrl = this.urlpath + url;
        console.log("Trying a get on "+fullUrl);
        const headers = {
            headers: this.getHeaders('GET', '', url)
        }

        try {
            const res = await axios.get(fullUrl, headers);
            if(res.status =='200') {
                return res.data;
            } else {
                throw(res);
            }
        } catch (err) {
            console.error(err.message);
            throw(err);
        }
    }

    async postUrl(url, data) {
        this.setTime();
        var fullUrl = this.urlpath + url;
        console.log("Trying a post on "+fullUrl);
        const headers = {
            headers: this.getHeaders('POST', data, url)
        }
        try {
            const res = await axios.post(fullUrl, data, headers);
            if(res.status =='200') {
                return res.data;
            } else {
                throw(res);
            }
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = Coinbase;
