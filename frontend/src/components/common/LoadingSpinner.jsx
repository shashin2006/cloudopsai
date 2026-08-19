/**
 * CloudOpsAI - Loading Spinner & Progress Indicators
 */

import React from "react";
import { Loader2, Activity } from "lucide-react";

export function LoadingSpinner({ size = "md", message = "", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 text-slate-400 ${className}`}>
      <div className="relative flex items-center justify-center">
        <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-sky-500`} />
        {size === "lg" && (
          <Activity className="w-4 h-4 text-sky-400 absolute animate-pulse" />
        )}
      </div>
      {message && <p className="text-xs font-medium text-slate-400 tracking-wide">{message}</p>}
    </div>
  );
}

export function Skeleton({ className = "", rounded = "rounded-lg" }) {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 border border-slate-700/30 ${rounded} ${className}`}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full space-y-3 p-4">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center gap-4 py-2">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <Skeleton
              key={cIdx}
              className={`h-6 ${
                cIdx === 0 ? "w-1/4" : cIdx === 1 ? "w-1/6" : "flex-1"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}
