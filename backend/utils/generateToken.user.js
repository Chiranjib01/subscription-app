import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants.js";

const generateTokenUser = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "10d",
  });
  res.cookie("jwt_user", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
};

export default generateTokenUser;
