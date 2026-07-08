import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Info,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const configuredTenantGuardBaseUrl =
  import.meta.env.VITE_TENANT_GUARD_API_URL ||
  "https://ai-fabric-tenant-guard.46.224.145.148.sslip.io";

const TENANT_GUARD_BASE_URL = configuredTenantGuardBaseUrl.replace(/\/$/, "");
const TENANT_GUARD_API_URL = `${TENANT_GUARD_BASE_URL}/api/tenant-guard-demo`;

type ApiStatus = "loading" | "connected" | "offline";

interface TenantGuardScenario {
  id: string;
  tenantId: string;
  tenantName: string;
  role: string;
  defaultQuery: string;
  operatorGoal: string;
  expectedEvidence: string;
}

interface DocumentStats {
  totalDocuments: number;
  tenantCount: number;
  restrictedDocuments: number;
  tenantADocuments: number;
  tenantBDocuments: number;
}

interface KnowledgeHit {
  id: string;
  title: string;
  tenantId: string;
  metadata: Record<string, unknown>;
}

interface SearchComparison {
  query: string;
  tenantAResults: KnowledgeHit[];
  tenantBResults: KnowledgeHit[];
  platformAdminResults: KnowledgeHit[];
}

interface CatalogEntry {
  id: string;
  tenantId: string;
  title: string;
  metadata: Record<string, unknown>;
}

interface CatalogSummary {
  role: string;
  visibleDocuments: number;
  entries: CatalogEntry[];
}

interface ActionDecision {
  success: boolean;
  confirmationRequired: boolean;
  message: string;
  errorCode: string | null;
  data: Record<string, unknown>;
}

interface TenantDeletionPreview {
  targetTenantId: string;
  matchingDocuments: number;
  documentIds: string[];
}

interface TenantDeletionResult {
  success: boolean;
  errorCode: string | null;
  deletedDocuments: number;
  deletedIds: string[];
  message: string;
  policyDecision: string;
  remainingTenantIds: string[];
  deletedVectors?: number;
  deletedVectorEntityIds?: string[];
  indexProof?: VectorIndexProof;
}

interface ProofCheck {
  id: string;
  label: string;
  passed: boolean;
  evidence: string;
}

interface BoundaryProof {
  passed: boolean;
  summary: string;
  checks: ProofCheck[];
}

interface DemoSessionSummary {
  sessionId: string;
  isolated: boolean;
  ttlHours: number;
}

interface VectorIndexProof {
  available: boolean;
  errorCode: string | null;
  status: string;
  provider: string;
  searchFilterMode: string;
  scanFilterMode: string;
  supportsSearchMetadataFiltering: boolean;
  supportsScanMetadataFiltering: boolean;
  indexedDocuments: number;
  indexedByTenant: Record<string, number>;
  checks: ProofCheck[];
  diagnostics: Record<string, unknown>;
  message: string;
}

