import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRightLeft,
  Bot,
  Boxes,
  CheckCircle2,
  Clock3,
  FileSearch,
  GitBranch,
  Info,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Network,
  Play,
  RefreshCw,
  RotateCcw,
  Send,
  ServerCrash,
  ShieldCheck,
  Split,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";
import {
  ConversationManagerResult,
  INCIDENT_INVESTIGATION_SESSION_KEY,
  IncidentAssessment,
  IncidentHealth,
  IncidentPlanComparison,
  IncidentPlanResult,
  IncidentScenario,
  IncidentSession,
  IncidentTransitionResponse,
  PlanStepTrace,
  durationMs,
  formatVersionedId,
  incidentInvestigationApi,
} from "./incident-investigation/api";

type PlanMode = "sequential" | "parallel";
type TransitionMode = "delegations" | "handoffs";

interface ManagerTurnView {
  question: string;
  idempotencyKey: string;
  result: ConversationManagerResult;
}

const DEFAULT_QUESTION = "Investigate the checkout latency incident and identify the safest next operational step.";
const DEFAULT_MANAGER_QUESTION = "What changed, and what should the incident commander do next?";

function shortId(value: string | null | undefined): string {
  if (!value) return "n/a";
  return value.length <= 18 ? value : `${value.slice(0, 9)}...${value.slice(-5)}`;
}

