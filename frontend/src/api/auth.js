/**
 * CloudOpsAI - Authentication API
 *
 * Backend:
 * POST /api/auth/login
 * Content-Type: application/x-www-form-urlencoded
 */

import {
  apiRequest,
  setAuthToken,
  getAuthToken,
} from "./client.js";


export async function loginUser(credentials) {
  const { username, email, password } = credentials;

  const loginIdentifier = username || email;

  if (!loginIdentifier || !password) {
    throw new Error("Username/email and password are required.");
  }

  const formData = new URLSearchParams();

  formData.append("username", loginIdentifier);
  formData.append("password", password);

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Invalid username/email or password."
    );
  }

  const token = data.access_token;

  if (!token) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  setAuthToken(token);

  return {
    token,
    user: data.user || null,
  };
}


export async function getCurrentUser() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  return await apiRequest(
    "/auth/me",
    {
      method: "GET",
    }
  );
}


export async function logoutUser() {
  setAuthToken(null);
}