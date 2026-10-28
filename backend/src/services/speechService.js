import { OpenAISpeechProvider } from "./speech/speechProvider.js";
import { cleanupFile } from "../middleware/audioUpload.js";

export class SpeechService {
  constructor() {
    this.openaiSpeech = new OpenAISpeechProvider(
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1"
    );
  }

  getProvider(providerName) {
    // Modular provider routing (ready to add Deepgram or alternatives)
    return this.openaiSpeech;
  }

  async transcribe({ filePath, mimeType, language = "en", contextPrompt = "", providerName }) {
    const provider = this.getProvider(providerName);
    try {
      const result = await provider.transcribeAudio({
        filePath,
        mimeType,
        language,
        prompt: contextPrompt
      });
      return result;
    } finally {
      // Ensure raw audio file is cleaned up from temporary disk storage
      cleanupFile(filePath);
    }
  }
}

export const speechService = new SpeechService();
