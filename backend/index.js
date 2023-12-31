import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/db.js";
import usersRouter from "./routes/users.route.js";
import productsRouter from "./routes/products.route.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import { FRONTEND_URL, MONGODB_URI } from "./utils/constants.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
db.connect(MONGODB_URI);
const app = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

app.get("/", (_, res) => {
  res.json({
    status: "success",
  });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT} ...`);
});

export default app;
