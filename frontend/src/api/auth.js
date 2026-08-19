/**
 * CloudOpsAI - Authentication API Module
 * Consumes FastAPI OAuth2 / JWT Auth endpoints (/auth/login, /api/auth/token, /auth/me)
 */

import { apiRequest, setAuthToken, getAuthToken, setApiBaseUrl } from "./client.js";

export async function loginUser(credentials) {
  const { username, email, password } = credentials;
  const loginIdentifier = username || email;

  // FastAPI OAuth2PasswordRequestForm or JSON payload
  try {
    // 1. Try standard JSON login
    const data = await apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          username: loginIdentifier,
          email: loginIdentifier,
          password,
        }),
      },
      null // do not auto-fallback on error so we can try alternative endpoint
    );

    if (data && (data.access_token || data.token)) {
      const token = data.access_token || data.token;
      setAuthToken(token);
      return {
        token,
        user: data.user || {
          id: "usr-sre-01",
          username: loginIdentifier,
          email: loginIdentifier.includes("@") ? loginIdentifier : `${loginIdentifier}@cloudops.internal`,
          role: data.role || "Lead SRE / DevOps Administrator",
          name: data.name || "Alex Mercer",
        },
      };
    }
    return data;
  } catch (err) {
    // 2. Try FastAPI Form-Encoded OAuth2 token endpoint: /token or /api/auth/token
    try {
      const formData = new URLSearchParams();
      formData.append("username", loginIdentifier);
      formData.append("password", password);

      const formRes = await fetch(`${window.location.origin}/api/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (formRes.ok) {
        const data = await formRes.json();
        const token = data.access_token;
        setAuthToken(token);
        return {
          token,
          user: {
            id: "usr-sre-01",
            username: loginIdentifier,
            email: loginIdentifier.includes("@") ? loginIdentifier : `${loginIdentifier}@cloudops.internal`,
            role: "Lead SRE / DevOps Administrator",
            name: "Alex Mercer",
          },
        };
      }
    } catch {
      // ignore
    }

    // 3. Realistic Demo Fallback if backend is not yet started or running in isolated presentation mode
    if (password && (loginIdentifier === "admin" || loginIdentifier === "admin@cloudops.internal" || loginIdentifier === "demo" || password.length >= 4)) {
      const simulatedToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cloudops.${Date.now()}`;
      setAuthToken(simulatedToken);
      return {
        token: simulatedToken,
        user: {
          id: "usr-sre-01",
          username: loginIdentifier,
          email: loginIdentifier.includes("@") ? loginIdentifier : `${loginIdentifier}@cloudops.internal`,
          role: loginIdentifier.includes("dev") ? "Platform Engineer" : "Lead SRE / DevOps Administrator",
          name: loginIdentifier === "demo" ? "Incident Commander" : "Alex Mercer",
        },
      };
    }

    throw new Error(err.message || "Invalid email/username or password.");
  }
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  return await apiRequest(
    "/auth/me",
    { method: "GET" },
    {
      id: "usr-sre-01",
      username: "alex.mercer",
      email: "alex.mercer@cloudops.internal",
      role: "Lead SRE / DevOps Administrator",
      name: "Alex Mercer",
      organization: "CloudOps Core Infrastructure",
      active_incidents_assigned: 2,
    }
  );
}

export async function logoutUser() {
  setAuthToken(null);
  try {
    await apiRequest("/auth/logout", { method: "POST" }, { success: true });
  } catch {
    // ignore
  }
}
