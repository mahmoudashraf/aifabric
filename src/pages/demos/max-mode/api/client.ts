import { API_BASE_URL } from "../constants";

async function readErrorBody(response: Response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

export async function apiFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(`Request failed (${response.status}): ${body || response.statusText}`);
  }
  return (await response.json()) as T;
}

export async function apiFetchOk(path: string, init?: RequestInit): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(`Request failed (${response.status}): ${body || response.statusText}`);
  }
}

export function apiFetchResponse(path: string, init?: RequestInit) {
  return fetch(`${API_BASE_URL}${path}`, init);
}
