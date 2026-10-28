import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { questionBankService } from "./services/questionBankService.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { testDbConnection } from "./config/db.js";

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbOk = await testDbConnection();
  res.status(200).json({
    status: "ok",
    service: "InterviewIQ AI Backend",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: dbOk ? "connected" : "ready_for_credentials"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Question filters route
app.get("/api/questions/filters", async (req, res, next) => {
  try {
    const filters = await questionBankService.getFilterOptions();
    res.status(200).json({ success: true, data: filters });
  } catch (err) {
    next(err);
  }
});

// Questions list route with filtering
app.get("/api/questions", async (req, res, next) => {
  try {
    const { role, topic, difficulty, limit } = req.query;
    const questions = await questionBankService.getQuestions({
      role,
      topic,
      difficulty,
      limit: limit ? parseInt(limit, 10) : 5
    });
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    next(err);
  }
});

// Answer validation endpoint
app.post("/api/interviews/answers/validate", async (req, res, next) => {
  try {
    const { questionId, answerText } = req.body;
    if (!questionId) {
      return res.status(400).json({ success: false, error: "questionId is required" });
    }
    if (!answerText || answerText.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Answer text cannot be empty" });
    }

    const question = await questionBankService.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Answer validated and accepted for development session.",
      data: {
        questionId: question.id,
        answerLength: answerText.trim().length,
        submittedAt: new Date().toISOString(),
        role: question.role
      }
    });
  } catch (err) {
    next(err);
  }
});

// Interview sessions & Dashboard metrics
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || "Internal server error"
  });
});

export default app;
