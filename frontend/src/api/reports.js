/**
 * CloudOpsAI - Post-Mortem & Reliability Reports API Module
 * Consumes FastAPI /reports and PostgreSQL Report models
 */

import { apiRequest } from "./client.js";
import { MOCK_REPORTS, MOCK_INCIDENTS, MOCK_AI_ANALYSES } from "../data/mockData.js";

let localReports = [...MOCK_REPORTS];

export async function getReports() {
  return await apiRequest(
    "/reports",
    { method: "GET" },
    () => {
      return {
        metrics: {
          uptime_pct: 99.98,
          mttr_minutes: 24.5,
          total_incidents_30d: 8,
          sev1_count: 2,
        },
        service_slas: [
          { service: "payment-gateway", slo_target: "99.99%", actual_uptime: "99.94%", error_budget_remaining: 68 },
          { service: "auth-service", slo_target: "99.95%", actual_uptime: "99.98%", error_budget_remaining: 92 },
          { service: "orders-api", slo_target: "99.90%", actual_uptime: "99.96%", error_budget_remaining: 85 },
          { service: "inventory-db", slo_target: "99.99%", actual_uptime: "99.99%", error_budget_remaining: 98 },
          { service: "notification-hub", slo_target: "99.50%", actual_uptime: "99.82%", error_budget_remaining: 88 },
        ],
        reports: [...localReports],
      };
    }
  );
}

export async function getReportById(id) {
  return await apiRequest(
    `/reports/${id}`,
    { method: "GET" },
    () => {
      return localReports.find((r) => r.id === id) || localReports[0];
    }
  );
}

export async function getPostmortem(incidentId) {
  return await apiRequest(
    `/reports/postmortem/${incidentId}`,
    { method: "GET" },
    () => {
      const incident = MOCK_INCIDENTS.find((i) => i.id === incidentId) || MOCK_INCIDENTS[0];
      const aiAnalysis = MOCK_AI_ANALYSES[incidentId] || MOCK_AI_ANALYSES[incident.id] || MOCK_AI_ANALYSES["INC-4092"];

      return {
        incident_id: incident.id,
        title: incident.title,
        service_name: incident.service_name,
        severity: incident.severity,
        commander: incident.commander || "Alex Mercer (Lead SRE)",
        duration: `${incident.duration_minutes || 42} minutes`,
        incident_date: incident.started_at,
        summary: `On ${new Date(incident.started_at).toLocaleDateString()}, the ${incident.service_name} experienced critical degradation leading to degraded response times and an elevated 5xx error rate. The incident was detected within 45 seconds via Prometheus anomaly alerts. Incident Commander initiated triage and leveraged NVIDIA AI Root Cause Analysis to isolate the failure domain.`,
        root_cause: aiAnalysis ? aiAnalysis.root_cause : "Cascading connection timeout caused by database pool lock starvation and missing query index.",
        action_items: [
          { task: "Configure pgBouncer connection pool max client limit to 1000", owner: "DevOps / SRE", status: "DONE" },
          { task: "Deploy index on transactions(account_id, created_at) migration", owner: "Database Team", status: "DONE" },
          { task: "Add Prometheus alert for pool utilization > 80% for 2m", owner: "Alex Mercer", status: "IN_PROGRESS" },
          { task: "Conduct load testing on staging at 2.5x peak QPS", owner: "QA Engineering", status: "PENDING" },
        ]
      };
    }
  );
}

export async function generateIncidentReport(incidentId) {
  return await apiRequest(
    `/reports/generate/${incidentId}`,
    { method: "POST" },
    () => {
      const incident = MOCK_INCIDENTS.find((i) => i.id === incidentId) || MOCK_INCIDENTS[0];
      const aiAnalysis = MOCK_AI_ANALYSES[incidentId] || MOCK_AI_ANALYSES["INC-4092"];

      const newReport = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        incident_id: incident.id,
        title: `Post-Mortem: ${incident.title}`,
        service_name: incident.service_name,
        severity: incident.severity,
        incident_duration_minutes: incident.duration_minutes || 45,
        total_impacted_requests: 18400,
        generated_at: new Date().toISOString(),
        author: "CloudOpsAI Automated SRE Reporter",
        status: "DRAFT",
        root_cause: aiAnalysis.root_cause || "Root cause identified via telemetry correlation.",
        evidence_summary: aiAnalysis.summary || "System logs and metrics analyzed.",
        resolution: "Immediate mitigation applied by Incident Commander. Preventative actions recorded.",
        preventive_actions: [
          "Deploy automated canary validation on staging prior to production cutover.",
          "Implement connection pool health watchdog with auto-drain.",
          "Review database indexing strategy for high-frequency transactions."
        ]
      };

      localReports.unshift(newReport);
      return newReport;
    }
  );
}
