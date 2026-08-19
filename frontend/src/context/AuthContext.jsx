/**
 * CloudOpsAI - Authentication Context Provider
 * Manages JWT session, user profile, role permissions, and backend API status
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, getCurrentUser, logoutUser } from "../api/auth.js";
import {
  getAuthToken,
  setAuthToken,
  getApiBaseUrl,
  setApiBaseUrl,
  checkBackendHealth,
  subscribeToConnectionStatus,
} from "../api/client.js";

const DEFAULT_SRE_USER = {
  id: "usr-sre-01",
  username: "alex.mercer",
  email: "alex.mercer@cloudops.internal",
  role: "Lead SRE / DevOps Administrator",
  name: "Alex Mercer",
  organization: "Core Infrastructure SRE",
};

const DEFAULT_SRE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cloudops.usr-sre-01.demo";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    return getAuthToken() || DEFAULT_SRE_TOKEN;
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cloudops_user");
      return saved ? JSON.parse(saved) : DEFAULT_SRE_USER;
    } catch {
      return DEFAULT_SRE_USER;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [apiBaseUrl, setApiBaseUrlState] = useState(() => getApiBaseUrl());
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  // Check backend health periodically
  const pingBackend = useCallback(async () => {
    setIsCheckingBackend(true);
    try {
      const result = await checkBackendHealth();
      setIsBackendLive(result.online);
      return result;
    } catch {
      setIsBackendLive(false);
      return { online: false };
    } finally {
      setIsCheckingBackend(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToConnectionStatus((status) => {
      setIsBackendLive(status);
    });

    pingBackend();
    const interval = setInterval(pingBackend, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [pingBackend]);

  // Handle unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      setTokenState(null);
      setUser(null);
      localStorage.removeItem("cloudops_user");
      setAuthError("Your session expired. Please sign in again.");
    };

    window.addEventListener("cloudops:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("cloudops:unauthorized", handleUnauthorized);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      const savedToken = getAuthToken();
      if (savedToken) {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem("cloudops_user", JSON.stringify(currentUser));
          }
        } catch {
          // Keep existing user if offline
        }
      } else {
        // Set default demo session
        setAuthToken(DEFAULT_SRE_TOKEN);
        localStorage.setItem("cloudops_user", JSON.stringify(DEFAULT_SRE_USER));
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await loginUser(credentials);
      if (result && result.token) {
        setAuthToken(result.token);
        setTokenState(result.token);
        setUser(result.user);
        localStorage.setItem("cloudops_user", JSON.stringify(result.user));
        return { success: true };
      }
      throw new Error("Invalid login response");
    } catch (err) {
      setAuthError(err.message || "Failed to authenticate.");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (roleType = "sre_lead") => {
    setIsLoading(true);
    setAuthError(null);

    const profiles = {
      sre_lead: DEFAULT_SRE_USER,
      "Lead SRE": DEFAULT_SRE_USER,
      commander: {
        id: "usr-sre-02",
        username: "sarah.chen",
        email: "sarah.chen@cloudops.internal",
        role: "Incident Commander / DBA Lead",
        name: "Sarah Chen",
        organization: "Platform Reliability & Data Ops",
      },
      devops: {
        id: "usr-sre-03",
        username: "marcus.vance",
        email: "marcus.vance@cloudops.internal",
        role: "Principal Infrastructure Architect",
        name: "Marcus Vance",
        organization: "Cloud Architecture & Observability",
      },
      "DevOps Engineer": {
        id: "usr-sre-03",
        username: "elena.rostova",
        email: "elena.rostova@cloudops.internal",
        role: "DevOps & Kubernetes Engineer",
        name: "Elena Rostova",
        organization: "Cloud Infrastructure",
      },
    };

    const selected = profiles[roleType] || profiles.sre_lead;
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cloudops.${selected.id}.${Date.now()}`;

    setAuthToken(fakeToken);
    setTokenState(fakeToken);
    setUser(selected);
    localStorage.setItem("cloudops_user", JSON.stringify(selected));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } finally {
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
      localStorage.removeItem("cloudops_user");
      setIsLoading(false);
    }
  };

  const updateApiUrl = (url) => {
    setApiBaseUrl(url);
    setApiBaseUrlState(url);
    pingBackend();
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    authError,
    setAuthError,
    login,
    demoLogin,
    logout,
    apiBaseUrl,
    updateApiUrl,
    isBackendLive,
    isCheckingBackend,
    pingBackend,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
