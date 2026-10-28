import express from "express";
import { sessionRepository } from "../repositories/sessionRepository.js";
import { questionBankService } from "../services/questionBankService.js";
import { evaluationService } from "../services/evaluationService.js";
import { speechService } from "../services/speechService.js";
import { audioUpload } from "../middleware/audioUpload.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

// 1. Create a new persistent interview session
router.post("/", async (req, res, next) => {
  try {
    const { role, topic, difficulty, style, answerMode, numQuestions } = req.body;
    const limit = numQuestions ? parseInt(numQuestions, 10) : 3;

    let selectedQuestions = await questionBankService.getQuestions({
      role,
      topic,
      difficulty,
      limit
    });

    if (selectedQuestions.length === 0) {
      selectedQuestions = await questionBankService.getQuestions({ role, limit });
    }

    const snapshotQuestions = [];
    for (const q of selectedQuestions) {
      const full = await questionBankService.getQuestionById(q.id);
      snapshotQuestions.push(full);
    }

    const session = await sessionRepository.createSession({
      userId: req.user.id,
      role: role || "Frontend Developer",
      topic: topic || "All",
      difficulty: difficulty || "Intermediate",
      style: style || "Technical",
      answerMode: answerMode || "Both",
      totalQuestions: snapshotQuestions.length,
      questions: snapshotQuestions
    });

    res.status(201).json({
      success: true,
      message: "Interview session created and persisted successfully.",
      data: session
    });
  } catch (err) {
    next(err);
  }
});

// 2. List all past interview sessions for the authenticated user
router.get("/", async (req, res, next) => {
  try {
    const sessions = await sessionRepository.getUserSessions(req.user.id);
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    next(err);
  }
});

// 3. Get detailed session by ID
router.get("/:id", async (req, res, next) => {
  try {
    const session = await sessionRepository.getSessionById(req.params.id, req.user.id);
    if (!session) {
      return res.status(404).json({ success: false, error: "Interview session not found or unauthorized." });
    }
    res.status(200).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
});

// 4. Save text answer for a question in this session
router.post("/:id/answers", async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { sessionQuestionId, answerText, answerType } = req.body;

    if (!sessionQuestionId || !answerText || !answerText.trim()) {
      return res.status(400).json({ success: false, error: "sessionQuestionId and answerText are required." });
    }

    const session = await sessionRepository.getSessionById(sessionId, req.user.id);
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found or unauthorized." });
    }

    const savedAnswer = await sessionRepository.saveAnswer({
      sessionId,
      sessionQuestionId,
      answerText: answerText.trim(),
      answerType: answerType || "text"
    });

    res.status(201).json({
      success: true,
      message: "Answer saved and persisted.",
      data: savedAnswer
    });
  } catch (err) {
    next(err);
  }
});

// 5. Audio Answer Upload & Transcription (Phase 4)
router.post("/:id/answers/audio", audioUpload.single("audio"), async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { sessionQuestionId, language, contextPrompt } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file uploaded." });
    }
    if (!sessionQuestionId) {
      return res.status(400).json({ success: false, error: "sessionQuestionId is required." });
    }

    const session = await sessionRepository.getSessionById(sessionId, req.user.id);
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found or unauthorized." });
    }

    // Call real speech transcription service
    const transcription = await speechService.transcribe({
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      language: language || "en",
      contextPrompt: contextPrompt || ""
    });

    res.status(200).json({
      success: true,
      message: "Audio transcribed successfully. Please review or edit transcript before evaluation.",
      data: {
        transcript: transcription.text,
        provider: transcription.provider,
        model: transcription.model
      }
    });
  } catch (err) {
    next(err);
  }
});

// 6. Evaluate answer with configured AI Provider
router.post("/:id/answers/:answerId/evaluate", async (req, res, next) => {
  try {
    const { id: sessionId, answerId } = req.params;
    const { providerPreference } = req.body;

    const session = await sessionRepository.getSessionById(sessionId, req.user.id);
    if (!session) {
      return res.status(404).json({ success: false, error: "Interview session not found or unauthorized." });
    }

    const answer = session.answers.find(a => a.id === Number(answerId));
    if (!answer) {
      return res.status(404).json({ success: false, error: "Answer record not found in this session." });
    }

    const question = session.questions.find(q => q.id === Number(answer.session_question_id));
    if (!question) {
      return res.status(404).json({ success: false, error: "Associated interview question not found." });
    }

    const feedback = await evaluationService.evaluateAnswer({
      answerId: Number(answerId),
      question,
      candidateAnswer: answer.answer_text,
      providerPreference
    });

    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully.",
      data: feedback
    });
  } catch (err) {
    next(err);
  }
});

export default router;
