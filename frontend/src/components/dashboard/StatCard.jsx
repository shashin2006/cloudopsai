/**
 * CloudOpsAI - Dashboard KPI StatCard Component
 */

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = null, // { direction: 'up'|'down'|'neutral', label: '+12% from yesterday', isPositive: true }
  variant = "default", // 'emerald', 'rose', 'amber', 'sky', 'indigo', 'default'
  onClick,
  id,
}) {
  const variantStyles = {
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "bg-gradient-to-b from-emerald-950/20 to-slate-900/60",
      iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
      text: "text-emerald-400",
    },
    rose: {
      border: "border-rose-500/30 hover:border-rose-500/50",
      bg: "bg-gradient-to-b from-rose-950/25 to-slate-900/60",
      iconBg: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
      text: "text-rose-400",
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/40",
      bg: "bg-gradient-to-b from-amber-950/20 to-slate-900/60",
      iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      text: "text-amber-400",
    },
    sky: {
      border: "border-sky-500/20 hover:border-sky-500/40",
      bg: "bg-gradient-to-b from-sky-950/20 to-slate-900/60",
      iconBg: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
      text: "text-sky-400",
    },
    indigo: {
      border: "border-indigo-500/20 hover:border-indigo-500/40",
      bg: "bg-gradient-to-b from-indigo-950/20 to-slate-900/60",
      iconBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30",
      text: "text-indigo-400",
    },
    default: {
      border: "border-slate-800 hover:border-slate-700",
      bg: "bg-slate-900/60",
      iconBg: "bg-slate-800 text-slate-300 border border-slate-700",
      text: "text-slate-100",
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 rounded-2xl border ${style.border} ${style.bg} backdrop-blur-sm transition-all duration-200 ${
        onClick ? "cursor-pointer hover:translate-y-[-2px] hover:shadow-xl" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className={`text-2xl sm:text-3xl font-bold font-mono mt-1 ${style.text}`}>
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trend.direction === "down" ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              {trend.label}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-400 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
