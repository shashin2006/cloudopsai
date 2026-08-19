/**
 * CloudOpsAI - Accessible Dark Modal Dialog
 */

import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-2xl",
  id,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id={id || "modal-overlay"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden my-8 transform transition-all duration-200 animate-in zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-900/80">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[calc(85vh-130px)] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
