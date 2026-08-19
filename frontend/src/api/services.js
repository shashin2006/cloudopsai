/**
 * CloudOpsAI - Services API Module
 * Interacts with FastAPI /services endpoints and PostgreSQL Service model
 */

import { apiRequest } from "./client.js";
import { MOCK_SERVICES, MOCK_LOGS, MOCK_INCIDENTS } from "../data/mockData.js";

// In-memory runtime cache for seamless client-side mutations during demo mode
let localServices = [...MOCK_SERVICES];

export async function getServices(params = {}) {
  const query = new URLSearchParams();
  if (params.environment && params.environment !== "ALL") query.append("environment", params.environment);
  if (params.health_status && params.health_status !== "ALL") query.append("health_status", params.health_status);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString() ? `?${query.toString()}` : "";

  return await apiRequest(
    `/services${queryString}`,
    { method: "GET" },
    () => {
      let filtered = [...localServices];
      if (params.environment && params.environment !== "ALL") {
        filtered = filtered.filter(
          (s) => s.environment.toLowerCase() === params.environment.toLowerCase()
        );
      }
      if (params.health_status && params.health_status !== "ALL") {
        filtered = filtered.filter(
          (s) => s.health_status.toUpperCase() === params.health_status.toUpperCase()
        );
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.owner.toLowerCase().includes(q) ||
            (s.description && s.description.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  );
}

export async function getServiceById(id) {
  return await apiRequest(
    `/services/${id}`,
    { method: "GET" },
    () => {
      return localServices.find((s) => s.id === id || s.name === id) || localServices[0];
    }
  );
}

export async function createService(serviceData) {
  return await apiRequest(
    "/services",
    {
      method: "POST",
      body: JSON.stringify(serviceData),
    },
    () => {
      const newService = {
        id: `srv-${Date.now().toString().slice(-4)}`,
        name: serviceData.name,
        environment: serviceData.environment || "production",
        owner: serviceData.owner || "Platform Engineering",
        health_status: serviceData.health_status || "HEALTHY",
        uptime: "100.0%",
        latency_ms: serviceData.latency_ms || 24,
        error_rate: "0.00%",
        version: serviceData.version || "v1.0.0",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: serviceData.description || "",
        cluster: serviceData.cluster || "k8s-prod-us-east-1",
        replicas: serviceData.replicas || "3/3",
        endpoint: serviceData.endpoint || `https://${serviceData.name}.cloudops.internal`,
      };
      localServices.unshift(newService);
      return newService;
    }
  );
}

export async function updateService(id, updateData) {
  return await apiRequest(
    `/services/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updateData),
    },
    () => {
      const idx = localServices.findIndex((s) => s.id === id);
      if (idx !== -1) {
        localServices[idx] = {
          ...localServices[idx],
          ...updateData,
          updated_at: new Date().toISOString(),
        };
        return localServices[idx];
      }
      return updateData;
    }
  );
}

export async function deleteService(id) {
  return await apiRequest(
    `/services/${id}`,
    { method: "DELETE" },
    () => {
      localServices = localServices.filter((s) => s.id !== id);
      return { success: true, id };
    }
  );
}

export async function getServiceRelatedData(serviceNameOrId) {
  const service = localServices.find((s) => s.id === serviceNameOrId || s.name === serviceNameOrId);
  const name = service ? service.name : serviceNameOrId;

  const logs = MOCK_LOGS.filter((l) => l.service === name);
  const incidents = MOCK_INCIDENTS.filter((i) => i.service_name === name || i.service_id === serviceNameOrId);

  return {
    service,
    logs,
    incidents,
  };
}
