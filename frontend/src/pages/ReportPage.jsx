import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, CheckCircle2, RotateCcw, ArrowRight, BookOpen, Layers, BarChart2 } from "lucide-react";

export default function ReportPage() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("interviewiq_completed_session");
    if (raw) {
      try {
        setSessionData(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!sessionData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No Active Completed Session</h2>
        <p className="text-slate-400 text-sm mb-6">Complete a mock interview session to inspect your evaluation report.</p>
        <Link
          to="/setup"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500"
        >
          Start New Interview
        </Link>
      </div>
    );
  }

  const { config, questions, answers } = sessionData;
  const answeredCount = Object.keys(answers || {}).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 mb-8 text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Award className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Session Completed
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mt-2">
          Your responses for {config?.role} have been received and verified for Phase 1.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300">
            Role: <strong className="text-white">{config?.role}</strong>
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300">
            Difficulty: <strong className="text-white">{config?.difficulty}</strong>
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300">
            Answered: <strong className="text-white">{answeredCount} of {questions.length}</strong>
          </span>
        </div>
      </div>

      {/* Answered Questions Breakdown */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Submitted Question & Answer Review</span>
        </h3>

        {questions.map((q, idx) => {
          const ans = answers[q.id];
          return (
            <div
              key={q.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Question {idx + 1} • {q.topic}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                  ans ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40" : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                }`}>
                  {ans ? "Submitted" : "Skipped"}
                </span>
              </div>

              <h4 className="text-base font-semibold text-white mb-4">
                {q.questionText}
              </h4>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono">
                {ans ? ans.answerText : "No answer submitted for this question."}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
        <Link
          to="/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start Another Session
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
