import { stripe } from "../config/stripeConfig.js";
import User from "../models/User.js";
import generateTokenUser from "../utils/generateToken.user.js";

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
    const user = await User.findOne({ stripeId });
    if (user) {
      user.subscription = {
        id: subscription.id,
        active: true,
        ...plan,
      };
      const updatedUser = await user.save();
      generateTokenUser(res, updatedUser._id);
      return res.json({
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
    }
    res.status(400).json({ message: "Error Occured" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const unsubscribe = async (req, res) => {
  try {
    const { stripeId, subscriptionId } = req.body;
    // await stripe.subscriptions.cancel(subscriptionId);
    const user = await User.findOne({ stripeId });
    if (user) {
      user.subscription.active = false;
      const updatedUser = await user.save();
      generateTokenUser(res, updatedUser._id);
      return res.json({
        message: "Subsciption Cancelled",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          stripeId: updatedUser.stripeId,
          subscription: updatedUser.subscription,
        },
      });
    }
    res.status(400).json({ message: "Error Occured" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
