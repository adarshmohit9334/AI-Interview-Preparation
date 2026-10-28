import React, { useState } from "react";
import { Check, Edit3, MessageSquare } from "lucide-react";

export default function TranscriptEditor({ initialTranscript, onConfirm, disabled = false }) {
  const [transcript, setTranscript] = useState(initialTranscript || "");

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Speech-to-Text Transcript Review</span>
        </label>
        <span className="text-[10px] text-slate-400">
          You can edit any technical terminology before sending for evaluation
        </span>
      </div>

      <textarea
        rows={4}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onConfirm(transcript)}
          disabled={disabled || !transcript.trim()}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Confirm Transcript for Evaluation</span>
        </button>
      </div>
    </div>
  );
}
