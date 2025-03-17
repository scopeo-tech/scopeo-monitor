import Faq from "../../model/faqModel";
import { Request, Response } from "express";

const getTopFaqs = async (req: Request, res: Response) => {
  const topFaqs = await Faq.find().sort({ searchCount: -1 }).limit(3).select("_id question answer");

  if (topFaqs.length === 0) {
    return res.status(200).json({ message: "No FAQs available", data: [] });
  }

  res.json({ data: topFaqs });
};

export { getTopFaqs };
