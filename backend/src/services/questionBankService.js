import { QUESTION_BANK, AVAILABLE_ROLES, AVAILABLE_DIFFICULTIES, AVAILABLE_STYLES, AVAILABLE_ANSWER_MODES } from "../data/questionBank.js";

/**
 * Question Bank Service
 * Abstraction layer decoupling the question bank from its storage.
 * In Phase 1 it queries the in-memory QUESTION_BANK.
 * In later phases this same interface can query MySQL without altering consumers.
 */
class QuestionBankService {
  /**
   * Get all available filtering metadata
   */
  async getFilterOptions() {
    const topicsByRole = {};
    for (const q of QUESTION_BANK) {
      if (!topicsByRole[q.role]) {
        topicsByRole[q.role] = new Set();
      }
      topicsByRole[q.role].add(q.topic);
    }

    const formattedTopics = {};
    for (const role in topicsByRole) {
      formattedTopics[role] = Array.from(topicsByRole[role]);
    }

    return {
      roles: AVAILABLE_ROLES,
      difficulties: AVAILABLE_DIFFICULTIES,
      styles: AVAILABLE_STYLES,
      answerModes: AVAILABLE_ANSWER_MODES,
      topicsByRole: formattedTopics,
      totalQuestions: QUESTION_BANK.length
    };
  }

  /**
   * Filter questions by role, topic, and difficulty
   */
  async getQuestions({ role, topic, difficulty, limit = 5 }) {
    let filtered = [...QUESTION_BANK];

    if (role && role !== "All") {
      filtered = filtered.filter(q => q.role.toLowerCase() === role.toLowerCase());
    }

    if (topic && topic !== "All") {
      filtered = filtered.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    }

    if (difficulty && difficulty !== "All") {
      filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Predictable selection: pick up to limit without repeating
    const selected = filtered.slice(0, Math.max(1, parseInt(limit, 10)));

    // Return sanitized question items (do not expose expected answer to candidate before evaluation)
    return selected.map(q => ({
      id: q.id,
      role: q.role,
      topic: q.topic,
      difficulty: q.difficulty,
      questionText: q.questionText,
      suggestedTimeSeconds: q.suggestedTimeSeconds
    }));
  }

  /**
   * Retrieve full question including rubric & expected answer for backend evaluation
   */
  async getQuestionById(id) {
    const question = QUESTION_BANK.find(q => q.id === id);
    if (!question) {
      return null;
    }
    return question;
  }
}

export const questionBankService = new QuestionBankService();
