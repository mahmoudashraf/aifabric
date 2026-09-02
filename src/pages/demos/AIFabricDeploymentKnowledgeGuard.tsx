import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Database,
  FileSearch,
  Fingerprint,
  Info,
  Loader2,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  Send,
  ServerCog,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";
import {
  DEPLOYMENT_GUARD_SESSION_KEY,
  EvidenceSummary,
  GuardHealth,
  GuardSession,
  QueryResponse,
  deploymentGuardApi,
} from "./deployment-guard/api";

interface Turn {
  id: string;
  prompt: string;
  result: QueryResponse;
  canary?: string;
}

const prompts = [
  "Summarize the current release health and any active incident.",
  "What should an operator do next if this deployment degrades?",
  "What indexing status is established by the available evidence?",
];

function shortId(value: string): string {
  return value.length <= 16 ? value : `${value.slice(0, 8)}...${value.slice(-5)}`;
}

function AnswerCard({ turn }: { turn: Turn }) {
  const { result } = turn;
  if (result.failure) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>{result.failure.reason.replaceAll("_", " ")}</AlertTitle>
        <AlertDescription>{result.failure.message}. No fallback answer was shown.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800" variant="outline">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />{turn.canary ? `${turn.canary} contained` : "Boundary verified"}
          </Badge>
          <span className="text-xs text-muted-foreground">Invocation {shortId(result.invocationId)}</span>
        </div>
        <CardTitle className="text-xl tracking-normal">{result.answer?.summary}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Health", result.answer?.healthStatus],
            ["Release", result.answer?.release],
            ["Indexing", result.answer?.indexingStatus],
            ["Incident risk", result.answer?.incidentRisk],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border bg-muted/30 p-3">
              <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
              <p className="mt-1 text-sm leading-6">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-950">
          <div className="flex items-center gap-2 font-semibold"><ServerCog className="h-4 w-4" />Recommended runbook</div>
          <p className="mt-2 text-sm leading-6">{result.answer?.recommendedRunbook}</p>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><FileSearch className="h-4 w-4" />Retrieved evidence</div>
          <div className="grid gap-2">
            {result.evidence.map((evidence) => (
              <div key={evidence.id} className="rounded-md border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{evidence.title}</span>
                  <Badge variant="secondary">{evidence.sourceType}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{evidence.content}</p>
                <div className="mt-2 text-xs text-muted-foreground">{evidence.id} {evidence.relevanceScore !== null ? `- ${(evidence.relevanceScore * 100).toFixed(1)}%` : ""}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{result.boundary.proof}. Enforced context: {result.boundary.activeContext}.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AIFabricDeploymentKnowledgeGuard() {
  const { toast } = useToast();
  const [session, setSession] = useState<GuardSession | null>(null);
  const [health, setHealth] = useState<GuardHealth | null>(null);
  const [evidence, setEvidence] = useState<EvidenceSummary[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [message, setMessage] = useState(prompts[0]);
  const [pageLoading, setPageLoading] = useState<"preparing" | "resetting" | null>("preparing");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvidence = useCallback(async (active: GuardSession) => {
    const documents = await deploymentGuardApi<EvidenceSummary[]>("/api/deployment-guard/evidence", {}, active.sessionId);
    setEvidence(documents);
  }, []);

  const createSession = useCallback(async () => {
    const created = await deploymentGuardApi<GuardSession>("/api/deployment-guard/sessions", { method: "POST" });
    localStorage.setItem(DEPLOYMENT_GUARD_SESSION_KEY, created.sessionId);
    setSession(created);
    await loadEvidence(created);
    return created;
  }, [loadEvidence]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const healthPromise = deploymentGuardApi<GuardHealth>("/api/demo/health");
        const stored = localStorage.getItem(DEPLOYMENT_GUARD_SESSION_KEY);
        let active: GuardSession | null = null;
        if (stored) {
          try {
            active = await deploymentGuardApi<GuardSession>("/api/deployment-guard/sessions/current", {}, stored);
          } catch {
            localStorage.removeItem(DEPLOYMENT_GUARD_SESSION_KEY);
          }
        }
        if (!active) active = await createSession();
        if (!mounted) return;
        setSession(active);
        await loadEvidence(active);
        setHealth(await healthPromise);
      } catch (caught) {
        if (mounted) setError(caught instanceof Error ? caught.message : "Unable to initialize Deployment Knowledge Guard.");
      } finally {
        if (mounted) setPageLoading(null);
      }
    })();
    return () => { mounted = false; };
  }, [createSession, loadEvidence]);

  const reset = async () => {
    setPageLoading("resetting");
    setError(null);
    try {
      if (session) await deploymentGuardApi<void>("/api/deployment-guard/sessions/current", { method: "DELETE" }, session.sessionId);
      setTurns([]);
      await createSession();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset the demo session.");
    } finally {
      setPageLoading(null);
    }
  };

  const selectContext = async (contextId: string) => {
    if (!session || contextId === session.activeContextId) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await deploymentGuardApi<GuardSession>(
        `/api/deployment-guard/sessions/current/contexts/${encodeURIComponent(contextId)}`,
        { method: "PUT" },
        session.sessionId,
      );
      setSession(updated);
      setTurns([]);
      await loadEvidence(updated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to change the deployment context.");
    } finally {
      setBusy(false);
    }
  };

  const run = async (
    prompt: string,
    canary?: "cross-tenant" | "cross-deployment" | "identity-spoof" | "missing-scope",
  ) => {
    if (!session || !prompt.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const result = await deploymentGuardApi<QueryResponse>(
        canary ? `/api/deployment-guard/canaries/${canary}` : "/api/deployment-guard/query",
        { method: "POST", body: canary ? undefined : JSON.stringify({ question: prompt.trim() }) },
        session.sessionId,
      );
      setTurns((current) => [...current, { id: crypto.randomUUID(), prompt, result, canary }]);
      if (result.failure) toast({ title: "Specialist execution failed visibly", description: result.failure.message, variant: "destructive" });
    } catch (caught) {
      const reason = caught instanceof Error ? caught.message : "Deployment specialist request failed.";
      setError(reason);
      toast({ title: "Request failed", description: reason, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void run(message);
  };

  const runtimeReady = useMemo(() => health?.specialistRuntime.ready && health?.indexing.state === "READY", [health]);

  if (pageLoading) {
    return <DemoFullPageLoader title={pageLoading === "resetting" ? "Resetting your guarded session" : "Preparing Deployment Knowledge Guard"} description="Loading approved contexts, indexed evidence, specialist manifests, and provider readiness." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20 pt-24">
        <section className="border-b bg-slate-950 text-white">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <Link to="/demos" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Live demos</Link>
                <Badge className="mb-4 border-cyan-300/40 bg-cyan-300/10 text-cyan-100" variant="outline"><ShieldCheck className="mr-1 h-3.5 w-3.5" />Trusted specialist retrieval</Badge>
                <h1 className="text-4xl font-bold tracking-normal md:text-5xl">Deployment Knowledge Guard</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">Ask operational questions across deliberately overlapping documents while AI Fabric enforces the server-approved tenant and deployment boundary.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary"><Link to="/demos/ai-fabric-deployment-knowledge-guard/about"><Info className="mr-2 h-4 w-4" />About this demo</Link></Button>
                <Button variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-800 hover:text-white" onClick={() => void reset()}><RotateCcw className="mr-2 h-4 w-4" />Reset session</Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto space-y-6 px-4 py-8">
          {error ? <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Visible runtime error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}

          <div className="grid gap-3 md:grid-cols-4">
            <Card><CardContent className="flex items-center gap-3 p-4"><LockKeyhole className="h-5 w-5 text-emerald-600" /><div><div className="text-xs uppercase text-muted-foreground">Active boundary</div><div className="font-semibold">{session?.activeContextLabel}</div></div></CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4"><Database className="h-5 w-5 text-blue-600" /><div><div className="text-xs uppercase text-muted-foreground">Scoped evidence</div><div className="font-semibold">{evidence.length} documents</div></div></CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4"><Bot className="h-5 w-5 text-violet-600" /><div><div className="text-xs uppercase text-muted-foreground">Specialist</div><div className="font-semibold">deployment-knowledge-reader@1</div></div></CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-4"><Activity className="h-5 w-5 text-amber-600" /><div><div className="text-xs uppercase text-muted-foreground">Runtime</div><div className="font-semibold">{runtimeReady ? "Ready" : "Not ready"}</div></div></CardContent></Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
            <aside className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground">Approved contexts</h2>
                <div className="mt-3 space-y-2">
                  {session?.contexts.map((context) => (
                    <Button key={context.id} variant={context.id === session.activeContextId ? "default" : "outline"} className="h-auto w-full justify-start px-3 py-3 text-left" disabled={busy} onClick={() => void selectContext(context.id)}>
                      <span><span className="block font-semibold">{context.label}</span><span className="block text-xs opacity-70">{context.environment}</span></span>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase text-muted-foreground">Boundary canaries</h2>
                <div className="mt-3 space-y-2">
                  <Button variant="outline" className="w-full justify-start" disabled={busy} onClick={() => void run("Attempt cross-tenant evidence access", "cross-tenant")}><ShieldCheck className="mr-2 h-4 w-4" />Cross-tenant</Button>
                  <Button variant="outline" className="w-full justify-start" disabled={busy} onClick={() => void run("Attempt cross-deployment evidence access", "cross-deployment")}><ServerCog className="mr-2 h-4 w-4" />Cross-deployment</Button>
                  <Button variant="outline" className="w-full justify-start" disabled={busy} onClick={() => void run("Attempt identity metadata spoof", "identity-spoof")}><Fingerprint className="mr-2 h-4 w-4" />Identity spoof</Button>
                  <Button variant="outline" className="w-full justify-start" disabled={busy} onClick={() => void run("Attempt retrieval without vector-space authority", "missing-scope")}><LockKeyhole className="mr-2 h-4 w-4" />Missing scope</Button>
                </div>
              </div>
            </aside>

            <section className="min-w-0 space-y-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl tracking-normal"><Bot className="h-5 w-5 text-violet-600" />Ask the scoped specialist</CardTitle></CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {prompts.map((prompt) => <Button key={prompt} size="sm" variant="secondary" onClick={() => setMessage(prompt)}>{prompt.split(" ").slice(0, 4).join(" ")}...</Button>)}
                  </div>
                  <form onSubmit={submit} className="space-y-3">
                    <Label htmlFor="deployment-question" className="sr-only">Deployment question</Label>
                    <Textarea id="deployment-question" value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-[92px] resize-none" placeholder="Ask about the active deployment..." />
                    <Button type="submit" disabled={busy || !message.trim()}><>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Run specialist</></Button>
                  </form>
                </CardContent>
              </Card>

              {turns.length === 0 ? (
                <div className="border-y py-10 text-center text-muted-foreground"><FileSearch className="mx-auto mb-3 h-8 w-8" /><p>Run a question or security canary. The result must include real scoped evidence.</p></div>
              ) : turns.map((turn) => (
                <div key={turn.id} className="space-y-3">
                  <div className="ml-auto max-w-2xl rounded-md bg-slate-900 px-4 py-3 text-white"><div className="text-xs text-slate-400">Operator</div><p className="mt-1">{turn.prompt}</p></div>
                  <AnswerCard turn={turn} />
                </div>
              ))}
            </section>

            <aside className="space-y-5">
              <Card>
                <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base tracking-normal"><Database className="h-4 w-4" />Active evidence catalog</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {evidence.map((document) => (
                    <div key={document.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{document.title}</span><Badge variant="secondary">{document.sourceType}</Badge></div>
                      <div className="mt-2 break-all text-xs text-muted-foreground">{document.id} / r{document.revision}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base tracking-normal"><Activity className="h-4 w-4" />Runtime proof</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">AI Fabric</span><span className="font-medium">{health?.aiFabricVersion || "Unknown"}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Index</span><span className="font-medium">{health?.indexing.state || "Unknown"}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Provider</span><span className="font-medium">{health?.providerReadiness.ready ? "Ready" : "Unavailable"}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Commit</span><span className="font-mono text-xs">{shortId(health?.commit || "unknown")}</span></div>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => void deploymentGuardApi<GuardHealth>("/api/demo/health").then(setHealth)}><RefreshCw className="mr-2 h-4 w-4" />Refresh health</Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <ConsultationCtaBand />
      <Footer />
    </div>
  );
}
