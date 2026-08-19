/**
 * CloudOpsAI - Observability Log Explorer Page
 */

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Terminal, Download, RefreshCw, Layers, ShieldAlert, Sparkles, Filter } from "lucide-react";
import { LogTable } from "../components/logs/LogTable.jsx";
import { LogFilters } from "../components/logs/LogFilters.jsx";
import { LogDetailsModal } from "../components/logs/LogDetailsModal.jsx";
import { Button } from "../components/common/Button.jsx";
import { LoadingSpinner } from "../components/common/LoadingSpinner.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { getLogs } from "../api/logs.js";
import { getServices } from "../api/services.js";
import { useToast } from "../context/ToastContext.jsx";

export function Logs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "ALL";

  const [logs, setLogs] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    level: "ALL",
    service: initialService,
    timeRange: "all",
    limit: 50,
    offset: 0,
  });

  const { addToast } = useToast();
  const streamIntervalRef = useRef(null);

  useEffect(() => {
    loadServices();
    loadLogs(filters);
  }, []);

  // Update when URL service param changes
  useEffect(() => {
    const srv = searchParams.get("service");
    if (srv && srv !== filters.service) {
      setFilters((prev) => ({ ...prev, service: srv }));
      loadLogs({ ...filters, service: srv });
    }
  }, [searchParams]);

  // Live Auto-Stream Interval
  useEffect(() => {
    if (isAutoRefresh) {
      streamIntervalRef.current = setInterval(() => {
        // Silently poll/simulate incoming telemetry stream
        loadLogs(filters, true);
      }, 4000);
    } else {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    }

    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [isAutoRefresh, filters]);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLogs = async (currentFilters, isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const data = await getLogs(currentFilters);
      const safeData = Array.isArray(data) ? data : (data?.items || []);
      setLogs(safeData);
    } catch (err) {
      if (!isSilent) {
        addToast({
          type: "error",
          title: "Failed to Fetch Logs",
          message: err.message,
        });
      }
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadLogs(newFilters);
  };

  const exportLogsAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cloudops-logs-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast({
      type: "success",
      title: "Logs Exported",
      message: `Downloaded ${logs.length} telemetry records in JSON format.`,
    });
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <span>Observability Log Explorer</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono font-bold">
              {safeLogs.length} RECORDS INGESTED
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stdout/stderr stream, structured JSON traces, and exception logs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={exportLogsAsJSON}
            disabled={safeLogs.length === 0}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <LogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        services={services}
        isAutoRefresh={isAutoRefresh}
        setIsAutoRefresh={setIsAutoRefresh}
        onRefresh={() => loadLogs(filters)}
        isLoading={isLoading}
      />

      {/* Log Console Table */}
      {isLoading ? (
        <LoadingSpinner size="lg" message="Streaming telemetry logs from mesh..." />
      ) : safeLogs.length === 0 ? (
        <EmptyState
          title="No Logs Matching Filters"
          description="Try broadening your search query or selecting 'ALL' services / log levels."
          actionLabel="Reset Filters"
          onAction={() =>
            handleFilterChange({
              search: "",
              level: "ALL",
              service: "ALL",
              timeRange: "all",
              limit: 50,
              offset: 0,
            })
          }
        />
      ) : (
        <div className="space-y-3">
          <LogTable
            logs={safeLogs}
            onSelectLog={(log) => setSelectedLog(log)}
            selectedLogId={selectedLog?.id}
          />

          {/* Footer stats */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
            <span>
              Showing {safeLogs.length} logs • Ingestion latency: ~12ms
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAutoRefresh ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{isAutoRefresh ? "Active Polling Stream" : "Stream Paused"}</span>
            </span>
          </div>
        </div>
      )}

      {/* Log Details Modal */}
      <LogDetailsModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        onFilterService={(serviceName) => {
          handleFilterChange({ ...filters, service: serviceName });
        }}
      />
    </div>
  );
}
