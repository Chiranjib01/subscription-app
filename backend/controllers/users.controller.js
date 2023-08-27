import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateTokenUser from "../utils/generateToken.user.js";
import { stripe } from "../config/stripeConfig.js";

// @method POST /api/users/signup
export const signUpUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const customer = await stripe.customers.create({
    name,
    email,
  });
  const user = await User.create({
    name,
    email,
    password,
    stripeId: customer.id,
  });
  if (user) {
    generateTokenUser(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      stripeId: user.stripeId,
      subscription: user.subscription,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// @method POST /api/users/auth
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPasswords(password))) {
    generateTokenUser(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      stripeId: user.stripeId,
      subscription: user.subscription,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// @method POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt_user", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
});

// get current logged in user
// @method GET /api/users
export const getUser = asyncHandler(async (req, res) => {
  const user = {
    _id: req._id,
    name: req.name,
    email: req.email,
    stripeId: req.stripeId,
    subscription: req.subscription,
  };
  res.status(200).json(user);
});

// @method GET /api/users/user/:userId
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  }
  res.status(200).json(user);
});
