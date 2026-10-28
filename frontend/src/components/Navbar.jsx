import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Terminal, LayoutDashboard, History, User, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("interviewiq_token");
  const user = JSON.parse(localStorage.getItem("interviewiq_user") || "null");

  const navLinks = [
    { name: "Mock Setup", path: "/setup", icon: Terminal },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "History", path: "/history", icon: History },
  ];

  const handleLogout = () => {
    localStorage.removeItem("interviewiq_token");
    localStorage.removeItem("interviewiq_user");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              InterviewIQ <span className="text-indigo-400 font-extrabold text-sm ml-0.5 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">AI</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/setup"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Interview
          </Link>

          {token && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{user.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
