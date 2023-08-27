import express from "express";
import { subscribe, unsubscribe } from "../controllers/products.controller.js";
// import { protectUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

export default router;
