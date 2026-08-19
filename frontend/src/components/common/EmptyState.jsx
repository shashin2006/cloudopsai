/**
 * CloudOpsAI - EmptyState, ErrorState, & ConfirmDialog
 */

import React from "react";
import { AlertCircle, AlertOctagon, RefreshCw, FolderSearch, CheckCircle2 } from "lucide-react";
import { Button } from "./Button.jsx";
import { Modal } from "./Modal.jsx";

export function EmptyState({
  title = "No data found",
  description = "There are no records matching your current filter criteria.",
  icon: Icon = FolderSearch,
  actionLabel,
  onAction,
  className = "",
  id,
}) {
  return (
    <div
      id={id}
      className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Unable to load data",
  error = "A communication error occurred while fetching information from the backend.",
  onRetry,
  className = "",
  id,
}) {
  return (
    <div
      id={id}
      className={`flex flex-col items-center justify-center p-8 text-center border border-rose-900/40 rounded-2xl bg-rose-950/20 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-900/40 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-rose-300/80 max-w-md mb-5 leading-relaxed font-mono">
        {typeof error === "string" ? error : error?.message || "Unknown error"}
      </p>
      {onRetry && (
        <Button
          variant="dangerOutline"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this operation?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger", // 'danger', 'primary', 'success'
  isLoading = false,
  id,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md" id={id}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              variant === "danger"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
            }`}
          >
            <AlertOctagon className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