interface TenantRagHit {
  id: string;
  title: string;
  tenantId: string;
  visibility: string;
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

interface TenantRagResponse {
  success: boolean;
  errorCode: string | null;
  query: string;
  user: {
    tenantId: string;
    role: string;
  };
  answer: string;
  metadataFilter: Record<string, unknown>;
  hits: TenantRagHit[];
  citations?: Array<{
    id: string;
    title: string;
    tenantId: string;
    score: number;
  }>;
  boundaryProof: BoundaryProof;
  indexProof: VectorIndexProof;
  requestId: string | null;
  processingTimeMs: number | null;
  model: string | null;
}

interface TenantGuardHealth {
  status: string;
  service: string;
  version: string;
  aiFabricVersion: string;
  commit: string;
  branch: string;
  builtAt: string;
  startedAt: string;
  checkedAt: string;
}

interface TenantGuardDashboard {
  scenarios: TenantGuardScenario[];
  stats: DocumentStats;
  defaultComparison: SearchComparison;
  tenantUserCatalog: CatalogSummary;
  platformAdminCatalog: CatalogSummary;
  crossTenantDenied: ActionDecision;
  writeActionPreview: ActionDecision;
  deletionPreview: TenantDeletionPreview;
  boundaryProof: BoundaryProof;
  session: DemoSessionSummary;
  indexProof: VectorIndexProof;
}

const EMPTY_INDEX_PROOF: VectorIndexProof = {
  available: false,
  errorCode: null,
  status: "NOT_READY",
  provider: "",
  searchFilterMode: "",
  scanFilterMode: "",
  supportsSearchMetadataFiltering: false,
  supportsScanMetadataFiltering: false,
  indexedDocuments: 0,
  indexedByTenant: {},
  checks: [],
  diagnostics: {},
  message: "",
};

const EMPTY_DASHBOARD: TenantGuardDashboard = {
  scenarios: [],
  stats: {
    totalDocuments: 0,
    tenantCount: 0,
    restrictedDocuments: 0,
    tenantADocuments: 0,
    tenantBDocuments: 0,
  },
  defaultComparison: {
    query: "VPN",
    tenantAResults: [],
    tenantBResults: [],
    platformAdminResults: [],
  },
  tenantUserCatalog: {
    role: "USER",
    visibleDocuments: 0,
    entries: [],
  },
  platformAdminCatalog: {
    role: "ADMIN",
    visibleDocuments: 0,
    entries: [],
  },
  crossTenantDenied: {
    success: false,
    confirmationRequired: false,
    message: "",
    errorCode: null,
    data: {},
  },
  writeActionPreview: {
    success: false,
    confirmationRequired: false,
    message: "",
    errorCode: null,
    data: {},
  },
  deletionPreview: {
    targetTenantId: "tenant-b",
    matchingDocuments: 0,
    documentIds: [],
  },
  boundaryProof: {
    passed: false,
    summary: "",
    checks: [],
  },
  session: {
    sessionId: "pending",
    isolated: false,
    ttlHours: 0,
  },
  indexProof: EMPTY_INDEX_PROOF,
};

function normalizeDashboard(dashboard: TenantGuardDashboard): TenantGuardDashboard {
  return {
    ...EMPTY_DASHBOARD,
    ...dashboard,
    stats: { ...EMPTY_DASHBOARD.stats, ...(dashboard?.stats || {}) },
    defaultComparison: { ...EMPTY_DASHBOARD.defaultComparison, ...(dashboard?.defaultComparison || {}) },
    tenantUserCatalog: { ...EMPTY_DASHBOARD.tenantUserCatalog, ...(dashboard?.tenantUserCatalog || {}) },
    platformAdminCatalog: { ...EMPTY_DASHBOARD.platformAdminCatalog, ...(dashboard?.platformAdminCatalog || {}) },
    boundaryProof: { ...EMPTY_DASHBOARD.boundaryProof, ...(dashboard?.boundaryProof || {}) },
    session: { ...EMPTY_DASHBOARD.session, ...(dashboard?.session || {}) },
    indexProof: { ...EMPTY_INDEX_PROOF, ...(dashboard?.indexProof || {}) },
  };
}

const TENANT_GUARD_SESSION_STORAGE_KEY = "ai-fabric-tenant-guard-session";

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `tenant-guard-${crypto.randomUUID()}`;
  }
  return `tenant-guard-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return createSessionId();
  const existing = window.localStorage.getItem(TENANT_GUARD_SESSION_STORAGE_KEY);
  if (existing) return existing;
  const next = createSessionId();
  window.localStorage.setItem(TENANT_GUARD_SESSION_STORAGE_KEY, next);
  return next;
}

function withSession(path: string, sessionId: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}sessionId=${encodeURIComponent(sessionId)}`;
}

async function apiRequest<T>(path: string, sessionId: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${TENANT_GUARD_API_URL}${withSession(path, sessionId)}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as T) : (null as T);
  if (!response.ok) {
    throw new Error(`Tenant Guard API ${response.status}: ${text || response.statusText}`);
  }
  return body;
}

async function healthRequest(): Promise<TenantGuardHealth> {
  const response = await fetch(`${TENANT_GUARD_BASE_URL}/api/demo/health`);
  const text = await response.text();
  const body = text ? (JSON.parse(text) as TenantGuardHealth) : (null as unknown as TenantGuardHealth);
  if (!response.ok) {
    throw new Error(`Tenant Guard health ${response.status}: ${text || response.statusText}`);
  }
  return body;
}

function statusClass(status: ApiStatus): string {
  if (status === "connected") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "offline") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function tenantTone(tenantId: string): string {
  if (tenantId === "tenant-a") return "border-blue-200 bg-blue-50 text-blue-700";
  if (tenantId === "tenant-b") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-violet-200 bg-violet-50 text-violet-700";
}

