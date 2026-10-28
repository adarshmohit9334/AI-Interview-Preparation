import { OpenAIProvider } from "./ai/openaiProvider.js";
import { GeminiProvider } from "./ai/geminiProvider.js";
import { EvaluationResponseSchema, calculateWeightedScore } from "../validators/evaluationSchema.js";
import pool from "../config/db.js";

const memoryFeedback = new Map();
let memoryFeedbackIdCounter = 1;

export class EvaluationService {
  constructor() {
    this.openaiProvider = new OpenAIProvider(
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_MODEL || "gpt-4o-mini"
    );
    this.geminiProvider = new GeminiProvider(
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_MODEL || "gemini-2.5-flash"
    );
  }

  getProvider(providerName) {
    const selected = (providerName || process.env.AI_PROVIDER || "openai").toLowerCase();
    if (selected === "gemini") {
      return this.geminiProvider;
    }
    return this.openaiProvider;
  }

  async evaluateAnswer({ answerId, question, candidateAnswer, providerPreference }) {
    if (!answerId) {
      throw new Error("answerId is required for evaluation.");
    }
    if (!candidateAnswer || !candidateAnswer.trim()) {
      throw new Error("Candidate answer cannot be empty.");
    }

    // Check if evaluation already exists (idempotency protection)
    const existingFeedback = await this.getFeedbackByAnswerId(answerId);
    if (existingFeedback) {
      return existingFeedback;
    }

    const provider = this.getProvider(providerPreference);

    // Call real AI evaluation
    const result = await provider.evaluateAnswer({
      questionText: question.questionText || question.question_snapshot,
      expectedAnswer: question.expectedAnswer || question.expected_answer_snapshot,
      keyConcepts: question.keyConcepts || [],
      scoringRubric: question.scoringRubric || question.rubric_snapshot || {},
      difficulty: question.difficulty || "Intermediate",
      candidateAnswer
    });

    // Validate structured JSON with Zod
    const validated = EvaluationResponseSchema.parse(result.data);

    // Recalculate overall score with canonical backend weights for honesty & determinism
    const authoritativeOverallScore = calculateWeightedScore(validated.dimensions);

    // Persist to MySQL or in-memory repository
    const saved = await this.saveFeedback({
      answerId,
      provider: result.provider,
      model: result.model,
      overallScore: authoritativeOverallScore,
      dimensions: validated.dimensions,
      strengths: validated.strengths,
      missingConcepts: validated.missingConcepts,
      mistakes: validated.mistakes,
      improvements: validated.improvements,
      suggestedAnswer: validated.suggestedAnswer,
      verdict: validated.verdict
    });

    return saved;
  }

  async saveFeedback(data) {
    if (pool) {
      try {
        const [res] = await pool.query(
          `INSERT INTO answer_feedback 
           (answer_id, provider, model, overall_score, correctness_score, relevance_score, 
            completeness_score, conceptual_understanding_score, clarity_score, practical_application_score, 
            strengths_json, missing_concepts_json, mistakes_json, improvements_json, suggested_answer, verdict)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.answerId,
            data.provider,
            data.model,
            data.overallScore,
            data.dimensions.correctness,
            data.dimensions.relevance,
            data.dimensions.completeness,
            data.dimensions.conceptualUnderstanding,
            data.dimensions.clarity,
            data.dimensions.practicalApplication,
            JSON.stringify(data.strengths),
            JSON.stringify(data.missingConcepts),
            JSON.stringify(data.mistakes),
            JSON.stringify(data.improvements),
            data.suggestedAnswer,
            data.verdict
          ]
        );
        return { id: res.insertId, ...data };
      } catch (err) {
        // Fallback
      }
    }

    const feedback = {
      id: memoryFeedbackIdCounter++,
      ...data,
      evaluated_at: new Date()
    };
    memoryFeedback.set(Number(data.answerId), feedback);
    return feedback;
  }

  async getFeedbackByAnswerId(answerId) {
    if (pool) {
      try {
        const [rows] = await pool.query("SELECT * FROM answer_feedback WHERE answer_id = ? LIMIT 1", [answerId]);
        if (rows.length > 0) return rows[0];
      } catch (err) {
        // Fallback
      }
    }
    return memoryFeedback.get(Number(answerId)) || null;
  }
}

export const evaluationService = new EvaluationService();
