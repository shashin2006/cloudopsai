/**
 * CloudOpsAI - SRE Login & Authentication Screen
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Zap,
  Lock,
  Mail,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Server,
  Terminal,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Button } from "../components/common/Button.jsx";

export function Login() {
  const { login, demoLogin, isBackendLive, isCheckingBackend } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("sre.lead@cloudops.ai");
  const [password, setPassword] = useState("CloudOps2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      addToast({
        type: "success",
        title: "Authenticated",
        message: "Welcome to CloudOpsAI Operations Center.",
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials or backend unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role = "Lead SRE") => {
    demoLogin(role);
    addToast({
      type: "success",
      title: "Demo Session Initialized",
      message: `Signed in as ${role} with high-fidelity telemetry.`,
    });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-xl shadow-sky-500/20 mb-4 ring-1 ring-white/20">
          <Zap className="w-8 h-8 fill-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-mono">
          CloudOps<span className="text-sky-400">AI</span>
        </h2>
        <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto">
          AI-Powered Cloud Operations, Observability & Incident Management Platform
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          {/* Backend Status indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendLive
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="font-mono text-slate-300">
                {isBackendLive ? "FastAPI Connected" : "Local Telemetry Mode"}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              JWT / PostgreSQL
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                SRE Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to War-Room
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] uppercase font-mono text-slate-400">
              Instant 1-Click SRE Access
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Quick Demo Access Roles */}
          <div className="space-y-2">
            <button
              onClick={() => handleQuickDemo("Lead SRE")}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-900 transition-colors flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold font-mono">
                  SR
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors block">
                    Alex Mercer
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Lead SRE / Platform Commander
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-sky-400 font-mono">Demo &rarr;</span>
            </button>

            <button
              onClick={() => handleQuickDemo("DevOps Engineer")}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-colors flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold font-mono">
                  DO
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors block">
                    Elena Rostova
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    DevOps & Kubernetes Engineer
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-indigo-400 font-mono">Demo &rarr;</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              Powered by NVIDIA Llama-3.3-70B • FastAPI • PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
