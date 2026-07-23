import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AiFabricChatElement } from "@loom-ai-labs/ai-fabric-chat-ui";
import { AiFabricChat } from "@loom-ai-labs/ai-fabric-chat-ui/react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  CircleDashed,
  Code2,
  Database,
  FileText,
  Info,
  Laptop,
  Loader2,
  PencilLine,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";

import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";

const API_BASE = (
  import.meta.env.VITE_LIVE_DATA_SYNC_API_URL ||
  "https://ai-fabric-live-data-sync.46.224.145.148.sslip.io"
).replace(/\/$/, "");

const WORKSPACE_STORAGE_KEY = "ai-fabric-live-sync-workspace-v1";

type EntityKind = "PRODUCT" | "POLICY" | "GUIDE";
type ApiStatus = "loading" | "connected" | "offline";

interface VectorProof {
  present: boolean;
  inSync: boolean;
  vectorId: string | null;
  content: string | null;
  metadata: Record<string, unknown>;
  message: string;
}

interface EntityRecord {
  kind: EntityKind;
  entityType: string;
  recordKey: string;
  title: string;
  revision: number;
  updatedAt: string;
  fields: Record<string, unknown>;
  vector: VectorProof;
}

interface SyncEvent {
  id: string;
  operation: string;
  kind: EntityKind;
  entityType: string;
  recordKey: string;
  title: string;
  revision: number | null;
  sourcePresent: boolean;
  vectorPresent: boolean;
  inSync: boolean;
  elapsedMs: number;
  message: string;
  occurredAt: string;
}

interface AnnotationUse {
  annotation: string;
  location: string;
  proof: string;
}

interface DemoState {
  workspaceId: string;
  sourceCounts: Record<string, number>;
  vectorCounts: Record<string, number>;
  sourceTotal: number;
  vectorTotal: number;
  synchronizedTotal: number;
  entities: EntityRecord[];
  events: SyncEvent[];
  annotationCoverage: {
    annotations: AnnotationUse[];
    extractionOwner: string;
    lifecycleOwner: string;
    consistencyMode: string;
  };
  checkedAt: string;
}

interface WorkspaceResponse {
  workspaceId: string;
  expiresAt: string;
  state: DemoState;
}

interface MutationResponse {
  mutation: SyncEvent;
  state: DemoState;
}

interface DemoHealth {
  status?: string;
  version?: string;
  aiFabricVersion?: string;
  commit?: string;
  branch?: string;
  builtAt?: string;
}

type EditorValues = Record<string, string>;

const kindConfig: Record<
  EntityKind,
  { label: string; path: string; icon: typeof Laptop; tone: string }
