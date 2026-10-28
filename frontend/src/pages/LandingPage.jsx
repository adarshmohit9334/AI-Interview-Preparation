import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle2, Mic, Code2, BrainCircuit, ShieldCheck, BarChart3, Zap } from "lucide-react";
import { getHealth } from "../services/api";

export default function LandingPage() {
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    getHealth()
      .then((res) => {
        if (res.status === "ok") setBackendStatus("online");
        else setBackendStatus("error");
      })
      .catch(() => setBackendStatus("offline"));
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Backend Status:</span>
          <span className="font-semibold text-emerald-400 capitalize">{backendStatus}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Phase 1 Active</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Master Your Next Tech Interview with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            Intelligent AI Feedback
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Realistic mock interviews with real-time text and speech evaluation. Receive dimensional scoring across correctness, conceptual depth, and structured feedback for every answer.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/setup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch Mock Interview
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Explore Platform Features
          </a>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Role Question Banks</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Curated original technical & behavioral questions for Frontend, Backend, Full Stack, Python, Java, Data Analytics, and HR roles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Text & Voice Answers</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Practice typing code-level explanations or speak your answers naturally using browser audio recording with transcription verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Dimensional Rubric Scoring</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Comprehensive analysis evaluating technical accuracy, completeness, clarity, identified mistakes, and model sample answers.
            </p>
          </div>
        </div>

        {/* Five Phase Overview Bar */}
        <div className="mt-20 p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">5-Phase Architecture Roadmap</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { num: "01", title: "Foundation & UI", desc: "Question bank & room UI", active: true },
              { num: "02", title: "MySQL & Auth", desc: "Sessions & persistence", active: false },
              { num: "03", title: "AI Evaluation", desc: "OpenAI & Gemini engine", active: false },
              { num: "04", title: "Voice & Speech", desc: "MediaRecorder & STT", active: false },
              { num: "05", title: "Reports & Polish", desc: "Analytics & final viva", active: false }
            ].map((phase) => (
              <div
                key={phase.num}
                className={`p-3.5 rounded-xl border text-xs ${
                  phase.active
                    ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200"
                    : "bg-slate-950/40 border-slate-800/80 text-slate-400"
                }`}
              >
                <div className="font-mono text-indigo-400 font-bold mb-1">PHASE {phase.num}</div>
                <div className="font-semibold text-white text-sm mb-0.5">{phase.title}</div>
                <div className="text-slate-400 text-xs">{phase.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
