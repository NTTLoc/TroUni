const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("your_stripe_secret_key");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "vnd" } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to smallest currency unit
      currency: currency,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
