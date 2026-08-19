/**
 * CloudOpsAI - Incident War-Room Timeline Component
 */

import React, { useState } from "react";
import {
  AlertOctagon,
  Search,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  Terminal,
  Clock,
  Plus,
  MessageSquare,
  Send,
} from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";
import { formatDate, formatRelativeTime } from "../../utils/formatters.js";
import { useToast } from "../../context/ToastContext.jsx";

export function IncidentTimeline({ events = [], onAddEvent, isLoading = false }) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDetails, setNoteDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const getEventIcon = (type) => {
    switch (type) {
      case "INCIDENT_TRIGGERED":
        return {
          icon: AlertOctagon,
          bg: "bg-rose-500/20 text-rose-400 border-rose-500/40",
        };
      case "INVESTIGATION_STARTED":
        return {
          icon: Search,
          bg: "bg-amber-500/20 text-amber-400 border-amber-500/40",
        };
      case "ERROR_DETECTED":
        return {
          icon: AlertTriangle,
          bg: "bg-red-500/20 text-red-400 border-red-500/40",
        };
      case "ROOT_CAUSE_IDENTIFIED":
        return {
          icon: Cpu,
          bg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
        };
      case "REMEDIATION_IN_PROGRESS":
      case "STATUS_UPDATED":
        return {
          icon: Terminal,
          bg: "bg-sky-500/20 text-sky-400 border-sky-500/40",
        };
      case "INCIDENT_RESOLVED":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
        };
      default:
        return {
          icon: MessageSquare,
          bg: "bg-slate-800 text-slate-300 border-slate-700",
        };
    }
  };

  const handlePostNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    setIsSubmitting(true);
    try {
      if (onAddEvent) {
        await onAddEvent({
          event_type: "INVESTIGATION_UPDATE",
          title: noteTitle,
          details: noteDetails,
          actor: "SRE Commander",
          severity: "INFO",
        });
      }
      addToast({
        type: "success",
        title: "Timeline Updated",
        message: "Event recorded into incident audit log.",
      });
      setNoteTitle("");
      setNoteDetails("");
      setIsAddingNote(false);
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to Post Note",
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Chronological Incident Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Audit trail of alerts, diagnostic findings, and mitigations
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="xs"
          icon={Plus}
          onClick={() => setIsAddingNote(!isAddingNote)}
        >
          {isAddingNote ? "Cancel" : "Add Timeline Note"}
        </Button>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <form
          onSubmit={handlePostNote}
          className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-3 animate-in fade-in"
        >
          <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">
            Record SRE Investigation Event
          </h4>
          <input
            type="text"
            placeholder="Event title (e.g. Rolled back deployment to v2.13.9, Checked DB locks...)"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
          <textarea
            rows="2"
            placeholder="Optional technical notes, CLI command outputs, or observations..."
            value={noteDetails}
            onChange={(e) => setNoteDetails(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsAddingNote(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="xs"
              isLoading={isSubmitting}
              icon={Send}
            >
              Post to Timeline
            </Button>
          </div>
        </form>
      )}

      {/* Timeline Event Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
        {events.map((evt, idx) => {
          const config = getEventIcon(evt.event_type);
          const Icon = config.icon;

          return (
            <div key={evt.id || idx} className="relative group">
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-[30px] top-0 w-8 h-8 rounded-xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${config.bg}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Event Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 group-hover:border-slate-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">
                      {evt.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {evt.event_type}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDate(evt.timestamp)} ({formatRelativeTime(evt.timestamp)})
                  </span>
                </div>

                {evt.details && (
                  <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 mt-2 break-words">
                    {evt.details}
                  </p>
                )}

                {evt.actor && (
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-400">Actor:</span>
                    <span className="text-slate-300 font-mono">{evt.actor}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
