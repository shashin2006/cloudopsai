/**
 * CloudOpsAI - Incident AI Analysis & Remediation War-Room Component
 */

import React, { useState } from "react";
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  FileCode,
  GitCommit,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../common/Button.jsx";
import { Badge } from "../common/Badge.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export function AIAnalysisCard({
  analysis,
  onTriggerAnalysis,
  isAnalyzing,
  incident,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [executedSteps, setExecutedSteps] = useState({});
  const [showEvidence, setShowEvidence] = useState(true);
  const { addToast } = useToast();

  const handleCopyCommand = (command, idx) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(idx);
    addToast({
      type: "success",
      title: "Command Copied",
      message: "Ready to run in terminal or cluster context.",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleToggleExecution = (stepId) => {
    setExecutedSteps((prev) => {
      const nextState = !prev[stepId];
      addToast({
        type: nextState ? "success" : "info",
        title: nextState ? "Action Marked Executed" : "Action Marked Pending",
        message: `Step ${stepId} status toggled in war-room.`,
      });
      return { ...prev, [stepId]: nextState };
    });
  };

  return (
    <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/30 via-slate-900/90 to-slate-950 p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                NVIDIA LLM Root Cause Diagnosis & War-Room Engine
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Llama-3.3-70B
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Correlated against logs, metrics, telemetry anomalies, and commit history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {analysis && (
            <div className="flex items-center gap-2 bg-slate-950/80 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl">
              <span className="text-xs text-slate-400 font-medium">Confidence:</span>
              <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-sky-400 to-indigo-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${analysis.confidence_score}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300">
                {analysis.confidence_score}%
              </span>
            </div>
          )}

          <Button
            variant="ai"
            size="sm"
            icon={isAnalyzing ? Sparkles : RotateCcw}
            isLoading={isAnalyzing}
            onClick={onTriggerAnalysis}
          >
            {analysis ? "Re-Run AI Diagnosis" : "Run AI Diagnosis"}
          </Button>
        </div>
      </div>

      {!analysis ? (
        <div className="p-8 text-center border border-dashed border-indigo-500/30 rounded-2xl bg-indigo-950/10">
          <Cpu className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60 animate-pulse" />
          <h4 className="text-sm font-semibold text-slate-200 mb-1">
            No AI Diagnosis Generated Yet
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
            Trigger the NVIDIA Llama-3.3-70B AI engine to parse telemetry logs, isolate the
            fault, and recommend verified remediation commands.
          </p>
          <Button
            variant="ai"
            size="sm"
            icon={Sparkles}
            onClick={onTriggerAnalysis}
            isLoading={isAnalyzing}
          >
            Synthesize Root Cause Now
          </Button>
        </div>
      ) : (
        <>
          {/* Summary & Root Cause */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/20 space-y-2">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                Executive Incident Summary
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/20 space-y-2">
              <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
                Identified Technical Root Cause
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                {analysis.root_cause}
              </p>
            </div>
          </div>

          {/* Evidence Checklist */}
          {analysis.evidence && analysis.evidence.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  Correlated Telemetry Evidence ({analysis.evidence.length})
                </span>
                <button
                  onClick={() => setShowEvidence(!showEvidence)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showEvidence ? "Collapse" : "Expand"}</span>
                </button>
              </div>

              {showEvidence && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {analysis.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-sky-300 uppercase">
                          {ev.type}
                        </span>
                        <span className="text-emerald-400">{ev.source}</span>
                      </div>
                      <p className="text-slate-200 text-[11px] leading-relaxed">
                        {ev.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recommended Remediation Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Actionable Remediation Procedures
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {Object.values(executedSteps).filter(Boolean).length} /{" "}
                {analysis.recommended_actions?.length || 0} Executed
              </span>
            </div>

            <div className="space-y-3">
              {analysis.recommended_actions?.map((action, idx) => {
                const isDone = !!executedSteps[action.step];

                return (
                  <div
                    key={action.step || idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isDone
                        ? "bg-emerald-950/20 border-emerald-500/40"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                            isDone
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}
                        >
                          {action.step}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                          {action.title}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono uppercase">
                          {action.category}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleExecution(action.step)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isDone
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? "Executed & Verified" : "Mark Executed"}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {action.description}
                    </p>

                    {/* Copyable CLI Command Box */}
                    {action.command && (
                      <div className="relative group/cmd">
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto pr-20 selection:bg-sky-500 selection:text-white">
                          <span className="text-slate-400 select-none">$ </span>
                          {action.command}
                        </div>
                        <button
                          onClick={() => handleCopyCommand(action.command, idx)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 border border-slate-700 transition-colors shadow"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy CLI</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
