/**
 * CloudOpsAI - Logs Observability API Module
 * Consumes FastAPI /logs endpoints with deep filtering, pagination & JSON metadata parsing
 */

import { apiRequest } from "./client.js";
import { MOCK_LOGS } from "../data/mockData.js";

let localLogs = [...MOCK_LOGS];

export async function getLogs(params = {}) {
  const query = new URLSearchParams();
  if (params.service && params.service !== "ALL") query.append("service", params.service);
  if (params.level && params.level !== "ALL") query.append("level", params.level);
  if (params.search) query.append("search", params.search);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.offset) query.append("offset", String(params.offset));

  const queryString = query.toString() ? `?${query.toString()}` : "";

  return await apiRequest(
    `/logs${queryString}`,
    { method: "GET" },
    () => {
      let filtered = [...localLogs];

      if (params.service && params.service !== "ALL") {
        filtered = filtered.filter((l) => l.service === params.service);
      }

      if (params.level && params.level !== "ALL") {
        filtered = filtered.filter((l) => l.level.toUpperCase() === params.level.toUpperCase());
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.message.toLowerCase().includes(q) ||
            l.source.toLowerCase().includes(q) ||
            l.service.toLowerCase().includes(q) ||
            JSON.stringify(l.metadata || {}).toLowerCase().includes(q)
        );
      }

      const limit = params.limit || 50;
      const offset = params.offset || 0;
      const items = filtered.slice(offset, offset + limit);

      return items;
    }
  );
}

export async function getLogById(id) {
  return await apiRequest(
    `/logs/${id}`,
    { method: "GET" },
    () => {
      return localLogs.find((l) => l.id === id) || localLogs[0];
    }
  );
}

export async function createLog(logData) {
  return await apiRequest(
    "/logs",
    {
      method: "POST",
      body: JSON.stringify(logData),
    },
    () => {
      const newLog = {
        id: `log-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        level: logData.level || "INFO",
        service: logData.service || "unknown-service",
        source: logData.source || "application.general",
        message: logData.message || "",
        metadata: logData.metadata || {},
      };
      localLogs.unshift(newLog);
      return newLog;
    }
  );
}
