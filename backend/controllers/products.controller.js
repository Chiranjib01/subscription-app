import { stripe } from "../config/stripeConfig.js";

export const subscribe = async (req, res) => {
  try {
    const { stripeId, priceId, paymentMethod } = req.body;
    const payment = await stripe.paymentMethods.attach(
      paymentMethod.paymentMethod.id,
      { customer: stripeId }
    );
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
    res.json({
      message: "Subsciption Successfull",
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Server Error" });
  }
};
