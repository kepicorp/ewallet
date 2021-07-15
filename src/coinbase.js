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
        var what = this.timestamp + method + requestUrl + body;
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
    

    async newToken(code) {
        //console.log('Fetching New Token');
        var buff = Buffer.from(this.client+":"+this.secret, 'utf-8');
        var base64 = buff.toString('base64');
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic '+base64
            }
        };
        
        const data = qs.stringify({
            'grant_type' : 'authorization_code',
            'code': code,
            'redirect_uri': this.callback
        });
        try {
            //console.log("Fetching token");
            const res = await axios.post(this.tokenurl, data, headers);
            if(res.status == '200'){
                this.token = res.data.access_token;
                this.refresh_token = res.data.refresh_token;
                this.expires_in = res.data.expires_in;
                this.refresh_expires_in = res.data.refresh_expires_in;
                this.date = Date.now();
                var returnData = { token: res.data.access_token }
                return(returnData);
            }else {
                throw(res);
            }
        } catch (err) {
            console.error(err.message);
            throw(err);
        };       
    }

}

module.exports = Coinbase;
