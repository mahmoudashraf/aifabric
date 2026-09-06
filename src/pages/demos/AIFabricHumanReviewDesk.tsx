import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Info,
  Loader2,
  RefreshCw,
  Scale,
  ShieldCheck,
  UserCog,
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
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";
import {
  AGENTIC_REVIEW_SESSION_STORAGE_KEY,
  AGENTIC_SESSION_STORAGE_KEY,
  IssuedReviewerSession,
  ResolverSession,
  ReviewDecision,
  ReviewDecisionResult,
  ReviewInformationResult,
  ReviewSubmissionResult,
  ReviewTask,
  ReviewTaskDetail,
  agenticApi,
  compactId,
  newIdempotencyKey,
} from "./agentic-resolver/api";
import {
  REVIEW_JOURNEYS,
  responseFor,
  type ReviewJourney,
} from "./agentic-resolver/reviewJourneys";

interface StoredReviewerSession extends IssuedReviewerSession {
  demoSessionId: string;
}

function dateTime(value?: string | null): string {
  if (!value) return "Not available";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function roleLabel(role: IssuedReviewerSession["role"]): string {
  return role === "SENIOR" ? "Senior reviewer" : "Operations reviewer";
}

export default function AIFabricHumanReviewDesk() {
  const [session, setSession] = useState<ResolverSession | null>(null);
  const [reviewer, setReviewer] = useState<StoredReviewerSession | null>(null);
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [selected, setSelected] = useState<ReviewTaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("20");
  const [reason, setReason] = useState("");
  const [lastDecision, setLastDecision] = useState<ReviewDecisionResult | null>(null);
  const [selectedJourneyId, setSelectedJourneyId] = useState(REVIEW_JOURNEYS[0].id);
  const [informationReference, setInformationReference] = useState("INC-DEMO-2026-42");
  const [informationResult, setInformationResult] = useState<ReviewInformationResult | null>(null);

  const selectedJourney = useMemo(
    () => REVIEW_JOURNEYS.find((journey) => journey.id === selectedJourneyId) || REVIEW_JOURNEYS[0],
    [selectedJourneyId],
  );

  const storageKey = useMemo(
    () => `${AGENTIC_REVIEW_SESSION_STORAGE_KEY}:${session?.sessionId || "none"}`,
    [session?.sessionId],
  );

  const loadTasks = useCallback(async (
    activeSession: ResolverSession,
    activeReviewer: StoredReviewerSession,
  ) => {
    const inbox = await agenticApi<ReviewTask[]>(
      "/api/agentic-resolver/demo-reviews",
      {},
      {
        sessionId: activeSession.sessionId,
        reviewerToken: activeReviewer.token,
      },
    );
    setTasks(inbox);
    setSelected((current) => current && !inbox.some(
      (task) => task.taskId === current.task.taskId,
    ) ? null : current);
  }, []);

  const issueReviewer = useCallback(async (
    activeSession: ResolverSession,
    role: IssuedReviewerSession["role"],
  ) => {
    const issued = await agenticApi<IssuedReviewerSession>(
      "/api/agentic-resolver/demo-reviews/sessions",
      { method: "POST", body: JSON.stringify({ role }) },
      { sessionId: activeSession.sessionId },
    );
    const stored = { ...issued, demoSessionId: activeSession.sessionId };
    sessionStorage.setItem(
      `${AGENTIC_REVIEW_SESSION_STORAGE_KEY}:${activeSession.sessionId}`,
      JSON.stringify(stored),
    );
    setReviewer(stored);
    return stored;
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        let demoSession: ResolverSession;
        const sessionId = sessionStorage.getItem(AGENTIC_SESSION_STORAGE_KEY);
        if (sessionId) {
          try {
            demoSession = await agenticApi<ResolverSession>(
              `/api/agentic-resolver/sessions/${encodeURIComponent(sessionId)}`,
            );
          } catch {
            demoSession = await agenticApi<ResolverSession>(
              "/api/agentic-resolver/sessions",
              { method: "POST" },
            );
            sessionStorage.setItem(AGENTIC_SESSION_STORAGE_KEY, demoSession.sessionId);
          }
        } else {
          demoSession = await agenticApi<ResolverSession>(
            "/api/agentic-resolver/sessions",
            { method: "POST" },
          );
          sessionStorage.setItem(AGENTIC_SESSION_STORAGE_KEY, demoSession.sessionId);
        }
        setSession(demoSession);
        const raw = sessionStorage.getItem(
          `${AGENTIC_REVIEW_SESSION_STORAGE_KEY}:${demoSession.sessionId}`,
        );
        let credential = raw ? JSON.parse(raw) as StoredReviewerSession : null;
        if (!credential || new Date(credential.expiresAt).getTime() <= Date.now()) {
          credential = await issueReviewer(demoSession, "REGULAR");
        } else {
          setReviewer(credential);
        }
        await loadTasks(demoSession, credential);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to open the review desk.");
      } finally {
        setLoading(false);
      }
    })();
  }, [issueReviewer, loadTasks]);

  const switchRole = async (role: IssuedReviewerSession["role"]) => {
    if (!session || busy) return;
    setBusy(true);
    setError(null);
    setSelected(null);
    try {
      const issued = await issueReviewer(session, role);
      await loadTasks(session, issued);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to change reviewer role.");
    } finally {
      setBusy(false);
    }
  };

  const refresh = async () => {
    if (!session || !reviewer || busy) return;
    setBusy(true);
    setError(null);
    try {
      await loadTasks(session, reviewer);
      if (selected) await openTask(selected.task.taskId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to refresh review state.");
    } finally {
      setBusy(false);
    }
  };

  const openTask = async (taskId: string) => {
    if (!session || !reviewer) return;
    const detail = await agenticApi<ReviewTaskDetail>(
      `/api/agentic-resolver/demo-reviews/${encodeURIComponent(taskId)}`,
      {},
      { sessionId: session.sessionId, reviewerToken: reviewer.token },
    );
    setSelected(detail);
  };

  const selectJourney = (journey: ReviewJourney) => {
    setSelectedJourneyId(journey.id);
    setAmount(String(journey.amount));
    setReason(journey.reason);
    setInformationResult(null);
  };

  const createReview = async () => {
    if (!session || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await agenticApi<ReviewSubmissionResult>(
        "/api/agentic-resolver/reviews/support-credit",
        {
          method: "POST",
          body: JSON.stringify({
            question: `Create a governed support credit for the ${selectedJourney.title.toLowerCase()} review journey.`,
            resolutionType: "ACCOUNT_CREDIT",
            amount: selectedJourney.amount,
            reason: selectedJourney.reason,
          }),
        },
        {
          sessionId: session.sessionId,
          idempotencyKey: newIdempotencyKey("review-proposal"),
        },
      );
      if (!result.reviewTask) throw new Error(
        result.reviewFailure?.publicMessage || result.proposalFailure?.publicMessage || "The specialist did not create review work.",
      );
      if (reviewer) await loadTasks(session, reviewer);
      if (reviewer) await openTask(result.reviewTask.taskId);
      setLastDecision(null);
      setInformationResult(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create review work.");
    } finally {
      setBusy(false);
    }
  };

  const provideInformation = async () => {
    if (!session || !selected || busy || !informationReference.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const result = await agenticApi<ReviewInformationResult>(
        `/api/agentic-resolver/reviews/${encodeURIComponent(selected.task.taskId)}/information`,
        {
          method: "POST",
          body: JSON.stringify({
            submissionId: newIdempotencyKey("review-information"),
            expectedVersion: selected.task.version,
            response: { incidentReference: informationReference.trim() },
          }),
        },
        { sessionId: session.sessionId },
      );
      setInformationResult(result);
      if (reviewer) await loadTasks(session, reviewer);
      await openTask(selected.task.taskId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The requested information could not be supplied.");
    } finally {
      setBusy(false);
    }
  };

  const decide = async (decision: ReviewDecision) => {
    if (!session || !reviewer || !selected || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await agenticApi<ReviewDecisionResult>(
        `/api/agentic-resolver/demo-reviews/${encodeURIComponent(selected.task.taskId)}/decision`,
        {
          method: "POST",
          body: JSON.stringify({
            decisionId: newIdempotencyKey(`review-${decision.toLowerCase()}`),
            decision,
            expectedVersion: selected.task.version,
            response: responseFor(decision, amount, reason),
          }),
        },
        { sessionId: session.sessionId, reviewerToken: reviewer.token },
      );
      setLastDecision(result);
      await loadTasks(session, reviewer);
      if (result.task) await openTask(result.task.taskId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The review decision failed.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <DemoFullPageLoader title="Opening the human review desk" description="Issuing a short-lived reviewer identity and loading only review work bound to your isolated demo session." steps={["Verify demo session", "Issue reviewer credential", "Load durable inbox"]} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-16 pt-24">
        <section className="container mx-auto px-4">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link to="/demos/ai-fabric-agentic-action-resolver" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Agentic resolver</Link>
            <div className="flex gap-2">
              <Button variant={reviewer?.role === "REGULAR" ? "default" : "outline"} onClick={() => void switchRole("REGULAR")} disabled={busy}>Regular</Button>
              <Button variant={reviewer?.role === "SENIOR" ? "default" : "outline"} onClick={() => void switchRole("SENIOR")} disabled={busy}>Senior</Button>
              <Button size="icon" variant="outline" onClick={() => void refresh()} disabled={busy} aria-label="Refresh review state"><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /></Button>
            </div>
          </div>

          <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <Badge variant="outline" className="mb-3 border-cyan-200 bg-cyan-50 text-cyan-800"><Scale className="mr-1 h-3.5 w-3.5" />Durable human review</Badge>
              <h1 className="text-4xl font-bold tracking-normal md:text-5xl">Human Review Operations Desk</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">Inspect safe proposals, apply only policy-allowed decisions, and watch AI Fabric continue the linked governed receipt without exposing executable parameters.</p>
            </div>
            <Card className="border-cyan-200 bg-cyan-50/60 shadow-none"><CardContent className="grid grid-cols-2 gap-3 p-4 text-sm">
              <div><div className="text-xs text-muted-foreground">Identity</div><div className="mt-1 font-semibold">{reviewer ? roleLabel(reviewer.role) : "Unavailable"}</div></div>
              <div><div className="text-xs text-muted-foreground">Credential</div><div className="mt-1 font-semibold">Server issued</div></div>
              <div><div className="text-xs text-muted-foreground">Expires</div><div className="mt-1 font-semibold">{dateTime(reviewer?.expiresAt)}</div></div>
              <div><div className="text-xs text-muted-foreground">Session</div><div className="mt-1 font-semibold">{compactId(session?.sessionId)}</div></div>
            </CardContent></Card>
          </div>

          {error ? <Alert variant="destructive" className="mb-6"><XCircle className="h-4 w-4" /><AlertTitle>Review operation failed</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}

          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <Card><CardHeader><CardTitle className="text-lg">Guided decision journeys</CardTitle></CardHeader><CardContent className="space-y-2">
                {REVIEW_JOURNEYS.map((journey) => (
                  <button key={journey.id} type="button" onClick={() => selectJourney(journey)} className={`w-full rounded-md border p-3 text-left transition-colors ${journey.id === selectedJourney.id ? "border-cyan-300 bg-cyan-50" : "hover:bg-muted/40"}`}>
                    <div className="font-semibold">{journey.title}</div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{journey.description}</p>
                  </button>
                ))}
              </CardContent></Card>
              <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-3">
                <div className="text-sm font-semibold text-cyan-950">{selectedJourney.title} journey</div>
                <div className="mt-2 flex flex-wrap gap-1.5">{selectedJourney.steps.map((step, index) => <Badge key={step} variant="outline" className="border-cyan-200 bg-white text-cyan-900">{index + 1}. {step}</Badge>)}</div>
              </div>
              <Button className="w-full" onClick={() => void createReview()} disabled={busy}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck2 className="mr-2 h-4 w-4" />}Create {selectedJourney.title.toLowerCase()} review</Button>
              <Card><CardHeader><CardTitle className="text-lg">Session inbox</CardTitle></CardHeader><CardContent className="space-y-2">
                {tasks.length === 0 ? <div className="rounded-md border border-dashed p-5 text-center text-sm text-muted-foreground">No visible work for this reviewer. Create a proposal or switch to the senior role after escalation.</div> : tasks.map((task) => (
                  <button key={task.taskId} type="button" onClick={() => void openTask(task.taskId)} className={`w-full rounded-md border p-3 text-left ${selected?.task.taskId === task.taskId ? "border-cyan-300 bg-cyan-50" : "hover:bg-muted/40"}`}>
                    <div className="flex items-center justify-between gap-2"><span className="font-semibold">{task.title}</span><Badge variant="outline">{task.status.replaceAll("_", " ")}</Badge></div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{task.summary}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{dateTime(task.createdAt)}</div>
                  </button>
                ))}
              </CardContent></Card>
            </aside>

            <section>
              {!selected ? (
                <Card><CardContent className="flex min-h-[520px] items-center justify-center p-8 text-center"><div className="max-w-lg"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-800"><UserCog className="h-6 w-6" /></div><h2 className="text-xl font-semibold">Select durable review work</h2><p className="mt-2 leading-7 text-muted-foreground">The inbox is filtered twice: AI Fabric authorizes tenant and policy scope, then the application verifies the originating browser session.</p></div></CardContent></Card>
              ) : (
                <div className="space-y-4">
                  <Card><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>{selected.task.title}</CardTitle><div className="mt-2 text-xs text-muted-foreground">Task {compactId(selected.task.taskId)} · Version {selected.task.version}</div></div><Badge variant="outline">{selected.task.status.replaceAll("_", " ")}</Badge></div></CardHeader><CardContent className="space-y-5">
                    <p className="leading-7 text-muted-foreground">{selected.task.summary}</p>
                    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Policy</div><div className="mt-1 font-semibold">{selected.task.policyId.name}@{selected.task.policyId.version}</div></div><div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Created</div><div className="mt-1 font-semibold">{dateTime(selected.task.createdAt)}</div></div><div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Expires</div><div className="mt-1 font-semibold">{dateTime(selected.task.expiresAt)}</div></div></div>

                    {selected.task.allowedDecisions.includes("CORRECT") ? <div className="grid gap-3 sm:grid-cols-2"><div><Label htmlFor="correction-amount">Corrected account credit</Label><Input id="correction-amount" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} /></div><div><Label htmlFor="review-reason">Correction or information note</Label><Textarea id="review-reason" value={reason} onChange={(event) => setReason(event.target.value)} className="min-h-[42px]" /></div></div> : null}

                    {selected.task.status === "WAITING_FOR_INFORMATION" ? (
                      <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4">
                        <div className="font-semibold text-cyan-950">Supply requested information</div>
                        <p className="mt-1 text-sm text-cyan-900">{String(selected.requestedInformation?.question || "Provide the requested source information.")}</p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <Label htmlFor="incident-reference" className="sr-only">Incident reference</Label>
                          <Input id="incident-reference" value={informationReference} onChange={(event) => setInformationReference(event.target.value)} placeholder="Incident reference" className="bg-white" />
                          <Button onClick={() => void provideInformation()} disabled={busy || !informationReference.trim()}>Provide information</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">{selected.task.allowedDecisions.map((decision) => <Button key={decision} variant={decision === "REJECT" ? "destructive" : decision === "APPROVE" ? "default" : "outline"} disabled={busy} onClick={() => void decide(decision)}>{decision === "APPROVE" ? <CheckCircle2 className="mr-2 h-4 w-4" /> : decision === "REJECT" ? <XCircle className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}{decision.replaceAll("_", " ")}</Button>)}</div>
                    )}

                    {selected.message ? <Alert><Info className="h-4 w-4" /><AlertTitle>Continuation</AlertTitle><AlertDescription>{selected.message}</AlertDescription></Alert> : null}
                    {informationResult?.message ? <Alert><Info className="h-4 w-4" /><AlertTitle>Information accepted</AlertTitle><AlertDescription>{informationResult.message}</AlertDescription></Alert> : null}
                    {selected.outcome ? <Alert className="border-emerald-200 bg-emerald-50"><CheckCircle2 className="h-4 w-4 text-emerald-700" /><AlertTitle>{selected.outcome.message}</AlertTitle><AlertDescription>The governed receipt reached one terminal application outcome.</AlertDescription></Alert> : null}
                    {selected.failureReason ? <Alert variant="destructive"><XCircle className="h-4 w-4" /><AlertTitle>Review failed</AlertTitle><AlertDescription>{selected.failureReason}</AlertDescription></Alert> : null}
                  </CardContent></Card>

                  {lastDecision ? <Card><CardHeader><CardTitle className="text-lg">Latest durable decision</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><div><div className="text-xs text-muted-foreground">Status</div><div className="mt-1 font-semibold">{lastDecision.task?.status.replaceAll("_", " ") || "Unavailable"}</div></div><div><div className="text-xs text-muted-foreground">Successor</div><div className="mt-1 font-semibold">{compactId(lastDecision.successorTaskId)}</div></div><div><div className="text-xs text-muted-foreground">Action outcome</div><div className="mt-1 font-semibold">{lastDecision.outcome?.message || "No write executed"}</div></div></CardContent></Card> : null}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
      <ConsultationCtaBand compact title="Designing governed human review?" body="Keep reviewer identity server-owned, expose only safe task projections, and continue writes through the original durable receipt." />
      <Footer />
    </div>
  );
}
