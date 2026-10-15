export const CONVERSATION_HANDOVER_BASE_URL = (
  import.meta.env.VITE_CONVERSATION_HANDOVER_API_URL
  || "https://ai-fabric-conversation-handover.46.224.145.148.sslip.io"
).replace(/\/$/, "");

export type ConversationControlState =
  | "AI_ACTIVE"
  | "HUMAN_PENDING"
  | "HUMAN_ACTIVE"
  | "AI_RESUME_PENDING"
  | "CLOSED";

export type ConversationRole = "USER" | "AI" | "HUMAN" | "SYSTEM";

export interface ConversationScope {
  tenantId: string;
  deploymentId: string;
  conversationId: string;
  ownerId: string;
}

export interface ConversationControl {
  scope: ConversationScope;
  state: ConversationControlState;
  version: number;
  controlEpoch: number;
  activeHandoverId: string | null;
  channelBindingId: string | null;
  updatedAt: string;
}

export interface ConversationMessage {
  messageId: string;
  sequence: number;
  role: ConversationRole;
  actorRef: string;
  content: string;
  clientMessageId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface HandoverIntakeField {
  key: "email" | "name" | "phone" | string;
  label: string;
  type: "EMAIL" | "TEXT" | "PHONE" | string;
  required: boolean;
  maxLength: number;
  purpose: string;
  consentRequired: boolean;
  options: string[];
}

export interface HandoverIntakeSchema {
  schemaVersion: string;
  anonymousAllowed: boolean;
  fields: HandoverIntakeField[];
}

export interface ContactIntake {
  email: string;
  name: string | null;
  phone: string | null;
  acceptedAt: string;
}

export interface ConversationView {
  control: ConversationControl;
  messages: ConversationMessage[];
  handoverIntakeSchema: HandoverIntakeSchema;
  handoverIntakeRequired: boolean;
  contactIntake: ContactIntake | null;
}

export interface ConversationSession {
  conversationId: string;
  conversation: ConversationView;
}

export interface OperatorQueueItem {
  conversationId: string;
  safeLabel: string;
  state: ConversationControlState;
  version: number;
  handoverId: string;
  updatedAt: string;
}

export interface OperatorSession {
  authenticated: boolean;
  operatorId: string;
  displayName: string;
}

export interface HandoverDemoHealth {
  status: string;
  service: string;
  aiFabricVersion: string;
  proof: string;
  handoverAction: string;
  handoverIntakeSchema: string;
  requiredHandoverField: string;
  publicOperatorEnabled?: boolean;
  demoOperatorAccessCode?: string;
}

interface HandoverRequest {
  expectedVersion: number;
  idempotencyKey: string;
  intake: Record<string, string>;
  consentedFields: string[];
}

interface TransitionRequest {
  expectedVersion: number;
  idempotencyKey: string;
}

async function readError(response: Response): Promise<string> {
  const payload = await response.json().catch(() => null) as
    | { message?: string; error?: string; errorCode?: string }
    | null;
  return payload?.message
    || payload?.error
    || payload?.errorCode
    || `Conversation handover request failed (${response.status})`;
}

export async function conversationHandoverApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${CONVERSATION_HANDOVER_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export function createConversationSession(): Promise<ConversationSession> {
  return conversationHandoverApi("/api/demo/session", { method: "POST", body: "{}" });
}

export function readConversation(conversationId: string): Promise<ConversationView> {
  return conversationHandoverApi(`/api/demo/conversations/${encodeURIComponent(conversationId)}`);
}

export function sendVisitorMessage(
  conversationId: string,
  text: string,
): Promise<ConversationView> {
  return conversationHandoverApi(`/api/demo/conversations/${encodeURIComponent(conversationId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ text, clientMessageId: newHandoverKey("visitor-message") }),
  });
}

export function submitHandover(
  conversationId: string,
  request: Omit<HandoverRequest, "idempotencyKey">,
): Promise<ConversationView> {
  return conversationHandoverApi(`/api/demo/conversations/${encodeURIComponent(conversationId)}/handover`, {
    method: "POST",
    body: JSON.stringify({ ...request, idempotencyKey: newHandoverKey("handover") }),
  });
}

export function cancelHandover(
  conversationId: string,
  expectedVersion: number,
): Promise<ConversationView> {
  return transition(`/api/demo/conversations/${encodeURIComponent(conversationId)}/handover/cancel`, expectedVersion, "cancel");
}

export function loginOperator(accessCode: string): Promise<OperatorSession> {
  return conversationHandoverApi("/api/demo/operator/session", {
    method: "POST",
    body: JSON.stringify({ accessCode }),
  });
}

export function readOperatorQueue(): Promise<OperatorQueueItem[]> {
  return conversationHandoverApi("/api/demo/operator/conversations");
}

export function readOperatorConversation(conversationId: string): Promise<ConversationView> {
  return conversationHandoverApi(`/api/demo/operator/conversations/${encodeURIComponent(conversationId)}`);
}

export function claimConversation(conversationId: string, expectedVersion: number): Promise<ConversationView> {
  return transition(`/api/demo/operator/conversations/${encodeURIComponent(conversationId)}/claim`, expectedVersion, "claim");
}

export function returnConversationToAi(conversationId: string, expectedVersion: number): Promise<ConversationView> {
  return transition(`/api/demo/operator/conversations/${encodeURIComponent(conversationId)}/return-to-ai`, expectedVersion, "return-ai");
}

export function closeConversation(conversationId: string, expectedVersion: number): Promise<ConversationView> {
  return transition(`/api/demo/operator/conversations/${encodeURIComponent(conversationId)}/close`, expectedVersion, "close");
}

export function sendOperatorMessage(conversationId: string, text: string): Promise<ConversationView> {
  return conversationHandoverApi(`/api/demo/operator/conversations/${encodeURIComponent(conversationId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ text, clientMessageId: newHandoverKey("operator-message") }),
  });
}

export function readHandoverHealth(): Promise<HandoverDemoHealth> {
  return conversationHandoverApi("/api/demo/health");
}

function transition(path: string, expectedVersion: number, prefix: string): Promise<ConversationView> {
  const request: TransitionRequest = {
    expectedVersion,
    idempotencyKey: newHandoverKey(prefix),
  };
  return conversationHandoverApi(path, { method: "POST", body: JSON.stringify(request) });
}

export function newHandoverKey(prefix: string): string {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}
