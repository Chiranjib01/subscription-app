import Stripe from "stripe";
import { STRIPE_PRIVATE_KEY } from "../utils/constants.js";

export const stripe = Stripe(STRIPE_PRIVATE_KEY);
