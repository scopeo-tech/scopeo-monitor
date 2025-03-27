import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redisConfig";

const MAX_REQUESTS = 500;
const RATE_LIMIT_WINDOW = 60;

const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const key = `rate_limit:${ip}`;
    const requestCount = await redisClient.get(key);

    if (requestCount && parseInt(requestCount) >= MAX_REQUESTS) {
      res.status(429).json({ message: "Too many requests, please try again later." });
      return;
    }

    if (!requestCount) {
      await redisClient.set(key, "1", "EX", RATE_LIMIT_WINDOW);
    } else {
      await redisClient.incr(key);
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next();
  }
};

export default rateLimitMiddleware;
