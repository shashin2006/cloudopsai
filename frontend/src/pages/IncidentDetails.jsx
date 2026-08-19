/**
 * CloudOpsAI - Incident War-Room & Root Cause Analysis Detail View
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  AlertOctagon,
  ArrowLeft,
  Clock,
  User,
  Layers,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { AIAnalysisCard } from "../components/incidents/AIAnalysisCard.jsx";
import { IncidentTimeline } from "../components/incidents/IncidentTimeline.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { ErrorState } from "../components/common/EmptyState.jsx";
import {
  getIncidentById,
  updateIncident,
  addIncidentTimelineEvent,
} from "../api/incidents.js";
import { triggerAIAnalysis } from "../api/ai.js";
import { formatDate, formatDuration, formatRelativeTime } from "../utils/formatters.js";
import { useToast } from "../context/ToastContext.jsx";

export function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [incident, setIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadIncident();
  }, [id]);

  const loadIncident = async () => {
    setIsLoading(true);
    try {
      const data = await getIncidentById(id);
      setIncident(data);
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to Load Incident",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateIncident(id, {
        status: newStatus,
        resolved_at: newStatus === "RESOLVED" ? new Date().toISOString() : null,
      });
      setIncident(updated);
      addToast({
        type: newStatus === "RESOLVED" ? "success" : "info",
        title: `Incident ${newStatus}`,
        message: `Status updated to ${newStatus}.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: err.message,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSeverityChange = async (newSeverity) => {
    try {
      const updated = await updateIncident(id, { severity: newSeverity });
      setIncident(updated);
      addToast({
        type: "info",
        title: "Severity Reclassified",
        message: `Incident severity set to ${newSeverity}.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: err.message,
      });
    }
  };

  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const newAnalysis = await triggerAIAnalysis(id);
      setIncident((prev) => ({
        ...prev,
        ai_analysis: newAnalysis,
      }));
      addToast({
        type: "success",
        title: "NVIDIA AI Diagnosis Completed",
        message: `Generated root cause diagnosis with ${newAnalysis.confidence_score}% confidence.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "AI Analysis Error",
        message: err.message,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTimelineEvent = async (eventData) => {
    const updated = await addIncidentTimelineEvent(id, eventData);
    setIncident(updated);
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" message="Loading incident war-room telemetry..." />
      </div>
    );
  }

  if (!incident) {
    return (
      <ErrorState
        title="Incident Not Found"
        error={`No incident record found matching identifier '${id}'.`}
        onRetry={() => navigate("/incidents")}
      />
    );
  }

  const isCritical = incident.severity === "CRITICAL";
  const isResolved = incident.status === "RESOLVED";

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/incidents"
          className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Incidents</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to={`/logs?service=${incident.service_name}`}>
            <Button variant="secondary" size="xs" icon={Terminal}>
              Filter Ingested Logs
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="xs"
            icon={RefreshCw}
            onClick={loadIncident}
          >
            Refresh War-Room
          </Button>
        </div>
      </div>

      {/* Main War-Room Header Card */}
      <div
        className={`p-6 rounded-3xl border backdrop-blur-xl space-y-5 shadow-2xl transition-colors ${
          isCritical && !isResolved
            ? "bg-gradient-to-br from-rose-950/30 via-slate-900/90 to-slate-950 border-rose-600/40"
            : "bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border-slate-800"
        }`}
      >
        {/* Title, Badges & Time */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-sky-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 shadow-inner">
                {incident.id}
              </span>
              <Badge type="severity" value={incident.severity} size="sm" />
              <Badge type="status" value={incident.status} size="sm" />
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Started {formatDate(incident.started_at)}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
              {incident.title}
            </h1>
          </div>

          {/* Status & Resolution Controls */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
            {/* Status Switcher */}
            <select
              value={incident.status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="OPEN">Status: OPEN</option>
              <option value="INVESTIGATING">Status: INVESTIGATING</option>
              <option value="MITIGATING">Status: MITIGATING</option>
              <option value="RESOLVED">Status: RESOLVED</option>
            </select>

            {/* Severity Switcher */}
            <select
              value={incident.severity}
              onChange={(e) => handleSeverityChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="CRITICAL">Severity: CRITICAL (Sev-1)</option>
              <option value="HIGH">Severity: HIGH (Sev-2)</option>
              <option value="MEDIUM">Severity: MEDIUM (Sev-3)</option>
              <option value="LOW">Severity: LOW (Sev-4)</option>
            </select>

            {incident.status !== "RESOLVED" ? (
              <Button
                variant="success"
                size="sm"
                icon={CheckCircle2}
                isLoading={isUpdatingStatus}
                onClick={() => handleStatusChange("RESOLVED")}
              >
                Resolve Incident
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                icon={RotateCcw}
                isLoading={isUpdatingStatus}
                onClick={() => handleStatusChange("INVESTIGATING")}
              >
                Reopen Incident
              </Button>
            )}
          </div>
        </div>

        {/* Incident Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Affected Microservice
            </span>
            <span className="font-mono text-sky-300 font-bold text-sm">
              {incident.service_name}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Incident Commander
            </span>
            <span className="font-medium text-slate-200 text-xs">
              {incident.commander}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              War-Room Duration
            </span>
            <span
              className={`font-mono font-bold text-xs ${
                isResolved ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isResolved
                ? `Resolved in ${incident.duration_minutes || 45}m`
                : `${formatDuration(incident.started_at, null)} (Active)`}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Postmortem Status
            </span>
            <span className="font-mono text-slate-300 text-xs">
              {incident.status === "RESOLVED" ? "Draft Available" : "Awaiting Triage"}
            </span>
          </div>
        </div>

        {/* Symptoms Description */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
            Observed Symptoms & Blast Radius
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
            {incident.description}
          </p>
        </div>
      </div>

      {/* NVIDIA AI Root Cause Diagnosis & War-Room Engine */}
      <AIAnalysisCard
        analysis={incident.ai_analysis}
        onTriggerAnalysis={handleTriggerAnalysis}
        isAnalyzing={isAnalyzing}
        incident={incident}
      />

      {/* Chronological Incident Timeline */}
      <IncidentTimeline
        events={incident.timeline_events || []}
        onAddEvent={handleAddTimelineEvent}
      />
    </div>
  );
}
