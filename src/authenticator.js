"use strict";
const axios = require('axios');
const e = require('express');
const qs = require('qs');

class Authenticator {
    constructor(client, secret, token) {
        this.client = process.env.CLIENT_ID || client;
        this.secret = process.env.CLIENT_SECRET || secret;
        this.tokenurl = process.env.TOKEN_URL || token;
        this.date = Date.now();
        this.expires_in = -1;
        this.refresh_expires_in = -1;
        this.token = "empty";
        console.log("Initiate autentication with client_id: "+this.client+"\nToken URL: "+this.tokenurl);
    }

    async newToken() {
        var buff = Buffer.from(this.client+":"+this.secret, 'utf-8');
        var base64 = buff.toString('base64');
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic '+base64
            }
        }
        const data = qs.stringify({
            'grant_type' : 'client_credentials'
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
                //var returnData = { token: this.token, refresh_token: this.refresh_token }
                var returnData = { token: res.data.access_token }
                return(returnData);
            }else {
                throw(res);
            }
        } catch (err) {
            //console.log('Using existing token');
            console.error(err.message);
            throw(err);
        };
    }

    async getToken() {
        //console.log('Fetching New Token');
        //console.log("curTime: "+Date.now()+"\noldTime: "+this.date+"\nexpires: "+this.expires_in*1000);
        var tokTime = this.date + this.expires_in*1000;
        var curTime = Date.now();
        var refreshTime = this.date + this.refresh_expires_in*1000;
        if (tokTime < curTime && refreshTime > curTime) {
            return await this.refreshToken();
        } else if (curTime >= refreshTime) {
            return await this.newToken();
        } else {
            // curtime < Token expiry time
            //console.log('Using existing token');
            var returnData = { token: this.token }
            return(returnData);
        }
        
    }
    async refreshToken() {
        //console.log('Refreshing Token');
        var buff = Buffer.from(this.client+":"+this.secret, 'utf-8');
        var base64 = buff.toString('base64');
        if(this.refresh_token) {
            const headers = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic '+base64
                }
            }
            const data = qs.stringify({
                'grant_type' : 'refresh_token',
                'refresh_token' : this.refresh_token
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
                    var returnData = { token: this.token, refresh_token: this.refresh_token }
                    //var returnData = { token: res.data.access_token }
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
}

module.exports = Authenticator;