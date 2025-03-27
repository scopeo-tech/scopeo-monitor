import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redisConfig";

const MAX_REQUESTS = 1000;
const RATE_LIMIT_WINDOW = 60;

const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ip =
      req.ip ||
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress;
    const key = `rate_limit:${ip}`;

    const requestCount = await redisClient.incr(key);

    let ttl = await redisClient.ttl(key);

    if (requestCount === 1 || ttl === -1) {
      await redisClient.expire(key, RATE_LIMIT_WINDOW);
    }

    if (requestCount > MAX_REQUESTS) {
      res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
      return;
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next();
  }
};

export default rateLimitMiddleware;
