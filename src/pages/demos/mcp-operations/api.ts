export const MCP_OPERATIONS_BASE_URL = (
  import.meta.env.VITE_MCP_OPERATIONS_API_URL
  || "https://ai-fabric-mcp-operations.46.224.145.148.sslip.io"
).replace(/\/$/, "");

export const MCP_OPERATIONS_SESSION_KEY = "ai-fabric-mcp-operations-session-v1";

export interface McpSession {
  sessionId: string;
  conversationId: string;
  selectedService: string;
  availableServices: string[];
  createdAt: string;
  expiresAt: string;
}

export interface McpConnection {
  ready: boolean;
  authenticationConfigured: boolean;
  serverRef: string;
  transport: string;
  tools: string[];
  failure: string | null;
}

export interface McpAudit {
  id: string;
  actionId: string;
  serverRef: string;
  toolName: string;
  accessMode: string;
  serviceName: string | null;
  success: boolean;
  errorCode: string | null;
  durationMs: number;
  startedAt: string;
}

export interface McpSandboxState {
  selectedService: string;
  status: Record<string, unknown>;
  incidents: Array<Record<string, unknown>>;
  timeline: McpAudit[];
  connection: McpConnection;
}

export interface McpToolPolicy {
  actionId: string;
  toolName: string;
  accessMode: string;
  requiresConfirmation: boolean;
  description: string;
}

export interface SpecialistId {
  name: string;
  version: string;
}

export interface McpSpecialistOutput {
  operation: string;
  serviceName: string;
  healthStatus: string;
  summary: string;
  facts: string[];
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

export interface McpExecution {
  invocationId: string;
  specialistId: SpecialistId;
  status: string;
  output: McpSpecialistOutput | null;
  diagnostics: Record<string, unknown>;
  failure: ExecutionFailure | null;
  startedAt: string;
  completedAt: string;
  actionProposal: ActionProposal | null;
}

export interface McpTurnResponse {
  execution: McpExecution;
  timeline: McpAudit[];
}

export interface ActionOutcome {
  actionName: string;
  message: string;
  data: Record<string, unknown>;
}

export interface McpDecisionResult {
  receiptId: string;
  status: string | null;
  outcome: ActionOutcome | null;
  failure: { reason?: string; publicMessage?: string; retryable?: boolean } | null;
}

export interface McpDecisionResponse {
  decision: McpDecisionResult;
  timeline: McpAudit[];
  currentStatus: Record<string, unknown>;
}

export interface McpBindingCanary {
  passed: boolean;
  rejectedServerRef: string;
  requiredServerRef: string;
  duplicateToolName: string;
  errorCode: string;
  writeDelta: number;
}

export interface McpHistoryMessage {
  role: string;
  content: string;
}

export interface McpDemoHealth {
  status?: string;
  app?: string;
  version?: string;
  aiFabricVersion?: string;
  commit?: string;
  builtAt?: string;
  mcp?: McpConnection;
  provider?: Record<string, unknown>;
  storage?: Record<string, unknown>;
  [key: string]: unknown;
}

async function errorMessage(response: Response): Promise<string> {
  const payload = await response.json().catch(() => null) as
    | { message?: string; error?: string; code?: string; failure?: { publicMessage?: string } }
    | null;
  return payload?.failure?.publicMessage
    || payload?.message
    || payload?.error
    || `MCP Operations request failed (${response.status})`;
}

export async function mcpOperationsApi<T>(
  path: string,
  init: RequestInit = {},
  idempotencyKey?: string,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);
  const response = await fetch(`${MCP_OPERATIONS_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) throw new Error(await errorMessage(response));
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export function newMcpIdempotencyKey(prefix: string): string {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

export function compactMcpId(value?: string | null): string {
  if (!value) return "Not available";
  return value.length > 22 ? `${value.slice(0, 11)}...${value.slice(-7)}` : value;
}