function statusClass(status: string): string {
  if (["UP", "SUCCEEDED", "SPECIALIST_RESULT", "DIRECT_RESPONSE"].includes(status)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["DOWN", "FAILED", "REJECTED", "DENIED"].some((token) => status.includes(token))) {
    return "border-red-200 bg-red-50 text-red-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function formatDuration(startedAt?: string, completedAt?: string): string {
  const value = durationMs(startedAt, completedAt);
  return value === null ? "n/a" : `${value.toLocaleString()} ms`;
}

function EvidenceBranch({ title, steps }: { title: string; steps: IncidentScenario["serviceEvidence"] }) {
  return (
    <section className="min-w-0 rounded-md border bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold"><FileSearch className="h-4 w-4 text-blue-600" />{title}</h3>
        <Badge variant="secondary">{steps.length} immutable facts</Badge>
      </div>
      <div className="space-y-2">
        {steps.map((evidence) => (
          <div key={evidence.id} className="rounded-md border border-border/70 bg-muted/25 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold">{evidence.id}</span>
              <Badge className={statusClass(evidence.severity)} variant="outline">{evidence.severity}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground/80">{evidence.summary}</p>
            <p className="mt-1 text-xs text-muted-foreground">Observed {new Date(evidence.observedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AssessmentView({ assessment }: { assessment: IncidentAssessment }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Severity", assessment.severity],
          ["Service health", assessment.healthStatus],
          ["Change risk", assessment.changeRisk],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border bg-muted/25 p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <p className="text-xs font-semibold uppercase">Likely cause</p>
          <p className="mt-2 text-sm leading-6">{assessment.likelyCause}</p>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-950">
          <p className="text-xs font-semibold uppercase">Recommended next step</p>
          <p className="mt-2 text-sm leading-6">{assessment.recommendation}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase text-muted-foreground">Validated citations</span>
        {assessment.evidenceIds.map((id) => <Badge key={id} variant="secondary">{id}</Badge>)}
      </div>
    </div>
  );
}

function ExecutionTimeline({ steps }: { steps: PlanStepTrace[] }) {
  if (steps.length === 0) return <p className="text-sm text-muted-foreground">No specialist step completed.</p>;
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={`${step.stepId}-${step.invocationId}`} className="relative rounded-md border bg-background p-4 pl-12">
          <span className="absolute left-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{step.stepId}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatVersionedId(step.specialistId)} · invocation {shortId(step.invocationId)}</p>
            </div>
            <Badge className={statusClass(step.status)} variant="outline">{step.status}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span>Source {step.sourceRevision || "not supplied"}</span>
            <span>{step.parallelGroupId ? `Parallel group ${step.parallelGroupId}` : "Ordered step"}</span>
            <span>{formatDuration(step.startedAt, step.completedAt)}</span>
            <span>{step.evidence.length} evidence references</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PlanResultView({ result, label }: { result: IncidentPlanResult; label: string }) {
  return (
    <section className="space-y-4 rounded-md border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
          <h3 className="mt-1 text-lg font-semibold">{formatVersionedId(result.planId)}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Execution {shortId(result.executionId)} · hash {shortId(result.planContentHash)}</p>
        </div>
        <div className="text-right">
          <Badge className={statusClass(result.status)} variant="outline">{result.status}</Badge>
          <p className="mt-2 text-xs text-muted-foreground"><Clock3 className="mr-1 inline h-3.5 w-3.5" />{formatDuration(result.startedAt, result.completedAt)}</p>
        </div>
      </div>
      {result.failure ? (
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>{result.failure.reason.replaceAll("_", " ")}</AlertTitle>
          <AlertDescription>{result.failure.publicMessage}. Partial branch output was not returned.</AlertDescription>
        </Alert>
      ) : result.output ? <AssessmentView assessment={result.output} /> : null}
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4" />Specialist execution timeline</div>
        <ExecutionTimeline steps={result.steps} />
      </div>
    </section>
  );
}

export function TransitionView({ result, mode }: { result: IncidentTransitionResponse; mode: TransitionMode }) {
  const transition = result.transition;
  const canary = result.secondTransitionCanary;
  if (!transition) {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-950">
        <Info className="h-4 w-4" />
        <AlertTitle>No specialist transition was selected</AlertTitle>
        <AlertDescription>
          The intake specialist returned {result.intake.output?.decision || result.intake.status}: {result.intake.output?.reason || "No transition reason was supplied."}
        </AlertDescription>
      </Alert>
    );
  }
  const source = transition.sourceSpecialistId || transition.predecessorSpecialistId;
  const target = transition.targetSpecialistId || transition.successorSpecialistId;
  const transitionId = transition.delegationId || transition.handoffId;
  const canaryDenied = Boolean(canary?.failure) || (canary?.status ? canary.status !== "SUCCEEDED" : false);

  return (
    <section className="space-y-4 rounded-md border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">One-level {mode === "delegations" ? "delegation" : "handoff"}</p>
          <p className="mt-1 font-semibold">{formatVersionedId(source)} <ArrowRightLeft className="mx-2 inline h-4 w-4" /> {formatVersionedId(target)}</p>
        </div>
        <Badge className={statusClass(transition.status || "UNKNOWN")} variant="outline">{transition.status || "UNKNOWN"}</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Transition</p><p className="mt-1 font-mono text-xs">{shortId(transitionId)}</p></div>
        <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Depth</p><p className="mt-1 font-semibold">{transition.depth ?? "n/a"}</p></div>
        <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Replay</p><p className="mt-1 font-semibold">{transition.replayed ? "Yes" : "No"}</p></div>
      </div>
      <Alert className={canaryDenied ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-red-200 bg-red-50 text-red-950"}>
        {canaryDenied ? <ShieldCheck className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
        <AlertTitle>{canaryDenied ? "Second transition denied" : "Boundary canary failed"}</AlertTitle>
        <AlertDescription>
          {canaryDenied
            ? `The runtime rejected a second specialist hop${canary?.failure?.reason ? `: ${canary.failure.reason}` : ""}.`
            : canary
              ? "The second transition was not visibly denied. Treat this result as a failed safety proof."
              : "The backend did not return the required second-transition canary. Treat this result as incomplete safety proof."}
        </AlertDescription>
      </Alert>
    </section>
  );
}

export default function AIFabricIncidentInvestigation() {
  const { toast } = useToast();
  const [health, setHealth] = useState<IncidentHealth | null>(null);
  const [scenarios, setScenarios] = useState<IncidentScenario[]>([]);
  const [session, setSession] = useState<IncidentSession | null>(null);
  const [pageLoading, setPageLoading] = useState<"preparing" | "resetting" | null>("preparing");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [planMode, setPlanMode] = useState<PlanMode>("parallel");
  const [planResult, setPlanResult] = useState<IncidentPlanResult | null>(null);
  const [comparison, setComparison] = useState<IncidentPlanComparison | null>(null);
  const [transitionResult, setTransitionResult] = useState<IncidentTransitionResponse | null>(null);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>("delegations");
  const [managerQuestion, setManagerQuestion] = useState(DEFAULT_MANAGER_QUESTION);
  const [managerTurns, setManagerTurns] = useState<ManagerTurnView[]>([]);

  const createSession = useCallback(async (scenarioId: string) => {
    const created = await incidentInvestigationApi<IncidentSession>(
      "/api/incidents/sessions",
      { method: "POST", body: JSON.stringify({ scenarioId }) },
    );
    localStorage.setItem(INCIDENT_INVESTIGATION_SESSION_KEY, created.sessionId);
    setSession(created);
    return created;
  }, []);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const [loadedHealth, loadedScenarios] = await Promise.all([
          incidentInvestigationApi<IncidentHealth>("/api/demo/health"),
          incidentInvestigationApi<IncidentScenario[]>("/api/incidents/scenarios"),
        ]);
        if (!mounted) return;
        setHealth(loadedHealth);
        setScenarios(loadedScenarios);
        const stored = localStorage.getItem(INCIDENT_INVESTIGATION_SESSION_KEY);
        let active: IncidentSession | null = null;
        if (stored) {
          try {
            active = await incidentInvestigationApi<IncidentSession>(`/api/incidents/sessions/${stored}`, {}, stored);
          } catch {
            localStorage.removeItem(INCIDENT_INVESTIGATION_SESSION_KEY);
          }
        }
        if (!active && loadedScenarios.length > 0) active = await createSession(loadedScenarios[0].id);
        if (mounted) setSession(active);
      } catch (caught) {
        if (mounted) setError(caught instanceof Error ? caught.message : "Unable to initialize Incident Investigation Room.");
      } finally {
        if (mounted) setPageLoading(null);
      }
    })();
    return () => { mounted = false; };
  }, [createSession]);

  const clearResults = () => {
    setPlanResult(null);
    setComparison(null);
    setTransitionResult(null);
    setManagerTurns([]);
  };

  const replaceSession = async (scenarioId: string) => {
    if (scenarioId === session?.scenario.id) return;
    setPageLoading("resetting");
    setError(null);
    try {
      if (session) await incidentInvestigationApi<void>(`/api/incidents/sessions/${session.sessionId}`, { method: "DELETE" }, session.sessionId);
      clearResults();
      await createSession(scenarioId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to select the incident scenario.");
    } finally {
      setPageLoading(null);
    }
  };

  const reset = async () => {
    if (!session) return;
    setPageLoading("resetting");
    setError(null);
    try {
      const resetSession = await incidentInvestigationApi<IncidentSession>(
        `/api/incidents/sessions/${session.sessionId}/reset`,
        { method: "POST" },
        session.sessionId,
      );
      clearResults();
      setSession(resetSession);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset the incident session.");
    } finally {
      setPageLoading(null);
    }
  };

  const runPlan = async () => {
    if (!session || !question.trim()) return;
    setBusy("plan");
    setError(null);
    setComparison(null);
    try {
      const result = await incidentInvestigationApi<IncidentPlanResult>(
        `/api/incidents/sessions/${session.sessionId}/plans/${planMode}`,
        { method: "POST", body: JSON.stringify({ question: question.trim() }) },
        session.sessionId,
        crypto.randomUUID(),
      );
      setPlanResult(result);
      if (result.failure) toast({ title: "Plan failed visibly", description: result.failure.publicMessage, variant: "destructive" });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Incident plan execution failed.";
      setError(message);
      toast({ title: "Plan request failed", description: message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const comparePlans = async () => {
    if (!session || !question.trim()) return;
    setBusy("compare");
    setError(null);
    setPlanResult(null);
    try {
      const result = await incidentInvestigationApi<IncidentPlanComparison>(
        `/api/incidents/sessions/${session.sessionId}/compare`,
        { method: "POST", body: JSON.stringify({ question: question.trim() }) },
        session.sessionId,
        crypto.randomUUID(),
      );
      setComparison(result);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Plan comparison failed.";
      setError(message);
      toast({ title: "Comparison failed", description: message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const runTransition = async (mode: TransitionMode) => {
    if (!session || !question.trim()) return;
    setBusy("transition");
    setError(null);
    setTransitionMode(mode);
    try {
      const result = await incidentInvestigationApi<IncidentTransitionResponse>(
        `/api/incidents/sessions/${session.sessionId}/${mode}`,
        { method: "POST", body: JSON.stringify({ question: question.trim() }) },
        session.sessionId,
        crypto.randomUUID(),
      );
      setTransitionResult(result);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Specialist transition failed.";
      setError(message);
      toast({ title: "Transition failed", description: message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const runManager = async (event?: FormEvent, replay?: ManagerTurnView) => {
    event?.preventDefault();
    if (!session) return;
    const prompt = replay?.question || managerQuestion.trim();
    if (!prompt) return;
    const idempotencyKey = replay?.idempotencyKey || crypto.randomUUID();
    setBusy("manager");
    setError(null);
    try {
      const result = await incidentInvestigationApi<ConversationManagerResult>(
        `/api/incidents/sessions/${session.sessionId}/manager/turns`,
        { method: "POST", body: JSON.stringify({ question: prompt }) },
        session.sessionId,
        idempotencyKey,
      );
      setManagerTurns((current) => [...current, { question: prompt, idempotencyKey, result }]);
      if (!replay) setManagerQuestion("");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Conversation manager turn failed.";
      setError(message);
      toast({ title: "Conversation failed", description: message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const runtimeReady = useMemo(
    () => health?.status === "UP" && health.specialistsReady && health.plansReady && health.provider.ready,
    [health],
  );

  if (pageLoading) {
    return <DemoFullPageLoader title={pageLoading === "resetting" ? "Preparing a clean incident workspace" : "Preparing Incident Investigation Room"} description="Loading immutable evidence, exact specialist manifests, fixed plans, provider readiness, and backend conversation state." />;
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
                <Badge className="mb-4 border-amber-300/40 bg-amber-300/10 text-amber-100" variant="outline"><Network className="mr-1 h-3.5 w-3.5" />Multi-specialist incident proof</Badge>
                <h1 className="text-4xl font-bold tracking-normal md:text-5xl">Incident Investigation Room</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">Run the same immutable incident through ordered and parallel specialist plans, inspect safe lineage, and prove bounded delegation, handoff, and backend-owned conversation.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary"><Link to="/demos/ai-fabric-incident-investigation/about"><Info className="mr-2 h-4 w-4" />About this demo</Link></Button>
                <Button variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-800 hover:text-white" onClick={() => void reset()}><RotateCcw className="mr-2 h-4 w-4" />Reset session</Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto space-y-8 px-4 py-8">
          {error && <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Demo request failed</AlertTitle><AlertDescription>{error}. No fallback result was substituted.</AlertDescription></Alert>}

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Runtime", runtimeReady ? "Ready" : "Not ready", health?.status || "Unknown", runtimeReady],
              ["Specialists", `${health?.specialists.length || 0} exact versions`, health?.specialistsReady ? "Registry verified" : "Registry unavailable", health?.specialistsReady],
              ["Plans", `${health?.plans.length || 0} fixed plans`, `${health?.fanInPolicy || "Unknown"} fan-in`, health?.plansReady],
              ["Conversation", health?.conversationHistory || "Unknown", `${health?.storage.chat || "Unknown"} storage`, health?.storage.chat === "UP"],
            ].map(([label, value, detail, ready]) => (
              <div key={String(label)} className="rounded-md border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase text-muted-foreground">{String(label)}</p>{ready ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                <p className="mt-2 text-lg font-semibold">{String(value)}</p><p className="mt-1 text-xs text-muted-foreground">{String(detail)}</p>
              </div>
            ))}
          </section>

          {session && (
            <section className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <Label htmlFor="incident-scenario">Incident source set</Label>
                  <Select value={session.scenario.id} onValueChange={(value) => void replaceSession(value)} disabled={Boolean(busy)}>
                    <SelectTrigger id="incident-scenario" className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>{scenarios.map((scenario) => <SelectItem key={scenario.id} value={scenario.id}>{scenario.title}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{session.scenario.description}</p>
                </div>
                <div className="rounded-md border bg-muted/25 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold"><LockKeyhole className="h-4 w-4 text-emerald-600" />Immutable execution context</div>
                  <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between gap-3"><dt>Deployment</dt><dd className="font-mono text-foreground">{session.scenario.deploymentId}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Source revision</dt><dd className="font-mono text-foreground">{session.scenario.sourceRevision}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Session</dt><dd className="font-mono text-foreground">{shortId(session.sessionId)}</dd></div>
                  </dl>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <EvidenceBranch title="Service health branch" steps={session.scenario.serviceEvidence} />
                <EvidenceBranch title="Change risk branch" steps={session.scenario.changeEvidence} />
              </div>
            </section>
          )}

          <Tabs defaultValue="plans" className="space-y-5">
            <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="plans" className="py-3"><Split className="mr-2 h-4 w-4" />Plan lab</TabsTrigger>
              <TabsTrigger value="transitions" className="py-3"><GitBranch className="mr-2 h-4 w-4" />Transition lab</TabsTrigger>
              <TabsTrigger value="conversation" className="py-3"><MessageSquare className="mr-2 h-4 w-4" />Conversation manager</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-5">
              <section className="rounded-md border bg-muted/20 p-5">
                <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div>
                    <Label>Execution strategy</Label>
                    <div className="mt-2 grid grid-cols-2 rounded-md border bg-background p-1">
                      {(["sequential", "parallel"] as PlanMode[]).map((mode) => (
                        <Button key={mode} size="sm" variant={planMode === mode ? "default" : "ghost"} onClick={() => setPlanMode(mode)}>{mode === "sequential" ? <Boxes className="mr-2 h-4 w-4" /> : <Split className="mr-2 h-4 w-4" />}{mode}</Button>
                      ))}
                    </div>
                  </div>
                  <div><Label htmlFor="incident-question">Incident question</Label><Textarea id="incident-question" className="mt-2 min-h-24 resize-y bg-background" value={question} onChange={(event) => setQuestion(event.target.value)} /></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => void runPlan()} disabled={!session || Boolean(busy)}>{busy === "plan" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}Run {planMode} plan</Button>
                  <Button variant="outline" onClick={() => void comparePlans()} disabled={!session || Boolean(busy)}>{busy === "compare" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}Compare both plans</Button>
                </div>
              </section>
              {planResult && <PlanResultView result={planResult} label="Selected strategy" />}
              {comparison && (
                <div className="space-y-4">
                  <Alert className={comparison.semanticallyEquivalent ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-red-200 bg-red-50 text-red-950"}>
                    {comparison.semanticallyEquivalent ? <CheckCircle2 className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
                    <AlertTitle>{comparison.semanticallyEquivalent ? "Semantically equivalent" : "Plan results diverged"}</AlertTitle>
                    <AlertDescription>{comparison.comparisonReason}</AlertDescription>
                  </Alert>
                  <div className="grid gap-4 xl:grid-cols-2"><PlanResultView result={comparison.sequential} label="Ordered execution" /><PlanResultView result={comparison.parallel} label="Parallel fan-out" /></div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transitions" className="space-y-5">
              <section className="rounded-md border bg-muted/20 p-5">
                <h2 className="text-lg font-semibold">Bounded specialist transitions</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Run a one-level delegation or handoff. Each response includes safe parent/child lineage and an intentional second-hop canary that must be denied.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => void runTransition("delegations")} disabled={!session || Boolean(busy)}><Network className="mr-2 h-4 w-4" />Run delegation</Button>
                  <Button variant="outline" onClick={() => void runTransition("handoffs")} disabled={!session || Boolean(busy)}><GitBranch className="mr-2 h-4 w-4" />Run handoff</Button>
                </div>
              </section>
              {transitionResult && <TransitionView result={transitionResult} mode={transitionMode} />}
            </TabsContent>

            <TabsContent value="conversation" className="space-y-5">
              <section className="rounded-md border bg-muted/20 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div><h2 className="text-lg font-semibold">Backend-owned incident conversation</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">The browser sends only the newest message. AI Fabric loads bounded prior turns, routes to an approved specialist, and returns snapshot lineage.</p></div>
                  <Badge variant="secondary">Newest message only</Badge>
                </div>
                <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => void runManager(event)}>
                  <Textarea className="min-h-20 flex-1 resize-y bg-background" value={managerQuestion} onChange={(event) => setManagerQuestion(event.target.value)} placeholder="Ask a follow-up about this incident" />
                  <Button className="sm:self-end" type="submit" disabled={!session || Boolean(busy) || !managerQuestion.trim()}>{busy === "manager" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Send</Button>
                </form>
              </section>
              <div className="space-y-4">
                {managerTurns.map((turn, index) => (
                  <Card key={`${turn.result.turnId}-${index}`} className="overflow-hidden border-border/80 shadow-sm">
                    <CardHeader className="border-b bg-muted/20 pb-4"><p className="text-sm text-muted-foreground">You</p><CardTitle className="text-base tracking-normal">{turn.question}</CardTitle></CardHeader>
                    <CardContent className="space-y-4 pt-5">
                      {turn.result.failure ? <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>{turn.result.failure.reason}</AlertTitle><AlertDescription>{turn.result.failure.publicMessage || turn.result.failure.message || "The manager failed without a fallback response."}</AlertDescription></Alert> : <p className="leading-7">{turn.result.message}</p>}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge className={statusClass(turn.result.status)} variant="outline">{turn.result.status}</Badge>
                        <Badge variant="secondary">Target {formatVersionedId(turn.result.selectedTarget)}</Badge>
                        <Badge variant="secondary">{turn.result.snapshotSourceTurnCount} source turns</Badge>
                        <Badge variant="secondary">Snapshot {shortId(turn.result.snapshotRevision)}</Badge>
                        {turn.result.replayed && <Badge className="border-blue-200 bg-blue-50 text-blue-800" variant="outline">Replay verified</Badge>}
                      </div>
                      {index === managerTurns.length - 1 && !turn.result.replayed && <Button size="sm" variant="outline" onClick={() => void runManager(undefined, turn)} disabled={Boolean(busy)}><RefreshCw className="mr-2 h-4 w-4" />Replay same request key</Button>}
                    </CardContent>
                  </Card>
                ))}
                {managerTurns.length === 0 && <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground"><Bot className="mx-auto mb-3 h-7 w-7" />No manager turns yet.</div>}
              </div>
            </TabsContent>
          </Tabs>

          <section className="flex flex-col justify-between gap-4 rounded-md border bg-slate-950 p-5 text-white md:flex-row md:items-center">
            <div><p className="font-semibold">Deployment proof</p><p className="mt-1 text-sm text-slate-300">AI Fabric {health?.aiFabricVersion || "unknown"} · commit {shortId(health?.commit)} · provider {health?.provider.generation || "unknown"}</p></div>
            <Badge className="w-fit border-slate-600 bg-slate-900 text-slate-100" variant="outline">Execution storage: {health?.storage.execution || "unknown"}</Badge>
          </section>
        </div>
      </main>
      <ConsultationCtaBand />
      <Footer />
    </div>
  );
}
