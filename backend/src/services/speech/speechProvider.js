import OpenAI from "openai";
import fs from "fs";

/**
 * Base Speech Provider Interface
 */
export class BaseSpeechProvider {
  constructor(name) {
    this.name = name;
  }

  async transcribeAudio({ filePath, mimeType, language = "en", prompt = "" }) {
    throw new Error(`transcribeAudio() must be implemented by ${this.constructor.name}`);
  }
}

/**
 * OpenAI Whisper Speech-to-Text Provider
 */
export class OpenAISpeechProvider extends BaseSpeechProvider {
  constructor(apiKey, model = "whisper-1") {
    super("openai");
    this.model = model;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async transcribeAudio({ filePath, mimeType, language = "en", prompt = "" }) {
    if (!this.client) {
      throw new Error("OpenAI API key is not configured for transcription (OPENAI_API_KEY).");
    }

    const fileStream = fs.createReadStream(filePath);

    const transcription = await this.client.audio.transcriptions.create({
      file: fileStream,
      model: this.model,
      language: language.startsWith("hi") ? "hi" : "en",
      prompt: prompt || "Technical interview response covering programming concepts and system design.",
      response_format: "json"
    });

    return {
      provider: "openai",
      model: this.model,
      text: transcription.text
    };
  }
}
