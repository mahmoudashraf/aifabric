export const INCIDENT_INVESTIGATION_BASE_URL = (
  import.meta.env.VITE_INCIDENT_INVESTIGATION_API_URL
  || "https://ai-fabric-incident-investigation.46.224.145.148.sslip.io"
).replace(/\/$/, "");

export const INCIDENT_INVESTIGATION_SESSION_KEY = "ai-fabric-incident-investigation-session";

export interface VersionedId {
  name: string;
  version: number | string;
}

export interface IncidentEvidence {
  id: string;
  category: string;
  summary: string;
  severity: string;
  observedAt: string;
}

export interface IncidentScenario {
  id: string;
  title: string;
  deploymentId: string;
  sourceRevision: string;
  description: string;
  serviceEvidence: IncidentEvidence[];
  changeEvidence: IncidentEvidence[];
  failingBranch: string | null;
}

export interface IncidentSession {
  sessionId: string;
  scenario: IncidentScenario;
  createdAt: string;
  expiresAt: string;
}

export interface IncidentAssessment {
  incidentId: string;
  deploymentId: string;
  sourceRevision: string;
  severity: string;
  healthStatus: string;
  changeRisk: string;
  likelyCause: string;
  recommendation: string;
  evidenceIds: string[];
  serviceHealth: {
    healthStatus: string;
    severity: string;
    summary: string;
    evidenceIds: string[];
  };
  changeRiskFinding: {
    riskLevel: string;
    suspectedChange: string;
    summary: string;
    evidenceIds: string[];
  };
}

export interface EvidenceReference {
  id?: string;
  documentId?: string;
  source?: string;
  sourceUrl?: string;
  vectorSpace?: string;
  relevanceScore?: number;
  metadata?: Record<string, unknown>;
}

export interface PlanStepTrace {
  stepId: string;
  parallelGroupId: string | null;
  sourceRevision: string | null;
  specialistId: VersionedId | string;
  invocationId: string;
  status: string;
  evidence: EvidenceReference[];
  startedAt: string;
  completedAt: string;
}

export interface PlanFailure {
  reason: string;
  publicMessage: string;
  retryable: boolean;
  stepId: string | null;
}

export interface IncidentPlanResult {
  executionId: string;
  planId: VersionedId | string;
  planContentHash: string;
  status: string;
  activeStepId: string | null;
  output: IncidentAssessment | null;
  steps: PlanStepTrace[];
  diagnostics: Record<string, unknown>;
  failure: PlanFailure | null;
  needsUserInput: unknown | null;
  startedAt: string;
  completedAt: string;
}

export interface IncidentPlanComparison {
  sequential: IncidentPlanResult;
  parallel: IncidentPlanResult;
  semanticallyEquivalent: boolean;
  comparisonReason: string;
}

export interface ExecutionFailure {
  reason: string;
  message?: string;
  publicMessage?: string;
  retryable?: boolean;
}

export interface ExecutionResult<T = unknown> {
  invocationId: string;
  specialistId: VersionedId | string;
  status: string;
  output: T | null;
  evidence: EvidenceReference[];
  diagnostics: Record<string, unknown>;
  failure: ExecutionFailure | null;
  startedAt: string;
  completedAt: string;
}

export interface SpecialistTransition {
  delegationId?: string;
  handoffId?: string;
  parentInvocationId?: string;
  predecessorInvocationId?: string;
  sourceSpecialistId?: VersionedId | string;
  predecessorSpecialistId?: VersionedId | string;
  targetSpecialistId?: VersionedId | string;
  successorSpecialistId?: VersionedId | string;
  depth?: number;
  status?: string;
  targetExecution?: ExecutionResult;
  successorExecution?: ExecutionResult;
  failure?: ExecutionFailure | null;
  replayed?: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface IncidentTransitionResponse {
  intake: ExecutionResult<{ decision: string; targetSpecialist: string; reason: string }>;
  transition: SpecialistTransition;
  secondTransitionCanary: SpecialistTransition;
}

export interface ConversationManagerResult {
  turnId: string;
  managerId: VersionedId | string;
  status: string;
  message: string | null;
  selectedTarget: VersionedId | string | null;
  managerInvocationId: string | null;
  workerInvocationId: string | null;
  snapshotRevision: string | null;
  snapshotSourceTurnCount: number;
  failure: ExecutionFailure | null;
  replayed: boolean;
  startedAt: string;
  completedAt: string;
}

export interface IncidentHealth {
  status: string;
  service: string;
  version: string;
  aiFabricVersion: string;
  commit: string;
  builtAt: string;
  specialists: Array<{ id: string; contentHash: string; source: string; ready: boolean }>;
  plans: Array<{ id: string; contentHash: string; ready: boolean }>;
  specialistsReady: boolean;
  plansReady: boolean;
  provider: { generation: string; ready: boolean };
  storage: { domain: string; chat: string; execution: string };
  fanInPolicy: string;
  conversationHistory: string;
}

export function formatVersionedId(value: VersionedId | string | null | undefined): string {
  if (!value) return "Not selected";
  if (typeof value === "string") return value;
  return `${value.name}@${value.version}`;
}

export function durationMs(startedAt?: string, completedAt?: string): number | null {
  if (!startedAt || !completedAt) return null;
  const duration = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  return Number.isFinite(duration) && duration >= 0 ? duration : null;
}

export async function incidentInvestigationApi<T>(
  path: string,
  options: RequestInit = {},
  sessionId?: string,
  idempotencyKey?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");
  if (sessionId) headers.set("X-AI-Fabric-Demo-Session", sessionId);
  if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);

  const response = await fetch(`${INCIDENT_INVESTIGATION_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = `Incident Investigation request failed (${response.status})`;
    try {
      const payload = await response.json() as { message?: string; error?: string; detail?: string };
      message = payload.message || payload.detail || payload.error || message;
    } catch {
      // Preserve the status when the backend did not return a JSON error.
    }
    throw new Error(message);
  }
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
