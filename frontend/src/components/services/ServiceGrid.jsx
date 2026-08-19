/**
 * CloudOpsAI - Services Grid View Component
 */

import React from "react";
import { Server, Activity, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { formatRelativeTime } from "../../utils/formatters.js";

export function ServiceGrid({ services = [], onSelectService }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => onSelectService(service)}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
        >
          <div>
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 group-hover:border-sky-500/40 transition-colors">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors font-mono">
                    {service.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {service.cluster}
                  </p>
                </div>
              </div>
              <Badge type="health" value={service.health_status} size="xs" />
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {service.description || "Microservice telemetry & backend workload."}
            </p>

            {/* Metrics pills */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  Latency
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    service.latency_ms > 300
                      ? "text-rose-400"
                      : service.latency_ms > 100
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {service.latency_ms}ms
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  Uptime
                </span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {service.uptime}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  Pods
                </span>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {service.replicas || "1/1"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <Badge type="env" value={service.environment} size="xs" />
            <span className="group-hover:text-sky-300 font-medium inline-flex items-center gap-1 text-[11px] transition-colors">
              Inspect Telemetry <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
