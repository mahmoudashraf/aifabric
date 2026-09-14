const configuredBaseUrl =
  import.meta.env.VITE_AGENTIC_ACTION_RESOLVER_API_URL ||
  "https://ai-fabric-agentic-action-resolver.46.224.145.148.sslip.io";

export const AGENTIC_RESOLVER_BASE_URL = configuredBaseUrl.replace(/\/$/, "");
export const AGENTIC_SESSION_STORAGE_KEY = "ai-fabric-agentic-action-resolver-session-v1";
export const AGENTIC_REVIEW_SESSION_STORAGE_KEY = "ai-fabric-agentic-action-resolver-review-session-v1";

export interface SpecialistId {
  name: string;
  version: string;
}

export interface EvidenceReference {
  evidenceId: string;
  content: string;
  relevanceScore?: number | null;
  source?: string | null;
  sourceUrl?: string | null;
  vectorSpace?: string | null;
  safeMetadata?: Record<string, unknown>;
}

export interface ExecutionFailure {
  reason: string;
  publicMessage: string;
  retryable: boolean;
}

export interface ActionProposal {
  receiptId: string;
  actionName: string;
  confirmationMessage: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export interface ActionOutcome {
  actionName: string;
  message: string;
  data: Record<string, unknown>;
}

export interface NeedsUserInput {
  requestId: string;
  invocationId: string;
  specialistId: SpecialistId;
  purposeCode: string;
  safeQuestion: string;
  responseContract: {
    schemaId: SpecialistId;
    schema: Record<string, unknown>;
  };
  deliveryTarget: string;
  durability: string;
  createdAt: string;
  expiresAt: string;
  maxAttempts: number;
}

export interface AccountBlocker {
  requirement: string;
  explanation: string;
  recommendedNextStep: string;
}

export interface AccountResolutionOutput {
  assessment: "READY" | "BLOCKED" | "INSUFFICIENT_EVIDENCE" | string;
  summary: string;
  blockers: AccountBlocker[];
}

export interface BillingResolutionOutput {
  resolutionType: string;
  amount: number;
  decision: string;
  expectedStatus: string;
  automaticLimit: number;
  explanation: string;
}

export interface ExecutionResult<T = AccountResolutionOutput | BillingResolutionOutput> {
  invocationId: string;
  specialistId: SpecialistId;
  status: string;
  output: T | null;
  evidence: EvidenceReference[];
  diagnostics: Record<string, unknown>;
  failure: ExecutionFailure | null;
  startedAt: string;
  completedAt: string;
  actionProposal: ActionProposal | null;
  needsUserInput: NeedsUserInput | null;
}

export interface ExecutionHandle {
  invocationId: string;
  durability: string;
  status: string;
  deadline: string | null;
  expiresAt: string;
  failureReason: string | null;
}

export interface ProactiveEventSubmission {
  eventId: string;
  eventType: string;
  execution: ExecutionHandle;
}

export interface SpecialistExecutionSnapshot<T = AccountResolutionOutput> {
  handle: ExecutionHandle;
  result: ExecutionResult<T> | null;
}

export interface ResumeResult<T = AccountResolutionOutput | BillingResolutionOutput> {
  status: string;
  executionResult: ExecutionResult<T> | null;
  failure: ExecutionFailure | null;
}

export interface ActionDecisionResult {
  receiptId: string;
  status: string | null;
  outcome: ActionOutcome | null;
  failure: { reason?: string; publicMessage?: string; retryable?: boolean } | null;
}

export interface ResolverScenario {
  id: string;
  title: string;
  description: string;
  suggestedPrompt: string;
}

export interface ResolverSession {
  sessionId: string;
  activeScenarioId: string;
  scenarios: ResolverScenario[];
  createdAt: string;
  expiresAt: string;
}

export interface DemoHealth {
  status?: string;
  app?: string;
  version?: string;
  aiFabricVersion?: string;
  commit?: string;
  branch?: string;
  builtAt?: string;
  provider?: string;
  execution?: {
    specialistChainsEnabled?: boolean;
    specialistChainsReady?: boolean;
    specialistChainDurability?: string;
    accountSmartResolutionChainRegistered?: boolean;
    specialistChains?: Array<{
      id: string;
      contentHash: string;
      manager: string;
      targets: string[];
      conversationPolicy: string;
      ready: boolean;
    }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface SpecialistChainBudget {
  managerDecisions: number;
  workerInvocations: number;
  parallelWorkers: number;
  projectedResultCharacters: number;
  durationMillis: number;
}

export interface SpecialistChainWorkerTrace {
  specialist: string;
  relationship: "DELEGATION" | "HANDOFF";
  invocationId: string | null;
  resultId: string | null;
  status: string;
  evidenceReferenceIds: string[];
  failureReason: string | null;
  startedAt: string;
  completedAt: string;
}

export interface SpecialistChainStepTrace {
  decisionIndex: number;
  managerInvocationId: string;
  directiveType: string;
  reason: string;
  parallelGroupId: string | null;
  workers: SpecialistChainWorkerTrace[];
  remainingBudget: SpecialistChainBudget;
  startedAt: string;
  completedAt: string;
}

export interface SpecialistChainResultView {
  resultId: string;
  specialist: string;
  workerInvocationId: string;
  summary: string;
  facts: Record<string, string>;
  evidenceReferenceIds: string[];
  resultHash: string;
  completedAt: string;
}

export interface AccountSmartResolutionResult {
  executionId: string;
  chain: string;
  chainContentHash: string;
  status: string;
  message: string | null;
  handoffTarget: string | null;
  results: SpecialistChainResultView[];
  timeline: SpecialistChainStepTrace[];
  conversationSnapshotRevision: string | null;
  conversationSourceTurnCount: number;
  failure: ExecutionFailure | null;
  replayed: boolean;
  durable: boolean;
  startedAt: string;
  completedAt: string;
}

export interface AccountSmartResolutionExecution {
  executionId: string;
  chain: string;
  status: string;
  nextDecisionIndex: number;
  timeline: SpecialistChainStepTrace[];
  failure: ExecutionFailure | null;
  result: AccountSmartResolutionResult | null;
  replayed: boolean;
  durable: boolean;
  submittedAt: string;
  updatedAt: string;
  deadline: string;
}

export interface AccountSmartResolutionRequest {
  question: string;
  resolutionType?: "REFUND" | "ACCOUNT_CREDIT";
  amount?: number;
}

export type ReviewDecision =
  | "APPROVE"
  | "REJECT"
  | "CORRECT"
  | "REQUEST_INFORMATION"
  | "ESCALATE";

export interface ReviewTask {
  taskId: string;
  policyId: SpecialistId;
  type: string;
  title: string;
  summary: string;
  allowedDecisions: ReviewDecision[];
  status: string;
  createdAt: string;
  expiresAt: string;
  version: number;
}

export interface ReviewTaskDetail {
  task: ReviewTask;
  requestedInformation: Record<string, unknown> | null;
  suppliedInformation: Record<string, unknown> | null;
  message: string | null;
  outcome: ActionOutcome | null;
  successorTaskId: string | null;
  failureReason: string | null;
}

export interface ReviewSubmissionResult {
  invocationId: string;
  proposalStatus: string;
  reviewTask: ReviewTask | null;
  dispatchAccepted: boolean;
  evidence: EvidenceReference[];
  proposalFailure: ExecutionFailure | null;
  reviewFailure: { reason?: string; publicMessage?: string } | null;
}

export interface ReviewDecisionResult {
  task: ReviewTask | null;
  outcome: ActionOutcome | null;
  successorTaskId: string | null;
  failure: { reason?: string; publicMessage?: string; retryable?: boolean } | null;
}

export interface ReviewInformationResult {
  task: ReviewTask | null;
  message: string | null;
  failure: { reason?: string; publicMessage?: string; retryable?: boolean } | null;
}

export interface IssuedReviewerSession {
  token: string;
  role: "REGULAR" | "SENIOR";
  expiresAt: string;
}

function headers(
  sessionId?: string,
  idempotencyKey?: string,
  reviewKey?: string,
  reviewerToken?: string,
): HeadersInit {
  const values: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionId) values["X-AI-Fabric-Demo-Session"] = sessionId;
  if (idempotencyKey) values["Idempotency-Key"] = idempotencyKey;
  if (reviewKey) values["X-AI-Fabric-Review-Key"] = reviewKey;
  if (reviewerToken) values["X-AI-Fabric-Demo-Reviewer"] = reviewerToken;
  return values;
}

async function errorMessage(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as
    | { message?: string; error?: string; failure?: { publicMessage?: string } }
    | null;
  return (
    body?.failure?.publicMessage ||
    body?.message ||
    body?.error ||
    `Request failed with status ${response.status}`
  );
}

export async function agenticApi<T>(
  path: string,
  init: RequestInit = {},
  options: {
    sessionId?: string;
    idempotencyKey?: string;
    reviewKey?: string;
    reviewerToken?: string;
  } = {},
): Promise<T> {
  const response = await fetch(`${AGENTIC_RESOLVER_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...headers(
        options.sessionId,
        options.idempotencyKey,
        options.reviewKey,
        options.reviewerToken,
      ),
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new Error(await errorMessage(response));
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function newIdempotencyKey(prefix: string): string {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

export function specialistLabel(value?: SpecialistId | null): string {
  return value ? `${value.name}@${value.version}` : "Not available";
}

export function compactId(value?: string | null): string {
  if (!value) return "Not available";
  return value.length > 18 ? `${value.slice(0, 9)}...${value.slice(-6)}` : value;
}
