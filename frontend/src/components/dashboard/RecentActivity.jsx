/**
 * CloudOpsAI - Dashboard Recent Operational Activity & Event Stream
 */

import React from "react";
import { Activity, ShieldAlert, Cpu, CheckCircle2, Terminal } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatters.js";

const RECENT_EVENTS = [
  {
    id: "act-1",
    type: "AI_DIAGNOSIS",
    icon: Cpu,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    title: "AI Root Cause Generated for INC-4092",
    details: "Identified PgBouncer connection starvation in payment-gateway v2.14.0 (93% confidence)",
    time: "2026-08-19T10:38:12Z",
  },
  {
    id: "act-2",
    type: "ALERT_TRIGGERED",
    icon: ShieldAlert,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    title: "Critical Alert: High5xxRate on payment-gateway",
    details: "Error rate reached 4.8% exceeding 3.0% threshold SLA",
    time: "2026-08-19T10:24:18Z",
  },
  {
    id: "act-3",
    type: "HOTFIX_DEPLOYED",
    icon: Terminal,
    color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    title: "PgBouncer Max Client Connections Raised to 15,000",
    details: "Applied dynamic config patch to k8s-prod-us-east-1 cluster",
    time: "2026-08-19T10:45:00Z",
  },
  {
    id: "act-4",
    type: "INCIDENT_RESOLVED",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    title: "INC-4085 Ingress TLS Certificate Resolved",
    details: "Cert-Manager webhook synced and daemonset restarted successfully",
    time: "2026-08-18T14:48:00Z",
  }
];

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 flex flex-col h-full">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Operational Event Stream
          </h3>
          <p className="text-xs text-slate-400">Real-time SRE audit & alert trail</p>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-80 custom-scrollbar">
        {RECENT_EVENTS.map((evt) => {
          const Icon = evt.icon;
          return (
            <div
              key={evt.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${evt.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">
                    {evt.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {formatRelativeTime(evt.time)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {evt.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