function actionTone(decision: ActionDecision | null): string {
  if (!decision) return "border-slate-200 bg-slate-50 text-slate-600";
  if (decision.success) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (decision.confirmationRequired) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function decisionLabel(decision: ActionDecision | null): string {
  if (!decision) return "Not run";
  if (decision.success) return "Executed";
  if (decision.confirmationRequired) return "Confirmation required";
  return decision.errorCode || "Denied";
}

function dataText(data: Record<string, unknown> | null | undefined, key: string): string {
  const value = data?.[key];
  return typeof value === "string" ? value : "";
}

function HitList({ title, hits, empty }: { title: string; hits: KnowledgeHit[]; empty: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        <Badge variant="outline">{hits.length} docs</Badge>
      </div>
      <div className="space-y-2">
        {hits.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
            {empty}
          </div>
        ) : (
          hits.map((hit) => (
            <div key={hit.id} className={`rounded-md border px-3 py-2 ${tenantTone(hit.tenantId)}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{hit.title}</span>
                <span className="text-xs uppercase tracking-wide">{hit.tenantId}</span>
              </div>
              <div className="mt-1 text-xs text-slate-600">{String(hit.metadata.visibility || "internal")}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CatalogList({ title, summary }: { title: string; summary: CatalogSummary }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        <Badge variant="outline">{summary.role}</Badge>
      </div>
      <div className="space-y-2">
        {summary.entries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2">
            <div>
              <div className="text-sm font-medium text-slate-900">{entry.title}</div>
              <div className="text-xs text-slate-500">{entry.id}</div>
            </div>
            <Badge className={tenantTone(entry.tenantId)} variant="outline">
              {entry.tenantId}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIFabricTenantGuard() {
  const { toast } = useToast();
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [dashboard, setDashboard] = useState<TenantGuardDashboard>(EMPTY_DASHBOARD);
  const [comparison, setComparison] = useState<SearchComparison>(EMPTY_DASHBOARD.defaultComparison);
  const [health, setHealth] = useState<TenantGuardHealth | null>(null);
  const [query, setQuery] = useState("VPN");
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blockingMessage, setBlockingMessage] = useState("Loading Tenant Guard proof state...");
  const [actionResult, setActionResult] = useState<ActionDecision | null>(null);
  const [deleteResult, setDeleteResult] = useState<TenantDeletionResult | null>(null);
  const [ragTenantId, setRagTenantId] = useState("tenant-a");
  const [ragRole, setRagRole] = useState("USER");
  const [ragQuery, setRagQuery] = useState("How do I configure VPN?");
  const [ragResponse, setRagResponse] = useState<TenantRagResponse | null>(null);
  const [isSeedingIndex, setIsSeedingIndex] = useState(false);
  const [isQueryingRag, setIsQueryingRag] = useState(false);
  const [nlActionPrompt, setNlActionPrompt] = useState("Archive our VPN setup document.");
  const [nlActionResult, setNlActionResult] = useState<ActionDecision | null>(null);
  const [isResolvingNlAction, setIsResolvingNlAction] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [next, nextHealth] = await Promise.all([
      apiRequest<TenantGuardDashboard>("/dashboard", sessionId),
      healthRequest(),
    ]);
    const normalized = normalizeDashboard(next);
    setDashboard(normalized);
    setHealth(nextHealth);
    setComparison(normalized.defaultComparison);
    setQuery(normalized.defaultComparison.query);
    setApiStatus("connected");
    return normalized;
  }, [sessionId]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setBlockingMessage("Loading Tenant Guard proof state...");
    loadDashboard()
      .then(() => {
        if (!mounted) return;
      })
      .catch((error) => {
        if (!mounted) return;
        setApiStatus("offline");
        toast({
          title: "Tenant Guard API is offline",
          description: error instanceof Error ? error.message : "Unable to connect to the Tenant Guard backend.",
          variant: "destructive",
        });
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [loadDashboard, toast]);

  const resetDemo = useCallback(async () => {
    setIsLoading(true);
    setBlockingMessage("Resetting your isolated Tenant Guard session...");
    setActionResult(null);
    setDeleteResult(null);
    setRagResponse(null);
    setNlActionResult(null);
    try {
      const next = await apiRequest<TenantGuardDashboard>("/reset", sessionId, { method: "POST" });
      const normalized = normalizeDashboard(next);
      setDashboard(normalized);
      setComparison(normalized.defaultComparison);
      setQuery(normalized.defaultComparison.query);
      setApiStatus("connected");
      toast({ title: "Tenant Guard reset", description: "Tenant evidence and policy decisions were restored." });
    } catch (error) {
      setApiStatus("offline");
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Unable to reset Tenant Guard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  const runCompare = useCallback(async () => {
    setIsComparing(true);
    try {
      const next = await apiRequest<SearchComparison>(`/compare?q=${encodeURIComponent(query || "VPN")}`, sessionId);
      setComparison(next);
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("offline");
      toast({
        title: "Search comparison failed",
        description: error instanceof Error ? error.message : "Unable to compare tenant search results.",
        variant: "destructive",
      });
    } finally {
      setIsComparing(false);
    }
  }, [query, sessionId, toast]);

  const runCrossTenantGuard = useCallback(async () => {
    setIsActing(true);
    try {
      const result = await apiRequest<ActionDecision>("/actions/execute", sessionId, {
        method: "POST",
        body: JSON.stringify({
          tenantId: "tenant-a",
          role: "USER",
          actionId: "archive_document",
          documentId: "doc-b",
          accessMode: "WRITE_ONLY",
          confirmed: true,
        }),
      });
      setActionResult(result);
    } catch (error) {
      toast({
        title: "Action check failed",
        description: error instanceof Error ? error.message : "Unable to run cross-tenant action check.",
        variant: "destructive",
      });
    } finally {
      setIsActing(false);
    }
  }, [sessionId, toast]);

  const previewWriteAction = useCallback(async () => {
    setIsActing(true);
    try {
      const result = await apiRequest<ActionDecision>("/actions/execute", sessionId, {
        method: "POST",
        body: JSON.stringify({
          tenantId: "tenant-a",
          role: "ADMIN",
          actionId: "archive_document",
          documentId: "doc-a",
          accessMode: "WRITE_ONLY",
          confirmed: false,
        }),
      });
      setActionResult(result);
    } catch (error) {
      toast({
        title: "Confirmation preview failed",
        description: error instanceof Error ? error.message : "Unable to preview write action.",
        variant: "destructive",
      });
    } finally {
      setIsActing(false);
    }
  }, [sessionId, toast]);

  const confirmWriteAction = useCallback(async () => {
    setIsActing(true);
    try {
      const result = await apiRequest<ActionDecision>("/actions/execute", sessionId, {
        method: "POST",
        body: JSON.stringify({
          tenantId: "tenant-a",
          role: "ADMIN",
          actionId: "archive_document",
          documentId: "doc-a",
          accessMode: "WRITE_ONLY",
          confirmed: true,
        }),
      });
      setActionResult(result);
    } catch (error) {
      toast({
        title: "Write action failed",
        description: error instanceof Error ? error.message : "Unable to execute write action.",
        variant: "destructive",
      });
    } finally {
      setIsActing(false);
    }
  }, [sessionId, toast]);

  const runNaturalLanguageAction = useCallback(async (confirmed: boolean) => {
    setIsResolvingNlAction(true);
    try {
      const result = await apiRequest<ActionDecision>("/actions/nl", sessionId, {
        method: "POST",
        body: JSON.stringify({
          tenantId: ragTenantId,
          role: ragRole,
          instruction: nlActionPrompt,
          confirmed,
        }),
      });
      setNlActionResult(result);
      setActionResult(result);
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("offline");
      toast({
        title: "NL action failed",
        description: error instanceof Error ? error.message : "Unable to resolve the natural-language action.",
        variant: "destructive",
      });
    } finally {
      setIsResolvingNlAction(false);
    }
  }, [nlActionPrompt, ragRole, ragTenantId, sessionId, toast]);

  const deleteTenant = useCallback(async () => {
    setIsDeleting(true);
    try {
      const result = await apiRequest<TenantDeletionResult>("/tenants/delete", sessionId, {
        method: "POST",
        body: JSON.stringify({
          tenantId: "platform",
          role: "ADMIN",
          targetTenantId: "tenant-b",
        }),
      });
      setDeleteResult(result);
      await loadDashboard();
    } catch (error) {
      toast({
        title: "Tenant deletion failed",
        description: error instanceof Error ? error.message : "Unable to delete tenant evidence.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [loadDashboard, sessionId, toast]);

  const seedAiIndex = useCallback(async () => {
    setIsSeedingIndex(true);
    try {
      const proof = await apiRequest<VectorIndexProof>("/index/seed", sessionId, { method: "POST" });
      setDashboard((current) => ({ ...current, indexProof: { ...EMPTY_INDEX_PROOF, ...proof } }));
      setRagResponse((current) => (current ? { ...current, indexProof: proof } : current));
      setApiStatus("connected");
      toast({
        title: "AI Fabric index seeded",
        description: `${proof.indexedDocuments || 0} vectors are available for tenant-scoped retrieval.`,
      });
    } catch (error) {
      setApiStatus("offline");
      toast({
        title: "Index seed failed",
        description: error instanceof Error ? error.message : "Unable to seed Tenant Guard AI index.",
        variant: "destructive",
      });
    } finally {
      setIsSeedingIndex(false);
    }
  }, [sessionId, toast]);

  const runAiFabricQuery = useCallback(async () => {
    setIsQueryingRag(true);
    try {
      const response = await apiRequest<TenantRagResponse>("/query", sessionId, {
        method: "POST",
        body: JSON.stringify({
          tenantId: ragTenantId,
          role: ragRole,
          query: ragQuery,
          limit: 5,
        }),
      });
      setRagResponse(response);
      setDashboard((current) => ({
        ...current,
        indexProof: { ...EMPTY_INDEX_PROOF, ...(response.indexProof || {}) },
      }));
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("offline");
      toast({
        title: "AI Fabric query failed",
        description: error instanceof Error ? error.message : "Unable to run tenant-scoped AI Fabric retrieval.",
        variant: "destructive",
      });
    } finally {
      setIsQueryingRag(false);
    }
  }, [ragQuery, ragRole, ragTenantId, sessionId, toast]);

  const visibleStatus = useMemo(() => {
    if (apiStatus === "connected") return "API connected";
    if (apiStatus === "offline") return "API offline";
    return "Connecting";
  }, [apiStatus]);

  const activeActionDecision = actionResult || dashboard.writeActionPreview;
  const actionPolicyExplanation = dataText(activeActionDecision.data, "policyExplanation");
  const actionPolicyDecision = dataText(activeActionDecision.data, "policyDecision");
  const pageBlocked = isLoading || isDeleting;
  const activeIndexProof = ragResponse?.indexProof || deleteResult?.indexProof || dashboard.indexProof || EMPTY_INDEX_PROOF;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {pageBlocked ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 text-center shadow-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-lg font-semibold text-slate-950">
              {isDeleting ? "Deleting tenant-scoped evidence..." : blockingMessage}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The backend is preparing an isolated proof state for this browser session.
            </p>
          </div>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-[1440px] px-6 py-8">
        <div className="mb-8">
          <Link to="/demos" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge className="border-blue-200 bg-blue-50 text-blue-700" variant="outline">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  AI Fabric Tenant Guard
                </Badge>
                <Badge className={statusClass(apiStatus)} variant="outline">
                  {apiStatus === "loading" ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
                  {apiStatus === "connected" ? <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> : null}
                  {apiStatus === "offline" ? <XCircle className="mr-1 h-3.5 w-3.5" /> : null}
                  {visibleStatus}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-normal text-slate-950 md:text-5xl">AI Fabric Tenant Guard</h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
                Compare tenant-scoped retrieval, catalog visibility, guarded actions, and deletion evidence from one real AI Fabric app.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/demos/ai-fabric-tenant-guard/about">
                  <Info className="mr-2 h-4 w-4" />
                  About this demo
                </Link>
              </Button>
              <Button variant="outline" onClick={() => loadDashboard()} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={resetDemo} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Reset guard
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Documents</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">{dashboard.stats.totalDocuments}</p>
              </div>
              <div className="rounded-md bg-blue-50 p-3 text-blue-600">
                <Database className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Tenants</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">{dashboard.stats.tenantCount}</p>
              </div>
              <div className="rounded-md bg-emerald-50 p-3 text-emerald-600">
                <Building2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Restricted</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">{dashboard.stats.restrictedDocuments}</p>
              </div>
              <div className="rounded-md bg-amber-50 p-3 text-amber-600">
                <Lock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Blocked Action</p>
                <p className="mt-1 text-xl font-bold text-rose-600">{dashboard.crossTenantDenied.errorCode || "Ready"}</p>
              </div>
              <div className="rounded-md bg-rose-50 p-3 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[0.9fr_2fr]">
            <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-blue-700">Session Scope</p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-950">{dashboard.session.sessionId}</p>
                </div>
                <Badge className="border-blue-200 bg-white text-blue-700" variant="outline">
                  {dashboard.session.isolated ? "isolated" : "canonical"}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Mutating demo actions are scoped to this browser session and expire after {dashboard.session.ttlHours || 6} hours.
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Backend Boundary Proof</p>
                  <p className="mt-1 text-sm text-slate-700">{dashboard.boundaryProof.summary || "Waiting for proof data."}</p>
                </div>
                <Badge className={dashboard.boundaryProof.passed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"} variant="outline">
                  {dashboard.boundaryProof.passed ? "passed" : "needs attention"}
                </Badge>
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {dashboard.boundaryProof.checks.map((check) => (
                  <div key={check.id} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                    <div className="flex items-start gap-2">
                      {check.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <XCircle className="mt-0.5 h-4 w-4 text-rose-600" />}
                      <div>
                        <p className="text-sm font-medium text-slate-950">{check.label}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{check.evidence}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-blue-100">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  AI Fabric Indexed Retrieval
                </CardTitle>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Real vector search with tenant/session metadata filters, then backend verification before evidence is shown.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={seedAiIndex} disabled={isSeedingIndex || apiStatus === "offline"}>
                  {isSeedingIndex ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                  Seed AI index
                </Button>
                <Button onClick={runAiFabricQuery} disabled={isQueryingRag || apiStatus === "offline"} className="bg-blue-600 hover:bg-blue-700">
                  {isQueryingRag ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Run retrieval
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-[1.1fr_1.35fr_0.9fr]">
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { label: "Tenant A", tenantId: "tenant-a", role: "USER", tone: "border-blue-200 bg-blue-50 text-blue-700" },
                  { label: "Tenant B", tenantId: "tenant-b", role: "USER", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
                  { label: "Platform", tenantId: "platform", role: "ADMIN", tone: "border-violet-200 bg-violet-50 text-violet-700" },
                ].map((persona) => {
                  const active = ragTenantId === persona.tenantId && ragRole === persona.role;
                  return (
                    <button
                      key={`${persona.tenantId}-${persona.role}`}
                      type="button"
                      onClick={() => {
                        setRagTenantId(persona.tenantId);
                        setRagRole(persona.role);
                      }}
                      className={`rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                        active ? persona.tone : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{persona.label}</span>
                      <span className="mt-1 block text-xs font-medium opacity-80">{persona.tenantId} / {persona.role}</span>
                    </button>
                  );
                })}
              </div>
              <textarea
                value={ragQuery}
                onChange={(event) => setRagQuery(event.target.value)}
                className="min-h-[104px] w-full rounded-md border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-blue-400"
                aria-label="AI Fabric tenant retrieval query"
              />
              <div className="grid gap-2 sm:grid-cols-3">
                {["How do I configure VPN?", "Can I export invoices?", "hardware key rotation"].map((prompt) => (
                  <Button key={prompt} variant="outline" onClick={() => setRagQuery(prompt)} className="justify-start">
                    {prompt}
                  </Button>
                ))}
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Metadata Filter</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {ragResponse ? `${ragResponse.user.tenantId} / ${ragResponse.user.role}` : `${ragTenantId} / ${ragRole}`}
                    </p>
                  </div>
                  <Badge className={ragResponse?.boundaryProof.passed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"} variant="outline">
                    {ragResponse?.boundaryProof.passed ? "verified" : "ready"}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2">
                  {Object.entries(ragResponse?.metadataFilter || {
                    sessionId: dashboard.session.sessionId,
                    tenantId: ragTenantId === "platform" ? "all tenants" : ragTenantId,
                    visibleToUser: ragTenantId === "platform" ? "admin scope" : true,
                  }).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm">
                      <span className="font-medium text-slate-600">{key}</span>
                      <span className="break-all text-right text-slate-950">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Retrieved Answer</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {ragResponse ? `${ragResponse.hits.length} verified evidence docs` : "No retrieval run yet"}
                  </p>
                </div>
                <Badge className={ragResponse?.success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"} variant="outline">
                  {ragResponse?.success ? "LLM generated" : "idle"}
                </Badge>
              </div>
              {ragResponse ? (
                <div className="mb-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase text-slate-500">Model</p>
                    <p className="mt-1 break-all text-sm text-slate-900">{ragResponse.model || "no generation model"}</p>
                  </div>
                  <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase text-slate-500">Request</p>
                    <p className="mt-1 break-all text-sm text-slate-900">{ragResponse.requestId || "not reported"}</p>
                  </div>
                  <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase text-slate-500">Generation</p>
                    <p className="mt-1 text-sm text-slate-900">{ragResponse.processingTimeMs ?? 0} ms</p>
                  </div>
                </div>
              ) : null}
              <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-800">
                {ragResponse?.answer || "Run retrieval to let AI Fabric search tenant-safe evidence and generate an answer from only those verified documents."}
              </div>
              {ragResponse?.citations?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ragResponse.citations.map((citation) => (
                    <Badge key={`${citation.tenantId}-${citation.id}`} className={tenantTone(citation.tenantId)} variant="outline">
                      [{citation.id}] {citation.title}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 space-y-2">
                {(ragResponse?.hits || []).map((hit) => (
                  <div key={`${hit.tenantId}-${hit.id}`} className={`rounded-md border p-3 ${tenantTone(hit.tenantId)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{hit.title}</p>
                        <p className="mt-1 text-xs text-slate-600">{hit.id} · {hit.visibility}</p>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {Math.round((hit.score || 0) * 100)}%
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{hit.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Vector Proof</p>
                    <p className="mt-1 text-sm text-slate-700">{activeIndexProof.provider || "provider pending"}</p>
                  </div>
                  <Badge className={activeIndexProof.available ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"} variant="outline">
                    {activeIndexProof.status || "NOT_READY"}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2">
                  <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm">
                    <span className="text-slate-600">Indexed docs</span>
                    <span className="font-semibold text-slate-950">{activeIndexProof.indexedDocuments || 0}</span>
                  </div>
                  {Object.entries(activeIndexProof.indexedByTenant || {}).map(([tenantId, count]) => (
                    <div key={tenantId} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm">
                      <span className="text-slate-600">{tenantId}</span>
                      <span className="font-semibold text-slate-950">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Proof Checks</p>
                <div className="mt-3 space-y-2">
                  {(ragResponse?.boundaryProof.checks || activeIndexProof.checks || []).slice(0, 5).map((check) => (
                    <div key={check.id} className="flex items-start gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                      {check.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <XCircle className="mt-0.5 h-4 w-4 text-rose-600" />}
                      <div>
                        <p className="text-sm font-medium text-slate-950">{check.label}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{check.evidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Scenario Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.scenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-md border p-4 ${tenantTone(scenario.tenantId)}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{scenario.tenantName}</div>
                      <div className="text-xs text-slate-600">{scenario.tenantId} / {scenario.role}</div>
                    </div>
                    <Badge variant="outline">{scenario.defaultQuery}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{scenario.operatorGoal}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5 text-blue-600" />
                  Tenant Search Comparison
                </CardTitle>
                <div className="flex gap-2">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-10 w-40 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                    aria-label="Search query"
                  />
                  <Button onClick={runCompare} disabled={isComparing || apiStatus === "offline"} className="bg-blue-600 hover:bg-blue-700">
                    {isComparing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Compare
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <HitList title="Tenant A User" hits={comparison.tenantAResults} empty="No tenant A evidence." />
                <HitList title="Tenant B User" hits={comparison.tenantBResults} empty="No tenant B evidence." />
                <HitList title="Platform Admin" hits={comparison.platformAdminResults} empty="No platform evidence." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Guarded Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`rounded-md border p-4 ${actionTone(activeActionDecision)}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{decisionLabel(activeActionDecision)}</span>
                  <KeyRound className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700">{activeActionDecision.message || "Policy decision ready."}</p>
                {actionPolicyExplanation ? (
                  <p className="mt-2 text-xs leading-5 text-slate-600">{actionPolicyExplanation}</p>
                ) : null}
                {actionPolicyDecision ? (
                  <Badge className="mt-3 bg-white" variant="outline">{actionPolicyDecision}</Badge>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Button variant="outline" onClick={runCrossTenantGuard} disabled={isActing}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Test cross-tenant block
                </Button>
                <Button variant="outline" onClick={previewWriteAction} disabled={isActing}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview write action
                </Button>
                <Button onClick={confirmWriteAction} disabled={isActing} className="bg-emerald-600 hover:bg-emerald-700">
                  {isActing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Confirm write
                </Button>
              </div>
              <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-semibold uppercase text-blue-700">Natural-language action</p>
                <textarea
                  value={nlActionPrompt}
                  onChange={(event) => setNlActionPrompt(event.target.value)}
                  className="mt-2 min-h-[84px] w-full rounded-md border border-blue-100 bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-blue-400"
                  aria-label="Natural-language tenant action"
                />
                <div className="mt-2 grid gap-2">
                  {[
                    "Archive our VPN setup document.",
                    "Archive the Tenant B VPN document.",
                    "Archive the billing export policy.",
                  ].map((prompt) => (
                    <Button key={prompt} variant="outline" onClick={() => setNlActionPrompt(prompt)} className="justify-start bg-white">
                      {prompt}
                    </Button>
                  ))}
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => runNaturalLanguageAction(false)}
                    disabled={isResolvingNlAction || apiStatus === "offline"}
                    className="bg-white"
                  >
                    {isResolvingNlAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                    Resolve action
                  </Button>
                  <Button
                    onClick={() => runNaturalLanguageAction(true)}
                    disabled={isResolvingNlAction || apiStatus === "offline"}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isResolvingNlAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Resolve and confirm
                  </Button>
                </div>
                {nlActionResult ? (
                  <div className={`mt-3 rounded-md border p-3 ${actionTone(nlActionResult)}`}>
                    <p className="text-sm font-semibold">{decisionLabel(nlActionResult)}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{nlActionResult.message}</p>
                    <div className="mt-2 grid gap-1 text-xs text-slate-600">
                      <span>LLM action: {dataText(nlActionResult.data, "llmActionId") || "unresolved"}</span>
                      <span>LLM target: {dataText(nlActionResult.data, "llmDocumentId") || "unresolved"}</span>
                      <span>Model: {dataText(nlActionResult.data, "llmModel") || "not reported"}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                Catalog Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <CatalogList title="Tenant A User" summary={dashboard.tenantUserCatalog} />
              <CatalogList title="Platform Admin" summary={dashboard.platformAdminCatalog} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trash2 className="h-5 w-5 text-rose-600" />
                Tenant Deletion Evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-rose-700">{dashboard.deletionPreview.targetTenantId}</p>
                    <p className="text-sm text-slate-600">{dashboard.deletionPreview.matchingDocuments} matching documents</p>
                  </div>
                  <Badge className="border-rose-200 bg-white text-rose-700" variant="outline">
                    guarded delete
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dashboard.deletionPreview.documentIds.map((id) => (
                    <Badge key={id} variant="outline" className="bg-white">
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>
              {deleteResult ? (
                <div className={`rounded-md border p-4 ${deleteResult.success ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                  <p className="text-sm font-semibold text-slate-900">
                    {deleteResult.success ? `${deleteResult.deletedDocuments} documents deleted` : deleteResult.errorCode}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{deleteResult.message || "No documents changed."}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Deleted: {deleteResult.deletedIds.join(", ") || "none"} · Remaining tenants: {deleteResult.remainingTenantIds?.join(", ") || "unknown"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Vector cleanup: {deleteResult.deletedVectors ?? 0} removed
                    {deleteResult.deletedVectorEntityIds?.length ? ` (${deleteResult.deletedVectorEntityIds.join(", ")})` : ""}
                  </p>
                </div>
              ) : null}
              <Button onClick={deleteTenant} disabled={isDeleting || apiStatus === "offline"} variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50">
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete tenant-b evidence
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-violet-600" />
                Runtime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Backend</p>
                <p className="mt-2 break-all text-sm text-slate-700">{TENANT_GUARD_BASE_URL}</p>
              </div>
              <div className="mt-3 rounded-md border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Deployment</p>
                <p className="mt-2 break-all text-sm text-slate-700">{health?.commit || "unknown commit"}</p>
                <p className="mt-1 text-xs text-slate-500">{health?.builtAt || "build metadata pending"}</p>
              </div>
              <div className="mt-3 rounded-md border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">API Surface</p>
                <p className="mt-2 text-sm text-slate-700">/api/tenant-guard-demo</p>
              </div>
              <div className="mt-3 rounded-md border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Vector Provider</p>
                <p className="mt-2 text-sm text-slate-700">{activeIndexProof.provider || "pending"}</p>
                <p className="mt-1 break-all text-xs text-slate-500">{activeIndexProof.searchFilterMode || "metadata filter pending"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>

      <Footer />
    </div>
  );
}
