/**
 * CloudOpsAI - Incident Card Component
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertOctagon, Clock, User, ShieldAlert, ArrowRight, Layers } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";
import { formatRelativeTime, formatDuration } from "../../utils/formatters.js";

export function IncidentCard({ incident, onStatusChange }) {
  const navigate = useNavigate();
  const isCritical = incident.severity === "CRITICAL";
  const isHigh = incident.severity === "HIGH";
  const isResolved = incident.status === "RESOLVED";

  return (
    <div
      onClick={() => navigate(`/incidents/${incident.id}`)}
      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
        isCritical && !isResolved
          ? "bg-rose-950/20 border-rose-600/50 hover:border-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.15)]"
          : isHigh && !isResolved
          ? "bg-amber-950/15 border-amber-600/40 hover:border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div>
        {/* Header: ID, Badges, Time */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-sky-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {incident.id}
            </span>
            <Badge type="severity" value={incident.severity} size="xs" />
            <Badge type="status" value={incident.status} size="xs" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatRelativeTime(incident.started_at)}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2 mb-2 leading-snug">
          {incident.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Metadata & Footer */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-slate-300">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>{incident.service_name}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <User className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[120px]">{incident.commander}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-rose-400 font-semibold">
            {isResolved
              ? `Resolved in ${incident.duration_minutes || 45}m`
              : `Active for ${formatDuration(incident.started_at, null)}`}
          </span>
          <span className="text-xs text-sky-400 group-hover:text-sky-300 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            War-Room <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
