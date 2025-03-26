import Redis from "ioredis";
import dotenv from "dotenv";
import logger from "../lib/util/logger";
dotenv.config();
const redisClient = new Redis(process.env.REDIS_URL ?? "", {
    tls: {},
    maxRetriesPerRequest: 5,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });
  

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) => logger.error("Redis error", err));

export default redisClient;