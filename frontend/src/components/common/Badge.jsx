/**
 * CloudOpsAI - Micro-Badge Component for Health, Severity & Status
 */

import React from "react";
import {
  getHealthBadgeClasses,
  getSeverityBadgeClasses,
  getIncidentStatusBadgeClasses,
  getLogLevelBadgeClasses,
  formatEnvironmentBadge,
} from "../../utils/formatters.js";

export function Badge({
  type = "default", // 'health', 'severity', 'status', 'level', 'env', 'default'
  value = "",
  size = "sm",
  pulse = false,
  className = "",
  id,
}) {
  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5 rounded",
    sm: "text-xs px-2 py-0.5 rounded-md",
    md: "text-xs px-2.5 py-1 rounded-md font-medium",
  };

  if (type === "health") {
    const config = getHealthBadgeClasses(value);
    return (
      <span
        id={id}
        className={`inline-flex items-center gap-1.5 font-medium border ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="whitespace-nowrap">{config.label}</span>
      </span>
    );
  }

  if (type === "severity") {
    const config = getSeverityBadgeClasses(value);
    return (
      <span
        id={id}
        className={`inline-flex items-center gap-1.5 font-semibold border ${config.badge} ${config.glow} ${sizeClasses[size]} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.indicator} ${pulse || value === "CRITICAL" ? "animate-pulse" : ""}`} />
        <span className="tracking-wide uppercase whitespace-nowrap">{value}</span>
      </span>
    );
  }

  if (type === "status") {
    const badgeClasses = getIncidentStatusBadgeClasses(value);
    return (
      <span
        id={id}
        className={`inline-flex items-center gap-1.5 font-medium border uppercase tracking-wider ${badgeClasses} ${sizeClasses[size]} ${className}`}
      >
        <span className="whitespace-nowrap">{value}</span>
      </span>
    );
  }

  if (type === "level") {
    const config = getLogLevelBadgeClasses(value);
    return (
      <span
        id={id}
        className={`inline-flex items-center font-mono font-bold uppercase border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
      >
        <span className="whitespace-nowrap">{value}</span>
      </span>
    );
  }

  if (type === "env") {
    const config = formatEnvironmentBadge(value);
    return (
      <span
        id={id}
        className={`inline-flex items-center font-mono font-semibold border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
      >
        <span className="whitespace-nowrap">{config.label}</span>
      </span>
    );
  }

  return (
    <span
      id={id}
      className={`inline-flex items-center font-medium bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses[size]} ${className}`}
    >
      <span className="whitespace-nowrap">{value}</span>
    </span>
  );
}
