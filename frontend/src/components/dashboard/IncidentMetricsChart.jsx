/**
 * CloudOpsAI - Incident Metrics & Observability Visualizer
 */

import React, { useState } from "react";
import { BarChart3, TrendingUp, ShieldAlert, Activity } from "lucide-react";

export function IncidentMetricsChart() {
  const [activeTab, setActiveTab] = useState("incidents"); // 'incidents' | 'logs'

  // 7-day incident volume data
  const incidentData = [
    { day: "Aug 13", critical: 0, high: 1, medium: 2, total: 3 },
    { day: "Aug 14", critical: 1, high: 0, medium: 1, total: 2 },
    { day: "Aug 15", critical: 0, high: 2, medium: 3, total: 5 },
    { day: "Aug 16", critical: 0, high: 1, medium: 1, total: 2 },
    { day: "Aug 17", critical: 0, high: 0, medium: 2, total: 2 },
    { day: "Aug 18", critical: 1, high: 2, medium: 1, total: 4 },
    { day: "Today", critical: 1, high: 1, medium: 1, total: 3 },
  ];

  // Log volume data by severity
  const logData = [
    { level: "INFO", count: "1.42M", percentage: 84, color: "bg-sky-500", text: "text-sky-400" },
    { level: "WARNING", count: "184K", percentage: 11, color: "bg-amber-500", text: "text-amber-400" },
    { level: "ERROR", count: "68K", percentage: 4.2, color: "bg-rose-500", text: "text-rose-400" },
    { level: "CRITICAL", count: "12.4K", percentage: 0.8, color: "bg-purple-500", text: "text-purple-400" },
  ];

  const maxIncidentVal = 6;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 flex flex-col h-full">
      {/* Header with toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Telemetry & Incident Trends
            </h3>
            <p className="text-xs text-slate-400">7-Day Incident Frequency & Log Ingestion</p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab("incidents")}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === "incidents"
                ? "bg-slate-800 text-sky-400 font-semibold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Incident Trend
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === "logs"
                ? "bg-slate-800 text-sky-400 font-semibold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Log Ingestion
          </button>
        </div>
      </div>

      {/* Visual Chart Content */}
      <div className="flex-1 flex flex-col justify-center">
        {activeTab === "incidents" ? (
          <div>
            {/* Bar chart representation */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
              {incidentData.map((item, idx) => {
                const heightPct = (item.total / maxIncidentVal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex flex-col items-center justify-end h-32">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-slate-100 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 pointer-events-none whitespace-nowrap z-10">
                        {item.total} incidents ({item.critical} crit)
                      </div>

                      {/* Stacked bar */}
                      <div
                        className="w-full max-w-[28px] rounded-t-md transition-all duration-300 group-hover:brightness-125 overflow-hidden flex flex-col justify-end"
                        style={{ height: `${Math.max(12, heightPct)}%` }}
                      >
                        {item.critical > 0 && (
                          <div
                            className="bg-rose-500 w-full"
                            style={{ height: `${(item.critical / item.total) * 100}%` }}
                          />
                        )}
                        {item.high > 0 && (
                          <div
                            className="bg-amber-500 w-full"
                            style={{ height: `${(item.high / item.total) * 100}%` }}
                          />
                        )}
                        {item.medium > 0 && (
                          <div
                            className="bg-sky-500 w-full"
                            style={{ height: `${(item.medium / item.total) * 100}%` }}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                Critical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-500" />
                Medium
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {logData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-semibold ${item.text}`}>{item.level}</span>
                  <span className="text-slate-300">
                    {item.count}{" "}
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
