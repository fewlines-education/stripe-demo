const express = require("express");
const Stripe = require("stripe");

if (process.env.NODE_ENV !== "production") {
  /**
   * This allows us to use the .env.local pattern offered by React.
   * Meaning we don't need to source our .env.local file and it does not
   * need to contain `export`, it can look like that:
   *
   * REACT_APP_PUBLISHABLE_KEY="mykey"
   * REACT_APP_SECRET_KEY="myscecretkey"
   */
  const path = require("path");
  require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });
}

const app = express();

const keyPublishable = process.env.REACT_APP_PUBLISHABLE_KEY;
const keySecret = process.env.REACT_APP_SECRET_KEY;
const stripe = Stripe(keySecret);

app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false }));

app.post("/charge", (request, result) => {
  // here we need to calculate the price to pay depending on request infos
  const amount = calculateAmount(request.body.products);

  stripe.customers
    .create({
      email: request.body.stripeData.email,
      source: request.body.stripeData.id
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Sample Charge",
        currency: "eur",
        customer: customer.id
      })
    )
    .then(charge => result.json(charge));
});

app.listen(8080);
