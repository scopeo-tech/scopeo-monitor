import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redisConfig";

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cacheKey = req.originalUrl;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(` Cache hit for ${cacheKey}`);
      res.json(JSON.parse(cachedData));
      return;
    }

    console.log(` Cache miss for ${cacheKey}`);
    const originalSend = res.json.bind(res);

    res.json = (body: any) => {
      redisClient
        .set(cacheKey, JSON.stringify(body), "EX", 180)
        .then(() => console.log(` Cached new response for ${cacheKey}`))
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
