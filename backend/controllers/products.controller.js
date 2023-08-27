import { stripe } from "../config/stripeConfig.js";

export const subscribe = async (req, res) => {
  try {
    const { stripeId, priceId, paymentMethod } = JSON.parse(req.body);
    console.log("1");
    const payment = await stripe.paymentMethods.attach(
      paymentMethod.paymentMethod.id,
      { customer: stripeId }
    );
    console.log("2");
    const subscription = await stripe.subscriptions.create({
      customer: stripeId,
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
    console.log("3");
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
