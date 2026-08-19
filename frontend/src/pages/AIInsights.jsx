/**
 * CloudOpsAI - AI Insights & Intelligence Center
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  Sparkles,
  Search,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Layers,
  ArrowRight,
  TrendingUp,
  Brain,
  Zap,
} from "lucide-react";
import { Button } from "../components/common/Button.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { getHistoricalAIAnalyses, runAdHocDiagnosis } from "../api/ai.js";
import { getServices } from "../api/services.js";
import { formatDate } from "../utils/formatters.js";
import { useToast } from "../context/ToastContext.jsx";

export function AIInsights() {
  const [analyses, setAnalyses] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Ad-hoc Diagnostic Playground State
  const [playgroundService, setPlaygroundService] = useState("");
  const [playgroundLogs, setPlaygroundLogs] = useState(
    `[2026-08-19 11:02:14 UTC] ERROR [auth-service/session] RedisConnectionError: Timeout 5000ms exceeded connecting to redis-cluster-node-03:6379\n` +
    `[2026-08-19 11:02:15 UTC] CRITICAL [auth-service/jwt] Failed to issue refresh token for user_id=98124; Redis session cache unreachable\n` +
    `[2026-08-19 11:02:17 UTC] ERROR [auth-service/http] 503 Service Unavailable on /api/v1/auth/session - CircuitBreaker OPEN`
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [playgroundResult, setPlaygroundResult] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [hist, srvList] = await Promise.all([
        getHistoricalAIAnalyses(),
        getServices(),
      ]);
      setAnalyses(hist || []);
      setServices(srvList || []);
      if (srvList && srvList.length > 0) {
        setPlaygroundService(srvList[0].name);
      }
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to Load AI Insights",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPlaygroundDiagnosis = async (e) => {
    e.preventDefault();
    if (!playgroundLogs.trim()) return;

    setIsSynthesizing(true);
    try {
      const result = await runAdHocDiagnosis(playgroundLogs, playgroundService);
      setPlaygroundResult(result);
      addToast({
        type: "success",
        title: "NVIDIA AI Diagnosis Generated",
        message: `Identified root cause with ${result.confidence_score}% confidence.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Diagnosis Error",
        message: err.message,
      });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const filteredAnalyses = analyses.filter((a) => {
    const q = search.toLowerCase();
    return (
      !search ||
      a.incident_id.toLowerCase().includes(q) ||
      a.root_cause.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Cpu className="w-5 h-5" />
            </span>
            <span>AI Intelligence & Telemetry Diagnostics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            NVIDIA Llama-3.3-70B automated root-cause engine, telemetry correlation, and remediation repository
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Model: NVIDIA Llama-3.3-70B-Instruct
          </span>
        </div>
      </div>

      {/* Model Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-indigo-300 block">
            Mean Diagnostic Confidence
          </span>
          <h3 className="text-2xl font-bold font-mono text-white">92.4%</h3>
          <p className="text-[11px] text-slate-400">Across 14 incident correlations</p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-sky-300 block">
            Avg Inference Latency
          </span>
          <h3 className="text-2xl font-bold font-mono text-sky-400">1.24s</h3>
          <p className="text-[11px] text-slate-400">Streamed via NVIDIA NIM endpoint</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-emerald-300 block">
            Verified Resolution Rate
          </span>
          <h3 className="text-2xl font-bold font-mono text-emerald-400">96.8%</h3>
          <p className="text-[11px] text-slate-400">SRE confirmed remediation procedures</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            Telemetry Sources
          </span>
          <h3 className="text-2xl font-bold font-mono text-slate-200">5 Types</h3>
          <p className="text-[11px] text-slate-400">Logs, p99 Latency, SLA, DB Locks, Git</p>
        </div>
      </div>

      {/* Ad-hoc Diagnostic Studio / Playground */}
      <div className="p-6 rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-slate-950 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live SRE Telemetry Diagnostic Studio
              </h3>
              <p className="text-xs text-slate-400">
                Paste raw stderr, panic traces, or cluster logs to trigger instant NVIDIA LLM root cause isolation
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono">
            Interactive
          </span>
        </div>

        <form onSubmit={handleRunPlaygroundDiagnosis} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Context Service
              </label>
              <select
                value={playgroundService}
                onChange={(e) => setPlaygroundService(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.environment})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reasoning Model
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-300 text-xs font-mono flex items-center justify-between">
                <span>NVIDIA Llama-3.3-70B-Instruct</span>
                <span className="text-[10px] text-emerald-400 font-bold">ONLINE</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Raw Log Stream / Error Stack Trace
            </label>
            <textarea
              rows="4"
              value={playgroundLogs}
              onChange={(e) => setPlaygroundLogs(e.target.value)}
              placeholder="Paste log traces, 5xx dumps, k8s pod events..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed custom-scrollbar"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="ai"
              size="sm"
              isLoading={isSynthesizing}
              icon={Sparkles}
            >
              Analyze Telemetry & Synthesize Root Cause
            </Button>
          </div>
        </form>

        {/* Diagnostic Result */}
        {playgroundResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  NVIDIA AI Root Cause Synthesis
                </h4>
              </div>
              <span className="text-xs font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                Confidence: {playgroundResult.confidence_score}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-rose-300 leading-relaxed">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Root Cause
              </span>
              {playgroundResult.root_cause}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Executive Analysis
              </span>
              {playgroundResult.summary}
            </div>

            {/* Recommended Procedure */}
            {playgroundResult.recommended_actions && playgroundResult.recommended_actions[0] && (
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                  Recommended Command: {playgroundResult.recommended_actions[0].title}
                </span>
                <pre className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-sky-300 border border-slate-800 overflow-x-auto">
                  $ {playgroundResult.recommended_actions[0].command}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Historical Root Cause Archive */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span>Historical Incident AI Diagnoses</span>
            <span className="text-xs text-slate-400 font-mono font-normal">
              ({filteredAnalyses.length} archived)
            </span>
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search historical root causes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" message="Loading AI analysis archive..." />
        ) : (
          <div className="space-y-3">
            {filteredAnalyses.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.incident_id}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                      {item.confidence_score}% Confidence
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.model_name || "NVIDIA Llama-3.3-70B"}
                    </span>
                  </div>

                  <Link
                    to={`/incidents/${item.incident_id}`}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Open War-Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-slate-400 font-sans block text-[10px] uppercase mb-0.5">
                    Root Cause:
                  </strong>
                  {item.root_cause}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
