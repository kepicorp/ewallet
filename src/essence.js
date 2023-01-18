"use strict";
const axios = require('axios');
const crypto = require('crypto');

class Essence {
    constructor() {
        this.uuid = crypto.randomUUID();
        console.log("Initiate Essence API with uuid: "+this.uuid);
    }
    

    getHeadersBearer(token) {     
        var headers= {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Request-ID": this.uuid,
            "Authorization": "Bearer "+token
        }
        return headers;
    }

    getHeaders(token) {     
        var headers= {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Request-ID": this.uuid,
            "Authorization": token
        }
        return headers;
    }

    async getAccountDetails(token, customerId) {
        
        if (token && customerId) {
            var url = "https://api.fusionfabric.cloud/retail-banking/accounts/v1/accounts?customerId="+customerId;
            const headers = this.getHeaders(token);
            console.log(url);
            console.log(headers);
            try {
                console.log("Getting account details for: "+customerId);
                
                const res = await axios.get(url, headers);
                console.log(res.data);
                if (res.status == 200) {
                    return res;
                } else {
                    const back = {
                        data: "failed to get accounts",
                        status: 500
                    }
                    return back;
                }
                return res;
            } catch (err) {
                //throw(err);
            }; 

        } else {
            console.error("Missing token or customerId");
            throw("Missing token or customerId");
        }
    }
}

module.exports = Essence;