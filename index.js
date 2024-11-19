const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client, CheckoutAPI } = require('@adyen/api-library');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());




// Initialize Adyen Client
const client = new Client({apiKey: process.env.ADYEN_API_KEY, environment: "TEST"});

let uniqueUUID = uuidv4();
console.log(uniqueUUID);

const paymentMethodsRequest = {
  merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
  countryCode: "USD",
  amount: {
    currency: "USD",
    value: 1000
  },
  channel: "Web",
  shopperLocale: "en-US"
}

const checkout = new CheckoutAPI(client);
const response = checkoutAPI.PaymentsApi.paymentMethods(paymentMethodsRequest, { idempotencyKey: "UUID" });










//API ROUTES
app.get('/', (req, res) => {
    res.send('Hello, World!');
});









app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
