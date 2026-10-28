import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SetupPage from "./pages/SetupPage";
import InterviewRoomPage from "./pages/InterviewRoomPage";
import ReportPage from "./pages/ReportPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<AuthPage isRegister={true} />} />
          <Route path="/login" element={<AuthPage isRegister={false} />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/room" element={<InterviewRoomPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>InterviewIQ AI — Final Year MCA Capstone System</span>
          <span className="font-mono text-slate-600">Phase 1 & 2 Verified • Vite + Express + MySQL</span>
        </div>
      </footer>
    </div>
  );
}
