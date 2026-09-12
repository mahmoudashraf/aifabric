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

export interface IncidentEvent {
  id: string;
  tenantId: string;
  incidentId: string;
  deploymentId: string;
  sourceRevision: string;
  type: string;
  source: string;
  summary: string;
  severity: string;
  observedAt: string;
  safeAttributes: Record<string, unknown>;
}

export interface RunbookIndexStatus {
  state: string;
  indexedDocuments: number;
  updatedAt: string | null;
  failure: string | null;
}

export interface IncidentWorkspace {
  candidateEvents: IncidentEvent[];
  excludedBoundaryEventCount: number;
  dataSources: Record<string, string>;
  runbooks: RunbookIndexStatus;
}

export interface IncidentSession {
  sessionId: string;
  scenario: IncidentScenario;
  workspace: IncidentWorkspace;
  createdAt: string;
  expiresAt: string;
}

export interface IncidentDataSourceUsage {
  action: string;
  candidateCount: number;
  groundingUsable: boolean;
}

export interface SpecialistDecisionTrace {
  specialist: string;
  status: string;
  dataSources: IncidentDataSourceUsage[];
  selectedEvidenceIds: string[];
  runbookEvidenceIds: string[];
  sourceRevision: string;
  applicationValidation: string;
}

export interface ServiceHealthFinding {
  healthStatus: string;
  severity: string;
  summary: string;
  evidenceIds: string[];
  dataSources: IncidentDataSourceUsage[];
  candidateEventCount: number;
  selectionReason: string;
  sourceRevision: string;
}

export interface ChangeRiskFinding {
  riskLevel: string;
  suspectedChange: string;
  summary: string;
  evidenceIds: string[];
  runbookEvidenceIds: string[];
  dataSources: IncidentDataSourceUsage[];
  candidateEventCount: number;
  selectionReason: string;
  sourceRevision: string;
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
  serviceHealth: ServiceHealthFinding;
  changeRiskFinding: ChangeRiskFinding;
  dataSources: IncidentDataSourceUsage[];
  validationStatus: string;
}

export interface PlanStepTrace {
  stepId: string;
  parallelGroupId: string | null;
  sourceRevision: string | null;
  specialistId: string;
  invocationId: string;
  status: string;
  startedAt: string;
  completedAt: string;
  decisionTrace: SpecialistDecisionTrace | null;
}

export interface IncidentFailure {
  reason: string;
  publicMessage: string;
  retryable: boolean;
  stepId: string | null;
}

export interface IncidentPlanResult {
  executionId: string;
  planId: string;
  planContentHash: string;
  status: string;
  activeStepId: string | null;
  output: IncidentAssessment | null;
  steps: PlanStepTrace[];
  failure: IncidentFailure | null;
  startedAt: string;
  completedAt: string;
}

export interface IncidentPlanComparison {
  sequential: IncidentPlanResult;
  parallel: IncidentPlanResult;
  semanticallyEquivalent: boolean;
  comparisonReason: string;
}

export interface SpecialistExecution<T = unknown> {
  invocationId: string;
  specialistId: string;
  status: string;
  output: T | null;
  failure: IncidentFailure | null;
  startedAt: string;
  completedAt: string;
  decisionTrace: SpecialistDecisionTrace | null;
}

export interface SpecialistTransition {
  delegationId?: string | null;
  handoffId?: string | null;
  parentInvocationId?: string | null;
  predecessorInvocationId?: string | null;
  sourceSpecialistId?: string | null;
  predecessorSpecialistId?: string | null;
  targetSpecialistId?: string | null;
  successorSpecialistId?: string | null;
  depth: number;
  status: string;
  targetExecution?: SpecialistExecution | null;
  successorExecution?: SpecialistExecution | null;
  failure?: IncidentFailure | null;
  replayed: boolean;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface IncidentIntakeOutput {
  decision: string;
  targetSpecialist: string | null;
  reason: string;
}

export interface IncidentTransitionResponse {
  intake: SpecialistExecution<IncidentIntakeOutput>;
  transition: SpecialistTransition | null;
  secondTransitionCanary: SpecialistTransition | null;
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
  failure: { reason: string; message?: string; publicMessage?: string; retryable?: boolean } | null;
  replayed: boolean;
  startedAt: string;
  completedAt: string;
  decisionTrace: SpecialistDecisionTrace | null;
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
  actions: Array<{ name: string; ready: boolean; accessMode: string }>;
  specialistsReady: boolean;
  plansReady: boolean;
  actionsReady: boolean;
  provider: { generation: string; ready: boolean };
  storage: { domain: string; chat: string; execution: string };
  fanInPolicy: string;
  conversationHistory: string;
  eventStore: { type: string; totalEvents: number; trustedFiltering: boolean };
  runbooks: RunbookIndexStatus;
}

export function formatVersionedId(value: VersionedId | string | null | undefined): string {
  if (!value) return "Not selected";
  if (typeof value === "string") return value;
  return `${value.name}@${value.version}`;
}

export function durationMs(startedAt?: string | null, completedAt?: string | null): number | null {
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
      // Preserve the HTTP status when the backend did not return JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
