/**
 * CloudOpsAI - SRE Data Formatters & Visual Helpers
 */

export function formatDate(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC";
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString) {
  if (!isoString) return "N/A";
  try {
    const now = new Date();
    const then = new Date(isoString);
    const diffSeconds = Math.floor((now - then) / 1000);

    if (diffSeconds < 60) return `${Math.max(1, diffSeconds)}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return isoString;
  }
}

export function formatDuration(startedAt, resolvedAt) {
  if (!startedAt) return "N/A";
  try {
    const start = new Date(startedAt);
    const end = resolvedAt ? new Date(resolvedAt) : new Date();
    const diffMs = Math.max(0, end - start);
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  } catch {
    return "N/A";
  }
}

export function getHealthBadgeClasses(status) {
  switch (String(status || "").toUpperCase()) {
    case "HEALTHY":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        dot: "bg-emerald-400 shadow-emerald-500/50",
        label: "Healthy",
      };
    case "DEGRADED":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        dot: "bg-amber-400 shadow-amber-500/50 animate-pulse",
        label: "Degraded",
      };
    case "DOWN":
    case "CRITICAL":
      return {
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        text: "text-rose-400",
        dot: "bg-rose-400 shadow-rose-500/50 animate-ping",
        label: "Down",
      };
    default:
      return {
        bg: "bg-slate-500/10",
        border: "border-slate-500/30",
        text: "text-slate-400",
        dot: "bg-slate-400",
        label: status || "Unknown",
      };
  }
}

export function getSeverityBadgeClasses(severity) {
  switch (String(severity || "").toUpperCase()) {
    case "CRITICAL":
      return {
        bg: "bg-rose-950/60",
        border: "border-rose-600/50",
        text: "text-rose-300",
        badge: "bg-rose-500/20 text-rose-400 border-rose-500/30",
        indicator: "bg-rose-500",
        glow: "shadow-[0_0_12px_rgba(244,63,94,0.3)]",
      };
    case "HIGH":
      return {
        bg: "bg-amber-950/40",
        border: "border-amber-600/40",
        text: "text-amber-300",
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        indicator: "bg-amber-500",
        glow: "shadow-[0_0_8px_rgba(245,158,11,0.2)]",
      };
    case "MEDIUM":
      return {
        bg: "bg-yellow-950/30",
        border: "border-yellow-600/30",
        text: "text-yellow-300",
        badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        indicator: "bg-yellow-500",
        glow: "",
      };
    case "LOW":
      return {
        bg: "bg-sky-950/30",
        border: "border-sky-600/30",
        text: "text-sky-300",
        badge: "bg-sky-500/20 text-sky-400 border-sky-500/30",
        indicator: "bg-sky-400",
        glow: "",
      };
    default:
      return {
        bg: "bg-slate-800",
        border: "border-slate-700",
        text: "text-slate-300",
        badge: "bg-slate-700 text-slate-300 border-slate-600",
        indicator: "bg-slate-400",
        glow: "",
      };
  }
}

export function getIncidentStatusBadgeClasses(status) {
  switch (String(status || "").toUpperCase()) {
    case "OPEN":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    case "INVESTIGATING":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse";
    case "RESOLVED":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
}

export function getLogLevelBadgeClasses(level) {
  switch (String(level || "").toUpperCase()) {
    case "CRITICAL":
      return {
        bg: "bg-rose-500/20",
        text: "text-rose-400 font-bold",
        border: "border-rose-500/40",
      };
    case "ERROR":
      return {
        bg: "bg-red-500/15",
        text: "text-red-400 font-semibold",
        border: "border-red-500/30",
      };
    case "WARNING":
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/30",
      };
    case "INFO":
    default:
      return {
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        border: "border-sky-500/20",
      };
  }
}

export function formatEnvironmentBadge(env) {
  switch (String(env || "").toLowerCase()) {
    case "production":
    case "prod":
      return {
        bg: "bg-purple-500/15",
        text: "text-purple-300",
        border: "border-purple-500/30",
        label: "PROD",
      };
    case "staging":
    case "stage":
      return {
        bg: "bg-blue-500/15",
        text: "text-blue-300",
        border: "border-blue-500/30",
        label: "STAGE",
      };
    case "development":
    case "dev":
    default:
      return {
        bg: "bg-slate-500/15",
        text: "text-slate-300",
        border: "border-slate-500/30",
        label: "DEV",
      };
  }
}
