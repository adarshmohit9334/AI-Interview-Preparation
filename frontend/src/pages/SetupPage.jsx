import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Sliders, Play, Layers, Clock, AlertCircle } from "lucide-react";
import { getQuestionFilters } from "../services/api";

export default function SetupPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    difficulties: [],
    styles: [],
    answerModes: [],
    topicsByRole: {}
  });

  // Selected state
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Intermediate");
  const [selectedStyle, setSelectedStyle] = useState("Technical");
  const [selectedAnswerMode, setSelectedAnswerMode] = useState("Both");
  const [numQuestions, setNumQuestions] = useState(3);

  useEffect(() => {
    async function fetchFilters() {
      try {
        setLoading(true);
        const res = await getQuestionFilters();
        if (res.success) {
          setFilterOptions(res.data);
          if (res.data.roles && res.data.roles.length > 0) {
            setSelectedRole(res.data.roles[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load interview options:", err);
        setError("Could not connect to backend server. Make sure the backend is running on port 5000.");
      } finally {
        setLoading(false);
      }
    }
    fetchFilters();
  }, []);

  const handleStartInterview = (e) => {
    e.preventDefault();
    const config = {
      role: selectedRole,
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      style: selectedStyle,
      answerMode: selectedAnswerMode,
      numQuestions: parseInt(numQuestions, 10)
    };

    // Store in sessionStorage for Phase 1 session continuity
    sessionStorage.setItem("interviewiq_config", JSON.stringify(config));
    navigate("/room");
  };

  const availableTopics = [
    "All",
    ...(filterOptions.topicsByRole[selectedRole] || [])
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400 mb-3">
          <Sliders className="w-3.5 h-3.5" />
          <span>Session Configurator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Customize your target role, difficulty, and interview modality. The platform will dynamically prepare suitable interview questions.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Backend Connection Warning</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleStartInterview} className="space-y-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Target Job Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filterOptions.roles.map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => {
                  setSelectedRole(role);
                  setSelectedTopic("All");
                }}
                className={`px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all ${
                  selectedRole === role
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20 font-semibold"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Topic or Skill Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Topic / Skill Category
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(filterOptions.difficulties.length > 0 ? filterOptions.difficulties : ["Beginner", "Intermediate", "Advanced"]).map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    selectedDifficulty === diff
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modality, Style, and Count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Number of Questions
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="2">2 Questions (Quick Sprint)</option>
              <option value="3">3 Questions (Standard)</option>
              <option value="5">5 Questions (Comprehensive)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Answer Mode
            </label>
            <select
              value={selectedAnswerMode}
              onChange={(e) => setSelectedAnswerMode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Both">Both (Text or Speech)</option>
              <option value="Text">Text Only</option>
              <option value="Audio">Audio / Speech Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Interview Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Technical">Technical Deep Dive</option>
              <option value="HR">HR & Behavioral</option>
              <option value="Mixed">Mixed Rounds</option>
            </select>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-white" />
            Enter Active Interview Room
          </button>
        </div>
      </form>
    </div>
  );
}
