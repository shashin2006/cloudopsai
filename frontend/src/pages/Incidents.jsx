/**
 * CloudOpsAI - SRE Incident Management & War-Rooms Page
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertOctagon,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { IncidentCard } from "../components/incidents/IncidentCard.jsx";
import { CreateIncidentModal } from "../components/incidents/CreateIncidentModal.jsx";
import { Button } from "../components/common/Button.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { getIncidents } from "../api/incidents.js";
import { getServices } from "../api/services.js";
import { useToast } from "../context/ToastContext.jsx";

export function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [incData, srvData] = await Promise.all([
        getIncidents(),
        getServices(),
      ]);
      setIncidents(incData || []);
      setServices(srvData || []);
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to Load Incidents",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      !search ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.service_name.toLowerCase().includes(search.toLowerCase()) ||
      (inc.description && inc.description.toLowerCase().includes(search.toLowerCase()));

    const matchesSeverity =
      severityFilter === "ALL" || inc.severity === severityFilter;

    const matchesStatus =
      statusFilter === "ALL" || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED").length;
  const criticalCount = incidents.filter(
    (i) => i.severity === "CRITICAL" && i.status !== "RESOLVED"
  ).length;
  const resolvedCount = incidents.filter((i) => i.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <span>Incident Command & War-Rooms</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold">
              {activeCount} ACTIVE
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident response, AI telemetry correlation, MTTR tracking, and mitigation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={loadData}
          >
            Refresh
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Declare Incident
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Total Incidents
            </span>
            <span className="text-xl font-bold font-mono text-slate-100">
              {incidents.length}
            </span>
          </div>
          <AlertOctagon className="w-5 h-5 text-slate-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-400 uppercase font-mono block">
              Critical (Sev-1)
            </span>
            <span className="text-xl font-bold font-mono text-rose-400">
              {criticalCount}
            </span>
          </div>
          <ShieldAlert className="w-5 h-5 text-rose-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 uppercase font-mono block">
              In War-Room
            </span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {activeCount}
            </span>
          </div>
          <Clock className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-mono block">
              Resolved
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {resolvedCount}
            </span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by incident ID, title, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Severity */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical (Sev-1)</option>
              <option value="HIGH">High (Sev-2)</option>
              <option value="MEDIUM">Medium (Sev-3)</option>
              <option value="LOW">Low (Sev-4)</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="MITIGATING">Mitigating</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Grid */}
      {isLoading ? (
        <LoadingSpinner size="lg" message="Loading incident war-rooms..." />
      ) : filteredIncidents.length === 0 ? (
        <EmptyState
          title="No Incidents Found"
          description="No incidents matched your search or filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setSeverityFilter("ALL");
            setStatusFilter("ALL");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        services={services}
        onIncidentCreated={(newInc) => {
          setIncidents((prev) => [newInc, ...prev]);
        }}
      />
    </div>
  );
}
