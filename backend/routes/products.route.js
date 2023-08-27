import express from "express";
import { subscribe } from "../controllers/products.controller.js";
// import { protectUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/subscribe", subscribe);

export default router;
