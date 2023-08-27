import { stripe } from "../config/stripeConfig.js";

export const subscribe = async (req, res) => {
  try {
    const { name, email, priceId, paymentMethod } = req.body;
    const customer = await stripe.customers.create({
      name,
      email,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });
    res.json({
      message: "Subsciption Successfull",
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
