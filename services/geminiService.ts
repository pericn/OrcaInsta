import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const polishMarkdown = async (text: string): Promise<string> => {
  if (!genAI) {
    throw new Error("API Key not configured");
  }

  const prompt = `
    You are a professional copy editor specializing in Chinese Markdown formatting.
    
    Your Task:
    1. Read the provided Markdown text.
    2. Insert a whitespace (space) between any Chinese punctuation (like ，。！？：) and Markdown marking symbols (like **bold**, *italic*, \`code\`, [link]).
    3. Also insert a space between English words/numbers and Chinese characters if missing.
    4. Do NOT change the meaning or the content of the text. Only fix the spacing and layout.
    5. Return ONLY the polished Markdown text.

    Text to polish:
    ${text}
  `;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Polish Error:", error);
    throw error;
  }
};