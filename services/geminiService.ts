import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = "You are a helpful, polite, and knowledgeable Japan travel guide helper for a tourist visiting Kyoto and Fukuoka. Your answers should be concise (under 100 words where possible), practical, and culturally accurate. If asked for translations, provide the Japanese characters (Kanji/Kana) and the Romaji (pronunciation). Format with bolding for key terms.";

export const getGeminiResponse = async (prompt: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025', // Using a flash model for quick chat responses
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    if (response.text) {
      return response.text;
    }
    return "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
