import {  Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../lib/types/type";
import jwt from "jsonwebtoken";
import  CustomError  from "../lib/util/CustomError";


const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new CustomError(401, "You are not authenticated"));
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_TOKEN as string, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err.message);
        return next(new CustomError(401, "Token is not valid"));
      }
      const { userId } = decoded as { userId: string };
      req.user = userId;
      next();
    });
  } catch (error) {
    next(new CustomError(401, "Failed to verify authentication"));
  }
};

export default verifyToken;
