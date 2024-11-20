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
const client = new Client({ apiKey: process.env.ADYEN_API_KEY, environment: "TEST" });
const checkout = new CheckoutAPI(client);

// API ROUTES
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/paymentMethods', async (req, res) => {
  console.log("/paymentMethods endpoint hit!");
  try {
    // Extract shopper information from request body
    const { countryCode, amount, shopperLocale } = req.body;

    // Prepare the /paymentMethods request payload
    const paymentMethodsRequest = {
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT, // Required
      countryCode: countryCode || "US", // Default to US if not provided
      amount: amount || { currency: "USD", value: 1000 }, // Default to $10.00
      shopperLocale: shopperLocale || "en-US", // Default to en-US if not provided
      channel: "Web" // Required for Drop-in integration
    };

    // Call Adyen's /paymentMethods endpoint
    const paymentMethodsResponse = await checkout.paymentMethods(paymentMethodsRequest);
    // Respond with the available payment methods
    res.json(paymentMethodsResponse);
  } catch (error) {
    console.error("Error fetching payment methods:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/payments', async (req, res) => {
  console.log('/payments hit!');
  try {
    const paymentRequest = {
      ...req.body,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT, 
      reference: uuidv4(),
    };

    const paymentResponse = await checkout.payments(paymentRequest);
    res.json(paymentResponse);
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/payments/details', async (req, res) => {
  console.log('/payments/details hit!');
  try {
    const detailsRequest = req.body;
    const detailsResponse = await checkout.paymentDetails(detailsRequest);
    res.json(detailsResponse);
  } catch (error) {
    console.error("Error handling payment details:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});