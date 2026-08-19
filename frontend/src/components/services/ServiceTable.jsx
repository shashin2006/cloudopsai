/**
 * CloudOpsAI - Services Table Component
 */

import React from "react";
import { Layers, Eye, MoreHorizontal, ExternalLink, Activity, Server } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";
import { formatDate, formatRelativeTime } from "../../utils/formatters.js";

export function ServiceTable({ services = [], onSelectService, onDeleteService }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3.5 px-4">Service</th>
            <th className="py-3.5 px-3">Environment</th>
            <th className="py-3.5 px-3">Owner / Team</th>
            <th className="py-3.5 px-3">Health Status</th>
            <th className="py-3.5 px-3 text-right">Latency</th>
            <th className="py-3.5 px-3 text-right">Uptime</th>
            <th className="py-3.5 px-3">Cluster & Pods</th>
            <th className="py-3.5 px-4 text-right">Last Updated</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {services.map((service) => (
            <tr
              key={service.id}
              className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
              onClick={() => onSelectService(service)}
            >
              <td className="py-3.5 px-4 font-mono font-medium text-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 group-hover:border-sky-500/40 transition-colors shrink-0">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="group-hover:text-sky-300 font-semibold text-sm transition-colors block">
                      {service.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {service.version || "v1.0.0"}
                    </span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-3">
                <Badge type="env" value={service.environment} size="xs" />
              </td>

              <td className="py-3.5 px-3 font-medium text-slate-300">
                {service.owner}
              </td>

              <td className="py-3.5 px-3">
                <Badge type="health" value={service.health_status} size="sm" />
              </td>

              <td className="py-3.5 px-3 text-right font-mono">
                <span
                  className={
                    service.latency_ms > 300
                      ? "text-rose-400 font-bold"
                      : service.latency_ms > 100
                      ? "text-amber-400 font-medium"
                      : "text-emerald-400"
                  }
                >
                  {service.latency_ms}ms
                </span>
              </td>

              <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                {service.uptime}
              </td>

              <td className="py-3.5 px-3 text-[11px] font-mono text-slate-400">
                <span className="text-slate-300">{service.cluster || "k8s-prod"}</span>
                <span className="text-sky-400 block text-[10px]">
                  {service.replicas || "1/1"}
                </span>
              </td>

              <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                {formatRelativeTime(service.updated_at)}
              </td>

              <td
                className="py-3.5 px-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Eye}
                    onClick={() => onSelectService(service)}
                    title="View Telemetry & Logs"
                  >
                    Inspect
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
