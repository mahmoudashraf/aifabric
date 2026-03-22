import { API_BASE_URL, CRUD_API_BASE_URL } from "../constants";

async function readErrorBody(response: Response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

export async function apiFetchJson<T>(path: string, init?: RequestInit, baseUrl = API_BASE_URL): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, init);
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(`Request failed (${response.status}): ${body || response.statusText}`);
  }
  return (await response.json()) as T;
}

export async function apiFetchOk(path: string, init?: RequestInit, baseUrl = API_BASE_URL): Promise<void> {
  const response = await fetch(`${baseUrl}${path}`, init);
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(`Request failed (${response.status}): ${body || response.statusText}`);
  }
}

export function apiFetchResponse(path: string, init?: RequestInit, baseUrl = API_BASE_URL) {
  return fetch(`${baseUrl}${path}`, init);
}

export { CRUD_API_BASE_URL };
