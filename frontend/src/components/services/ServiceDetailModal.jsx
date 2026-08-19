/**
 * CloudOpsAI - Service Inspection Drawer / Modal
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Activity,
  Terminal,
  AlertOctagon,
  Globe,
  Users,
  Calendar,
  ExternalLink,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "../common/Modal.jsx";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";
import { getServiceRelatedData, updateService } from "../../api/services.js";
import { formatDate, formatRelativeTime } from "../../utils/formatters.js";
import { useToast } from "../../context/ToastContext.jsx";

export function ServiceDetailModal({ service, isOpen, onClose, onServiceUpdated }) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'logs' | 'incidents'
  const [relatedData, setRelatedData] = useState({ logs: [], incidents: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (service && isOpen) {
      loadRelated();
    }
  }, [service, isOpen]);

  const loadRelated = async () => {
    if (!service) return;
    setIsRefreshing(true);
    try {
      const data = await getServiceRelatedData(service.id);
      setRelatedData(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleHealthOverride = async (newStatus) => {
    try {
      const updated = await updateService(service.id, { health_status: newStatus });
      addToast({
        type: "success",
        title: "Service Health Updated",
        message: `${service.name} status updated to ${newStatus}.`,
      });
      if (onServiceUpdated) onServiceUpdated(updated);
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: err.message,
      });
    }
  };

  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-mono">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-white">
                {service.name}
              </span>
              <Badge type="env" value={service.environment} size="xs" />
              <Badge type="health" value={service.health_status} size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {service.id} • {service.cluster}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "overview"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Telemetry & Specs
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "logs"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Service Logs</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {relatedData.logs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("incidents")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "incidents"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Related Incidents</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                {relatedData.incidents.length}
              </span>
            </button>
          </div>

          <Button
            variant="ghost"
            size="xs"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={loadRelated}
          >
            Refresh
          </Button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Response Latency (p99)
                </span>
                <span
                  className={`text-lg font-bold font-mono ${
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
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Uptime SLA
                </span>
                <span className="text-lg font-bold font-mono text-slate-100">
                  {service.uptime}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Error Rate
                </span>
                <span
                  className={`text-lg font-bold font-mono ${
                    parseFloat(service.error_rate) > 1.0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {service.error_rate || "0.00%"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Active Pods / Replicas
                </span>
                <span className="text-lg font-bold font-mono text-sky-400">
                  {service.replicas || "1/1"}
                </span>
              </div>
            </div>

            {/* Service Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
              <div className="space-y-2.5">
                <div>
                  <span className="text-slate-400 block">Owner / Engineering Team</span>
                  <span className="font-semibold text-slate-200">{service.owner}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Description</span>
                  <span className="text-slate-300 leading-relaxed block mt-0.5">
                    {service.description || "Core infrastructure service."}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Service Endpoint</span>
                  <span className="font-mono text-sky-400 break-all">
                    {service.endpoint || "http://internal-gateway"}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-slate-400 block">Kubernetes Cluster</span>
                  <span className="font-mono text-slate-200">{service.cluster}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Version Tag</span>
                  <span className="font-mono text-slate-200">{service.version}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Registration Timestamp</span>
                  <span className="text-slate-300">{formatDate(service.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Health Status Override Bar */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Quick Health Override:
              </span>
              <div className="flex gap-2">
                <Button
                  size="xs"
                  variant="success"
                  onClick={() => handleHealthOverride("HEALTHY")}
                >
                  Healthy
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  className="text-amber-400 hover:text-amber-300 border-amber-500/30"
                  onClick={() => handleHealthOverride("DEGRADED")}
                >
                  Degraded
                </Button>
                <Button
                  size="xs"
                  variant="danger"
                  onClick={() => handleHealthOverride("DOWN")}
                >
                  Down
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Logs */}
        {activeTab === "logs" && (
          <div className="space-y-2">
            {(!relatedData?.logs || (Array.isArray(relatedData.logs) && relatedData.logs.length === 0)) ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No recent logs ingested for this service.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2 font-mono text-xs">
                {(Array.isArray(relatedData.logs) ? relatedData.logs : []).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-start gap-3"
                  >
                    <Badge type="level" value={log.level} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{log.source}</span>
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                      <p className="text-slate-200 break-words">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 text-right">
              <Link
                to={`/logs?service=${service.name}`}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Open in Full Log Explorer &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Incidents */}
        {activeTab === "incidents" && (
          <div className="space-y-3">
            {(!relatedData?.incidents || (Array.isArray(relatedData.incidents) && relatedData.incidents.length === 0)) ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active or historical incidents recorded for this service.
              </div>
            ) : (
              (Array.isArray(relatedData.incidents) ? relatedData.incidents : []).map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {inc.id}
                      </span>
                      <Badge type="severity" value={inc.severity} size="xs" />
                      <Badge type="status" value={inc.status} size="xs" />
                    </div>
                    <h5 className="text-xs font-semibold text-slate-200">
                      {inc.title}
                    </h5>
                  </div>
                  <Link to={`/incidents/${inc.id}`}>
                    <Button variant="secondary" size="xs">
                      War-Room &rarr;
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
