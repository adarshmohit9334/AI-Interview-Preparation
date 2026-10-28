import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  ArrowRight,
  Send,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Mic,
  MessageSquare,
  Shield,
  Sparkles,
  Info
} from "lucide-react";
import { getQuestions, validateAnswer } from "../services/api";

export default function InterviewRoomPage() {
  const navigate = useNavigate();

  const [sessionConfig, setSessionConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Answering states
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [completedAnswers, setCompletedAnswers] = useState({});

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerRunning, setTimerRunning] = useState(true);

  // Load configuration & fetch selected questions from backend
  useEffect(() => {
    const storedConfig = sessionStorage.getItem("interviewiq_config");
    let parsedConfig = {
      role: "Frontend Developer",
      topic: "All",
      difficulty: "Intermediate",
      style: "Technical",
      answerMode: "Both",
      numQuestions: 3
    };

    if (storedConfig) {
      try {
        parsedConfig = JSON.parse(storedConfig);
      } catch (e) {
        console.error(e);
      }
    }
    setSessionConfig(parsedConfig);

    async function fetchSessionQuestions() {
      try {
        setLoading(true);
        const res = await getQuestions({
          role: parsedConfig.role,
          topic: parsedConfig.topic,
          difficulty: parsedConfig.difficulty,
          limit: parsedConfig.numQuestions
        });

        if (res.success && res.data.length > 0) {
          setQuestions(res.data);
          setTimeLeft(res.data[0].suggestedTimeSeconds || 120);
        } else {
          // Fallback if specific filter returns zero questions: fetch role without strict topic
          const fallbackRes = await getQuestions({
            role: parsedConfig.role,
            limit: parsedConfig.numQuestions
          });
          if (fallbackRes.success && fallbackRes.data.length > 0) {
            setQuestions(fallbackRes.data);
            setTimeLeft(fallbackRes.data[0].suggestedTimeSeconds || 120);
          } else {
            setError("No questions matched the chosen criteria. Please adjust your role or topic filters.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Error connecting to backend API.");
      } finally {
        setLoading(false);
      }
    }

    fetchSessionQuestions();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Current question helper
  const currentQuestion = questions[currentIndex] || null;

  // Handle Answer submission
  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    if (!answerText.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Phase 1 calls backend validation endpoint
      const res = await validateAnswer({
        questionId: currentQuestion.id,
        answerText: answerText.trim()
      });

      if (res.success) {
        // Record completed answer locally
        setCompletedAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            answerText: answerText.trim(),
            submittedAt: new Date().toISOString(),
            status: "Submitted & Validated (Phase 1)"
          }
        }));

        setSubmitSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const nextQ = questions[nextIndex];
      // Check if already answered
      const existing = completedAnswers[nextQ.id];
      setAnswerText(existing ? existing.answerText : "");
      setSubmitSuccess(existing ? existing : null);
      setTimeLeft(nextQ.suggestedTimeSeconds || 120);
      setTimerRunning(true);
    } else {
      // Completed all questions in the session
      sessionStorage.setItem("interviewiq_completed_session", JSON.stringify({
        config: sessionConfig,
        questions,
        answers: completedAnswers
      }));
      navigate("/report");
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Loading Interview Room...</h2>
        <p className="text-slate-400 text-sm mt-1">Retrieving questions from question bank</p>
      </div>
    );
  }

  if (error && (!questions || questions.length === 0)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-800 text-red-200">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">Interview Session Error</h2>
          <p className="text-sm text-red-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/setup")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500"
          >
            Return to Setup
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Session Header Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              {sessionConfig?.role}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
              {sessionConfig?.difficulty}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
              {sessionConfig?.style}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-sm ${
              timeLeft < 30 ? "bg-red-950/40 border-red-800 text-red-400 animate-pulse" : "bg-slate-950 border-slate-800 text-slate-300"
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to exit the interview session early?")) {
                  navigate("/setup");
                }
              }}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>
              Question <span className="text-white font-bold">{currentIndex + 1}</span> of {questions.length}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question & Answer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Prompt */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {currentQuestion?.topic}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ID: {currentQuestion?.id}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
              {currentQuestion?.questionText}
            </h2>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Evaluation Rubric Note</span>
              </div>
              <p>
                Answers are evaluated on technical accuracy, conceptual understanding, structured clarity, and practical examples.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Suggested time: {currentQuestion?.suggestedTimeSeconds}s</span>
            <span>Single-response model</span>
          </div>
        </div>

        {/* Right Column: Answer Input & Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Your Answer</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {answerText.length} characters
              </span>
            </div>

            <textarea
              rows={8}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your structured explanation here. Be specific, explain underlying mechanics, and cite code or real-world examples where relevant..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans resize-y transition-colors leading-relaxed"
            />

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-red-950/30 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAnswerText("")}
                  disabled={submitting || !answerText}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answerText.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submission Feedback & Next Step card */}
          {submitSuccess && (
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 animate-fadeIn">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Answer Successfully Validated</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {submitSuccess.phaseNote || "Answer registered in session."}
                    </p>
                    <div className="mt-2 text-xs text-indigo-300 font-mono">
                      Timestamp: {new Date(submitSuccess.submittedAt).toLocaleTimeString()} | Length: {submitSuccess.answerLength} chars
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all shrink-0"
                >
                  <span>{currentIndex < questions.length - 1 ? "Next Question" : "Complete & View Report"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
