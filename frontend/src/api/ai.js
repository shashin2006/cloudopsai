/**
 * CloudOpsAI - AI Operational Intelligence & Root Cause Analysis Module
 * Communicates with FastAPI /ai-analysis endpoints powered by NVIDIA Hosted LLM Engine
 */

import { apiRequest } from "./client.js";
import { MOCK_AI_ANALYSES } from "../data/mockData.js";

let localAIAnalyses = { ...MOCK_AI_ANALYSES };

export async function getAIAnalysisByIncidentId(incidentId) {
  return await apiRequest(
    `/incidents/${incidentId}/ai-analysis`,
    { method: "GET" },
    () => {
      return (
        localAIAnalyses[incidentId] ||
        localAIAnalyses["INC-4092"] || {
          id: `ai-${incidentId}`,
          incident_id: incidentId,
          model_name: "NVIDIA-hosted Llama-3.3-70B-Instruct SRE",
          confidence_score: 87,
          created_at: new Date().toISOString(),
          summary: `Automated root cause analysis completed for ${incidentId}. Correlated log error bursts with recent infrastructure metrics.`,
          root_cause: "High latency spikes detected across upstream container network interface causing cascading connection queue overflows.",
          confidence_reasons: [
            "Log frequency matching 5xx error rate surge.",
            "Container CPU throttling aligned with request queuing."
          ],
          evidence: [
            {
              type: "METRIC_ANOMALY",
              source: "container_cpu_utilization",
              details: "CPU usage peaked above 95% threshold for 8 consecutive scraping intervals."
            }
          ],
          recommended_actions: [
            {
              step: 1,
              title: "Scale Horizontal Pod Autoscaler (HPA)",
              command: "kubectl scale deployment --replicas=12",
              description: "Increase pod replicas to distribute ingress traffic volume.",
              category: "SCALING",
              status: "PENDING"
            }
          ]
        }
      );
    }
  );
}

export async function getLatestAIAnalysis() {
  return await apiRequest(
    "/ai/latest",
    { method: "GET" },
    () => {
      const all = Object.values(localAIAnalyses);
      return all[0] || MOCK_AI_ANALYSES["INC-4092"];
    }
  );
}

export async function triggerAIAnalysis(incidentId, incidentContext = {}) {
  return await apiRequest(
    `/incidents/${incidentId}/ai-analyze`,
    {
      method: "POST",
      body: JSON.stringify(incidentContext),
    },
    async () => {
      // Simulate NVIDIA LLM thinking delay for realistic SRE UX
      await new Promise((r) => setTimeout(r, 600));

      const existing = localAIAnalyses[incidentId] || localAIAnalyses["INC-4092"];
      const updated = {
        ...existing,
        incident_id: incidentId,
        id: `ai-${incidentId}-${Date.now().toString().slice(-4)}`,
        created_at: new Date().toISOString(),
        confidence_score: Math.min(98, Math.max(88, (existing.confidence_score || 90) + Math.floor(Math.random() * 5) - 2)),
      };

      localAIAnalyses[incidentId] = updated;
      return updated;
    }
  );
}

export async function getHistoricalAIAnalyses() {
  return await apiRequest(
    "/ai/analyses",
    { method: "GET" },
    () => {
      return Object.values(localAIAnalyses);
    }
  );
}

export async function getAllAIAnalyses() {
  return await getHistoricalAIAnalyses();
}

export async function runAdHocDiagnosis(logs, serviceName = "generic-service") {
  return await apiRequest(
    "/ai/ad-hoc-diagnose",
    {
      method: "POST",
      body: JSON.stringify({ logs, serviceName }),
    },
    async () => {
      await new Promise((r) => setTimeout(r, 700));

      return {
        id: `adhoc-${Date.now()}`,
        service_name: serviceName,
        model_name: "NVIDIA-hosted Llama-3.3-70B-Instruct",
        confidence_score: 94,
        created_at: new Date().toISOString(),
        summary: `Parsed telemetry log stream for ${serviceName}. Detected Redis cache disconnection timeout cascading to HTTP 503 circuit-breaker trip.`,
        root_cause: `Redis node connection timeout (5000ms) on cluster member node-03 causing session store lock starvation.`,
        recommended_actions: [
          {
            step: 1,
            title: "Failover Redis Sentinel Node",
            category: "DATABASE",
            description: "Trigger Sentinel master failover to promote replica node-01 to master.",
            command: "redis-cli -h redis-cluster-node-03 -p 26379 SENTINEL failover mymaster",
            status: "PENDING"
          }
        ]
      };
    }
  );
}

export async function getAIOperationalMetrics() {
  return await apiRequest(
    "/ai/metrics",
    { method: "GET" },
    () => {
      return {
        total_analyses: 48,
        avg_confidence: 91.2,
        accuracy_rating: "96.4%",
        time_saved_hours: 142,
        recurring_patterns: [
          { pattern: "Database Connection Pool Starvation", count: 18, severity: "CRITICAL", avgConfidence: 94 },
          { pattern: "Kubernetes OOMKilled Memory Spike", count: 12, severity: "HIGH", avgConfidence: 91 },
          { pattern: "TLS / SSL Certificate Renewal Flapping", count: 9, severity: "MEDIUM", avgConfidence: 89 },
          { pattern: "Redis Cache Eviction Thrashing", count: 5, severity: "LOW", avgConfidence: 86 },
          { pattern: "Ingress 504 Gateway Timeout Cascade", count: 4, severity: "HIGH", avgConfidence: 92 },
        ]
      };
    }
  );
}
