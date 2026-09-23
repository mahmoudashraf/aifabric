import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Braces,
  CheckCircle2,
  Database,
  ExternalLink,
  Eye,
  FileJson,
  FilePlus2,
  FileText,
  Fingerprint,
  Info,
  Layers3,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";

import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";
import {
  DOCUMENT_OPERATIONS_BASE_URL,
  DOCUMENT_OPERATIONS_SESSION_KEY,
  DocumentDemoHealth,
  DocumentDemoSession,
  DocumentDeleteResult,
  DocumentIndexResult,
  DocumentLifecycle,
  DocumentPreview,
  DocumentQueryResult,
  DocumentSourceSummary,
  compactDocumentId,
  documentForm,
  documentOperationsApi,
} from "./document-operations/api";

const DEFAULT_QUERY = "Can I return an opened laptop?";
const DEFAULT_TITLE = "Holiday Shipping Policy";
const DEFAULT_FILENAME = "holiday-shipping-policy.txt";
const DEFAULT_CONTENT =
  "Holiday orders placed before 18 December use priority shipping. "
  + "Orders delayed by more than five business days qualify for a shipping refund.";
const DEFAULT_REPLACEMENT =
  "Opened laptops may be returned within 30 days when the serial number matches the order. "
  + "All accessories must be included. No restocking fee applies to verified hardware faults.";

const TRANSITIONAL_STATUSES = new Set(["INDEXING", "REPLACING", "DELETING"]);

