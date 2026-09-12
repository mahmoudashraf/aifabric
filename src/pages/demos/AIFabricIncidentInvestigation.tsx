import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRightLeft,
  BadgeCheck,
  BookOpen,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Database,
  Filter,
  GitBranch,
  Info,
  ListFilter,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Network,
  Play,
  Quote,
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
  IncidentEvent,
  IncidentHealth,
  IncidentPlanComparison,
  IncidentPlanResult,
  IncidentScenario,
  IncidentSession,
  IncidentTransitionResponse,
  PlanStepTrace,
  SpecialistDecisionTrace,
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

const DEFAULT_QUESTION = "Investigate this incident using current service and change evidence. Recommend the safest next step.";
const DEFAULT_TRANSITION_QUESTION = "Is checkout healthy right now?";
const DEFAULT_MANAGER_QUESTION = "What do current service metrics show?";
const MANAGER_FOLLOW_UP = "What about the release and its approval?";

function shortId(value: string | null | undefined): string {
  if (!value) return "n/a";
  return value.length <= 20 ? value : `${value.slice(0, 10)}...${value.slice(-5)}`;
}

function humanize(value: string | null | undefined): string {
  if (!value) return "Not available";
  return value.replaceAll("_", " ").toLowerCase().replace(/^./, (character) => character.toUpperCase());
}

function statusClass(status: string): string {
  if (["UP", "READY", "SUCCEEDED", "SPECIALIST_RESULT", "DIRECT_RESPONSE", "VALIDATED"].some((token) => status.includes(token))) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["DOWN", "FAILED", "REJECTED", "DENIED", "UNAVAILABLE"].some((token) => status.includes(token))) {
    return "border-red-200 bg-red-50 text-red-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function formatDuration(startedAt?: string | null, completedAt?: string | null): string {
  const value = durationMs(startedAt, completedAt);
  return value === null ? "n/a" : `${value.toLocaleString()} ms`;
}

function FailureNotice({ failure, title = "Investigation could not be completed" }: {
  failure: { reason: string; publicMessage?: string; message?: string; retryable?: boolean; stepId?: string | null };
  title?: string;
}) {
  return (
    <Alert variant="destructive">
      <ServerCrash className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{failure.publicMessage || failure.message || "The request failed and no fallback answer was substituted."}</p>
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer font-semibold">Technical failure code</summary>
          <div className="mt-2 space-y-1 font-mono">
            <p>{failure.reason}</p>
            {failure.stepId && <p>step: {failure.stepId}</p>}
            <p>retryable: {failure.retryable ? "yes" : "no"}</p>
          </div>
        </details>
      </AlertDescription>
    </Alert>
  );
}

