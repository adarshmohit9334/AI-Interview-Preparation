import { GoogleGenAI } from "@google/genai";
import { BaseAIProvider } from "./baseProvider.js";

export class GeminiProvider extends BaseAIProvider {
  constructor(apiKey, model = "gemini-2.5-flash") {
    super("gemini");
    this.model = model;
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
  }

  async evaluateAnswer(params) {
    if (!this.client) {
      throw new Error("Google Gemini API key is not configured in backend .env (GEMINI_API_KEY).");
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(params);

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Google Gemini returned an empty response.");
    }

    return {
      provider: "gemini",
      model: this.model,
      data: JSON.parse(text)
    };
  }
}
