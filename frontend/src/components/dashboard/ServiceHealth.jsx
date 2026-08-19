/**
 * CloudOpsAI - Dashboard Service Health Matrix Component
 */

import React from "react";
import { Link } from "react-router-dom";
import { Layers, ArrowUpRight, Activity, Zap } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { formatRelativeTime } from "../../utils/formatters.js";

export function ServiceHealth({ services = [], onSelectService }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Service Health Matrix
            </h3>
            <p className="text-xs text-slate-400">Real-time microservice latency & uptime</p>
          </div>
        </div>
        <Link
          to="/services"
          className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 transition-colors"
        >
          <span>All Services</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Services List Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/40 text-slate-400 font-semibold border-b border-slate-800/80">
            <tr>
              <th className="py-3 px-4">Service Name</th>
              <th className="py-3 px-3">Env</th>
              <th className="py-3 px-3">Health</th>
              <th className="py-3 px-3 text-right">Latency</th>
              <th className="py-3 px-3 text-right">Uptime</th>
              <th className="py-3 px-4 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {services.slice(0, 6).map((service) => (
              <tr
                key={service.id}
                onClick={() => onSelectService && onSelectService(service)}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 font-mono font-medium text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-sky-400 transition-colors" />
                  <span className="group-hover:text-sky-300 transition-colors">
                    {service.name}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <Badge type="env" value={service.environment} size="xs" />
                </td>
                <td className="py-3 px-3">
                  <Badge type="health" value={service.health_status} size="xs" />
                </td>
                <td className="py-3 px-3 text-right font-mono">
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
                <td className="py-3 px-3 text-right font-mono text-slate-300">
                  {service.uptime}
                </td>
                <td className="py-3 px-4 text-right text-slate-400">
                  {formatRelativeTime(service.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
