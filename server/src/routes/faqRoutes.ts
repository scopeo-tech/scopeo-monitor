import e from "express";
import tryCatch from "../lib/util/tryCatch";
import { getTopFaqs } from "../controller/faq/faqController";
const faqRouter = e.Router();

faqRouter
.get("/get-top-faqs", tryCatch(getTopFaqs));

export default faqRouter