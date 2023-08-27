import express from "express";
import {
  authUser,
  getUser,
  getUserById,
  logoutUser,
  signUpUser,
} from "../controllers/users.controller.js";
import { protectUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/user/:userId", getUserById);
router.route("/profile").get(protectUser, getUser);

export default router;
