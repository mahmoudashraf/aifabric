export const DEPLOYMENT_GUARD_BASE_URL = (
  import.meta.env.VITE_DEPLOYMENT_KNOWLEDGE_GUARD_API_URL
  || "https://ai-fabric-deployment-knowledge-guard.46.224.145.148.sslip.io"
).replace(/\/$/, "");

export const DEPLOYMENT_GUARD_SESSION_KEY = "ai-fabric-deployment-guard-session";

export interface ContextOption {
  id: string;
  label: string;
  environment: string;
}

export interface GuardSession {
  sessionId: string;
  operatorId: string;
  activeContextId: string;
  activeContextLabel: string;
  environment: string;
  expiresAt: string;
  contexts: ContextOption[];
}

export interface EvidenceSummary {
  id: string;
  title: string;
  sourceType: string;
  revision: number;
}

export interface EvidenceView extends EvidenceSummary {
  content: string;
  relevanceScore: number | null;
  vectorSpace: string | null;
}

export interface DeploymentAnswer {
  summary: string;
  healthStatus: string;
  release: string;
  indexingStatus: string;
  incidentRisk: string;
  recommendedRunbook: string;
  evidenceIds: string[];
}

export interface QueryResponse {
  invocationId: string;
  status: string;
  answer: DeploymentAnswer | null;
  evidence: EvidenceView[];
  boundary: {
    activeContext: string;
    tenantId: string;
    deploymentId: string;
    enforced: boolean;
    proof: string;
  };
  failure: { reason: string; message: string; retryable: boolean } | null;
}

export interface GuardHealth {
  status: string;
  service: string;
  version: string;
  aiFabricVersion: string;
  commit: string;
  builtAt: string;
  indexing: { state: string; indexedDocuments: number; updatedAt: string | null; failure: string | null };
  specialistRuntime: { ready: boolean; registered: string[]; registryHash: string };
  providerReadiness: { ready: boolean; configuredProviders: string[]; availableProviders: string[] };
  securityBoundary: Record<string, boolean>;
}

export async function deploymentGuardApi<T>(
  path: string,
  options: RequestInit = {},
  sessionId?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");
  if (sessionId) headers.set("X-AI-Fabric-Demo-Session", sessionId);

  const response = await fetch(`${DEPLOYMENT_GUARD_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = `Deployment Guard request failed (${response.status})`;
    try {
      const payload = await response.json() as { message?: string; error?: string };
      message = payload.message || payload.error || message;
    } catch {
      // Preserve the HTTP status when the backend did not return JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
