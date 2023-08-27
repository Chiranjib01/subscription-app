import { stripe } from "../config/stripeConfig.js";
import User from "../models/User.js";

export const subscribe = async (req, res) => {
  try {
    const { stripeId, priceId, paymentMethod, plan } = req.body;
    await stripe.paymentMethods.attach(paymentMethod, {
      customer: stripeId,
    });
    const customer = await stripe.customers.update(stripeId, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
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
    const user = await User.find({ stripeId });
    user.subscription = plan;
    const updatedUser = await user.save();
    generateTokenUser(res, updatedUser._id);
    res.json({
      message: "Subsciption Successfull",
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        stripeId: updatedUser.stripeId,
        subscription: updatedUser.subscription,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
