const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("your_stripe_secret_key");
const { success, error } = require("./response/apiResponse");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/checkout", async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
              description: description,
            },
            unit_amount: parseInt(price) * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/failure`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    res.status(500).json(error("Payment failed", err.message));
  }
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/failure", (req, res) => {
  res.render("failure");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Dummy Data
// 4242424242424242
// 12/34
// 567
