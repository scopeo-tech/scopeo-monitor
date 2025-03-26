import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redisConfig";

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cacheKey = req.originalUrl;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      return;
    }

    const originalSend = res.json.bind(res);

    res.json = (body: any) => {
      redisClient
        .set(cacheKey, JSON.stringify(body), "EX", 180)
        .catch((error) => console.error("Failed to save to Redis:", error));
      return originalSend(body);
    };

    next();
  } catch (error) {
    console.error(" Redis cache error:", error);
    next();
  }
};

export default cacheMiddleware;
