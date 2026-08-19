/**
 * CloudOpsAI - Unified API Client Layer
 * Handles authentication headers, configurable base URL, timeout, error formatting,
 * and resilient isolated fallback when the FastAPI backend is running offline or in demo mode.
 */

import {
  MOCK_SERVICES,
  MOCK_INCIDENTS,
  MOCK_INCIDENT_TIMELINES,
  MOCK_AI_ANALYSES,
  MOCK_LOGS,
  MOCK_REPORTS
} from "../data/mockData.js";

const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

export function getApiBaseUrl() {
  return localStorage.getItem("cloudops_api_base_url") || DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(url) {
  if (url) {
    localStorage.setItem("cloudops_api_base_url", url);
  } else {
    localStorage.removeItem("cloudops_api_base_url");
  }
}

export function getAuthToken() {
  return localStorage.getItem("cloudops_auth_token") || null;
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("cloudops_auth_token", token);
  } else {
    localStorage.removeItem("cloudops_auth_token");
  }
}

// Global backend connectivity status listener
let backendConnected = false;
const connectionListeners = new Set();

export function isBackendConnected() {
  return backendConnected;
}

export function subscribeToConnectionStatus(listener) {
  connectionListeners.add(listener);
  listener(backendConnected);
  return () => connectionListeners.delete(listener);
}

function notifyConnectionStatus(status) {
  if (backendConnected !== status) {
    backendConnected = status;
    connectionListeners.forEach((fn) => fn(status));
  }
}

/**
 * Check backend health via /health or /api/health endpoint
 */
export async function checkBackendHealth() {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    }).catch(async () => {
      return await fetch(`${baseUrl}/api/health`, {
        method: "GET",
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);
    if (res && res.ok) {
      notifyConnectionStatus(true);
      return { online: true, baseUrl, status: res.status };
    }
    notifyConnectionStatus(false);
    return { online: false, baseUrl, error: `Status ${res ? res.status : "No response"}` };
  } catch (err) {
    notifyConnectionStatus(false);
    return { online: false, baseUrl, error: err.message || "Connection refused" };
  }
}

/**
 * Generic request wrapper with Auth header & mock fallback
 */
export async function apiRequest(endpoint, options = {}, fallbackData = null) {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    notifyConnectionStatus(true);

    if (response.status === 401) {
      // Unauthorized or expired token
      setAuthToken(null);
      window.dispatchEvent(new CustomEvent("cloudops:unauthorized"));
      throw new Error("Session expired or unauthorized. Please sign in again.");
    }

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.detail || errorJson.message || errorMessage;
      } catch {
        // text body
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    // If backend is unreachable or not implemented yet, use fallback data gracefully
    const isNetworkError =
      err.name === "AbortError" ||
      err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError") ||
      err.message.includes("Connection refused") ||
      err.message.includes("404");

    if (isNetworkError && fallbackData !== null) {
      notifyConnectionStatus(false);
      // Simulate light async delay for realistic UX
      await new Promise((r) => setTimeout(r, 120));
      return typeof fallbackData === "function" ? fallbackData() : fallbackData;
    }

    throw err;
  }
}
