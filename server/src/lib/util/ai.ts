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





export async function AIErrorAnalysis(errorMessage: string): Promise<{ summary: string; causes: string[]; fixes: string[] }> {
  try {
    const response = await axios.post<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_ERROR_API || ""}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze the following error message and provide insights:
                
                **Error Message:** ${errorMessage}

                Return the response in this structured format:

                **Summary:** [medium summary of the error]
                **Possible Causes:**  
                - [Cause 1]  
                - [Cause 2]  
                - [Cause 3]  

                **Suggested Fixes:**  
                - [Fix 1]  
                - [Fix 2]  
                - [Fix 3]  

                Ensure at least three causes and three fixes are provided. If unknown, suggest general troubleshooting steps.`
              }
            ]
          }
        ]
      }
    );

    const data = response.data as GeminiResponse;

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Invalid AI response structure.");
    }

    const responseText = data.candidates[0]?.content?.parts?.[0]?.text?.trim();
    if (!responseText) {
      throw new Error("Invalid AI response structure.");
    }

    const summaryMatch = responseText.match(/\*\*Summary:\*\*([\s\S]*?)\n\s*\*\*/);
    const causesMatch = responseText.match(/\*\*Possible Causes:\*\*([\s\S]*?)\n\s*\*\*/);
    const fixesMatch = responseText.match(/\*\*Suggested Fixes:\*\*([\s\S]*)/);

    const summary = summaryMatch ? summaryMatch[1].trim() : "No summary available.";
    const causes = causesMatch ? causesMatch[1].trim().split("\n- ").slice(1) : [];
    const fixes = fixesMatch ? fixesMatch[1].trim().split("\n- ").slice(1) : [];

    return { summary, causes, fixes };
  } catch (error) {
    console.error("AI Error Analysis Failed:", error);
    return {
      summary: "Could not analyze error.",
      causes: [],
      fixes: [],
    };
  }
}
