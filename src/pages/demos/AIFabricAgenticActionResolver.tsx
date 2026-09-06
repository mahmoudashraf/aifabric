import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  FileSearch,
  Info,
  Loader2,
  MessageSquareText,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";

import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";
import {
  AGENTIC_RESOLVER_BASE_URL,
  AGENTIC_SESSION_STORAGE_KEY,
  AccountResolutionOutput,
  ActionDecisionResult,
  BillingResolutionOutput,
  DemoHealth,
  ExecutionResult,
  ProactiveEventSubmission,
  ResolverScenario,
  ResolverSession,
  ResumeResult,
  SpecialistExecutionSnapshot,
  agenticApi,
  compactId,
  newIdempotencyKey,
  specialistLabel,
} from "./agentic-resolver/api";

interface TimelineItem {
  id: string;
  role: "user" | "specialist" | "system";
  text: string;
  result?: ExecutionResult;
  decision?: ActionDecisionResult;
}

interface ProactiveEventProof {
  eventId: string;
  eventType: string;
  failureCode: string;
  attemptNumber: number;
  execution: ProactiveEventSubmission["execution"];
  result: ExecutionResult<AccountResolutionOutput> | null;
}

const EVENT_TERMINAL_STATUSES = new Set([
  "SUCCEEDED",
  "FAILED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
]);

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function time(value?: string | null): string {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function duration(result: ExecutionResult): string {
  const started = new Date(result.startedAt).getTime();
  const completed = new Date(result.completedAt).getTime();
  return Number.isFinite(started) && Number.isFinite(completed) ? `${Math.max(0, completed - started)} ms` : "Not available";
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return "Not available";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (typeof value === "object") return Object.entries(value as Record<string, unknown>)
    .map(([key, child]) => `${key}: ${displayValue(child)}`)
    .join(" | ");
  return String(value);
}

function isAccountResolutionOutput(value: unknown): value is AccountResolutionOutput {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AccountResolutionOutput>;
  return typeof candidate.assessment === "string"
    && typeof candidate.summary === "string"
    && Array.isArray(candidate.blockers);
}

function isBillingResolutionOutput(value: unknown): value is BillingResolutionOutput {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<BillingResolutionOutput>;
  return typeof candidate.resolutionType === "string"
    && typeof candidate.amount === "number"
    && typeof candidate.decision === "string"
    && typeof candidate.expectedStatus === "string"
    && typeof candidate.automaticLimit === "number"
    && typeof candidate.explanation === "string";
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function SpecialistOutput({ output }: { output: unknown }) {
  if (isAccountResolutionOutput(output)) {
    return (
      <div className="space-y-4">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Assessment</div>
          <div className="text-lg font-semibold">{output.assessment.replaceAll("_", " ")}</div>
          <p className="mt-2 leading-7 text-muted-foreground">{output.summary}</p>
        </div>
        {output.blockers.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {output.blockers.map((blocker) => (
              <div key={`${blocker.requirement}-${blocker.explanation}`} className="rounded-md border border-amber-200 bg-amber-50 p-4">
                <div className="font-semibold text-amber-950">{blocker.requirement.replaceAll("_", " ")}</div>
                <p className="mt-2 text-sm leading-6 text-amber-900">{blocker.explanation}</p>
                <p className="mt-2 text-sm font-medium text-amber-950">Next: {blocker.recommendedNextStep}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (isBillingResolutionOutput(output)) {
    return (
      <div className="space-y-4">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Billing path</div>
          <div className="text-lg font-semibold">{output.decision.replaceAll("_", " ")}</div>
          <p className="mt-2 leading-7 text-muted-foreground">{output.explanation}</p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["Resolution", output.resolutionType.replaceAll("_", " ")],
            ["Amount", money(output.amount)],
            ["Expected status", output.expectedStatus.replaceAll("_", " ")],
            ["Automatic limit", money(output.automaticLimit)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border bg-muted/25 p-3">
              <dt className="text-xs font-semibold uppercase text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return output ? (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Unsupported specialist output</AlertTitle>
      <AlertDescription>The backend returned an output contract this demo UI does not recognize.</AlertDescription>
    </Alert>
  ) : null;
}

export function ProactiveEventCard({ proof }: { proof: ProactiveEventProof }) {
  const successful = proof.execution.status === "SUCCEEDED";
  const running = !EVENT_TERMINAL_STATUSES.has(proof.execution.status);

  return (
    <div className="mt-3 rounded-md border border-violet-200 bg-violet-50/70 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-semibold text-violet-950">Proactive account event</div>
        <Badge variant="outline" className={successful ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "bg-white"}>
          {running ? "Executing" : proof.execution.status.replaceAll("_", " ")}
        </Badge>
      </div>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div><dt className="text-xs uppercase text-muted-foreground">Event</dt><dd className="mt-1 font-medium">{proof.eventType}</dd></div>
        <div><dt className="text-xs uppercase text-muted-foreground">Trusted source</dt><dd className="mt-1 font-medium">EVENT</dd></div>
        <div><dt className="text-xs uppercase text-muted-foreground">Failure facts</dt><dd className="mt-1 font-medium">{proof.failureCode}, attempt {proof.attemptNumber}</dd></div>
        <div><dt className="text-xs uppercase text-muted-foreground">Principal</dt><dd className="mt-1 font-medium">Backend service</dd></div>
      </dl>
      <div className="mt-3 text-xs text-muted-foreground">
        Durable invocation {compactId(proof.execution.invocationId)}. The event contains no account, tenant, scopes, specialist, or provider authority.
      </div>
      {proof.execution.failureReason ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-rose-900">{proof.execution.failureReason}</div>
      ) : null}
    </div>
  );
}

function ResultCard({
  result,
  busy,
  onDecision,
  onResume,
}: {
  result: ExecutionResult;
  busy: boolean;
  onDecision: (receiptId: string, decision: "CONFIRM" | "REJECT") => void;
  onResume: (result: ExecutionResult, amount: number) => void;
}) {
  const [amount, setAmount] = useState("25");
  const statusTone = result.status === "SUCCEEDED"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : result.status === "CONFIRMATION_REQUIRED" || result.status === "WAITING_FOR_INPUT"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className={statusTone} variant="outline">{result.status.replaceAll("_", " ")}</Badge>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Bot className="h-3.5 w-3.5" />{specialistLabel(result.specialistId)}</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{duration(result)}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Invocation {compactId(result.invocationId)}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SpecialistOutput output={result.output} />

        {result.needsUserInput ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <MessageSquareText className="mt-0.5 h-5 w-5 text-amber-700" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-amber-950">{result.needsUserInput.safeQuestion}</div>
                <p className="mt-1 text-sm text-amber-900">
                  Typed host response, {result.needsUserInput.durability.toLowerCase()} wait, maximum {result.needsUserInput.maxAttempts} attempts.
                </p>
                <form
                  className="mt-4 flex flex-col gap-2 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const parsed = Number(amount);
                    if (Number.isFinite(parsed) && parsed > 0) onResume(result, parsed);
                  }}
                >
                  <Label className="sr-only" htmlFor={`amount-${result.invocationId}`}>Billing amount</Label>
                  <Input
                    id={`amount-${result.invocationId}`}
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="bg-background"
                  />
                  <Button disabled={busy} type="submit">
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Resume specialist
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ) : null}

        {result.actionProposal ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <div className="font-semibold text-amber-950">Confirmation required</div>
            <p className="mt-2 text-sm leading-6 text-amber-900">{result.actionProposal.confirmationMessage}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-amber-900">
              <Badge variant="outline" className="border-amber-300 bg-white">{result.actionProposal.actionName}</Badge>
              <span>Expires {time(result.actionProposal.expiresAt)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button disabled={busy} onClick={() => onDecision(result.actionProposal!.receiptId, "CONFIRM")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />Confirm
              </Button>
              <Button disabled={busy} variant="outline" onClick={() => onDecision(result.actionProposal!.receiptId, "REJECT")}>
                <XCircle className="mr-2 h-4 w-4" />Reject
              </Button>
            </div>
          </div>
        ) : null}

        {result.failure ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{result.failure.reason.replaceAll("_", " ")}</AlertTitle>
            <AlertDescription>{result.failure.publicMessage}</AlertDescription>
          </Alert>
        ) : null}

        {result.evidence.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><FileSearch className="h-4 w-4 text-primary" />Approved evidence</div>
            <div className="grid gap-2 md:grid-cols-2">
              {result.evidence.map((item) => (
                <div key={item.evidenceId} className="rounded-md border bg-muted/20 p-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{item.vectorSpace || item.source || "Evidence"}</span>
                    {typeof item.relevanceScore === "number" ? <span>{Math.round(item.relevanceScore * 100)}%</span> : null}
                  </div>
                  <p className="mt-2 line-clamp-4 text-sm leading-6">{item.content}</p>
                  <div className="mt-2 text-xs text-muted-foreground">ID {compactId(item.evidenceId)}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function AIFabricAgenticActionResolver() {
  const { toast } = useToast();
  const [session, setSession] = useState<ResolverSession | null>(null);
  const [health, setHealth] = useState<DemoHealth | null>(null);
  const [history, setHistory] = useState<TimelineItem[]>([]);
  const [message, setMessage] = useState("");
  const [pageLoading, setPageLoading] = useState<"initializing" | "resetting" | null>("initializing");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventProof, setEventProof] = useState<ProactiveEventProof | null>(null);

  const activeScenario = useMemo(
    () => session?.scenarios.find((scenario) => scenario.id === session.activeScenarioId) || null,
    [session],
  );

  const createSession = useCallback(async () => {
    const created = await agenticApi<ResolverSession>("/api/agentic-resolver/sessions", { method: "POST" });
    sessionStorage.setItem(AGENTIC_SESSION_STORAGE_KEY, created.sessionId);
    setSession(created);
    setMessage(created.scenarios.find((item) => item.id === created.activeScenarioId)?.suggestedPrompt || "");
    return created;
  }, []);

  const initialize = useCallback(async () => {
    setError(null);
    try {
      const healthPromise = agenticApi<DemoHealth>("/api/demo/health");
      const stored = sessionStorage.getItem(AGENTIC_SESSION_STORAGE_KEY);
      let loaded: ResolverSession;
      if (stored) {
        try {
          loaded = await agenticApi<ResolverSession>(`/api/agentic-resolver/sessions/${encodeURIComponent(stored)}`);
          setSession(loaded);
          setMessage(loaded.scenarios.find((item) => item.id === loaded.activeScenarioId)?.suggestedPrompt || "");
        } catch {
          sessionStorage.removeItem(AGENTIC_SESSION_STORAGE_KEY);
          loaded = await createSession();
        }
      } else {
        loaded = await createSession();
      }
      setHealth(await healthPromise);
      return loaded;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to initialize the Agentic Resolver demo.");
      return null;
    } finally {
      setPageLoading(null);
    }
  }, [createSession]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const reset = async () => {
    setPageLoading("resetting");
    setHistory([]);
    setEventProof(null);
    setError(null);
    try {
      if (session?.sessionId) {
        await agenticApi<void>(`/api/agentic-resolver/sessions/${encodeURIComponent(session.sessionId)}`, { method: "DELETE" });
      }
      sessionStorage.removeItem(AGENTIC_SESSION_STORAGE_KEY);
      await createSession();
      toast({ title: "Fresh isolated session", description: "Account scenarios and backend conversation state were reset." });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset the demo session.");
    } finally {
      setPageLoading(null);
    }
  };

  const selectScenario = async (scenario: ResolverScenario) => {
    if (!session || busy) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await agenticApi<ResolverSession>(
        `/api/agentic-resolver/sessions/${encodeURIComponent(session.sessionId)}/scenarios/${encodeURIComponent(scenario.id)}`,
        { method: "PUT" },
      );
      setSession(updated);
      setHistory([]);
      setEventProof(null);
      setMessage(scenario.suggestedPrompt);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to select this scenario.");
    } finally {
      setBusy(false);
    }
  };

  const run = async (question: string, endpoint = "/api/agentic-resolver/chat", body?: Record<string, unknown>) => {
    if (!session || !question.trim() || busy) return;
    const userItem: TimelineItem = { id: newIdempotencyKey("user"), role: "user", text: question.trim() };
    setHistory((current) => [...current, userItem]);
    setBusy(true);
    setError(null);
    try {
      const result = await agenticApi<ExecutionResult>(
        endpoint,
        { method: "POST", body: JSON.stringify(body || { question: question.trim() }) },
        { sessionId: session.sessionId, idempotencyKey: newIdempotencyKey("agentic-turn") },
      );
      setHistory((current) => [...current, {
        id: result.invocationId,
        role: "specialist",
        text: result.output?.summary || result.needsUserInput?.safeQuestion || result.actionProposal?.confirmationMessage || result.failure?.publicMessage || result.status,
        result,
      }]);
      setMessage("");
    } catch (caught) {
      const text = caught instanceof Error ? caught.message : "Specialist execution failed.";
      setError(text);
      setHistory((current) => [...current, { id: newIdempotencyKey("failure"), role: "system", text }]);
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void run(message);
  };

  const decide = async (receiptId: string, decision: "CONFIRM" | "REJECT") => {
    if (!session || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await agenticApi<ActionDecisionResult>(
        "/api/agentic-resolver/actions/decide",
        { method: "POST", body: JSON.stringify({ receiptId, decision }) },
        { sessionId: session.sessionId },
      );
      setHistory((current) => [...current, {
        id: newIdempotencyKey("decision"),
        role: "system",
        text: result.outcome?.message || result.failure?.publicMessage || `Proposal ${result.status?.toLowerCase() || "was unavailable"}.`,
        decision: result,
      }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to decide the action proposal.");
    } finally {
      setBusy(false);
    }
  };

  const resume = async (result: ExecutionResult, amount: number) => {
    if (!session || !result.needsUserInput || busy) return;
    setBusy(true);
    setError(null);
    try {
      const resumed = await agenticApi<ResumeResult>(
        "/api/agentic-resolver/input/resume",
        {
          method: "POST",
          body: JSON.stringify({
            invocationId: result.invocationId,
            requestId: result.needsUserInput.requestId,
            response: { amount },
          }),
        },
        { sessionId: session.sessionId, idempotencyKey: newIdempotencyKey("resume") },
      );
      if (resumed.executionResult) {
        setHistory((current) => [...current, {
          id: `${resumed.executionResult!.invocationId}-${resumed.status}`,
          role: "specialist",
          text: resumed.executionResult!.output
            ? displayValue(resumed.executionResult!.output)
            : resumed.executionResult!.status,
          result: resumed.executionResult!,
        }]);
      } else {
        setError(resumed.failure?.publicMessage || "The specialist input was rejected.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to resume the specialist.");
    } finally {
      setBusy(false);
    }
  };

  const runProactiveEvent = async () => {
    if (!session || busy) return;
    const eventId = newIdempotencyKey("payment-verification-failed");
    const failureCode = "DECLINED";
    const attemptNumber = 2;
    setBusy(true);
    setError(null);
    setEventProof(null);
    try {
      const submission = await agenticApi<ProactiveEventSubmission>(
        "/api/agentic-resolver/events/payment-verification-failed",
        {
          method: "POST",
          body: JSON.stringify({
            eventId,
            failureCode,
            attemptNumber,
            occurredAt: new Date().toISOString(),
          }),
        },
        { sessionId: session.sessionId },
      );
      let proof: ProactiveEventProof = {
        eventId,
        eventType: submission.eventType,
        failureCode,
        attemptNumber,
        execution: submission.execution,
        result: null,
      };
      setEventProof(proof);

      for (let attempt = 0; attempt < 100 && !EVENT_TERMINAL_STATUSES.has(proof.execution.status); attempt += 1) {
        await wait(600);
        const snapshot = await agenticApi<SpecialistExecutionSnapshot>(
          `/api/agentic-resolver/events/executions/${encodeURIComponent(submission.execution.invocationId)}`,
          {},
          { sessionId: session.sessionId },
        );
        proof = { ...proof, execution: snapshot.handle, result: snapshot.result };
        setEventProof(proof);
      }

      if (!EVENT_TERMINAL_STATUSES.has(proof.execution.status)) {
        throw new Error("The event-driven specialist did not complete before the UI polling deadline.");
      }
      if (!proof.result || proof.result.status !== "SUCCEEDED") {
        throw new Error(proof.result?.failure?.publicMessage || proof.execution.failureReason || `Event execution ended with ${proof.execution.status}.`);
      }
      setHistory((current) => [...current, {
        id: `${proof.result!.invocationId}-event-result`,
        role: "specialist",
        text: proof.result!.output?.summary || proof.result!.status,
        result: proof.result!,
      }]);
      toast({
        title: "Event specialist completed",
        description: "AI Fabric analyzed server-owned account context without allowing the raw event to supply authority.",
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The proactive event execution failed.");
    } finally {
      setBusy(false);
    }
  };

  if (pageLoading) {
    return (
      <DemoFullPageLoader
        title={pageLoading === "resetting" ? "Resetting your resolver session" : "Preparing your agentic resolver"}
        description="The backend is creating isolated accounts, binding trusted identity, loading specialist manifests, and checking provider readiness."
        steps={["Create server-owned session", "Bind account scenarios", "Load exact-version specialists"]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-16 pt-24">
        <section className="container mx-auto px-4">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link to="/demos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />Live demos
            </Link>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline"><Link to="/demos/ai-fabric-agentic-action-resolver/about"><Info className="mr-2 h-4 w-4" />About this demo</Link></Button>
              <Button asChild variant="outline"><Link to="/demos/ai-fabric-agentic-action-resolver/review"><ShieldCheck className="mr-2 h-4 w-4" />Review desk</Link></Button>
              <Button variant="outline" onClick={() => void reset()}><RotateCcw className="mr-2 h-4 w-4" />Reset session</Button>
            </div>
          </div>

          <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_330px] lg:items-end">
            <div>
              <Badge variant="outline" className="mb-3 border-violet-200 bg-violet-50 text-violet-700"><Sparkles className="mr-1 h-3.5 w-3.5" />Bounded specialist execution</Badge>
              <h1 className="text-4xl font-bold tracking-normal md:text-5xl">Agentic AI Action Resolver</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                Inspect an account with a manifest-defined specialist, retrieve approved policy evidence, collect typed missing input, and execute one confirmed resolution through a durable receipt.
              </p>
            </div>
            <Card className="border-violet-200 bg-violet-50/60 shadow-none">
              <CardContent className="grid grid-cols-2 gap-3 p-4 text-sm">
                <div><div className="text-xs text-muted-foreground">Backend</div><div className="mt-1 font-semibold">{health?.status || "Unavailable"}</div></div>
                <div><div className="text-xs text-muted-foreground">AI Fabric</div><div className="mt-1 font-semibold">{String(health?.aiFabricVersion || "0.5.3")}</div></div>
                <div><div className="text-xs text-muted-foreground">Commit</div><div className="mt-1 font-semibold">{compactId(String(health?.commit || "pending deployment"))}</div></div>
                <div><div className="text-xs text-muted-foreground">Session</div><div className="mt-1 font-semibold">{compactId(session?.sessionId)}</div></div>
              </CardContent>
            </Card>
          </div>

          {error ? <Alert variant="destructive" className="mb-6"><XCircle className="h-4 w-4" /><AlertTitle>Live execution problem</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}

          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_310px]">
            <aside className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Account scenarios</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {session?.scenarios.map((scenario) => {
                    const selected = scenario.id === session.activeScenarioId;
                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => void selectScenario(scenario)}
                        className={`w-full rounded-md border p-3 text-left transition-colors ${selected ? "border-violet-300 bg-violet-50" : "border-border hover:bg-muted/50"}`}
                      >
                        <div className="flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4" />{scenario.title}</div>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">{scenario.description}</p>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Guided proofs</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" onClick={() => activeScenario && void run(activeScenario.suggestedPrompt)} disabled={!activeScenario || busy}>
                    <FileSearch className="mr-2 h-4 w-4" />Inspect with policy RAG
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => void run("What path would this refund take?", "/api/agentic-resolver/billing-assessment", { question: "What path would this refund take?", resolutionType: "REFUND", amount: null })} disabled={busy}>
                    <MessageSquareText className="mr-2 h-4 w-4" />Prove typed input wait
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => void run("Update my billing address to 10 Downing Street, London, London, SW1A 2AA, GB.")} disabled={busy}>
                    <ShieldCheck className="mr-2 h-4 w-4" />Propose governed write
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => void runProactiveEvent()} disabled={busy}>
                    <Activity className="mr-2 h-4 w-4" />Run proactive event
                  </Button>
                  {eventProof ? <ProactiveEventCard proof={eventProof} /> : null}
                </CardContent>
              </Card>
            </aside>

            <section className="min-w-0">
              <Card className="overflow-hidden">
                <div className="border-b bg-muted/20 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div><div className="font-semibold">{activeScenario?.title || "Resolver conversation"}</div><div className="text-xs text-muted-foreground">The browser sends only the newest message. AI Fabric owns approved history.</div></div>
                    {busy ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Activity className="h-5 w-5 text-emerald-600" />}
                  </div>
                </div>
                <div className="min-h-[460px] space-y-4 p-5">
                  {history.length === 0 ? (
                    <div className="flex min-h-[390px] items-center justify-center text-center">
                      <div className="max-w-md">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Bot className="h-6 w-6" /></div>
                        <h2 className="text-xl font-semibold">Start with current account state</h2>
                        <p className="mt-2 leading-7 text-muted-foreground">Use a guided proof or ask naturally. Identity, subject, scopes, specialist, and provider remain backend-owned.</p>
                      </div>
                    </div>
                  ) : history.map((item) => (
                    <div key={item.id} className={item.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[95%]"}>
                      {item.role === "user" ? (
                        <div className="rounded-md bg-violet-700 px-4 py-3 text-white shadow-sm">{item.text}</div>
                      ) : item.result ? (
                        <ResultCard result={item.result} busy={busy} onDecision={(receipt, decision) => void decide(receipt, decision)} onResume={(result, amount) => void resume(result, amount)} />
                      ) : item.decision ? (
                        <Card className={item.decision.outcome ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {item.decision.outcome ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" /> : <Info className="mt-0.5 h-5 w-5 text-amber-700" />}
                              <div><div className="font-semibold">{item.decision.status?.replaceAll("_", " ") || "Decision unavailable"}</div><p className="mt-1 text-sm leading-6">{item.text}</p>
                                {item.decision.outcome && Object.keys(item.decision.outcome.data || {}).length > 0 ? (
                                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{Object.entries(item.decision.outcome.data).slice(0, 8).map(([key, value]) => <div key={key}><dt className="text-xs uppercase text-muted-foreground">{key.replaceAll(/([A-Z])/g, " $1")}</dt><dd className="mt-0.5 font-medium">{displayValue(value)}</dd></div>)}</dl>
                                ) : null}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Alert variant="destructive"><XCircle className="h-4 w-4" /><AlertTitle>Execution failed</AlertTitle><AlertDescription>{item.text}</AlertDescription></Alert>
                      )}
                    </div>
                  ))}
                </div>
                <form onSubmit={submit} className="border-t bg-background p-4">
                  <Label htmlFor="agentic-message" className="sr-only">Message</Label>
                  <div className="flex items-end gap-2">
                    <Textarea id="agentic-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about the current account or request a supported resolution..." className="min-h-[72px] resize-none" />
                    <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={!message.trim() || busy} aria-label="Send message">
                      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </div>
                </form>
              </Card>
            </section>

            <aside className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Runtime boundary</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    [ShieldCheck, "Trusted context", "Principal, account, tenant, deployment, and scopes are resolved by the backend."],
                    [Code2, "Exact manifest", "The app selects a versioned specialist and validates its schemas and capability references."],
                    [Database, "Durable write", "Executable parameters stay encrypted in a JDBC receipt until an authorized decision."],
                    [RefreshCw, "Replay-safe", "A terminal receipt returns its stored outcome instead of repeating the side effect."],
                  ].map(([Icon, title, detail]) => (
                    <div key={String(title)} className="flex gap-3 rounded-md border p-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
                      <div><div className="font-semibold">{String(title)}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{String(detail)}</p></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Live backend</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <a href={`${AGENTIC_RESOLVER_BASE_URL}/api/demo/health`} target="_blank" rel="noreferrer" className="block rounded-md border p-3 hover:bg-muted/50">Open safe health response</a>
                  <div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Active scenario</div><div className="mt-1 font-semibold">{activeScenario?.title || "Not available"}</div></div>
                  <div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Session expires</div><div className="mt-1 font-semibold">{time(session?.expiresAt)}</div></div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>
      <ConsultationCtaBand compact title="Building a governed specialist?" body="Use this reference flow to separate model reasoning from identity, authority, confirmation, and application-owned side effects." />
      <Footer />
    </div>
  );
}
