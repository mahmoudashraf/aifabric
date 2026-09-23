export const DOCUMENT_OPERATIONS_BASE_URL = (
  import.meta.env.VITE_DOCUMENT_OPERATIONS_API_URL
  || "https://ai-fabric-document-knowledge-operations.46.224.145.148.sslip.io"
).replace(/\/$/, "");

export const DOCUMENT_OPERATIONS_SESSION_KEY =
  "ai-fabric-document-knowledge-operations-session-v1";

export interface DocumentDemoHealth {
  status?: string;
  app?: string;
  version?: string;
  aiFabricVersion?: string;
  commit?: string;
  builtAt?: string;
  [key: string]: unknown;
}

export interface DocumentSourceSummary {
  id: string;
  title: string;
  originalFilename: string;
  tenantId: string;
  visibility: string;
  contentHash: string;
  sourceVersion: number;
  activeVersion: number | null;
  status: string;
  activeChunks: number;
  failureCode: string | null;
  failureMessage: string | null;
}

export interface DocumentDemoSession {
  sessionId: string;
  tenantId: string;
  sources: DocumentSourceSummary[];
}

export interface DocumentWarning {
  code: string;
  message?: string;
  count?: number;
}

export interface DocumentChunkPreview {
  sourceDocumentId: string;
  chunkId: string;
  chunkIndex: number;
  chunkCount: number;
  entityId: string;
  contentPreview: string;
  contentLength: number;
  previewTruncated: boolean;
  contentFingerprint: string;
  safeMetadata: Record<string, unknown>;
  warnings: DocumentWarning[];
}

export interface DocumentPreview {
  planId: string;
  source: DocumentSourceSummary;
  documentCount: number;
  chunkCount: number;
  totalContentLength: number;
  chunksTruncated: boolean;
  previewChunks: DocumentChunkPreview[];
  metadataDroppedCount: number;
  warnings: DocumentWarning[];
}

export interface DocumentWorkEvidence {
  workId: string;
  state: string;
  errorCode: string | null;
  failureReason: string | null;
}

export interface DocumentManifestRun {
  manifestId: string;
  planId: string;
  sourceVersion: number;
  state: string;
  chunkCount: number;
  indexingWork: DocumentWorkEvidence[];
  deletionWork: DocumentWorkEvidence[];
  failureCode: string | null;
  failureMessage: string | null;
}

export interface DocumentLifecycle {
  source: DocumentSourceSummary;
  manifests: DocumentManifestRun[];
}

export interface DocumentEvidence {
  entityId: string;
  sourceId: string;
  sourceVersion: number;
  sourceName: string;
  chunkId: string;
  chunkIndex: number;
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface DocumentQueryResult {
  query: string;
  tenantId: string;
  resultCount: number;
  evidence: DocumentEvidence[];
  processingTimeMs: number;
  embeddingModel: string;
}

export interface DocumentIndexResult {
  source: DocumentSourceSummary;
  manifestId: string;
  queuedChunks: number;
  activeChunksBeforeSubmission: number;
  workIds: string[];
  entityIds: string[];
}

export interface DocumentDeleteResult {
  source: DocumentSourceSummary;
  manifestId: string;
  queuedDeletes: number;
  workIds: string[];
  entityIds: string[];
}

async function errorMessage(response: Response): Promise<string> {
  const payload = await response.json().catch(() => null) as
    | { message?: string; error?: string; code?: string }
    | null;
  return payload?.message
    || payload?.error
    || payload?.code
    || `Document operations request failed (${response.status})`;
}

export async function documentOperationsApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const response = await fetch(
    `${DOCUMENT_OPERATIONS_BASE_URL}${path}`,
    { ...init, headers },
  );
  if (!response.ok) throw new Error(await errorMessage(response));
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export function documentForm(
  filename: string,
  title: string,
  content: string,
): FormData {
  const form = new FormData();
  const extension = filename.toLowerCase().endsWith(".json") ? "json" : "txt";
  const safeFilename = filename.trim() || `knowledge-source.${extension}`;
  form.append(
    "file",
    new Blob([content], {
      type: extension === "json" ? "application/json" : "text/plain",
    }),
    safeFilename,
  );
  if (title.trim()) form.append("title", title.trim());
  form.append("visibility", "internal");
  return form;
}

export function compactDocumentId(value?: string | null): string {
  if (!value) return "Not available";
  return value.length > 24 ? `${value.slice(0, 12)}...${value.slice(-8)}` : value;
}
