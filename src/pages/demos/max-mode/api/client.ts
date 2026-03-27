import { API_BASE_URL, CRUD_API_BASE_URL, API_AUTH_HEADERS } from "../constants";

async function readErrorBody(response: Response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function mergeHeaders(init?: RequestInit, baseUrl?: string): Record<string, string> {
  const existing = (init?.headers as Record<string, string>) || {};
  // Add auth headers for API_BASE_URL (d912 rest connector) calls
  if (!baseUrl || baseUrl === API_BASE_URL) {
    return { ...API_AUTH_HEADERS, ...existing };
  }
  return existing;
}

export async function apiFetchJson<T>(path: string, init?: RequestInit, baseUrl = API_BASE_URL): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: mergeHeaders(init, baseUrl) });
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(`Request failed (${response.status}): ${body || response.statusText}`);
  }
  return (await response.json()) as T;
}

export async function apiFetchOk(path: string, init?: RequestInit, baseUrl = API_BASE_URL): Promise<void> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: mergeHeaders(init, baseUrl) });
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(`Request failed (${response.status}): ${body || response.statusText}`);
  }
}

export function apiFetchResponse(path: string, init?: RequestInit, baseUrl = API_BASE_URL) {
  return fetch(`${baseUrl}${path}`, { ...init, headers: mergeHeaders(init, baseUrl) });
}

export { CRUD_API_BASE_URL };
