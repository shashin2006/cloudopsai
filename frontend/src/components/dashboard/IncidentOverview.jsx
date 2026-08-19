/**
 * CloudOpsAI - Dashboard Incident Overview Section
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertOctagon, ArrowUpRight, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { formatRelativeTime } from "../../utils/formatters.js";

export function IncidentOverview({ incidents = [] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Active Incidents & War-Rooms
            </h3>
            <p className="text-xs text-slate-400">Severity, service impact & triage state</p>
          </div>
        </div>
        <Link
          to="/incidents"
          className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 transition-colors"
        >
          <span>All Incidents</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Incidents List */}
      <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-96 custom-scrollbar">
        {incidents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active incidents. System is healthy.
          </div>
        ) : (
          incidents.slice(0, 4).map((inc) => (
            <div
              key={inc.id}
              onClick={() => navigate(`/incidents/${inc.id}`)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                inc.severity === "CRITICAL"
                  ? "bg-rose-950/20 border-rose-600/40 hover:border-rose-500/70 hover:bg-rose-950/30"
                  : inc.severity === "HIGH"
                  ? "bg-amber-950/20 border-amber-600/30 hover:border-amber-500/60 hover:bg-amber-950/30"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {inc.id}
                  </span>
                  <Badge type="severity" value={inc.severity} size="xs" />
                  <Badge type="status" value={inc.status} size="xs" />
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formatRelativeTime(inc.started_at)}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1 mb-1.5">
                {inc.title}
              </h4>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
                <span className="font-mono text-slate-300">
                  Service: <strong className="text-slate-200">{inc.service_name}</strong>
                </span>
                <span className="text-sky-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium text-[11px]">
                  War-Room <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
