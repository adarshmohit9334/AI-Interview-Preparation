import React from "react";
import { Link } from "react-router-dom";
import { History, Play, AlertCircle } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interview History
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review past mock interviews and inspect detailed AI evaluation feedback.
          </p>
        </div>

        <Link
          to="/setup"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
        >
          <Play className="w-4 h-4 fill-white" />
          Start Mock
        </Link>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Persistent History In Phase 2</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Full persistent session history connected to MySQL user accounts is coming in Phase 2. Currently running in Phase 1 development mode.
        </p>
        <Link
          to="/setup"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500"
        >
          Try an Interview Now
        </Link>
      </div>
    </div>
  );
}
