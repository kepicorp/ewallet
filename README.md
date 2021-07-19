# Finastra eWallet

Finastra's implementation of eWallet integrated to coinbase

> Additiona feature for Defi with AAVE and SUSHISWAP

Contact [author](mailto:pierre.quemard@finastra.com)

## Project setup

> This project has little to no dependency, it will use cache token until expiration.
> The project will also serve any website put in the ```dist``` folder.
> That allow simple integration to existing *vuejs* or any other framework project.
> Full API key management with Coinbase

### Install

Make sure you have [nodejs](https://nodejs.org/en/) installed.

Load dependencies for the project
```
npm install
```


### Deploy locally

> Assuming you want to deploy to an existing nodejs framework like *vuejs*

Copy files from ```src``` directory inside your project.

Add dependencies:
* axios
* dotenv
* express
* (Dev-only) nodemon

```bash
npm install axios 
npm install dotenv
npm install express
npm install --save-dev nodemon
```

Add a *start server* section in your ```package.json```

```json
  "scripts": {
    "dev": "npx nodemon --exec node -r dotenv/config ./src/server.js",
    "prod": "node -r dotenv/config ./src/server.js"
  }
```

### Configure

Set ```.env``` file

```bash
# Coinbase related details
KEY=API_KEY_COINBASE
SECRET=API_SECRET_COINBASE
PASS=API_PASSPHRASE_COINBASE
PATH=API_PATH_COINBASE
CLIENT_ID=FFDC_CLIENT_ID
CLIENT_SECRET=FFDC_CLIENT_SECRET
TOKEN_URL=FFDC_TOKEN_URL
# Server configuration
BACK_PORT=A_NUMBER
```

## Usage

### Test and run

Test back-end on configured port
```
npm run dev
```

You can now navigate to the back-end to access APIs.
Assuming your port was defined in ```.env``` was **8000**.


### Compile project

> Optionally you can compile the project with babel or any other compiler providing the right dependencies.
> This project being as simple as possible we did not use compiler to test.

Build the back-end to the *dist* directory


## Exchanges

aave.org
https://alchemix.fi/
https://support.celsius.network/hc/en-us
