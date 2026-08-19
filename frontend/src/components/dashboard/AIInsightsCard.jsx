/**
 * CloudOpsAI - Dashboard AI Insights Card
 * Showcases the latest NVIDIA LLM Root Cause Diagnosis & Recommended Mitigation
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Terminal } from "lucide-react";
import { Button } from "../common/Button.jsx";
import { Badge } from "../common/Badge.jsx";

export function AIInsightsCard({ analysis, onInvestigate }) {
  const navigate = useNavigate();

  if (!analysis) return null;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 p-6 relative overflow-hidden shadow-xl">
      {/* Decorative top accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Latest AI Root Cause Diagnosis
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> NVIDIA LLM
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated telemetry correlation for{" "}
              <strong className="text-sky-300 font-mono">{analysis.incident_id}</strong>
            </p>
          </div>
        </div>

        {/* Confidence Meter Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900/80 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Confidence:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-sky-400 to-indigo-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${analysis.confidence_score}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-indigo-300">
              {analysis.confidence_score}%
            </span>
          </div>
        </div>
      </div>

      {/* Root Cause & Summary Body */}
      <div className="space-y-3 mb-5">
        <div>
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
            Root Cause Diagnosis
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-1 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {analysis.root_cause}
          </p>
        </div>

        {/* Recommended Action Pill */}
        {analysis.recommended_actions && analysis.recommended_actions[0] && (
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <Terminal className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-slate-300 block">
                  Top Recommended Remediation:
                </span>
                <span className="text-xs font-mono text-sky-300 truncate block">
                  {analysis.recommended_actions[0].title}
                </span>
              </div>
            </div>
            <Button
              variant="ai"
              size="xs"
              onClick={() => navigate(`/incidents/${analysis.incident_id}`)}
              className="shrink-0"
              icon={ArrowRight}
              iconPosition="right"
            >
              Execute In War-Room
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          Model: {analysis.model_name || "NVIDIA Llama-3.3-70B"}
        </span>
        <Link
          to="/ai-insights"
          className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
        >
          View All AI Insights &rarr;
        </Link>
      </div>
    </div>
  );
}
