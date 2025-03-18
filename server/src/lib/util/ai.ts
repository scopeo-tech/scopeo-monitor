import axios from "axios";
import { GeminiResponse } from "../types/type";

export async function getAISuggestion(query: string): Promise<string> {
  try {

    const response = await axios.post<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_SEARCH_API || ""}`,
      {
        contents: [
          {
            parts: [
              {
                text: `This is an FAQ page for a **project monitoring website**. Suggest only **one** most relevant autocomplete word for: "${query}" . Do not suggest unrelated words.`,
              },
            ],
          },
        ],
      }
    );

    const suggestion = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (suggestion.toLowerCase().startsWith(query.toLowerCase())) {
      return suggestion.slice(query.length);
    }
    return suggestion;
  } catch (error) {
    console.error("AI Error:", error);
    return "";
  }
}


export async function getAIGeneratedFaq(query: string): Promise<{ question: string; answer: string }> {
  try {
    const response = await axios.post<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_FAQ_API || ""}`,
      {
        contents: [
          {
            parts: [
              {
                text: `This is an FAQ page for a **project monitoring website**. A user searched for: "${query}". There is no matching FAQ in the database. 
                
                Generate a helpful question and answer based on what the user might be asking. 
                
                Response format:
                **Question:** [Generated question] 
                **Answer:** [Generated answer]`,
              },
            ],
          },
        ],
      }
    );

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const [generatedQuestion, generatedAnswer] = responseText.split("**Answer:**").map((part) => part.trim());
    return {
      question: generatedQuestion.replace("**Question:**", "").trim(),
      answer: generatedAnswer || "I'm sorry, but I couldn't generate an answer.",
    };
  } catch (error) {
    console.error("AI FAQ Generation Error:", error);
    return {
      question: query,
      answer: "I'm sorry, but I couldn't generate an answer at this time.",
    };
  }
}
