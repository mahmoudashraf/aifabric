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
import { DemoBackendArchitecture } from "./components/DemoBackendArchitecture";
import { demoBackendArchitectures } from "./components/demoBackendArchitectures";

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
}

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
};

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${TENANT_GUARD_API_URL}${path}`, {
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
  const [dashboard, setDashboard] = useState<TenantGuardDashboard>(EMPTY_DASHBOARD);
  const [comparison, setComparison] = useState<SearchComparison>(EMPTY_DASHBOARD.defaultComparison);
  const [query, setQuery] = useState("VPN");
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionResult, setActionResult] = useState<ActionDecision | null>(null);
  const [deleteResult, setDeleteResult] = useState<TenantDeletionResult | null>(null);

  const loadDashboard = useCallback(async () => {
    const next = await apiRequest<TenantGuardDashboard>("/dashboard");
    setDashboard(next);
    setComparison(next.defaultComparison);
    setQuery(next.defaultComparison.query);
    setApiStatus("connected");
    return next;
  }, []);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    apiRequest<TenantGuardDashboard>("/dashboard")
      .then((next) => {
        if (!mounted) return;
        setDashboard(next);
        setComparison(next.defaultComparison);
        setQuery(next.defaultComparison.query);
        setApiStatus("connected");
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
  }, [toast]);

  const resetDemo = useCallback(async () => {
    setIsLoading(true);
    setActionResult(null);
    setDeleteResult(null);
    try {
      const next = await apiRequest<TenantGuardDashboard>("/reset", { method: "POST" });
      setDashboard(next);
      setComparison(next.defaultComparison);
      setQuery(next.defaultComparison.query);
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
  }, [toast]);

  const runCompare = useCallback(async () => {
    setIsComparing(true);
    try {
      const next = await apiRequest<SearchComparison>(`/compare?q=${encodeURIComponent(query || "VPN")}`);
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
  }, [query, toast]);

  const runCrossTenantGuard = useCallback(async () => {
    setIsActing(true);
    try {
      const result = await apiRequest<ActionDecision>("/actions/execute", {
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
  }, [toast]);

  const previewWriteAction = useCallback(async () => {
    setIsActing(true);
    try {
      const result = await apiRequest<ActionDecision>("/actions/execute", {
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
  }, [toast]);

  const confirmWriteAction = useCallback(async () => {
    setIsActing(true);
    try {
      const result = await apiRequest<ActionDecision>("/actions/execute", {
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
  }, [toast]);

  const deleteTenant = useCallback(async () => {
    setIsDeleting(true);
    try {
      const result = await apiRequest<TenantDeletionResult>("/tenants/delete", {
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
  }, [loadDashboard, toast]);

  const visibleStatus = useMemo(() => {
    if (apiStatus === "connected") return "API connected";
    if (apiStatus === "offline") return "API offline";
    return "Connecting";
  }, [apiStatus]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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
              <div className={`rounded-md border p-4 ${actionTone(actionResult || dashboard.writeActionPreview)}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{decisionLabel(actionResult || dashboard.writeActionPreview)}</span>
                  <KeyRound className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700">{(actionResult || dashboard.writeActionPreview).message || "Policy decision ready."}</p>
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
                  <p className="mt-1 text-sm text-slate-600">{deleteResult.deletedIds.join(", ") || "No documents changed."}</p>
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
                <p className="text-xs font-semibold uppercase text-slate-500">API Surface</p>
                <p className="mt-2 text-sm text-slate-700">/api/tenant-guard-demo</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DemoBackendArchitecture architecture={demoBackendArchitectures.tenantGuard} className="mt-6" />
      </main>

      <Footer />
    </div>
  );
}