export function DecisionTrace({ trace, candidates = [] }: {
  trace: SpecialistDecisionTrace | null | undefined;
  candidates?: IncidentEvent[];
}) {
  if (!trace) return null;
  const selected = new Set(trace.selectedEvidenceIds);
  const selectedEvents = candidates.filter((event) => selected.has(event.id));
  const phases = [
    {
      label: "AI-selected specialist",
      icon: BrainCircuit,
      content: <Badge variant="secondary">{trace.specialist}</Badge>,
      detail: "Selected by the model within the registered specialist allowlist.",
    },
    {
      label: "AI-requested data source",
      icon: Database,
      content: trace.dataSources.length > 0
        ? <div className="flex flex-wrap gap-1.5">{trace.dataSources.map((source) => <Badge key={source.action} variant="outline">{source.action}</Badge>)}</div>
        : <span className="text-sm text-muted-foreground">No read action requested</span>,
      detail: "The specialist chose only actions visible in its exact manifest.",
    },
    {
      label: "Backend-authorized candidates",
      icon: Filter,
      content: <span className="text-lg font-semibold">{trace.dataSources.reduce((sum, source) => sum + source.candidateCount, 0)}</span>,
      detail: `Filtered to source revision ${shortId(trace.sourceRevision)} by trusted application context.`,
    },
    {
      label: "AI-cited evidence",
      icon: Quote,
      content: (
        <div className="flex flex-wrap gap-1.5">
          {trace.selectedEvidenceIds.map((id) => <Badge key={id} variant="outline">{id}</Badge>)}
          {trace.runbookEvidenceIds.map((id) => <Badge key={id} className="border-violet-200 bg-violet-50 text-violet-800" variant="outline"><BookOpen className="mr-1 h-3 w-3" />{id}</Badge>)}
        </div>
      ),
      detail: selectedEvents.length > 0
        ? selectedEvents.map((event) => event.summary).join(" ")
        : "Only IDs present in authorized action or RAG evidence can appear here.",
    },
    {
      label: "Application validation",
      icon: BadgeCheck,
      content: <Badge className={statusClass(trace.applicationValidation)} variant="outline">{humanize(trace.applicationValidation)}</Badge>,
      detail: "Java validates action usage, citations, boundaries, and source revision before projection.",
    },
  ];

  return (
    <section aria-label="AI and application decision trace" className="border-t pt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-blue-600" />Decision trace</h4>
        <Badge className={statusClass(trace.status)} variant="outline">{trace.status}</Badge>
      </div>
      <ol className="grid gap-3 lg:grid-cols-5">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <li key={phase.label} className="min-w-0 border-l-2 border-blue-200 pl-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Icon className="h-3.5 w-3.5" /></span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">{index + 1}. {phase.label}</p>
                  <div className="mt-2 min-w-0 break-words">{phase.content}</div>
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{phase.detail}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CandidateWorkspace({ session }: { session: IncidentSession }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? session.workspace.candidateEvents : session.workspace.candidateEvents.slice(0, 6);
  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b bg-muted/20 px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold"><ListFilter className="h-5 w-5 text-blue-600" />Authorized incident workspace</h2>
          <p className="mt-1 text-sm text-muted-foreground">These are candidates, not a preselected answer. The specialist must choose its source and cite relevant evidence.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{session.workspace.candidateEvents.length} in boundary</Badge>
          <Badge variant="outline">{session.workspace.excludedBoundaryEventCount} excluded</Badge>
          <Badge className={statusClass(session.workspace.runbooks.state)} variant="outline">{session.workspace.runbooks.indexedDocuments} runbooks</Badge>
        </div>
      </div>
      <div className="grid gap-4 border-b px-5 py-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <Label htmlFor="incident-scenario">Incident scenario</Label>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{session.scenario.description}</p>
        </div>
        <div className="border-l-0 text-xs text-muted-foreground lg:border-l lg:pl-4">
          <p className="flex items-center gap-2 font-semibold text-foreground"><LockKeyhole className="h-4 w-4 text-emerald-600" />Trusted execution boundary</p>
          <p className="mt-2">Deployment: <span className="font-mono text-foreground">{session.scenario.deploymentId}</span></p>
          <p className="mt-1">Source revision: <span className="font-mono text-foreground">{session.scenario.sourceRevision}</span></p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-b px-5 py-3">
        {Object.entries(session.workspace.dataSources).map(([source, state]) => (
          <Badge key={source} className={statusClass(state)} variant="outline">{source}: {state}</Badge>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-muted/25 text-xs uppercase text-muted-foreground">
            <tr><th className="px-5 py-3">Observed</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Candidate event</th><th className="px-5 py-3">Severity</th></tr>
          </thead>
          <tbody className="divide-y">
            {shown.map((event) => (
              <tr key={event.id}>
                <td className="whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">{new Date(event.observedAt).toLocaleString()}</td>
                <td className="px-4 py-3"><Badge variant="outline">{event.source}</Badge></td>
                <td className="px-4 py-3 text-xs font-semibold">{humanize(event.type)}</td>
                <td className="px-4 py-3"><p className="font-mono text-xs font-semibold">{event.id}</p><p className="mt-1 max-w-2xl leading-5 text-muted-foreground">{event.summary}</p></td>
                <td className="px-5 py-3"><Badge className={statusClass(event.severity)} variant="outline">{event.severity}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {session.workspace.candidateEvents.length > 6 && (
        <div className="border-t px-5 py-3 text-center"><Button size="sm" variant="ghost" onClick={() => setExpanded((value) => !value)}>{expanded ? "Show fewer candidates" : `Show all ${session.workspace.candidateEvents.length} candidates`}</Button></div>
      )}
    </section>
  );
}

function AssessmentView({ assessment }: { assessment: IncidentAssessment }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
        {[["Severity", assessment.severity], ["Service health", assessment.healthStatus], ["Change risk", assessment.changeRisk]].map(([label, value]) => (
          <div key={label} className="bg-background p-4"><p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-amber-950"><p className="text-xs font-semibold uppercase">AI assessment</p><p className="mt-2 text-sm leading-6">{assessment.likelyCause}</p></div>
        <div className="border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-blue-950"><p className="text-xs font-semibold uppercase">Recommended next step</p><p className="mt-2 text-sm leading-6">{assessment.recommendation}</p></div>
      </div>
      <div className="grid gap-4 border-y py-4 lg:grid-cols-2">
        <div><p className="text-xs font-semibold uppercase text-muted-foreground">Service-health selection</p><p className="mt-2 text-sm leading-6">{assessment.serviceHealth.selectionReason}</p></div>
        <div><p className="text-xs font-semibold uppercase text-muted-foreground">Change-risk selection</p><p className="mt-2 text-sm leading-6">{assessment.changeRiskFinding.selectionReason}</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold uppercase text-muted-foreground">Validated citations</span>{assessment.evidenceIds.map((id) => <Badge key={id} variant="secondary">{id}</Badge>)}<Badge className={statusClass(assessment.validationStatus)} variant="outline">{humanize(assessment.validationStatus)}</Badge></div>
    </div>
  );
}

function ExecutionTimeline({ steps, candidates }: { steps: PlanStepTrace[]; candidates: IncidentEvent[] }) {
  if (steps.length === 0) return <p className="text-sm text-muted-foreground">No specialist step completed.</p>;
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={`${step.stepId}-${step.invocationId}`} className="relative border-l-2 border-slate-200 pl-7">
          <span className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><p className="font-semibold">{step.stepId}</p><p className="mt-1 text-xs text-muted-foreground">{step.specialistId} / invocation {shortId(step.invocationId)}</p></div>
            <Badge className={statusClass(step.status)} variant="outline">{step.status}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground"><span>{step.parallelGroupId ? `Parallel group ${step.parallelGroupId}` : "Ordered step"}</span><span>{formatDuration(step.startedAt, step.completedAt)}</span><span>Revision {shortId(step.sourceRevision)}</span></div>
          <div className="mt-4"><DecisionTrace trace={step.decisionTrace} candidates={candidates} /></div>
        </li>
      ))}
    </ol>
  );
}

function PlanResultView({ result, label, candidates }: { result: IncidentPlanResult; label: string; candidates: IncidentEvent[] }) {
  return (
    <section className="space-y-5 rounded-md border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p><h3 className="mt-1 text-lg font-semibold">{result.planId}</h3><p className="mt-1 text-xs text-muted-foreground">Execution {shortId(result.executionId)} / hash {shortId(result.planContentHash)}</p></div>
        <div className="text-right"><Badge className={statusClass(result.status)} variant="outline">{result.status}</Badge><p className="mt-2 text-xs text-muted-foreground"><Clock3 className="mr-1 inline h-3.5 w-3.5" />{formatDuration(result.startedAt, result.completedAt)}</p></div>
      </div>
      {result.failure ? <FailureNotice failure={result.failure} title="Required investigation branch failed" /> : result.output ? <AssessmentView assessment={result.output} /> : null}
      <div><div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-blue-600" />Specialist execution timeline</div><ExecutionTimeline steps={result.steps} candidates={candidates} /></div>
    </section>
  );
}

export function TransitionView({ result, mode, candidates = [] }: { result: IncidentTransitionResponse; mode: TransitionMode; candidates?: IncidentEvent[] }) {
  const transition = result.transition;
  const target = transition?.targetExecution || transition?.successorExecution || null;
  if (!transition) {
    return (
      <section className="rounded-md border bg-card p-5 shadow-sm">
        <h3 className="font-semibold">No specialist transition was selected</h3>
        <p className="mt-2 text-sm text-muted-foreground">The intake specialist returned {result.intake.output?.decision || "COMPLETE"}: {result.intake.output?.reason || "the request did not map to one approved worker"}.</p>
      </section>
    );
  }
  return (
    <section className="space-y-5 rounded-md border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase text-muted-foreground">AI intake decision</p><h3 className="mt-1 text-lg font-semibold">{humanize(result.intake.output?.decision)} to {result.intake.output?.targetSpecialist || "no target"}</h3><p className="mt-2 text-sm text-muted-foreground">{result.intake.output?.reason}</p></div>
        <Badge className={statusClass(transition.status)} variant="outline">{mode === "delegations" ? "Delegation" : "Handoff"}: {transition.status}</Badge>
      </div>
      <div className="grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
        <div className="bg-background p-4"><p className="text-xs uppercase text-muted-foreground">Source</p><p className="mt-1 font-semibold">{transition.sourceSpecialistId || transition.predecessorSpecialistId}</p></div>
        <div className="bg-background p-4"><p className="text-xs uppercase text-muted-foreground">Target</p><p className="mt-1 font-semibold">{transition.targetSpecialistId || transition.successorSpecialistId}</p></div>
        <div className="bg-background p-4"><p className="text-xs uppercase text-muted-foreground">Bounded depth</p><p className="mt-1 font-semibold">{transition.depth}</p></div>
      </div>
      {transition.failure && <FailureNotice failure={transition.failure} title="Specialist transition was denied" />}
      {target?.failure && <FailureNotice failure={target.failure} title="Selected specialist failed" />}
      {target?.output && <div><p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Safe projected specialist result</p><p className="text-sm leading-7">{String((target.output as { summary?: string }).summary || "Validated structured result returned")}</p></div>}
      <DecisionTrace trace={target?.decisionTrace} candidates={candidates} />
      {result.secondTransitionCanary && (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950"><ShieldCheck className="h-4 w-4" /><AlertTitle>Second transition blocked by application policy</AlertTitle><AlertDescription>The one-hop canary returned {result.secondTransitionCanary.status}. This is an application-owned guard, not a model choice.</AlertDescription></Alert>
      )}
    </section>
  );
}

export default function AIFabricIncidentInvestigation() {
  const { toast } = useToast();
  const [health, setHealth] = useState<IncidentHealth | null>(null);
  const [scenarios, setScenarios] = useState<IncidentScenario[]>([]);
  const [session, setSession] = useState<IncidentSession | null>(null);
  const [pageLoading, setPageLoading] = useState<"initializing" | "resetting" | null>("initializing");
  const [busy, setBusy] = useState<"plan" | "compare" | "transition" | "manager" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [planMode, setPlanMode] = useState<PlanMode>("parallel");
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [transitionQuestion, setTransitionQuestion] = useState(DEFAULT_TRANSITION_QUESTION);
  const [managerQuestion, setManagerQuestion] = useState(DEFAULT_MANAGER_QUESTION);
  const [planResult, setPlanResult] = useState<IncidentPlanResult | null>(null);
  const [comparison, setComparison] = useState<IncidentPlanComparison | null>(null);
  const [transitionResult, setTransitionResult] = useState<IncidentTransitionResponse | null>(null);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>("delegations");
  const [managerTurns, setManagerTurns] = useState<ManagerTurnView[]>([]);

  const createSession = useCallback(async (scenarioId: string) => {
    const created = await incidentInvestigationApi<IncidentSession>("/api/incidents/sessions", { method: "POST", body: JSON.stringify({ scenarioId }) });
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

  const clearResults = () => { setPlanResult(null); setComparison(null); setTransitionResult(null); setManagerTurns([]); };

  const replaceSession = async (scenarioId: string) => {
    if (scenarioId === session?.scenario.id) return;
    setPageLoading("resetting"); setError(null);
    try {
      if (session) await incidentInvestigationApi<void>(`/api/incidents/sessions/${session.sessionId}`, { method: "DELETE" }, session.sessionId);
      clearResults();
      await createSession(scenarioId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to select the incident scenario.");
    } finally { setPageLoading(null); }
  };

  const reset = async () => {
    if (!session) return;
    setPageLoading("resetting"); setError(null);
    try {
      const resetSession = await incidentInvestigationApi<IncidentSession>(`/api/incidents/sessions/${session.sessionId}/reset`, { method: "POST" }, session.sessionId);
      clearResults(); setSession(resetSession);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset the incident session.");
    } finally { setPageLoading(null); }
  };

  const runPlan = async () => {
    if (!session || !question.trim()) return;
    setBusy("plan"); setError(null); setComparison(null);
    try {
      const result = await incidentInvestigationApi<IncidentPlanResult>(`/api/incidents/sessions/${session.sessionId}/plans/${planMode}`, { method: "POST", body: JSON.stringify({ question: question.trim() }) }, session.sessionId, crypto.randomUUID());
      setPlanResult(result);
      if (result.failure) toast({ title: "Plan failed visibly", description: result.failure.publicMessage, variant: "destructive" });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Incident plan execution failed.";
      setError(message); toast({ title: "Plan request failed", description: message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const comparePlans = async () => {
    if (!session || !question.trim()) return;
    setBusy("compare"); setError(null); setPlanResult(null);
    try {
      setComparison(await incidentInvestigationApi<IncidentPlanComparison>(`/api/incidents/sessions/${session.sessionId}/compare`, { method: "POST", body: JSON.stringify({ question: question.trim() }) }, session.sessionId, crypto.randomUUID()));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Plan comparison failed.";
      setError(message); toast({ title: "Comparison failed", description: message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const runTransition = async (mode: TransitionMode) => {
    if (!session || !transitionQuestion.trim()) return;
    setBusy("transition"); setError(null); setTransitionMode(mode);
    try {
      setTransitionResult(await incidentInvestigationApi<IncidentTransitionResponse>(`/api/incidents/sessions/${session.sessionId}/${mode}`, { method: "POST", body: JSON.stringify({ question: transitionQuestion.trim() }) }, session.sessionId, crypto.randomUUID()));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Specialist transition failed.";
      setError(message); toast({ title: "Transition failed", description: message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const runManager = async (event?: FormEvent, replay?: ManagerTurnView) => {
    event?.preventDefault();
    if (!session) return;
    const prompt = replay?.question || managerQuestion.trim();
    if (!prompt) return;
    const idempotencyKey = replay?.idempotencyKey || crypto.randomUUID();
    setBusy("manager"); setError(null);
    try {
      const result = await incidentInvestigationApi<ConversationManagerResult>(`/api/incidents/sessions/${session.sessionId}/manager/turns`, { method: "POST", body: JSON.stringify({ question: prompt }) }, session.sessionId, idempotencyKey);
      setManagerTurns((current) => [...current, { question: prompt, idempotencyKey, result }]);
      if (!replay) setManagerQuestion("");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Conversation manager turn failed.";
      setError(message); toast({ title: "Conversation failed", description: message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const runtimeReady = useMemo(() => health?.status === "UP" && health.specialistsReady && health.plansReady && health.actionsReady && health.provider.ready && health.runbooks.state === "READY", [health]);
  const candidates = session?.workspace.candidateEvents || [];

  if (pageLoading) return <DemoFullPageLoader title={pageLoading === "resetting" ? "Preparing a clean incident workspace" : "Preparing Incident Investigation Room"} description="Loading bounded event candidates, exact specialist manifests, read-action readiness, runbooks, and backend conversation state." />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20 pt-24">
        <section className="border-b bg-slate-950 text-white">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <Link to="/demos" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Live demos</Link>
                <Badge className="mb-4 border-cyan-300/40 bg-cyan-300/10 text-cyan-100" variant="outline"><Network className="mr-1 h-3.5 w-3.5" />Model-selected specialists and operational read actions</Badge>
                <h1 className="text-4xl font-bold tracking-normal md:text-5xl">Incident Investigation Room</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">Watch AI Fabric route an incident, let each specialist choose approved operational sources, validate every citation, and preserve the same evidence contract across plans, transitions, and conversation.</p>
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

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Runtime", runtimeReady ? "Ready" : "Not ready", health?.status || "Unknown", runtimeReady],
              ["Specialists", `${health?.specialists.length || 0} versions`, health?.specialistsReady ? "Registry verified" : "Unavailable", health?.specialistsReady],
              ["READ actions", `${health?.actions.length || 0} approved`, health?.actionsReady ? "Catalog verified" : "Unavailable", health?.actionsReady],
              ["Runbook RAG", `${health?.runbooks.indexedDocuments || 0} docs`, health?.runbooks.state || "Unknown", health?.runbooks.state === "READY"],
              ["Conversation", health?.conversationHistory || "Unknown", `${health?.storage.chat || "Unknown"} storage`, health?.storage.chat === "UP"],
            ].map(([label, value, detail, ready]) => (
              <div key={String(label)} className="rounded-md border bg-card p-4 shadow-sm"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase text-muted-foreground">{String(label)}</p>{ready ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div><p className="mt-2 text-lg font-semibold">{String(value)}</p><p className="mt-1 text-xs text-muted-foreground">{String(detail)}</p></div>
            ))}
          </section>

          {session && (
            <section className="space-y-4">
              <div className="max-w-lg"><Label htmlFor="incident-scenario">Choose incident source set</Label><Select value={session.scenario.id} onValueChange={(value) => void replaceSession(value)} disabled={Boolean(busy)}><SelectTrigger id="incident-scenario" className="mt-2"><SelectValue /></SelectTrigger><SelectContent>{scenarios.map((scenario) => <SelectItem key={scenario.id} value={scenario.id}>{scenario.title}</SelectItem>)}</SelectContent></Select></div>
              <CandidateWorkspace session={session} />
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
                <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                  <div><Label>Execution strategy</Label><div className="mt-2 grid grid-cols-2 rounded-md border bg-background p-1">{(["sequential", "parallel"] as PlanMode[]).map((mode) => <Button key={mode} size="sm" variant={planMode === mode ? "default" : "ghost"} onClick={() => setPlanMode(mode)}>{mode === "sequential" ? <Boxes className="mr-2 h-4 w-4" /> : <Split className="mr-2 h-4 w-4" />}{mode}</Button>)}</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Both plans run the same v2 specialists under ALL_REQUIRED fan-in.</p></div>
                  <div><Label htmlFor="incident-question">Incident question</Label><Textarea id="incident-question" className="mt-2 min-h-24 resize-y bg-background" value={question} onChange={(event) => setQuestion(event.target.value)} /></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => void runPlan()} disabled={!session || Boolean(busy)}>{busy === "plan" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}Run {planMode} plan</Button><Button variant="outline" onClick={() => void comparePlans()} disabled={!session || Boolean(busy)}>{busy === "compare" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}Compare both plans</Button></div>
              </section>
              {planResult && <PlanResultView result={planResult} label="Selected strategy" candidates={candidates} />}
              {comparison && <div className="space-y-4"><Alert className={comparison.semanticallyEquivalent ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-red-200 bg-red-50 text-red-950"}>{comparison.semanticallyEquivalent ? <CheckCircle2 className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}<AlertTitle>{comparison.semanticallyEquivalent ? "Semantically equivalent" : "Plan results diverged"}</AlertTitle><AlertDescription>{comparison.comparisonReason}</AlertDescription></Alert><div className="grid gap-4 xl:grid-cols-2"><PlanResultView result={comparison.sequential} label="Ordered execution" candidates={candidates} /><PlanResultView result={comparison.parallel} label="Parallel fan-out" candidates={candidates} /></div></div>}
            </TabsContent>

            <TabsContent value="transitions" className="space-y-5">
              <section className="rounded-md border bg-muted/20 p-5"><h2 className="text-lg font-semibold">Bounded specialist transitions</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">The intake model selects zero or one exact v2 worker. The application permits one delegation or handoff and rejects a second hop.</p><div className="mt-4"><Label htmlFor="transition-question">Routing question</Label><Textarea id="transition-question" className="mt-2 min-h-20 resize-y bg-background" value={transitionQuestion} onChange={(event) => setTransitionQuestion(event.target.value)} /></div><div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => void runTransition("delegations")} disabled={!session || Boolean(busy) || !transitionQuestion.trim()}>{busy === "transition" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Network className="mr-2 h-4 w-4" />}Run delegation</Button><Button variant="outline" onClick={() => void runTransition("handoffs")} disabled={!session || Boolean(busy) || !transitionQuestion.trim()}><GitBranch className="mr-2 h-4 w-4" />Run handoff</Button></div></section>
              {transitionResult && <TransitionView result={transitionResult} mode={transitionMode} candidates={candidates} />}
            </TabsContent>

            <TabsContent value="conversation" className="space-y-5">
              <section className="rounded-md border bg-muted/20 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-lg font-semibold">Backend-owned incident conversation</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">The browser sends only the newest message. AI Fabric loads bounded prior turns, routes to an approved v2 specialist, and preserves idempotent replay.</p></div><Badge variant="secondary">Newest message only</Badge></div><div className="mt-4 flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={() => setManagerQuestion(DEFAULT_MANAGER_QUESTION)}>Start with service health</Button><Button type="button" size="sm" variant="outline" onClick={() => setManagerQuestion(MANAGER_FOLLOW_UP)}>Follow up about the release</Button></div><form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => void runManager(event)}><Textarea aria-label="Newest incident conversation message" className="min-h-20 flex-1 resize-y bg-background" value={managerQuestion} onChange={(event) => setManagerQuestion(event.target.value)} placeholder="Ask a follow-up about this incident" /><Button className="sm:self-end" type="submit" disabled={!session || Boolean(busy) || !managerQuestion.trim()}>{busy === "manager" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Send</Button></form></section>
              <div className="space-y-4">
                {managerTurns.map((turn, index) => (
                  <Card key={`${turn.result.turnId}-${index}`} className="overflow-hidden border-border/80 shadow-sm"><CardHeader className="border-b bg-muted/20 pb-4"><p className="text-sm text-muted-foreground">You</p><CardTitle className="text-base tracking-normal">{turn.question}</CardTitle></CardHeader><CardContent className="space-y-4 pt-5">{turn.result.failure ? <FailureNotice failure={turn.result.failure} title="Conversation turn failed" /> : <p className="leading-7">{turn.result.message}</p>}<div className="flex flex-wrap gap-2 text-xs"><Badge className={statusClass(turn.result.status)} variant="outline">{turn.result.status}</Badge><Badge variant="secondary">Target {formatVersionedId(turn.result.selectedTarget)}</Badge><Badge variant="secondary">{turn.result.snapshotSourceTurnCount} prior turns</Badge><Badge variant="secondary">Snapshot {shortId(turn.result.snapshotRevision)}</Badge>{turn.result.replayed && <Badge className="border-blue-200 bg-blue-50 text-blue-800" variant="outline">Replay verified</Badge>}</div><DecisionTrace trace={turn.result.decisionTrace} candidates={candidates} />{index === managerTurns.length - 1 && !turn.result.replayed && <Button size="sm" variant="outline" onClick={() => void runManager(undefined, turn)} disabled={Boolean(busy)}><RefreshCw className="mr-2 h-4 w-4" />Replay same request key</Button>}</CardContent></Card>
                ))}
                {managerTurns.length === 0 && <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground"><Bot className="mx-auto mb-3 h-7 w-7" />No manager turns yet.</div>}
              </div>
            </TabsContent>
          </Tabs>

          <section className="flex flex-col justify-between gap-4 rounded-md border bg-slate-950 p-5 text-white md:flex-row md:items-center"><div><p className="font-semibold">Deployment proof</p><p className="mt-1 text-sm text-slate-300">AI Fabric {health?.aiFabricVersion || "unknown"} / commit {shortId(health?.commit)} / provider {health?.provider.generation || "unknown"}</p></div><div className="flex flex-wrap gap-2"><Badge className="border-slate-600 bg-slate-900 text-slate-100" variant="outline">Events: {health?.eventStore.totalEvents || 0}</Badge><Badge className="border-slate-600 bg-slate-900 text-slate-100" variant="outline">Plan storage: {health?.storage.execution || "unknown"}</Badge></div></section>
        </div>
      </main>
      <ConsultationCtaBand />
      <Footer />
    </div>
  );
}
