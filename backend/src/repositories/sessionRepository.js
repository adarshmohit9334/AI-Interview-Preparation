import pool from "../config/db.js";

const memorySessions = new Map();
const memoryQuestions = new Map(); // sessionId -> [questions]
const memoryAnswers = new Map();   // answerId -> answer
let memorySessionIdCounter = 1;
let memoryAnswerIdCounter = 1;

export class SessionRepository {
  async createSession({ userId, role, topic, difficulty, style, answerMode, totalQuestions, questions }) {
    if (pool) {
      try {
        const [result] = await pool.query(
          `INSERT INTO interview_sessions 
           (user_id, selected_role, selected_topic, difficulty, interview_style, answer_mode, total_questions, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'in_progress')`,
          [userId, role, topic || "All", difficulty, style || "Technical", answerMode || "Both", totalQuestions]
        );
        const sessionId = result.insertId;

        // Insert question snapshots
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          await pool.query(
            `INSERT INTO interview_session_questions
             (session_id, question_key, question_order, question_snapshot, expected_answer_snapshot, rubric_snapshot)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              sessionId,
              q.id,
              i + 1,
              q.questionText,
              q.expectedAnswer || "",
              JSON.stringify(q.scoringRubric || {})
            ]
          );
        }

        return this.getSessionById(sessionId, userId);
      } catch (err) {
        // Fallback to memory on db failure
      }
    }

    const sessionId = memorySessionIdCounter++;
    const session = {
      id: sessionId,
      user_id: userId,
      selected_role: role,
      selected_topic: topic || "All",
      difficulty,
      interview_style: style || "Technical",
      answer_mode: answerMode || "Both",
      total_questions: totalQuestions,
      completed_questions: 0,
      status: "in_progress",
      started_at: new Date(),
      created_at: new Date()
    };
    memorySessions.set(sessionId, session);
    memoryQuestions.set(sessionId, questions.map((q, idx) => ({
      id: idx + 1,
      session_id: sessionId,
      question_key: q.id,
      question_order: idx + 1,
      question_snapshot: q.questionText,
      expected_answer_snapshot: q.expectedAnswer || "",
      rubric_snapshot: q.scoringRubric || {}
    })));

    return { ...session, questions: memoryQuestions.get(sessionId) };
  }

  async getSessionById(sessionId, userId) {
    if (pool) {
      try {
        const [sessions] = await pool.query(
          "SELECT * FROM interview_sessions WHERE id = ? AND user_id = ? LIMIT 1",
          [sessionId, userId]
        );
        if (sessions.length === 0) return null;

        const session = sessions[0];
        const [questions] = await pool.query(
          "SELECT id, question_key, question_order, question_snapshot, rubric_snapshot FROM interview_session_questions WHERE session_id = ? ORDER BY question_order ASC",
          [sessionId]
        );
        const [answers] = await pool.query(
          `SELECT a.id, a.session_question_id, a.answer_text, a.answer_type, a.submitted_at, 
                  af.overall_score, af.verdict, af.strengths_json, af.missing_concepts_json, af.mistakes_json, af.improvements_json, af.suggested_answer
           FROM answers a
           LEFT JOIN answer_feedback af ON af.answer_id = a.id
           WHERE a.session_id = ?`,
          [sessionId]
        );

        return { ...session, questions, answers };
      } catch (err) {
        // fallback
      }
    }

    const session = memorySessions.get(Number(sessionId));
    if (!session || session.user_id !== Number(userId)) return null;
    const questions = memoryQuestions.get(Number(sessionId)) || [];
    const answers = Array.from(memoryAnswers.values()).filter(a => a.session_id === Number(sessionId));

    return { ...session, questions, answers };
  }

  async getUserSessions(userId) {
    if (pool) {
      try {
        const [sessions] = await pool.query(
          "SELECT * FROM interview_sessions WHERE user_id = ? ORDER BY created_at DESC",
          [userId]
        );
        return sessions;
      } catch (err) {
        // fallback
      }
    }
    return Array.from(memorySessions.values())
      .filter(s => s.user_id === Number(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async saveAnswer({ sessionId, sessionQuestionId, answerText, answerType = "text" }) {
    if (pool) {
      try {
        const [result] = await pool.query(
          `INSERT INTO answers (session_id, session_question_id, answer_type, answer_text)
           VALUES (?, ?, ?, ?)`,
          [sessionId, sessionQuestionId, answerType, answerText]
        );
        await pool.query(
          `UPDATE interview_sessions 
           SET completed_questions = completed_questions + 1 
           WHERE id = ?`,
          [sessionId]
        );
        return {
          id: result.insertId,
          session_id: sessionId,
          session_question_id: sessionQuestionId,
          answer_type: answerType,
          answer_text: answerText,
          submitted_at: new Date()
        };
      } catch (err) {
        // fallback
      }
    }

    const answerId = memoryAnswerIdCounter++;
    const answer = {
      id: answerId,
      session_id: Number(sessionId),
      session_question_id: Number(sessionQuestionId),
      answer_type: answerType,
      answer_text: answerText,
      submitted_at: new Date()
    };
    memoryAnswers.set(answerId, answer);
    const session = memorySessions.get(Number(sessionId));
    if (session) {
      session.completed_questions = (session.completed_questions || 0) + 1;
    }
    return answer;
  }
}

export const sessionRepository = new SessionRepository();
