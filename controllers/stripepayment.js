const stripe = require("stripe")(
  "sk_test_51J2F3FSCw9Tvnt9qZl0wwKUoJdJYgLWDKibhTkTutAG0LwzkaprzkCRv0mThbxGTmoJ3WPp735sOfK0N2U05fBb000gcnPY1Vq"
);
const uuid = require("uuid/v4");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;

  let ammount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test account",
            shipping: {
              name: token.card.name,
              adress: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.adress_city,
                country: token.card.adress_country,
                postal_code: token.card.adress_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
