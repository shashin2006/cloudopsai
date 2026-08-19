/**
 * CloudOpsAI - Microservices Registry & Health Matrix Page
 */

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Search,
  LayoutGrid,
  List,
  RefreshCw,
  Server,
  Activity,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { ServiceTable } from "../components/services/ServiceTable.jsx";
import { ServiceGrid } from "../components/services/ServiceGrid.jsx";
import { CreateServiceModal } from "../components/services/CreateServiceModal.jsx";
import { ServiceDetailModal } from "../components/services/ServiceDetailModal.jsx";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { getServices } from "../api/services.js";
import { useToast } from "../context/ToastContext.jsx";

export function Services() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [search, setSearch] = useState("");
  const [envFilter, setEnvFilter] = useState("ALL");
  const [healthFilter, setHealthFilter] = useState("ALL");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsRefreshing(true);
    try {
      const data = await getServices();
      setServices(data || []);
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to Load Services",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter logic
  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      !search ||
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.owner.toLowerCase().includes(search.toLowerCase()) ||
      srv.cluster.toLowerCase().includes(search.toLowerCase()) ||
      (srv.description && srv.description.toLowerCase().includes(search.toLowerCase()));

    const matchesEnv =
      envFilter === "ALL" ||
      srv.environment.toLowerCase() === envFilter.toLowerCase();

    const matchesHealth =
      healthFilter === "ALL" || srv.health_status === healthFilter;

    return matchesSearch && matchesEnv && matchesHealth;
  });

  const healthyCount = services.filter((s) => s.health_status === "HEALTHY").length;
  const degradedCount = services.filter((s) => s.health_status === "DEGRADED").length;
  const downCount = services.filter((s) => s.health_status === "DOWN").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <span>Microservices Registry</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono font-bold">
              {services.length} WORKLOADS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cluster distribution, health SLAs, latency telemetry, and Kubernetes deployments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={loadServices}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Register Service
          </Button>
        </div>
      </div>

      {/* Health Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Total Workloads
            </span>
            <span className="text-xl font-bold font-mono text-slate-100">
              {services.length}
            </span>
          </div>
          <Server className="w-5 h-5 text-slate-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-mono block">
              Healthy
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {healthyCount}
            </span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 uppercase font-mono block">
              Degraded
            </span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {degradedCount}
            </span>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-400 uppercase font-mono block">
              Down / Outage
            </span>
            <span className="text-xl font-bold font-mono text-rose-400">
              {downCount}
            </span>
          </div>
          <XCircle className="w-5 h-5 text-rose-400" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service by name, owner, or cluster..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Filters and View mode */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Environment Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Env:</span>
            <select
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">All Environments</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </div>

          {/* Health Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Health:</span>
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="ALL">All Health States</option>
              <option value="HEALTHY">Healthy</option>
              <option value="DEGRADED">Degraded</option>
              <option value="DOWN">Down</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md ${
                viewMode === "table"
                  ? "bg-slate-800 text-sky-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${
                viewMode === "grid"
                  ? "bg-slate-800 text-sky-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Services List / Grid */}
      {isLoading ? (
        <LoadingSpinner size="lg" message="Loading microservices registry..." />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title="No Services Found"
          description="No microservices matched your search and filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setEnvFilter("ALL");
            setHealthFilter("ALL");
          }}
        />
      ) : viewMode === "table" ? (
        <ServiceTable
          services={filteredServices}
          onSelectService={(srv) => setSelectedService(srv)}
        />
      ) : (
        <ServiceGrid
          services={filteredServices}
          onSelectService={(srv) => setSelectedService(srv)}
        />
      )}

      {/* Modals */}
      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onServiceCreated={(newSrv) => {
          setServices((prev) => [...prev, newSrv]);
        }}
      />

      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        onServiceUpdated={(updated) => {
          setServices((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
        }}
      />
    </div>
  );
}