> = {
  PRODUCT: {
    label: "Products",
    path: "products",
    icon: Laptop,
    tone: "border-blue-200 bg-blue-50 text-blue-700",
  },
  POLICY: {
    label: "Policies",
    path: "policies",
    icon: ShieldCheck,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  GUIDE: {
    label: "Support guides",
    path: "guides",
    icon: Wrench,
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
};

const editorFields: Record<
  EntityKind,
  Array<{ key: string; label: string; multiline?: boolean; type?: string }>
> = {
  PRODUCT: [
    { key: "title", label: "Product title" },
    { key: "summary", label: "Summary", multiline: true },
    { key: "specification", label: "Searchable specification", multiline: true },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", type: "number" },
    { key: "status", label: "Status" },
  ],
  POLICY: [
    { key: "title", label: "Policy title" },
    { key: "guidance", label: "Searchable guidance", multiline: true },
    { key: "audience", label: "Audience" },
    { key: "status", label: "Status" },
    { key: "effectiveDate", label: "Effective date", type: "date" },
  ],
  GUIDE: [
    { key: "title", label: "Guide title" },
    { key: "symptoms", label: "Searchable symptoms", multiline: true },
    { key: "resolution", label: "Searchable resolution", multiline: true },
    { key: "productArea", label: "Product area" },
    { key: "severity", label: "Severity" },
  ],
};

const asText = (value: unknown): string =>
  value === undefined || value === null ? "" : String(value);

const shortId = (value?: string | null): string => {
  if (!value) return "not available";
  return value.length > 12 ? value.slice(0, 12) : value;
};

const formatTime = (value?: string): string => {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const metadataPriority = [
  "workspaceId",
  "recordKey",
  "title",
  "revision",
  "status",
  "category",
  "price",
  "audience",
  "effectiveDate",
  "productArea",
  "severity",
  "updatedAt",
  "entityId",
];

function visibleMetadata(metadata: Record<string, unknown>): Array<[string, unknown]> {
  return Object.entries(metadata)
    .filter(([key]) => !key.startsWith("_") && key !== "raw" && key !== "content")
    .sort(([left], [right]) => {
      const leftIndex = metadataPriority.indexOf(left);
      const rightIndex = metadataPriority.indexOf(right);
      return (leftIndex < 0 ? metadataPriority.length : leftIndex)
        - (rightIndex < 0 ? metadataPriority.length : rightIndex);
    })
    .slice(0, 10);
}

async function parseApiError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as
    | { message?: string; error?: string }
    | null;
  return body?.message || body?.error || `${response.status} ${response.statusText}`;
}

async function apiRequest<T>(
  path: string,
  workspaceId?: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}/api/live-sync${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(workspaceId ? { "X-Demo-Workspace-ID": workspaceId } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }
  return response.json() as Promise<T>;
}

function valuesFor(entity: EntityRecord): EditorValues {
  const values: EditorValues = { title: entity.title };
  Object.entries(entity.fields).forEach(([key, value]) => {
    values[key] = asText(value);
  });
  return values;
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Database;
  tone: string;
}) {
  return (
    <div className="border-r border-border px-4 py-3 last:border-r-0">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-md border ${tone}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-normal">{value}</span>
            <span className="truncate text-xs text-muted-foreground">{note}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIFabricLiveDataSync() {
  const { toast } = useToast();
  const chatRef = useRef<AiFabricChatElement>(null);
  const [workspaceId, setWorkspaceId] = useState("");
  const [state, setState] = useState<DemoState | null>(null);
  const [health, setHealth] = useState<DemoHealth | null>(null);
  const [status, setStatus] = useState<ApiStatus>("loading");
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingMode, setLoadingMode] = useState<"loading" | "resetting">("loading");
  const [activeKind, setActiveKind] = useState<EntityKind>("PRODUCT");
  const [selectedKey, setSelectedKey] = useState("");
  const [editor, setEditor] = useState<EditorValues>({});
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<EntityRecord | null>(null);

  const selected = useMemo(
    () => state?.entities.find((entity) => entity.recordKey === selectedKey) || null,
    [selectedKey, state],
  );

  const visibleEntities = useMemo(
    () => state?.entities.filter((entity) => entity.kind === activeKind) || [],
    [activeKind, state],
  );

  const selectEntity = useCallback((entity: EntityRecord) => {
    setActiveKind(entity.kind);
    setSelectedKey(entity.recordKey);
    setEditor(valuesFor(entity));
  }, []);

  const useStateResponse = useCallback(
    (nextState: DemoState, preferredKey?: string, fallbackKind: EntityKind = "PRODUCT") => {
      setState(nextState);
      const nextSelected =
        nextState.entities.find((entity) => entity.recordKey === preferredKey) ||
        nextState.entities.find((entity) => entity.kind === fallbackKind) ||
        nextState.entities[0];
      if (nextSelected) {
        selectEntity(nextSelected);
      } else {
        setSelectedKey("");
        setEditor({});
      }
    },
    [selectEntity],
  );

  const createWorkspace = useCallback(async () => {
    const response = await apiRequest<WorkspaceResponse>("/workspaces", undefined, {
      method: "POST",
    });
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, response.workspaceId);
    setWorkspaceId(response.workspaceId);
    useStateResponse(response.state, "novabook-air");
    return response.workspaceId;
  }, [useStateResponse]);

  const load = useCallback(async () => {
    setPageLoading(true);
    setLoadingMode("loading");
    setStatus("loading");
    try {
      const stored = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      let activeWorkspace = stored || "";
      if (activeWorkspace) {
        try {
          const current = await apiRequest<DemoState>("/state", activeWorkspace);
          setWorkspaceId(activeWorkspace);
          useStateResponse(current, "novabook-air");
        } catch {
          window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);
          activeWorkspace = await createWorkspace();
        }
      } else {
        activeWorkspace = await createWorkspace();
      }
      const healthResponse = await fetch(`${API_BASE}/api/demo/health`);
      if (healthResponse.ok) {
        setHealth((await healthResponse.json()) as DemoHealth);
      }
      setStatus("connected");
    } catch (error) {
      setStatus("offline");
      toast({
        variant: "destructive",
        title: "Live sync backend is unavailable",
        description: error instanceof Error ? error.message : "Unable to initialize the demo.",
      });
    } finally {
      setPageLoading(false);
    }
  }, [createWorkspace, toast, useStateResponse]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if ((!selected || selected.kind !== activeKind) && visibleEntities[0]) {
      selectEntity(visibleEntities[0]);
    } else if (visibleEntities.length === 0 && selected) {
      setSelectedKey("");
      setEditor({});
    }
  }, [selectEntity, selected, visibleEntities]);

  const refresh = useCallback(async () => {
    if (!workspaceId) return;
    setRefreshing(true);
    try {
      const current = await apiRequest<DemoState>("/state", workspaceId);
      useStateResponse(current, selectedKey, activeKind);
      setStatus("connected");
    } catch (error) {
      setStatus("offline");
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "The backend did not respond.",
      });
    } finally {
      setRefreshing(false);
    }
  }, [activeKind, selectedKey, toast, useStateResponse, workspaceId]);

  const reset = useCallback(async () => {
    if (!workspaceId) return;
    setPageLoading(true);
    setLoadingMode("resetting");
    try {
      const response = await apiRequest<WorkspaceResponse>("/reset", workspaceId, {
        method: "POST",
      });
      await chatRef.current?.newConversation();
      setActiveKind("PRODUCT");
      useStateResponse(response.state, "novabook-air");
      toast({
        title: "Workspace reset",
        description: "Six fresh database rows and vectors are ready for this browser session.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error instanceof Error ? error.message : "The workspace could not be reset.",
      });
    } finally {
      setPageLoading(false);
    }
  }, [toast, useStateResponse, workspaceId]);

  const save = useCallback(async () => {
    if (!selected || !workspaceId) return;
    setSaving(true);
    try {
      const payload = {
        ...editor,
        price: editor.price ? Number(editor.price) : null,
      };
      const result = await apiRequest<MutationResponse>(
        `/entities/${kindConfig[selected.kind].path}/${selected.recordKey}`,
        workspaceId,
        { method: "PUT", body: JSON.stringify(payload) },
      );
      useStateResponse(result.state, selected.recordKey);
      toast({
        title: "Database and vector updated",
        description: `${selected.title} is now at revision ${result.mutation.revision}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "The entity could not be updated.",
      });
    } finally {
      setSaving(false);
    }
  }, [editor, selected, toast, useStateResponse, workspaceId]);

  const remove = useCallback(async () => {
    if (!deleteCandidate || !workspaceId) return;
    setSaving(true);
    try {
      const result = await apiRequest<MutationResponse>(
        `/entities/${kindConfig[deleteCandidate.kind].path}/${deleteCandidate.recordKey}`,
        workspaceId,
        { method: "DELETE" },
      );
      useStateResponse(result.state, undefined, deleteCandidate.kind);
      toast({
        title: "Entity and vector removed",
        description: result.mutation.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "The entity could not be deleted.",
      });
    } finally {
      setDeleteCandidate(null);
      setSaving(false);
    }
  }, [deleteCandidate, toast, useStateResponse, workspaceId]);

  const askAboutSelected = useCallback(() => {
    if (!selected) return;
    chatRef.current?.show();
    void chatRef.current?.sendMessage(
      selected.kind === "PRODUCT"
        ? `What does the current synchronized data say about ${selected.title}?`
        : selected.kind === "POLICY"
          ? `Explain the current ${selected.title} policy.`
          : `How should I follow the ${selected.title} guide?`,
    );
  }, [selected]);

  const headerProvider = useCallback(
    () => ({ "X-Demo-Workspace-ID": workspaceId }),
    [workspaceId],
  );

  if (pageLoading) {
    return (
      <DemoFullPageLoader
        title={loadingMode === "resetting" ? "Resetting your sync workspace" : "Preparing live entity sync"}
        description={
          loadingMode === "resetting"
            ? "Removing session rows and vectors, then recreating the annotation-indexed dataset."
            : "Creating an isolated database workspace and indexing six annotated entities."
        }
        steps={[
          "Seed products, policies, and support guides",
          "Run @AIProcess indexing through AI Fabric",
          "Compare database and vector revisions",
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <Navbar />

      <main className="pt-20">
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Link
                  to="/demos"
                  className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Live demos
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-normal md:text-3xl">
                    AI Fabric Live Data Sync
                  </h1>
                  <Badge
                    variant="outline"
                    className={
                      status === "connected"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }
                  >
                    {status === "connected" ? "Live backend" : "Backend unavailable"}
                  </Badge>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Edit or delete normal JPA entities and inspect the vector content AI Fabric makes
                  available to retrieval and the LLM, without calling an indexing endpoint yourself.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/demos/ai-fabric-live-data-sync/about">
                    <Info className="mr-2 h-4 w-4" />
                    About this demo
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={refreshing}>
                  {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Refresh proof
                </Button>
                <Button variant="destructive" size="sm" onClick={() => void reset()}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset workspace
                </Button>
              </div>
            </div>

            <div className="mt-5 grid overflow-hidden rounded-md border border-border md:grid-cols-4">
              <Metric
                label="Database"
                value={String(state?.sourceTotal || 0)}
                note="source rows"
                icon={Database}
                tone="border-blue-200 bg-blue-50 text-blue-700"
              />
              <Metric
                label="Vector store"
                value={String(state?.vectorTotal || 0)}
                note="workspace vectors"
                icon={Zap}
                tone="border-violet-200 bg-violet-50 text-violet-700"
              />
              <Metric
                label="Revision proof"
                value={`${state?.synchronizedTotal || 0}/${state?.sourceTotal || 0}`}
                note="aligned"
                icon={CheckCircle2}
                tone="border-emerald-200 bg-emerald-50 text-emerald-700"
              />
              <Metric
                label="Release"
                value={health?.aiFabricVersion || "0.3.3"}
                note={`commit ${shortId(health?.commit)}`}
                icon={Code2}
                tone="border-slate-200 bg-slate-50 text-slate-700"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto grid min-w-0 gap-0 px-4 lg:grid-cols-[0.95fr_1.15fr_0.9fr]">
            <div className="min-w-0 border-b border-border py-6 lg:border-b-0 lg:border-r lg:pr-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">1. Source database</p>
                  <h2 className="mt-1 text-lg font-bold tracking-normal">Choose an entity</h2>
                </div>
                <Badge variant="outline">{workspaceId ? "Isolated session" : "No session"}</Badge>
              </div>

              <Tabs value={activeKind} onValueChange={(value) => setActiveKind(value as EntityKind)}>
                <TabsList className="grid h-auto w-full grid-cols-3">
                  {(Object.keys(kindConfig) as EntityKind[]).map((kind) => (
                    <TabsTrigger key={kind} value={kind} className="px-2 text-xs">
                      {kindConfig[kind].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="mt-4 grid gap-2">
                {visibleEntities.map((entity) => {
                  const Icon = kindConfig[entity.kind].icon;
                  const active = entity.recordKey === selectedKey;
                  return (
                    <button
                      key={entity.recordKey}
                      type="button"
                      onClick={() => selectEntity(entity)}
                      className={`w-full rounded-md border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${kindConfig[entity.kind].tone}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold">{entity.title}</span>
                            {entity.vector.inSync ? (
                              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            )}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            Revision {entity.revision} · {entity.entityType}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
                {visibleEntities.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border bg-background p-5 text-center">
                    <CircleDashed className="mx-auto h-5 w-5 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">No {kindConfig[activeKind].label.toLowerCase()} remain</p>
                    <p className="mt-1 text-xs text-muted-foreground">Reset the workspace to recreate the seed rows.</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="min-w-0 border-b border-border py-6 lg:border-b-0 lg:border-r lg:px-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">2. Application write</p>
                  <h2 className="mt-1 text-lg font-bold tracking-normal">
                    {selected ? `Edit ${selected.title}` : "Select a source row"}
                  </h2>
                </div>
                {selected ? (
                  <Badge variant="outline" className={selected.vector.inSync ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}>
                    {selected.vector.inSync ? "DB = vector" : "Sync mismatch"}
                  </Badge>
                ) : null}
              </div>

              {selected ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {editorFields[selected.kind].map((field, index) => {
                      const full = field.multiline || index < 3;
                      return (
                        <div key={field.key} className={full ? "md:col-span-2" : ""}>
                          <Label htmlFor={`sync-${field.key}`} className="text-xs font-semibold">
                            {field.label}
                          </Label>
                          {field.multiline ? (
                            <Textarea
                              id={`sync-${field.key}`}
                              className="mt-1 min-h-[82px] resize-y bg-background"
                              value={editor[field.key] || ""}
                              onChange={(event) =>
                                setEditor((current) => ({ ...current, [field.key]: event.target.value }))
                              }
                            />
                          ) : (
                            <Input
                              id={`sync-${field.key}`}
                              className="mt-1 bg-background"
                              type={field.type || "text"}
                              step={field.type === "number" ? "0.01" : undefined}
                              value={editor[field.key] || ""}
                              onChange={(event) =>
                                setEditor((current) => ({ ...current, [field.key]: event.target.value }))
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button onClick={() => void save()} disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save entity
                    </Button>
                    <Button variant="outline" onClick={askAboutSelected}>
                      <Bot className="mr-2 h-4 w-4" />
                      Ask synchronized AI
                    </Button>
                    <Button variant="outline" className="text-rose-700 hover:text-rose-800" onClick={() => setDeleteCandidate(selected)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  <div className="mt-5 flex gap-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                    <PencilLine className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      Saving calls only the normal entity service. <code>@AIProcess</code> observes the
                      returned row and refreshes the vector before this proof is shown.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex min-h-72 items-center justify-center rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground">
                  Select a row from the source database.
                </div>
              )}
            </div>

            <div className="min-w-0 py-6 lg:pl-6">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-primary">3. Vector seen by RAG</p>
                <h2 className="mt-1 text-lg font-bold tracking-normal">Indexed mirror</h2>
              </div>

              {selected ? (
                <div className="space-y-4">
                  <div className={`rounded-md border p-4 ${selected.vector.inSync ? "border-emerald-200 bg-emerald-50/70" : "border-rose-200 bg-rose-50/70"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {selected.vector.inSync ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-600" />
                        )}
                        <span className="font-semibold">{selected.vector.message}</span>
                      </div>
                      <Badge variant="outline">r{asText(selected.vector.metadata.revision || "?")}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Vector ID</span>
                        <p className="mt-1 font-mono font-semibold">{shortId(selected.vector.vectorId)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Workspace filter</span>
                        <p className="mt-1 font-semibold">Exact metadata match</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-border bg-background p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4 text-violet-600" />
                      Embedded content
                    </div>
                    <p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {selected.vector.content || "No vector content is available."}
                    </p>
                  </div>

                  <div className="rounded-md border border-border bg-background p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Database className="h-4 w-4 text-blue-600" />
                      @AIContext metadata
                    </div>
                    <dl className="grid gap-2 text-xs">
                      {visibleMetadata(selected.vector.metadata).map(([key, value]) => (
                          <div key={key} className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
                            <dt className="text-muted-foreground">{key}</dt>
                            <dd className="max-w-[60%] break-all text-right font-medium">{asText(value)}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-border bg-background p-5 text-center text-sm text-muted-foreground">
                  A deleted entity has no source row or vector.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-primary">Lifecycle evidence</p>
                <h2 className="mt-1 text-xl font-bold tracking-normal">Recent sync operations</h2>
              </div>
              <Badge variant="outline">{state?.events.length || 0} mutations</Badge>
            </div>

            <div className="overflow-hidden rounded-md border border-border">
              {state?.events.length ? (
                state.events.map((event) => (
                  <div key={event.id} className="grid gap-3 border-b border-border bg-card p-4 last:border-b-0 md:grid-cols-[auto_1fr_auto] md:items-center">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-md border ${event.inSync ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                      {event.operation === "DELETE" ? <Trash2 className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{event.operation} · {event.title}</span>
                        <Badge variant="outline" className="text-[10px]">{event.entityType}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{event.message}</p>
                    </div>
                    <div className="text-left text-xs text-muted-foreground md:text-right">
                      <p className="font-semibold text-foreground">{event.elapsedMs} ms</p>
                      <p>{formatTime(event.occurredAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-card p-8 text-center">
                  <Activity className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-3 text-sm font-semibold">No mutations yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Edit or delete a source entity to produce lifecycle proof.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase text-primary">Code-backed annotation map</p>
              <h2 className="mt-1 text-xl font-bold tracking-normal">What performs the sync</h2>
            </div>
            <div className="overflow-hidden rounded-md border border-border bg-card">
              {state?.annotationCoverage.annotations.map((annotation, index) => (
                <div key={annotation.annotation} className="grid gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[150px_1fr]">
                  <div>
                    <code className="inline-block max-w-full break-all rounded bg-violet-50 px-2 py-1 text-xs font-bold text-violet-700">
                      {annotation.annotation}
                    </code>
                    <p className="mt-2 text-xs text-muted-foreground">{annotation.location}</p>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{annotation.proof}</p>
                </div>
              ))}
              <div className="grid gap-3 border-t border-border bg-muted/30 p-4 text-xs sm:grid-cols-3">
                <div>
                  <span className="font-semibold text-foreground">Extraction</span>
                  <p className="mt-1 text-muted-foreground">{state?.annotationCoverage.extractionOwner}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Lifecycle</span>
                  <p className="mt-1 text-muted-foreground">{state?.annotationCoverage.lifecycleOwner}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Consistency</span>
                  <p className="mt-1 text-muted-foreground">{state?.annotationCoverage.consistencyMode}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {workspaceId ? (
        <AiFabricChat
          ref={chatRef}
          endpoint={`${API_BASE}/api/live-sync/chat`}
          title="Live Sync Assistant"
          welcomeTitle="Ask the synchronized data"
          welcomeMessage="Answers use only the current vectors for this isolated workspace. Edit or delete an entity, then ask again."
          composerPlaceholder="Ask about a product, policy, or support guide..."
          layout="docked"
          accentColor="#2563eb"
          debug
          maxModeEnabled
          requestMode="rag"
          requestPosition="knowledge_sync"
          requestHeaders={headerProvider}
          conversationPersistence="session"
          conversationStorageKey={`ai-fabric-live-sync-chat-${workspaceId}`}
          quickPrompts={[
            "How long does the NovaBook Air battery last?",
            "Can I return opened electronics?",
            "How do I recover an amber SyncLight?",
          ]}
          modes={[
            {
              value: "rag",
              label: "Evidence RAG",
              description: "Answer from synchronized vector evidence only",
            },
          ]}
          positions={[
            {
              value: "knowledge_sync",
              label: "Live sync",
              description: "Products, policies, and support guides",
            },
          ]}
          tools={[
            {
              id: "source-record",
              label: "Selected source",
              description: "Current application-owned database row",
              icon: "file-text",
              position: "knowledge_sync",
              content: selected ? (
                <div style={{ padding: "16px", display: "grid", gap: "12px" }}>
                  <strong>{selected.title}</strong>
                  <span>Database revision {selected.revision}</span>
                  <button type="button" onClick={askAboutSelected}>
                    Ask AI about this row
                  </button>
                </div>
              ) : (
                <div style={{ padding: "16px" }}>Select a source row in the workspace.</div>
              ),
            },
            {
              id: "vector-proof",
              label: "Vector proof",
              description: "Current indexed content and revision",
              icon: "database",
              position: "knowledge_sync",
              placement: "overflow",
              badge: state?.vectorTotal || 0,
              content: selected ? (
                <div style={{ padding: "16px", display: "grid", gap: "10px" }}>
                  <strong>{selected.vector.inSync ? "Revision aligned" : "Sync mismatch"}</strong>
                  <span>{selected.vector.content || "No vector content"}</span>
                </div>
              ) : (
                <div style={{ padding: "16px" }}>No vector is selected.</div>
              ),
            },
          ]}
          headerContext={<span>{state?.vectorTotal || 0} live vectors</span>}
          dockActions={
            <span className="inline-flex items-center gap-1 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Workspace filtered
            </span>
          }
        />
      ) : null}

      <AlertDialog open={Boolean(deleteCandidate)} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this source entity?</AlertDialogTitle>
            <AlertDialogDescription>
              The JPA row for <strong>{deleteCandidate?.title}</strong> will be deleted. AI Fabric
              should remove its vector in the same lifecycle call, and the proof panel will verify
              that no stale vector remains.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Keep entity</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                void remove();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete row and vector
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ConsultationCtaBand
        compact
        title="Mapping live entity sync into a Spring Boot application?"
        body="Join a free AI Fabric open-source maintainer session to review an annotation boundary using public or properly redacted code."
      />
      <Footer />
    </div>
  );
}
