import Redis from "ioredis";
import dotenv from "dotenv";
import logger from "../lib/util/logger";
dotenv.config();
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redisClient.on("connect", () => logger.info("Redis connected via Docker"));
redisClient.on("error", (err) => logger.error("Redis error", err));

export default redisClient;