import jwt from "jsonwebtoken";

export const createAccessToken = (userId: string, secret: string) => {
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
};

export const createRefreshToken = (userId: string, secret: string) => {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};