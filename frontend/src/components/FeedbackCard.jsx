import React from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, Target, Sparkles, BookOpen } from "lucide-react";

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  const {
    overallScore,
    dimensions = {},
    strengths = [],
    missingConcepts = [],
    mistakes = [],
    improvements = [],
    suggestedAnswer = "",
    verdict = "",
    provider = "AI",
    model = ""
  } = feedback;

  const dimensionList = [
    { label: "Correctness", val: dimensions.correctness ?? 0, color: "text-emerald-400" },
    { label: "Conceptual Depth", val: dimensions.conceptualUnderstanding ?? 0, color: "text-indigo-400" },
    { label: "Relevance", val: dimensions.relevance ?? 0, color: "text-blue-400" },
    { label: "Completeness", val: dimensions.completeness ?? 0, color: "text-purple-400" },
    { label: "Practicality", val: dimensions.practicalApplication ?? 0, color: "text-cyan-400" },
    { label: "Clarity", val: dimensions.clarity ?? 0, color: "text-amber-400" },
  ];

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "bg-emerald-950/80 border-emerald-500/50 text-emerald-300";
    if (score >= 60) return "bg-amber-950/80 border-amber-500/50 text-amber-300";
    return "bg-rose-950/80 border-rose-500/50 text-rose-300";
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl animate-fadeIn space-y-6">
      {/* Top Header: Score & Verdict */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-bold shadow-lg ${getScoreBadgeColor(overallScore)}`}>
            <span className="text-2xl leading-none">{overallScore}</span>
            <span className="text-[10px] uppercase font-mono opacity-80 mt-1">/ 100</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {provider.toUpperCase()} {model && `(${model})`}
              </span>
              <span className="text-xs text-slate-500 font-mono">Rubric v1.0</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{verdict}</h3>
          </div>
        </div>
      </div>

      {/* Dimensional Breakdown Matrix */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dimensional Evaluation Matrix</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dimensionList.map((dim) => (
            <div key={dim.label} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70">
              <div className="text-[11px] text-slate-400 mb-1">{dim.label}</div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mr-3">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${dim.val}%` }} />
                </div>
                <span className={`text-xs font-mono font-bold ${dim.color}`}>{dim.val}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Missing Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
          <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Demonstrated Strengths</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Concepts */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40">
          <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Missing Key Concepts</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {missingConcepts.length > 0 ? (
              missingConcepts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No critical concepts missing.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Actionable Improvements */}
      {improvements && improvements.length > 0 && (
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40">
          <h5 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Actionable Coaching Guidance</span>
          </h5>
          <ul className="space-y-1 text-xs text-slate-300">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Model Answer */}
      {suggestedAnswer && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Model Sample Answer (Benchmark)</span>
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
            {suggestedAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
