/**
 * CloudOpsAI - Incidents API Module
 * Consumes FastAPI /incidents, /incident-events, and related incident telemetry
 */

import { apiRequest } from "./client.js";
import {
  MOCK_INCIDENTS,
  MOCK_INCIDENT_TIMELINES,
  MOCK_LOGS,
  MOCK_AI_ANALYSES
} from "../data/mockData.js";

let localIncidents = [...MOCK_INCIDENTS];
let localTimelines = { ...MOCK_INCIDENT_TIMELINES };

export async function getIncidents(params = {}) {
  const query = new URLSearchParams();
  if (params.severity && params.severity !== "ALL") query.append("severity", params.severity);
  if (params.status && params.status !== "ALL") query.append("status", params.status);
  if (params.service_id && params.service_id !== "ALL") query.append("service_id", params.service_id);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString() ? `?${query.toString()}` : "";

  return await apiRequest(
    `/incidents${queryString}`,
    { method: "GET" },
    () => {
      let filtered = [...localIncidents];

      if (params.severity && params.severity !== "ALL") {
        filtered = filtered.filter(
          (i) => i.severity.toUpperCase() === params.severity.toUpperCase()
        );
      }

      if (params.status && params.status !== "ALL") {
        filtered = filtered.filter(
          (i) => i.status.toUpperCase() === params.status.toUpperCase()
        );
      }

      if (params.service_id && params.service_id !== "ALL") {
        filtered = filtered.filter(
          (i) => i.service_id === params.service_id || i.service_name === params.service_id
        );
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.id.toLowerCase().includes(q) ||
            i.service_name.toLowerCase().includes(q) ||
            (i.description && i.description.toLowerCase().includes(q))
        );
      }

      return filtered;
    }
  );
}

export async function getIncidentById(id) {
  return await apiRequest(
    `/incidents/${id}`,
    { method: "GET" },
    () => {
      const inc = localIncidents.find((i) => i.id === id) || localIncidents[0];
      const timeline = localTimelines[id] || localTimelines[inc.id] || localTimelines["INC-4092"] || [];
      const aiAnalysis = MOCK_AI_ANALYSES[id] || MOCK_AI_ANALYSES[inc.id] || MOCK_AI_ANALYSES["INC-4092"];

      return {
        ...inc,
        timeline_events: timeline,
        ai_analysis: aiAnalysis,
      };
    }
  );
}

export async function createIncident(incidentData) {
  return await apiRequest(
    "/incidents",
    {
      method: "POST",
      body: JSON.stringify(incidentData),
    },
    () => {
      const newId = `INC-${4090 + localIncidents.length + 1}`;
      const newInc = {
        id: newId,
        title: incidentData.title,
        service_id: incidentData.service_id || "srv-payment",
        service_name: incidentData.service_name || "payment-gateway",
        environment: incidentData.environment || "production",
        severity: incidentData.severity || "HIGH",
        status: incidentData.status || "OPEN",
        started_at: new Date().toISOString(),
        resolved_at: null,
        duration_minutes: 0,
        commander: incidentData.commander || "Alex Mercer (Lead SRE)",
        description: incidentData.description || "Incident declared manually from CloudOpsAI portal.",
        impact: incidentData.impact || "Under active triage.",
        ai_analysis_id: null,
        events_count: 1,
        logs_count: 12,
      };

      localIncidents.unshift(newInc);

      localTimelines[newId] = [
        {
          id: `evt-${Date.now()}`,
          event_type: "INCIDENT_TRIGGERED",
          timestamp: new Date().toISOString(),
          actor: incidentData.commander || "SRE Operator",
          title: "Incident Declared & War-Room Initialized",
          details: incidentData.description || "Incident declared manually.",
          severity: incidentData.severity || "HIGH",
        },
      ];

      return newInc;
    }
  );
}

export async function updateIncident(id, updateData) {
  return await apiRequest(
    `/incidents/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updateData),
    },
    () => {
      const idx = localIncidents.findIndex((i) => i.id === id);
      if (idx !== -1) {
        const isResolved = updateData.status && updateData.status.toUpperCase() === "RESOLVED";
        localIncidents[idx] = {
          ...localIncidents[idx],
          ...updateData,
          resolved_at: isResolved ? new Date().toISOString() : (updateData.resolved_at !== undefined ? updateData.resolved_at : localIncidents[idx].resolved_at),
        };

        if (updateData.status) {
          if (!localTimelines[id]) localTimelines[id] = [];
          localTimelines[id].push({
            id: `evt-${Date.now()}`,
            event_type: isResolved ? "INCIDENT_RESOLVED" : "STATUS_UPDATED",
            timestamp: new Date().toISOString(),
            actor: "SRE Incident Commander",
            title: `Status Changed to ${updateData.status.toUpperCase()}`,
            details: `Incident triage state shifted to ${updateData.status.toUpperCase()}.`,
            severity: isResolved ? "INFO" : "HIGH",
          });
        }

        return getIncidentById(id);
      }
      return { id, ...updateData };
    }
  );
}

export async function updateIncidentStatus(id, newStatus) {
  return await updateIncident(id, { status: newStatus });
}

export async function getIncidentEvents(incidentId) {
  return await apiRequest(
    `/incidents/${incidentId}/events`,
    { method: "GET" },
    () => {
      return (
        localTimelines[incidentId] ||
        localTimelines["INC-4092"] || []
      );
    }
  );
}

export async function addIncidentEvent(incidentId, eventData) {
  return await apiRequest(
    `/incidents/${incidentId}/events`,
    {
      method: "POST",
      body: JSON.stringify(eventData),
    },
    () => {
      const newEvt = {
        id: `evt-${Date.now()}`,
        event_type: eventData.event_type || "INVESTIGATION_UPDATE",
        timestamp: new Date().toISOString(),
        actor: eventData.actor || "SRE Investigator",
        title: eventData.title || "Timeline Note Added",
        details: eventData.details || "",
        severity: eventData.severity || "INFO",
      };

      if (!localTimelines[incidentId]) localTimelines[incidentId] = [];
      localTimelines[incidentId].push(newEvt);
      return newEvt;
    }
  );
}

export async function addIncidentTimelineEvent(incidentId, eventData) {
  await addIncidentEvent(incidentId, eventData);
  return await getIncidentById(incidentId);
}

export async function getIncidentLogs(incidentId) {
  return await apiRequest(
    `/incidents/${incidentId}/logs`,
    { method: "GET" },
    () => {
      const inc = localIncidents.find((i) => i.id === incidentId);
      const serviceName = inc ? inc.service_name : null;
      if (serviceName) {
        return MOCK_LOGS.filter((l) => l.service === serviceName || l.level === "CRITICAL");
      }
      return MOCK_LOGS.slice(0, 5);
    }
  );
}