function statusTone(status?: string): string {
  const normalized = (status || "UNKNOWN").toUpperCase();
  if (["INDEXED", "ACTIVE", "COMPLETED"].includes(normalized)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["FAILED", "DELETED", "DEAD_LETTER"].includes(normalized)) {
    return "border-red-200 bg-red-50 text-red-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-900";
}

function formatStatus(value?: string): string {
  return (value || "unknown").replaceAll("_", " ").toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function SourceRow({
  source,
  selected,
  onSelect,
}: {
  source: DocumentSourceSummary;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = source.originalFilename.endsWith(".json") ? FileJson : FileText;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full border-b px-4 py-4 text-left transition-colors last:border-b-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${
        selected ? "bg-blue-50" : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${
          selected ? "border-blue-200 bg-white text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{source.title}</p>
              <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                {source.originalFilename}
              </p>
            </div>
            <Badge variant="outline" className={statusTone(source.status)}>
              {formatStatus(source.status)}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Source v{source.sourceVersion}</span>
            <span>Active v{source.activeVersion ?? "none"}</span>
            <span>{source.activeChunks} chunks</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function DocumentIntelligenceHub() {
  const { toast } = useToast();
  const [pageLoading, setPageLoading] = useState<"preparing" | "resetting" | null>("preparing");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<DocumentDemoHealth | null>(null);
  const [session, setSession] = useState<DocumentDemoSession | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [preview, setPreview] = useState<DocumentPreview | null>(null);
  const [lifecycle, setLifecycle] = useState<DocumentLifecycle | null>(null);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [queryResult, setQueryResult] = useState<DocumentQueryResult | null>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [filename, setFilename] = useState(DEFAULT_FILENAME);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [replacement, setReplacement] = useState(DEFAULT_REPLACEMENT);
  const [lastOperation, setLastOperation] = useState<
    DocumentIndexResult | DocumentDeleteResult | null
  >(null);

  const selectedSource = useMemo(
    () => session?.sources.find((source) => source.id === selectedSourceId) || null,
    [selectedSourceId, session],
  );

  const applySession = useCallback((next: DocumentDemoSession) => {
    setSession(next);
    setSelectedSourceId((current) => {
      if (current && next.sources.some((source) => source.id === current)) return current;
      return next.sources.find((source) => source.status !== "DELETED")?.id
        || next.sources[0]?.id
        || null;
    });
    return next;
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    const next = await documentOperationsApi<DocumentDemoSession>(
      `/api/document-demo/sessions/${sessionId}`,
    );
    return applySession(next);
  }, [applySession]);

  const waitForSettledState = useCallback(async (sessionId: string) => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const next = await loadSession(sessionId);
      if (!next.sources.some((source) => TRANSITIONAL_STATUSES.has(source.status))) {
        return next;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 650));
    }
    return loadSession(sessionId);
  }, [loadSession]);

  const createSession = useCallback(async () => {
    const next = await documentOperationsApi<DocumentDemoSession>(
      "/api/document-demo/sessions",
      { method: "POST" },
    );
    sessionStorage.setItem(DOCUMENT_OPERATIONS_SESSION_KEY, next.sessionId);
    applySession(next);
    return waitForSettledState(next.sessionId);
  }, [applySession, waitForSettledState]);

  const initialize = useCallback(async () => {
    setPageLoading("preparing");
    setError(null);
    try {
      const healthResult = await documentOperationsApi<DocumentDemoHealth>(
        "/api/demo/health",
      );
      setHealth(healthResult);
      const stored = sessionStorage.getItem(DOCUMENT_OPERATIONS_SESSION_KEY);
      if (stored) {
        try {
          await waitForSettledState(stored);
          return;
        } catch {
          sessionStorage.removeItem(DOCUMENT_OPERATIONS_SESSION_KEY);
        }
      }
      await createSession();
    } catch (caught) {
      setError(caught instanceof Error
        ? caught.message
        : "Unable to prepare the document workspace.");
    } finally {
      setPageLoading(null);
    }
  }, [createSession, waitForSettledState]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const refresh = async () => {
    if (!session || busy) return;
    setBusy("refresh");
    setError(null);
    try {
      await loadSession(session.sessionId);
      if (selectedSourceId) {
        setLifecycle(await documentOperationsApi<DocumentLifecycle>(
          `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSourceId}`,
        ));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to refresh lifecycle state.");
    } finally {
      setBusy(null);
    }
  };

  const reset = async () => {
    if (busy || pageLoading) return;
    setPageLoading("resetting");
    setError(null);
    try {
      sessionStorage.removeItem(DOCUMENT_OPERATIONS_SESSION_KEY);
      setPreview(null);
      setLifecycle(null);
      setQueryResult(null);
      setLastOperation(null);
      await createSession();
      toast({ title: "Fresh isolated knowledge workspace ready" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset the workspace.");
    } finally {
      setPageLoading(null);
    }
  };

  const inspect = async () => {
    if (!session || !selectedSource || busy) return;
    setBusy("preview");
    setError(null);
    try {
      const [previewResult, lifecycleResult] = await Promise.all([
        documentOperationsApi<DocumentPreview>(
          `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSource.id}/preview`,
        ),
        documentOperationsApi<DocumentLifecycle>(
          `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSource.id}`,
        ),
      ]);
      setPreview(previewResult);
      setLifecycle(lifecycleResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to preview this source.");
    } finally {
      setBusy(null);
    }
  };

  const indexSelected = async () => {
    if (!session || !selectedSource || busy) return;
    setBusy("index");
    setError(null);
    try {
      const result = await documentOperationsApi<DocumentIndexResult>(
        `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSource.id}/index`,
        { method: "POST" },
      );
      setLastOperation(result);
      await waitForSettledState(session.sessionId);
      setLifecycle(await documentOperationsApi<DocumentLifecycle>(
        `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSource.id}`,
      ));
      toast({ title: `${result.queuedChunks} chunk${result.queuedChunks === 1 ? "" : "s"} submitted` });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to index this source.");
    } finally {
      setBusy(null);
    }
  };

  const deleteSelected = async () => {
    if (!session || !selectedSource || busy) return;
    setBusy("delete");
    setError(null);
    try {
      const result = await documentOperationsApi<DocumentDeleteResult>(
        `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSource.id}`,
        { method: "DELETE" },
      );
      setLastOperation(result);
      await waitForSettledState(session.sessionId);
      setLifecycle(await documentOperationsApi<DocumentLifecycle>(
        `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSource.id}`,
      ));
      toast({ title: "Exact manifest deletion completed" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete this source.");
    } finally {
      setBusy(null);
    }
  };

  const createSource = async (event: FormEvent) => {
    event.preventDefault();
    if (!session || busy || !content.trim()) return;
    setBusy("create");
    setError(null);
    try {
      const source = await documentOperationsApi<DocumentSourceSummary>(
        `/api/document-demo/sessions/${session.sessionId}/sources`,
        { method: "POST", body: documentForm(filename, title, content) },
      );
      await loadSession(session.sessionId);
      setSelectedSourceId(source.id);
      setPreview(null);
      setLifecycle(null);
      toast({ title: "Source stored; preview it before indexing" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create the source.");
    } finally {
      setBusy(null);
    }
  };

  const replaceSelected = async () => {
    if (!session || !selectedSource || busy || !replacement.trim()) return;
    setBusy("replace");
    setError(null);
    try {
      const source = await documentOperationsApi<DocumentSourceSummary>(
        `/api/document-demo/sessions/${session.sessionId}/sources/${selectedSource.id}/content`,
        {
          method: "PUT",
          body: documentForm(
            selectedSource.originalFilename,
            selectedSource.title,
            replacement,
          ),
        },
      );
      await loadSession(session.sessionId);
      setPreview(null);
      setLifecycle(null);
      setLastOperation(null);
      toast({ title: `Source version ${source.sourceVersion} prepared; index to activate it` });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to replace the source.");
    } finally {
      setBusy(null);
    }
  };

  const runQuery = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!session || busy || !query.trim()) return;
    setBusy("query");
    setError(null);
    try {
      const result = await documentOperationsApi<DocumentQueryResult>(
        `/api/document-demo/sessions/${session.sessionId}/query?query=${encodeURIComponent(query.trim())}&limit=8`,
      );
      setQueryResult(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to retrieve document evidence.");
    } finally {
      setBusy(null);
    }
  };

  const loadFile = async (file?: File) => {
    if (!file) return;
    if (!file.name.endsWith(".txt") && !file.name.endsWith(".json")) {
      setError("This reduced core demo accepts only .txt and .json sources.");
      return;
    }
    setFilename(file.name);
    setTitle(file.name.replace(/\.(txt|json)$/i, "").replaceAll(/[-_]/g, " "));
    setContent(await file.text());
  };

  const indexedCount = session?.sources.filter((source) => source.status === "INDEXED").length || 0;
  const activeChunks = session?.sources.reduce((total, source) => total + source.activeChunks, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <Navbar />
      {pageLoading ? (
        <DemoFullPageLoader
          title={pageLoading === "resetting"
            ? "Creating a fresh knowledge workspace"
            : "Preparing Document Knowledge Operations"}
          description="Creating an isolated tenant, storing trusted sources, and reconciling real indexing work."
          steps={[
            "Create backend-owned demo identity",
            "Index text and JSON through Spring AI document ETL",
            "Load active AI Fabric manifests and evidence",
          ]}
        />
      ) : null}

      <main className="pb-16 pt-24">
        <section className="border-b bg-white">
          <div className="container mx-auto px-4 py-8">
            <Link to="/demos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />All live demos
            </Link>
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800">
                  <Layers3 className="mr-1 h-3.5 w-3.5" />Spring AI ETL + AI Fabric lifecycle
                </Badge>
                <h1 className="mt-4 text-3xl font-bold tracking-normal md:text-5xl">
                  Document Knowledge Operations
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  Preview, index, replace, retrieve, and delete trusted document evidence while inspecting the exact manifests and durable work behind each operation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link to="/demos/ai-fabric-document-knowledge-operations/about">
                    <Info className="mr-2 h-4 w-4" />About this demo
                  </Link>
                </Button>
                <Button disabled={Boolean(busy)} variant="outline" onClick={() => void refresh()}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${busy === "refresh" ? "animate-spin" : ""}`} />Refresh
                </Button>
                <Button disabled={Boolean(busy)} variant="destructive" onClick={() => void reset()}>
                  <RotateCcw className="mr-2 h-4 w-4" />Reset workspace
                </Button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">AI Fabric {health?.aiFabricVersion || "checking"}</Badge>
              <Badge variant="secondary">Commit {compactDocumentId(health?.commit)}</Badge>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
                Evidence only · no browser-generated answer
              </Badge>
              <span className="self-center">Session {compactDocumentId(session?.sessionId)}</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto space-y-6 px-4 py-8">
          {error ? (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Visible runtime failure</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-3 md:grid-cols-4">
            {[
              [FileText, session?.sources.length || 0, "Sources"],
              [CheckCircle2, indexedCount, "Indexed"],
              [Database, activeChunks, "Active chunks"],
              [ShieldCheck, "Server", "Tenant boundary"],
            ].map(([Icon, value, label]) => {
              const TypedIcon = Icon as typeof FileText;
              return (
                <div key={String(label)} className="border-y bg-white px-4 py-4 md:border">
                  <TypedIcon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold">{String(value)}</p>
                  <p className="mt-1 text-xs uppercase text-muted-foreground">{String(label)}</p>
                </div>
              );
            })}
          </div>

          <section className="border-y bg-slate-950 px-5 py-5 text-white md:border md:px-6">
            <div className="grid gap-5 md:grid-cols-4">
              {[
                ["1", "Preview", "Build a bounded plan without writing vectors."],
                ["2", "Index", "Queue canonical AIIndexDocument work and activate it."],
                ["3", "Replace", "Keep old evidence active until the new version succeeds."],
                ["4", "Delete", "Remove exact manifest entity IDs, then query again."],
              ].map(([step, label, copy]) => (
                <div key={step} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">{step}</div>
                  <div><p className="font-semibold">{label}</p><p className="mt-1 text-sm leading-5 text-slate-300">{copy}</p></div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.68fr)_minmax(0,1.6fr)]">
            <aside className="min-w-0 overflow-hidden border bg-white shadow-sm">
              <div className="border-b px-4 py-4">
                <h2 className="flex items-center gap-2 font-semibold"><Database className="h-4 w-4 text-blue-700" />Trusted sources</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Three seed sources are indexed for each isolated session.</p>
              </div>
              <div className="max-h-[680px] overflow-y-auto">
                {session?.sources.map((source) => (
                  <SourceRow
                    key={source.id}
                    source={source}
                    selected={source.id === selectedSourceId}
                    onSelect={() => {
                      setSelectedSourceId(source.id);
                      setPreview(null);
                      setLifecycle(null);
                      setLastOperation(null);
                    }}
                  />
                ))}
              </div>
            </aside>

            <div className="min-w-0 border bg-white p-4 shadow-sm md:p-6">
              <Tabs defaultValue="lifecycle">
                <TabsList className="grid h-auto w-full grid-cols-3">
                  <TabsTrigger value="lifecycle"><Layers3 className="mr-2 h-4 w-4" />Lifecycle</TabsTrigger>
                  <TabsTrigger value="retrieval"><Search className="mr-2 h-4 w-4" />Retrieval</TabsTrigger>
                  <TabsTrigger value="source"><FilePlus2 className="mr-2 h-4 w-4" />Add source</TabsTrigger>
                </TabsList>

                <TabsContent value="lifecycle" className="mt-6 space-y-5">
                  {selectedSource ? (
                    <>
                      <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-bold">{selectedSource.title}</h2>
                            <Badge variant="outline" className={statusTone(selectedSource.status)}>{formatStatus(selectedSource.status)}</Badge>
                          </div>
                          <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{selectedSource.id}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button disabled={Boolean(busy)} variant="outline" onClick={() => void inspect()}>
                            {busy === "preview" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}Preview plan
                          </Button>
                          <Button
                            disabled={Boolean(busy) || selectedSource.status !== "PENDING"}
                            onClick={() => void indexSelected()}
                          >
                            {busy === "index" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}Index version {selectedSource.sourceVersion}
                          </Button>
                          <Button
                            disabled={Boolean(busy) || selectedSource.status === "DELETED" || TRANSITIONAL_STATUSES.has(selectedSource.status)}
                            variant="destructive"
                            onClick={() => void deleteSelected()}
                          >
                            {busy === "delete" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}Delete evidence
                          </Button>
                        </div>
                      </div>

                      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                          ["Source version", selectedSource.sourceVersion],
                          ["Active version", selectedSource.activeVersion ?? "None"],
                          ["Active chunks", selectedSource.activeChunks],
                          ["Visibility", selectedSource.visibility],
                        ].map(([label, value]) => (
                          <div key={label} className="border-l-2 border-blue-200 pl-3">
                            <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
                            <dd className="mt-1 font-semibold">{String(value)}</dd>
                          </div>
                        ))}
                      </dl>

                      {selectedSource.failureMessage ? (
                        <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>{selectedSource.failureCode}</AlertTitle><AlertDescription>{selectedSource.failureMessage}</AlertDescription></Alert>
                      ) : null}

                      <div className="grid gap-5 lg:grid-cols-2">
                        <section className="border p-4">
                          <h3 className="flex items-center gap-2 font-semibold"><RefreshCw className="h-4 w-4 text-violet-700" />Prepare a replacement</h3>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">The active version remains retrievable until this candidate is indexed successfully.</p>
                          <Textarea className="mt-4 min-h-36 resize-y" value={replacement} onChange={(event) => setReplacement(event.target.value)} />
                          <Button className="mt-3" disabled={Boolean(busy) || selectedSource.status !== "INDEXED"} variant="outline" onClick={() => void replaceSelected()}>
                            {busy === "replace" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Prepare next version
                          </Button>
                        </section>

                        <section className="border p-4">
                          <h3 className="flex items-center gap-2 font-semibold"><Fingerprint className="h-4 w-4 text-emerald-700" />Manifest proof</h3>
                          {!lifecycle?.manifests.length ? (
                            <p className="mt-4 text-sm leading-6 text-muted-foreground">Open the preview or refresh this source to inspect its manifests and durable work.</p>
                          ) : (
                            <div className="mt-4 space-y-3">
                              {lifecycle.manifests.map((manifest) => (
                                <div key={manifest.manifestId} className="border-l-2 border-emerald-300 pl-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-mono text-xs font-semibold">v{manifest.sourceVersion} · {compactDocumentId(manifest.manifestId)}</span>
                                    <Badge variant="outline" className={statusTone(manifest.state)}>{formatStatus(manifest.state)}</Badge>
                                  </div>
                                  <p className="mt-2 text-xs text-muted-foreground">{manifest.chunkCount} chunks · {manifest.indexingWork.length} index work · {manifest.deletionWork.length} delete work</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      </div>

                      {preview ? (
                        <section className="border-t pt-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div><h3 className="font-semibold">Side-effect-free plan preview</h3><p className="mt-1 text-sm text-muted-foreground">{preview.chunkCount} chunks · {preview.totalContentLength.toLocaleString()} characters · plan {compactDocumentId(preview.planId)}</p></div>
                            <Badge variant="outline">{preview.metadataDroppedCount} metadata keys dropped</Badge>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {preview.previewChunks.map((chunk) => (
                              <div key={chunk.entityId} className="border bg-slate-50 p-4">
                                <div className="flex items-center justify-between gap-2"><span className="font-mono text-[11px]">Chunk {chunk.chunkIndex + 1}/{chunk.chunkCount}</span><Badge variant="secondary">{chunk.contentLength} chars</Badge></div>
                                <p className="mt-3 text-sm leading-6">{chunk.contentPreview}</p>
                                <p className="mt-3 break-all font-mono text-[10px] text-muted-foreground">{chunk.entityId}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      ) : null}

                      {lastOperation ? (
                        <Alert className="border-blue-200 bg-blue-50 text-blue-950"><CheckCircle2 className="h-4 w-4" /><AlertTitle>Real durable work submitted</AlertTitle><AlertDescription>{lastOperation.workIds.length} work ID{lastOperation.workIds.length === 1 ? "" : "s"}: {lastOperation.workIds.map(compactDocumentId).join(", ") || "No vector work required"}.</AlertDescription></Alert>
                      ) : null}
                    </>
                  ) : (
                    <p className="py-16 text-center text-sm text-muted-foreground">Select a source to inspect its lifecycle.</p>
                  )}
                </TabsContent>

                <TabsContent value="retrieval" className="mt-6 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">Tenant-scoped retrieval evidence</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">This endpoint returns the real chunks selected by AI Fabric. It does not fabricate an answer or use browser text matching.</p>
                  </div>
                  <form className="flex flex-col gap-2 sm:flex-row" onSubmit={runQuery}>
                    <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask about the indexed knowledge..." />
                    <Button disabled={Boolean(busy) || !query.trim()} type="submit" className="sm:w-36">
                      {busy === "query" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}Retrieve
                    </Button>
                  </form>
                  {queryResult ? (
                    <section>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-y py-3">
                        <div><span className="font-semibold">{queryResult.resultCount} evidence result{queryResult.resultCount === 1 ? "" : "s"}</span><span className="ml-2 text-sm text-muted-foreground">in {queryResult.processingTimeMs} ms</span></div>
                        <Badge variant="outline">{queryResult.embeddingModel || "Configured embedding provider"}</Badge>
                      </div>
                      {!queryResult.evidence.length ? (
                        <div className="py-14 text-center"><Search className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-semibold">No active evidence matched</p><p className="mt-1 text-sm text-muted-foreground">Delete or replacement changes are visible here after lifecycle completion.</p></div>
                      ) : (
                        <div className="divide-y">
                          {queryResult.evidence.map((evidence) => (
                            <article key={evidence.entityId} className="py-5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{evidence.sourceName}</Badge><span className="font-mono text-[11px] text-muted-foreground">v{evidence.sourceVersion} · chunk {evidence.chunkIndex + 1}</span></div>
                                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800">{Math.round(evidence.score * 100)}% score</Badge>
                              </div>
                              <p className="mt-3 text-sm leading-7">{evidence.content}</p>
                              <details className="mt-3 text-xs text-muted-foreground"><summary className="cursor-pointer font-medium text-foreground">Safe evidence identity</summary><div className="mt-2 space-y-1 font-mono"><p className="break-all">entity: {evidence.entityId}</p><p className="break-all">source: {evidence.sourceId}</p><p className="break-all">chunk: {evidence.chunkId}</p></div></details>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  ) : null}
                </TabsContent>

                <TabsContent value="source" className="mt-6">
                  <form onSubmit={createSource} className="space-y-5">
                    <div><h2 className="text-xl font-bold">Add a trusted source</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use the editor or load a local text/JSON file. The backend stores it under its trusted root; indexing is a separate explicit operation.</p></div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">Title<Input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
                      <label className="grid gap-2 text-sm font-medium">Filename<Input value={filename} onChange={(event) => setFilename(event.target.value)} placeholder="knowledge.txt" /></label>
                    </div>
                    <label className="grid gap-2 text-sm font-medium">Load .txt or .json<Input type="file" accept=".txt,.json,text/plain,application/json" onChange={(event) => void loadFile(event.target.files?.[0])} /></label>
                    <label className="grid gap-2 text-sm font-medium">Source content<Textarea className="min-h-48 resize-y font-mono text-sm" value={content} onChange={(event) => setContent(event.target.value)} /></label>
                    <Button disabled={Boolean(busy) || !content.trim()} type="submit">
                      {busy === "create" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePlus2 className="mr-2 h-4 w-4" />}Store source
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <section className="grid gap-4 border bg-white p-5 md:grid-cols-4">
            {[
              [Braces, "Spring AI ETL", "DocumentReader and token splitting prepare trusted source content."],
              [Fingerprint, "Stable identity", "Source, version, chunk, entity, plan, and manifest IDs are deterministic."],
              [Database, "One lifecycle", "Canonical AIIndexDocument work uses the existing queue and vector provider."],
              [ShieldCheck, "Fail closed", "Tenant identity is server-owned and only active manifests may become evidence."],
            ].map(([Icon, label, copy]) => {
              const TypedIcon = Icon as typeof Braces;
              return <div key={String(label)}><TypedIcon className="h-5 w-5 text-primary" /><p className="mt-3 font-semibold">{String(label)}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(copy)}</p></div>;
            })}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Backend: {DOCUMENT_OPERATIONS_BASE_URL}</span>
            <a href={`${DOCUMENT_OPERATIONS_BASE_URL}/api/demo/health`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">Open safe health response <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        </section>
      </main>

      <ConsultationCtaBand compact title="Planning document knowledge operations?" body="Relate this preview, manifest, indexing, replacement, retrieval, and exact-delete lifecycle to a public or properly redacted Spring Boot workflow." />
      <Footer />
    </div>
  );
}
