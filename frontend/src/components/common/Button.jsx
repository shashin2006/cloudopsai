/**
 * CloudOpsAI - Reusable Button Component
 */

import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = "left",
  className = "",
  type = "button",
  id,
  onClick,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg";

  const sizeClasses = {
    xs: "px-2.5 py-1 text-xs gap-1.5",
    sm: "px-3 py-1.5 text-xs gap-2",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-sky-600 hover:bg-sky-500 text-white shadow-sm hover:shadow-sky-500/25 focus:ring-sky-500 active:scale-[0.98]",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-slate-600 focus:ring-slate-500 active:scale-[0.98]",
    outline:
      "border border-slate-700 bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus:ring-slate-500",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-sm hover:shadow-rose-500/25 focus:ring-rose-500 active:scale-[0.98]",
    dangerOutline:
      "border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 focus:ring-rose-500",
    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-emerald-500/25 focus:ring-emerald-500 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 focus:ring-slate-600",
    ai:
      "bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-sm hover:shadow-indigo-500/25 focus:ring-indigo-500 active:scale-[0.98]",
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
