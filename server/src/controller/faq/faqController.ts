import { getAIGeneratedFaq, getAISuggestion } from "../../lib/util/ai";
import Faq from "../../model/faqModel";
import { Request, Response } from "express";

const getTopFAQs = async (req: Request, res: Response) => {
  const topFaqs = await Faq.find()
    .sort({ searchCount: -1 })
    .limit(3)
    .select("_id question answer");

  if (topFaqs.length === 0) {
    return res.status(200).json({ message: "No FAQs available", data: [] });
  }

  res.json({ data: topFaqs });
};

const searchFAQs = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query is required" });
  }

  const results = await Faq.find({
    keywords: { $regex: query, $options: "i" },
  }).limit(5).select("_id question answer searchCount");

  if (results.length === 0) {
    return res.status(200).json({ message: "No FAQs found", results: [] });
  }
  
  await Promise.all(
    results.map((faq) =>
      Faq.updateOne({ _id: faq._id }, { $inc: { searchCount: 1 } })
    )
  );

  res.json({ results });
};

//AI Generated FAQ

const generateAIFAQs = async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query is required" });
  }
    const aiFaq = await getAIGeneratedFaq(query);
    res.json({ data: aiFaq });
};


// AI Autocomplete
const AiSuggestion = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query is required" });
  }

  const aiSuggestion = await getAISuggestion(query);
  res.json({ suggestion: aiSuggestion });
};

export { getTopFAQs, searchFAQs , AiSuggestion , generateAIFAQs};
