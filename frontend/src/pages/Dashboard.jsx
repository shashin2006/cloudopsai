/**
 * CloudOpsAI - Main SRE Operations Dashboard
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  AlertOctagon,
  Terminal,
  Cpu,
  Plus,
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
  ShieldAlert,
  Server,
  FileText,
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard.jsx";
import { ServiceHealth } from "../components/dashboard/ServiceHealth.jsx";
import { IncidentOverview } from "../components/dashboard/IncidentOverview.jsx";
import { AIInsightsCard } from "../components/dashboard/AIInsightsCard.jsx";
import { RecentActivity } from "../components/dashboard/RecentActivity.jsx";
import { IncidentMetricsChart } from "../components/dashboard/IncidentMetricsChart.jsx";
import { Button } from "../components/common/Button.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { CreateIncidentModal } from "../components/incidents/CreateIncidentModal.jsx";
import { CreateServiceModal } from "../components/services/CreateServiceModal.jsx";
import { ServiceDetailModal } from "../components/services/ServiceDetailModal.jsx";
import { getServices } from "../api/services.js";
import { getIncidents } from "../api/incidents.js";
import { getLatestAIAnalysis } from "../api/ai.js";
import { useToast } from "../context/ToastContext.jsx";

export function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [srvList, incList, aiData] = await Promise.all([
        getServices(),
        getIncidents(),
        getLatestAIAnalysis(),
      ]);
      setServices(srvList || []);
      setIncidents(incList || []);
      setLatestAnalysis(aiData || null);
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed to load dashboard telemetry",
        message: err.message,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const healthyServicesCount = services.filter((s) => s.health_status === "HEALTHY").length;
  const criticalIncidentsCount = incidents.filter(
    (i) => i.severity === "CRITICAL" && i.status !== "RESOLVED"
  ).length;
  const activeIncidents = incidents.filter((i) => i.status !== "RESOLVED");

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" message="Ingesting cloud telemetry & microservice mesh..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <span>SRE Operations Center</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              99.98% Uptime SLA
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time infrastructure health, AI incident triage, and observability correlation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={loadDashboardData}
          >
            Refresh
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateServiceOpen(true)}
          >
            Register Service
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={AlertOctagon}
            onClick={() => setIsCreateIncidentOpen(true)}
          >
            Declare Incident
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Services"
          value={services.length}
          subtitle={`${healthyServicesCount} of ${services.length} fully healthy`}
          icon={Layers}
          variant="sky"
          trend={{ direction: "up", label: "100% active mesh", isPositive: true }}
          onClick={() => navigate("/services")}
        />

        <StatCard
          title="Active Incidents"
          value={activeIncidents.length}
          subtitle={`${criticalIncidentsCount} Critical Sev-1 requiring triage`}
          icon={AlertOctagon}
          variant={criticalIncidentsCount > 0 ? "rose" : "amber"}
          trend={{
            direction: criticalIncidentsCount > 0 ? "up" : "down",
            label: `${activeIncidents.length} in war-room`,
            isPositive: criticalIncidentsCount === 0,
          }}
          onClick={() => navigate("/incidents")}
        />

        <StatCard
          title="Telemetry Ingested (24h)"
          value="1.68M"
          subtitle="4.2% error / exception rate"
          icon={Terminal}
          variant="indigo"
          trend={{ direction: "up", label: "+14% query traffic", isPositive: true }}
          onClick={() => navigate("/logs")}
        />

        <StatCard
          title="AI Diagnoses Generated"
          value="93%"
          subtitle="NVIDIA Llama-3.3-70B confidence"
          icon={Cpu}
          variant="emerald"
          trend={{ direction: "up", label: "Automated Root Cause", isPositive: true }}
          onClick={() => navigate("/ai-insights")}
        />
      </div>

      {/* AI Root Cause Highlight Card */}
      {latestAnalysis && (
        <AIInsightsCard
          analysis={latestAnalysis}
          onInvestigate={() => navigate(`/incidents/${latestAnalysis.incident_id}`)}
        />
      )}

      {/* Observability Visualizer & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncidentMetricsChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Service Health Matrix & Active Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServiceHealth
          services={services}
          onSelectService={(srv) => setSelectedService(srv)}
        />
        <IncidentOverview incidents={incidents} />
      </div>

      {/* Modals */}
      <CreateIncidentModal
        isOpen={isCreateIncidentOpen}
        onClose={() => setIsCreateIncidentOpen(false)}
        services={services}
        onIncidentCreated={(newInc) => {
          setIncidents((prev) => [newInc, ...prev]);
        }}
      />

      <CreateServiceModal
        isOpen={isCreateServiceOpen}
        onClose={() => setIsCreateServiceOpen(false)}
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
