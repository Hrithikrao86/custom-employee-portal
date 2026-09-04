const API_URL = "https://custom-employee-portal-i2xu.onrender.com/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getUsers() {
  return request("/admin/users");
}

export async function getAuditLogs() {
  return request("/admin/audit-logs");
}

export async function getPeople() {
  return request("/services/people");
}

export async function getCRM() {
  return request("/services/crm");
}

export async function getDesk() {
  return request("/services/desk");
}

export async function getBooks() {
  return request("/services/books");
}