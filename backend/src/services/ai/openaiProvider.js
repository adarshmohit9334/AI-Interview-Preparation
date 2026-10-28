import OpenAI from "openai";
import { BaseAIProvider } from "./baseProvider.js";

export class OpenAIProvider extends BaseAIProvider {
  constructor(apiKey, model = "gpt-4o-mini") {
    super("openai");
    this.model = model;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async evaluateAnswer(params) {
    if (!this.client) {
      throw new Error("OpenAI API key is not configured in backend .env (OPENAI_API_KEY).");
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(params);

    const completion = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("OpenAI returned an empty response.");
    }

    return {
      provider: "openai",
      model: this.model,
      data: JSON.parse(raw)
    };
  }
}
