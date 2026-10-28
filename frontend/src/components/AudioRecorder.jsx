import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, RotateCcw, Upload, Volume2, AlertCircle } from "lucide-react";

export default function AudioRecorder({ onAudioReady, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [permissionError, setPermissionError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setPermissionError(null);
    audioChunksRef.current = [];
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError("Audio recording is not supported in this browser. Please use text answering.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: "audio/webm" };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback for browsers that do not support webm
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mime = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mime });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (onAudioReady) onAudioReady(blob);

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250); // Slice data every 250ms
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError("Microphone permission denied. Please allow microphone access in your browser settings.");
      } else {
        setPermissionError("Could not access microphone: " + (err.message || "Unknown error"));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleReset = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingDuration(0);
    if (onAudioReady) onAudioReady(null);
  };

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
      {permissionError && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{permissionError}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={disabled}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Mic className="w-4 h-4" />
              <span>Record Voice Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-md flex items-center gap-2 animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Recording ({formatDuration(recordingDuration)})</span>
            </button>
          )}

          {audioBlob && !isRecording && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Record Again</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          {isRecording ? (
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Recording active: {formatDuration(recordingDuration)}
            </span>
          ) : audioBlob ? (
            <span className="text-emerald-400">Audio ready ({formatDuration(recordingDuration)})</span>
          ) : (
            <span>Mic input ready</span>
          )}
        </div>
      </div>

      {audioUrl && !isRecording && (
        <div className="pt-2 flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <audio controls src={audioUrl} className="w-full h-8" />
        </div>
      )}
    </div>
  );
}
