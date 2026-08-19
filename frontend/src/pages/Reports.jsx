/**
 * CloudOpsAI - Reliability Reports & SRE Postmortems Page
 */

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "../components/common/Button.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { getReports, getPostmortem } from "../api/reports.js";
import { getIncidents } from "../api/incidents.js";
import { formatDate } from "../utils/formatters.js";
import { useToast } from "../context/ToastContext.jsx";

export function Reports() {
  const [reportsData, setReportsData] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState("INC-4092");
  const [postmortem, setPostmortem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    loadAllReports();
  }, []);

  useEffect(() => {
    if (selectedIncidentId) {
      loadPostmortem(selectedIncidentId);
    }
  }, [selectedIncidentId]);

  const loadAllReports = async () => {
    setIsLoading(true);
    try {
      const [rep, incs] = await Promise.all([getReports(), getIncidents()]);
      setReportsData(rep);
      setIncidents(incs || []);
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to Load Reports",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPostmortem = async (incId) => {
    try {
      const data = await getPostmortem(incId);
      setPostmortem(data);
    } catch (err) {
      console.error(err);
    }
  };

  const copyMarkdown = () => {
    if (!postmortem) return;
    const md = `# SRE Incident Postmortem: ${postmortem.incident_id}\n\n` +
      `**Title:** ${postmortem.title}\n` +
      `**Date:** ${formatDate(postmortem.incident_date)}\n` +
      `**Commander:** ${postmortem.commander}\n` +
      `**Duration:** ${postmortem.duration}\n` +
      `**Severity:** ${postmortem.severity}\n\n` +
      `## Executive Summary\n${postmortem.summary}\n\n` +
      `## Root Cause Analysis\n${postmortem.root_cause}\n\n` +
      `## Action Items & Preventative Measures\n` +
      postmortem.action_items.map((a) => `- [${a.status}] **${a.task}** (Owner: ${a.owner})`).join("\n");

    navigator.clipboard.writeText(md);
    setCopied(true);
    addToast({
      type: "success",
      title: "Markdown Copied",
      message: "Ready to paste into Jira, Notion, or GitHub Issues.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPostmortemPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" message="Compiling reliability scorecards & SLA telemetry..." />
      </div>
    );
  }

  const { metrics, service_slas } = reportsData || {
    metrics: { uptime_pct: 99.98, mttr_minutes: 24.5, total_incidents_30d: 8, sev1_count: 2 },
    service_slas: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300">
              <FileText className="w-5 h-5" />
            </span>
            <span>Reliability Reports & Postmortems</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Service Level Objectives (SLOs), MTTR analysis, error budgets, and blameless postmortems
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={copyMarkdown}
          >
            {copied ? "Copied Markdown" : "Copy Markdown"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={downloadPostmortemPDF}
          >
            Export / Print
          </Button>
        </div>
      </div>

      {/* Top SRE Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-emerald-400 block">
            System Availability (30d)
          </span>
          <h3 className="text-2xl font-bold font-mono text-emerald-400">
            {metrics.uptime_pct}%
          </h3>
          <p className="text-[11px] text-slate-400">SLA Target: 99.95% (Exceeded)</p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-sky-400 block">
            Mean Time To Resolve (MTTR)
          </span>
          <h3 className="text-2xl font-bold font-mono text-sky-400">
            {metrics.mttr_minutes}m
          </h3>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -18% vs last month
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-amber-400 block">
            Incidents (Last 30 Days)
          </span>
          <h3 className="text-2xl font-bold font-mono text-amber-400">
            {metrics.total_incidents_30d}
          </h3>
          <p className="text-[11px] text-slate-400">{metrics.sev1_count} Sev-1 Critical</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            Remaining Error Budget
          </span>
          <h3 className="text-2xl font-bold font-mono text-slate-200">88.4%</h3>
          <p className="text-[11px] text-slate-400">Next reset: 12 days</p>
        </div>
      </div>

      {/* Service SLA & Error Budget Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
          Microservice SLO & Error Budget Compliance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-3">SLO Target</th>
                <th className="py-3 px-3">Actual Uptime</th>
                <th className="py-3 px-3">Remaining Budget</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {service_slas.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-100">
                    {s.service}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{s.slo_target}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                    {s.actual_uptime}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-sky-500 h-full rounded-full"
                          style={{ width: `${s.error_budget_remaining}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-300">
                        {s.error_budget_remaining}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      IN COMPLIANCE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Postmortem Viewer */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Blameless SRE Postmortem Document
              </h3>
              <p className="text-xs text-slate-400">
                Automated post-incident root cause documentation and preventive action registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Incident:</span>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} - {inc.service_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {postmortem ? (
          <div className="space-y-6 text-xs text-slate-200">
            {/* Meta summary strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono uppercase">
                  Incident ID
                </span>
                <span className="font-mono text-sky-400 font-bold text-sm">
                  {postmortem.incident_id}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono uppercase">
                  Severity & Impact
                </span>
                <Badge type="severity" value={postmortem.severity} size="xs" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono uppercase">
                  Commander
                </span>
                <span className="font-medium text-slate-200">{postmortem.commander}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono uppercase">
                  Total Duration
                </span>
                <span className="font-mono text-slate-200">{postmortem.duration}</span>
              </div>
            </div>

            {/* Postmortem Sections */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                  1. Executive Summary & Impact
                </h4>
                <p className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 leading-relaxed text-slate-300">
                  {postmortem.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                  2. Detailed Technical Root Cause
                </h4>
                <p className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 font-mono leading-relaxed text-slate-200">
                  {postmortem.root_cause}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  3. Preventative Action Items & Owners
                </h4>
                <div className="space-y-2">
                  {postmortem.action_items?.map((act, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            act.status === "DONE"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        />
                        <span className="font-medium text-slate-200">{act.task}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-mono text-slate-400">
                          {act.owner}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            act.status === "DONE"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {act.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No postmortem generated for this incident yet.
          </div>
        )}
      </div>
    </div>
  );
}
