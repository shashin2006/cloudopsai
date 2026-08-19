/**
 * CloudOpsAI - Platform Settings & Engine Configuration Page
 */

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Server,
  Cpu,
  Database,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Save,
  Radio,
  ExternalLink,
  Code2,
} from "lucide-react";
import { Button } from "../components/common/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export function Settings() {
  const { isBackendLive, isCheckingBackend, pingBackend, apiBaseUrl, updateApiUrl } = useAuth();
  const { addToast } = useToast();

  const [backendUrl, setBackendUrl] = useState(apiBaseUrl || "http://localhost:8000");
  const [modelName, setModelName] = useState("nvidia/llama-3.3-70b-instruct");
  const [retentionDays, setRetentionDays] = useState("30");
  const [pollingRate, setPollingRate] = useState("4");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateApiUrl(backendUrl);
    
    try {
      const res = await pingBackend();
      setIsSaving(false);
      if (res.online) {
        addToast({
          type: "success",
          title: "Backend Connected",
          message: `Successfully verified FastAPI target at ${backendUrl}`,
        });
      } else {
        addToast({
          type: "info",
          title: "Settings Saved (Isolated Mode)",
          message: `Saved target ${backendUrl}. Active in high-fidelity mock fallback mode until backend is running.`,
        });
      }
    } catch {
      setIsSaving(false);
      addToast({
        type: "success",
        title: "Settings Saved",
        message: "API target configuration updated successfully.",
      });
    }
  };

  const handleTestBackend = async () => {
    updateApiUrl(backendUrl);
    const res = await pingBackend();
    if (res.online) {
      addToast({
        type: "success",
        title: "FastAPI Connection Verified",
        message: `Successfully connected to FastAPI server at ${res.baseUrl} (HTTP ${res.status})`,
      });
    } else {
      addToast({
        type: "warning",
        title: "FastAPI Server Offline",
        message: `Unable to reach ${res.baseUrl}. Platform running in local high-fidelity telemetry mode.`,
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
            <SettingsIcon className="w-5 h-5" />
          </span>
          <span>Engine Settings & Architecture</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure backend API endpoints, NVIDIA AI inference models, telemetry streams, and persistence
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Backend & API Connectivity */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                FastAPI Backend Service Target
              </h3>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 ${
                isBackendLive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              {isBackendLive ? "Connected (FastAPI Live)" : "Isolated Demo Mode"}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                FastAPI Base URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={RefreshCw}
                  isLoading={isCheckingBackend}
                  onClick={handleTestBackend}
                >
                  Test Connection
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Set to <code className="text-sky-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">http://localhost:8000</code> when running Docker Compose. If the backend container is offline, CloudOpsAI automatically serves high-fidelity telemetry locally.
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400">Presets:</span>
            <button
              type="button"
              onClick={() => setBackendUrl("http://localhost:8000")}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-[11px]"
            >
              http://localhost:8000 (Docker Local)
            </button>
            <button
              type="button"
              onClick={() => setBackendUrl("http://127.0.0.1:8000")}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-[11px]"
            >
              http://127.0.0.1:8000 (Localhost IP)
            </button>
          </div>
        </div>

        {/* AI Model & Inference Engine */}
        <div className="p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-slate-950 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-500/20">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              NVIDIA AI Root Cause Model Engine
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Active Reasoning Model
              </label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="nvidia/llama-3.3-70b-instruct">
                  nvidia/llama-3.3-70b-instruct (Recommended)
                </option>
                <option value="meta/llama-3.1-405b-instruct">
                  meta/llama-3.1-405b-instruct (Deep Reasoning)
                </option>
                <option value="mistralai/mixtral-8x22b-instruct-v0.1">
                  mistralai/mixtral-8x22b-instruct-v0.1
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Inference Protocol
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-300 font-mono">
                NVIDIA OpenAI-Compatible API (Server-Side Proxy)
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry & Observability Streaming */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4 text-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Telemetry Retention & Live Ingestion
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Log Ingestion Polling Interval (Seconds)
              </label>
              <input
                type="number"
                value={pollingRate}
                onChange={(e) => setPollingRate(e.target.value)}
                min="1"
                max="60"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                PostgreSQL Log Partition Retention (Days)
              </label>
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                min="7"
                max="365"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Docker & Deployment Guide Card */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>Docker Compose Quick Start</span>
          </div>
          <p className="text-xs text-slate-400">
            Run the entire stack with your backend on port 8000 and frontend on port 3000:
          </p>
          <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-200 overflow-x-auto">
docker compose up --build
          </pre>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            isLoading={isSaving}
          >
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
