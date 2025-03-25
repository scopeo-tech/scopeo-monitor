import e from "express";
import tryCatch from "../lib/util/tryCatch";
import { AiSuggestion, generateAIFAQs, getTopFAQs, searchFAQs } from "../controller/faq/faqController";
import cacheMiddleware from "../middleware/redisCache";
const faqRouter = e.Router();

faqRouter
.get("/get-top-faqs", cacheMiddleware,tryCatch(getTopFAQs))
.get("/get-search-faqs",cacheMiddleware, tryCatch(searchFAQs))
.get("/get-ai-suggestion", tryCatch(AiSuggestion))
.get("/get-ai-generated-faqs", tryCatch(generateAIFAQs))

export default faqRouter