/**
 * CloudOpsAI - Main Application Header
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Menu,
  Bell,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  ExternalLink,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { MOCK_INCIDENTS } from "../../data/mockData.js";

export function Header({ isCollapsed, onMobileMenuToggle }) {
  const { user, isBackendLive, isCheckingBackend, pingBackend } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [utcTime, setUtcTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Keep live UTC clock updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toUTCString().replace("GMT", "UTC").slice(17, 25) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute breadcrumbs from path
  const getBreadcrumbs = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Dashboard", path: "/dashboard" }];

    return parts.map((part, idx) => {
      const path = "/" + parts.slice(0, idx + 1).join("/");
      let label = part.charAt(0).toUpperCase() + part.slice(1);
      if (part === "ai-insights") label = "AI Insights";
      if (part.startsWith("INC-")) label = `Incident ${part}`;
      return { label, path };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const activeIncidents = MOCK_INCIDENTS.filter((i) => i.status !== "RESOLVED");

  const handleBackendPing = async () => {
    const res = await pingBackend();
    if (res.online) {
      addToast({
        type: "success",
        title: "FastAPI Backend Connected",
        message: `Active connection established to ${res.baseUrl}`,
      });
    } else {
      addToast({
        type: "warning",
        title: "Running in Isolated Demo Mode",
        message: `FastAPI at ${res.baseUrl} is offline. Using local high-fidelity telemetry store.`,
      });
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-20 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-all"
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link
            to="/dashboard"
            className="hover:text-slate-200 font-medium transition-colors hidden sm:inline"
          >
            CloudOps
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-slate-100">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-slate-200 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Telemetry Time, Backend Status, Alert Bell, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live UTC Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>{utcTime || "00:00:00 UTC"}</span>
        </div>

        {/* Backend Ping / Status Pill */}
        <button
          onClick={handleBackendPing}
          disabled={isCheckingBackend}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isBackendLive
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
          }`}
          title="Click to re-check FastAPI connection"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendLive
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                : "bg-amber-400"
            } ${isCheckingBackend ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline font-mono text-[11px]">
            {isCheckingBackend
              ? "Connecting..."
              : isBackendLive
              ? "FastAPI LIVE"
              : "DEMO TELEMETRY"}
          </span>
          <RefreshCw
            className={`w-3 h-3 text-slate-400 hover:text-slate-200 ${
              isCheckingBackend ? "animate-spin" : ""
            }`}
          />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            aria-label="Active Incident Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeIncidents.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
              <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Active Incident Alerts
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {activeIncidents.length} OPEN
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-800/60">
                {activeIncidents.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    All systems operational. No active incident alerts.
                  </div>
                ) : (
                  activeIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(`/incidents/${inc.id}`);
                      }}
                      className="p-3 hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono font-semibold text-sky-400">
                          {inc.id}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            inc.severity === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {inc.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium line-clamp-1">
                        {inc.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{inc.service_name}</span>
                        <span className="font-mono text-rose-400">
                          {inc.duration_minutes}m active
                        </span>
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-800 bg-slate-950/60 text-center">
                <Link
                  to="/incidents"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  View All Incidents &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-300 text-xs font-bold font-mono shadow-inner">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AM"}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-medium text-slate-200 leading-tight">
              {user?.name || "Alex Mercer"}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {user?.role?.split("/")[0] || "Lead SRE"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
