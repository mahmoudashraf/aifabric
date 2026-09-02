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
  ExternalLink,
  Info,
  KeyRound,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Network,
  PlugZap,
  RefreshCw,
  RotateCcw,
  Send,
  Server,
  ShieldCheck,
  TerminalSquare,
  TriangleAlert,
  Wrench,
  XCircle,
} from "lucide-react";

import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";
import {
  MCP_OPERATIONS_BASE_URL,
  MCP_OPERATIONS_SESSION_KEY,
  McpAudit,
  McpBindingCanary,
  McpConnection,
  McpDecisionResponse,
  McpDemoHealth,
  McpExecution,
  McpHistoryMessage,
  McpSandboxState,
  McpSession,
  McpToolPolicy,
  McpTurnResponse,
  compactMcpId,
  mcpOperationsApi,
  newMcpIdempotencyKey,
} from "./mcp-operations/api";

interface ConversationItem {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  execution?: McpExecution;
  decision?: McpDecisionResponse["decision"];
}

const STARTER_PROMPTS = [
  "Check the current service status.",
  "List recent incidents for this service.",
  "Restart this sandbox service.",
];

function humanize(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not available";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return "Available in developer inspector";
  return String(value);
}

function tone(value: string | undefined): string {
  const normalized = (value || "").toUpperCase();
  if (["UP", "HEALTHY", "SUCCEEDED", "EXECUTED", "CONFIRMED"].some((item) => normalized.includes(item))) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["DOWN", "FAILED", "ERROR", "DENIED", "REJECTED", "UNAVAILABLE"].some((item) => normalized.includes(item))) {
    return "border-red-200 bg-red-50 text-red-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-900";
}

function ConnectionPanel({ connection }: { connection: McpConnection | null }) {
  if (!connection) return null;
  return (
    <section className="rounded-md border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <PlugZap className="h-4 w-4 text-cyan-700" />Remote MCP boundary
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Exact server binding over {connection.transport}</p>
        </div>
        <Badge className={tone(connection.ready ? "UP" : "DOWN")} variant="outline">
          {connection.ready ? "Connected" : "Unavailable"}
        </Badge>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-muted-foreground">Server reference</dt>
          <dd className="mt-1 break-all font-mono text-xs font-semibold">{connection.serverRef}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted-foreground">Server authentication</dt>
          <dd className="mt-1 font-semibold">{connection.authenticationConfigured ? "Configured" : "Missing"}</dd>
        </div>
      </dl>
      {connection.failure ? (
        <Alert variant="destructive" className="mt-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Remote MCP is not ready</AlertTitle>
          <AlertDescription>{connection.failure} No local executor will replace it.</AlertDescription>
        </Alert>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {connection.tools.map((tool) => <Badge key={tool} variant="secondary" className="font-mono text-[11px]">{tool}</Badge>)}
        </div>
      )}
    </section>
  );
}

function ExecutionCard({
  execution,
  disabled,
  onDecision,
}: {
  execution: McpExecution;
  disabled: boolean;
  onDecision: (receiptId: string, decision: "CONFIRM" | "REJECT") => void;
}) {
  const proposalPending = execution.actionProposal?.status === "PROPOSED";

  return (
    <section className="space-y-4 rounded-md border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge className={tone(execution.status)} variant="outline">{humanize(execution.status)}</Badge>
        <span className="text-xs text-muted-foreground">
          {execution.specialistId ? `${execution.specialistId.name}@${execution.specialistId.version}` : "Specialist unavailable"}
        </span>
      </div>
      {execution.output ? (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{execution.output.summary}</h3>
            <Badge variant="secondary">{execution.output.serviceName}</Badge>
            <Badge className={tone(execution.output.healthStatus)} variant="outline">{execution.output.healthStatus}</Badge>
          </div>
          {execution.output.facts?.length ? (
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {execution.output.facts.map((fact) => (
                <li key={fact} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{fact}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {execution.actionProposal ? (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-950">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Confirmation required</p>
              <p className="mt-1 text-sm leading-6">{execution.actionProposal.confirmationMessage}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="border-amber-300 bg-white">{execution.actionProposal.actionName}</Badge>
                <span>Receipt {compactMcpId(execution.actionProposal.receiptId)}</span>
              </div>
              {proposalPending ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button disabled={disabled} onClick={() => onDecision(execution.actionProposal!.receiptId, "CONFIRM")}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />Confirm restart
                  </Button>
                  <Button disabled={disabled} variant="outline" onClick={() => onDecision(execution.actionProposal!.receiptId, "REJECT")}>
                    <XCircle className="mr-2 h-4 w-4" />Reject
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <Badge className={tone(execution.actionProposal.status)} variant="outline">
                    {humanize(execution.actionProposal.status)}
                  </Badge>
                  <span>This durable receipt has already been resolved.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {execution.failure ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{humanize(execution.failure.reason)}</AlertTitle>
          <AlertDescription>{execution.failure.publicMessage}</AlertDescription>
        </Alert>
      ) : null}
      <details className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-semibold text-foreground">Developer execution identity</summary>
        <div className="mt-2 grid gap-1">
          <span>Invocation: {compactMcpId(execution.invocationId)}</span>
          <span>Status: {execution.status}</span>
          <span>Receipt parameters remain protected by the backend.</span>
        </div>
      </details>
    </section>
  );
}

function ToolTimeline({ timeline }: { timeline: McpAudit[] }) {
  if (!timeline.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No MCP tool call has been recorded for this session.</p>;
  }
  return (
    <ol className="space-y-3">
      {timeline.map((entry) => (
        <li key={entry.id} className="rounded-md border bg-background p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs font-semibold">{entry.toolName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{entry.serverRef}</p>
            </div>
            <Badge className={tone(entry.success ? "SUCCEEDED" : "FAILED")} variant="outline">
              {entry.success ? "Succeeded" : entry.errorCode || "Failed"}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span>{entry.accessMode}</span>
            <span>{entry.serviceName || "Server-owned service"}</span>
            <span>{entry.durationMs.toLocaleString()} ms</span>
            <span>{new Date(entry.startedAt).toLocaleTimeString()}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function AIFabricMcpOperations() {
  const { toast } = useToast();
  const [pageLoading, setPageLoading] = useState<"preparing" | "resetting" | null>("preparing");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<McpDemoHealth | null>(null);
  const [connection, setConnection] = useState<McpConnection | null>(null);
  const [session, setSession] = useState<McpSession | null>(null);
  const [sandbox, setSandbox] = useState<McpSandboxState | null>(null);
  const [tools, setTools] = useState<McpToolPolicy[]>([]);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [message, setMessage] = useState(STARTER_PROMPTS[0]);
  const [canary, setCanary] = useState<McpBindingCanary | null>(null);

  const loadState = useCallback(async (active: McpSession) => {
    const state = await mcpOperationsApi<McpSandboxState>(`/api/mcp-ops/sessions/${active.sessionId}/state`);
    setSandbox(state);
    setConnection(state.connection);
    return state;
  }, []);

  const createSession = useCallback(async () => {
    const created = await mcpOperationsApi<McpSession>("/api/mcp-ops/sessions", { method: "POST" });
    sessionStorage.setItem(MCP_OPERATIONS_SESSION_KEY, created.sessionId);
    setSession(created);
    await loadState(created);
    return created;
  }, [loadState]);

  const initialize = useCallback(async () => {
    setPageLoading("preparing");
    setError(null);
    try {
      const [healthResult, connectionResult, toolResult] = await Promise.all([
        mcpOperationsApi<McpDemoHealth>("/api/demo/health"),
        mcpOperationsApi<McpConnection>("/api/mcp-ops/connection"),
        mcpOperationsApi<McpToolPolicy[]>("/api/mcp-ops/tools"),
      ]);
      setHealth(healthResult);
      setConnection(connectionResult);
      setTools(toolResult);
      const stored = sessionStorage.getItem(MCP_OPERATIONS_SESSION_KEY);
      let active: McpSession | null = null;
      if (stored) {
        try {
          active = await mcpOperationsApi<McpSession>(`/api/mcp-ops/sessions/${stored}`);
          setSession(active);
          await loadState(active);
          const history = await mcpOperationsApi<McpHistoryMessage[]>(`/api/mcp-ops/sessions/${stored}/history`);
          setConversation(history.map((item, index) => ({
            id: `restored-${index}`,
            role: item.role === "USER" ? "user" : "assistant",
            text: item.content,
          })));
        } catch {
          sessionStorage.removeItem(MCP_OPERATIONS_SESSION_KEY);
        }
      }
      if (!active) await createSession();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to prepare the remote MCP demo.");
    } finally {
      setPageLoading(null);
    }
  }, [createSession, loadState]);

  useEffect(() => { void initialize(); }, [initialize]);

  const reset = async () => {
    if (pageLoading) return;
    setPageLoading("resetting");
    setError(null);
    try {
      if (session) {
        await mcpOperationsApi<void>(`/api/mcp-ops/sessions/${session.sessionId}`, { method: "DELETE" }).catch(() => undefined);
      }
      sessionStorage.removeItem(MCP_OPERATIONS_SESSION_KEY);
      setConversation([]);
      setCanary(null);
      await createSession();
      toast({ title: "Fresh isolated sandbox ready" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset the demo session.");
    } finally {
      setPageLoading(null);
    }
  };

  const selectService = async (serviceName: string) => {
    if (!session || busy || serviceName === session.selectedService) return;
    setBusy("service");
    setError(null);
    try {
      const updated = await mcpOperationsApi<McpSession>(
        `/api/mcp-ops/sessions/${session.sessionId}/service`,
        { method: "PUT", body: JSON.stringify({ serviceName }) },
      );
      setSession(updated);
      setConversation([]);
      setCanary(null);
      await loadState(updated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to select the service.");
    } finally {
      setBusy(null);
    }
  };

  const sendMessage = async (value: string) => {
    const text = value.trim();
    if (!session || !text || busy) return;
    setBusy("chat");
    setError(null);
    setConversation((current) => [...current, { id: newMcpIdempotencyKey("user"), role: "user", text }]);
    try {
      const result = await mcpOperationsApi<McpTurnResponse>(
        `/api/mcp-ops/sessions/${session.sessionId}/chat`,
        { method: "POST", body: JSON.stringify({ message: text }) },
        newMcpIdempotencyKey("mcp-turn"),
      );
      setConversation((current) => [...current, {
        id: result.execution.invocationId,
        role: "assistant",
        text: result.execution.output?.summary
          || result.execution.actionProposal?.confirmationMessage
          || result.execution.failure?.publicMessage
          || result.execution.status,
        execution: result.execution,
      }]);
      setSandbox((current) => current ? { ...current, timeline: result.timeline } : current);
      setMessage("");
    } catch (caught) {
      const textError = caught instanceof Error ? caught.message : "The specialist request failed.";
      setError(textError);
      setConversation((current) => [...current, {
        id: newMcpIdempotencyKey("failure"),
        role: "system",
        text: textError,
      }]);
    } finally {
      setBusy(null);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(message);
  };

  const decide = async (receiptId: string, decision: "CONFIRM" | "REJECT") => {
    if (!session || busy) return;
    setBusy("decision");
    setError(null);
    try {
      const result = await mcpOperationsApi<McpDecisionResponse>(
        `/api/mcp-ops/sessions/${session.sessionId}/actions/decide`,
        { method: "POST", body: JSON.stringify({ receiptId, decision }) },
      );
      setConversation((current) => [
        ...current.map((item) => {
          if (item.execution?.actionProposal?.receiptId !== receiptId) return item;
          return {
            ...item,
            execution: {
              ...item.execution,
              actionProposal: {
                ...item.execution.actionProposal,
                status: result.decision.status || decision,
              },
            },
          };
        }),
        {
          id: newMcpIdempotencyKey("decision"),
          role: "system" as const,
          text: result.decision.outcome?.message
            || result.decision.failure?.publicMessage
            || `The proposal is ${result.decision.status?.toLowerCase() || "unavailable"}.`,
          decision: result.decision,
        },
      ]);
      setSandbox((current) => current ? {
        ...current,
        status: result.currentStatus,
        timeline: result.timeline,
      } : current);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to decide the restart proposal.");
    } finally {
      setBusy(null);
    }
  };

  const runCanary = async () => {
    if (!session || busy) return;
    setBusy("canary");
    setError(null);
    try {
      const result = await mcpOperationsApi<McpBindingCanary>(
        `/api/mcp-ops/sessions/${session.sessionId}/binding-canary`,
        { method: "POST" },
      );
      setCanary(result);
      await loadState(session);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to run the server-binding canary.");
    } finally {
      setBusy(null);
    }
  };

  const refresh = async () => {
    if (!session || busy) return;
    setBusy("refresh");
    setError(null);
    try {
      const [state, remote] = await Promise.all([
        loadState(session),
        mcpOperationsApi<McpConnection>("/api/mcp-ops/connection"),
      ]);
      setSandbox(state);
      setConnection(remote);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to refresh remote state.");
    } finally {
      setBusy(null);
    }
  };

  const statusFields = useMemo(() => Object.entries(sandbox?.status || {}).filter(([, value]) => typeof value !== "object"), [sandbox]);

  return (
    <div className="min-h-screen bg-slate-50/60">
      <Navbar />
      {pageLoading ? (
        <DemoFullPageLoader
          title={pageLoading === "resetting" ? "Resetting your sandbox" : "Preparing remote MCP operations"}
          description="Creating an isolated session, checking the authenticated remote server, and loading backend-owned state."
          steps={["Resolve exact server and tool catalog", "Create opaque sandbox identity", "Read current state over Streamable HTTP"]}
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
                <Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-800">
                  <Network className="mr-1 h-3.5 w-3.5" />Remote MCP + governed actions
                </Badge>
                <h1 className="mt-4 text-3xl font-bold tracking-normal md:text-5xl">AI Fabric MCP Operations</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  Inspect an isolated service through authenticated remote MCP tools, then request a restart through AI Fabric confirmation and replay-safe execution.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><Link to="/demos/ai-fabric-mcp-operations/about"><Info className="mr-2 h-4 w-4" />About this demo</Link></Button>
                <Button disabled={Boolean(busy)} variant="outline" onClick={() => void refresh()}><RefreshCw className={`mr-2 h-4 w-4 ${busy === "refresh" ? "animate-spin" : ""}`} />Refresh</Button>
                <Button disabled={Boolean(busy)} variant="destructive" onClick={() => void reset()}><RotateCcw className="mr-2 h-4 w-4" />Reset session</Button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">AI Fabric {health?.aiFabricVersion || "checking"}</Badge>
              <Badge variant="secondary">Commit {compactMcpId(health?.commit)}</Badge>
              <Badge className={tone(connection?.ready ? "UP" : "DOWN")} variant="outline">{connection?.ready ? "Remote MCP ready" : "Remote MCP unavailable"}</Badge>
              <span className="self-center">Session {compactMcpId(session?.sessionId)}</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto space-y-6 px-4 py-8">
          {error ? (
            <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Visible runtime failure</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
          ) : null}

          <div className="grid gap-3 md:grid-cols-3">
            {session?.availableServices.map((service) => (
              <button
                key={service}
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void selectService(service)}
                className={`min-h-24 rounded-md border p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${session.selectedService === service ? "border-cyan-400 bg-cyan-50" : "bg-white hover:border-cyan-200"}`}
              >
                <span className="flex items-center justify-between gap-2"><span className="font-semibold capitalize">{service}</span>{session.selectedService === service ? <CheckCircle2 className="h-5 w-5 text-cyan-700" /> : <Server className="h-5 w-5 text-muted-foreground" />}</span>
                <span className="mt-2 block text-sm text-muted-foreground">Isolated state and a fresh backend conversation.</span>
              </button>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <section className="min-w-0 rounded-md border bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                <div><h2 className="flex items-center gap-2 font-semibold"><MessageSquare className="h-5 w-5 text-primary" />Operations assistant</h2><p className="mt-1 text-xs text-muted-foreground">The browser sends only the new message. Trusted arguments stay on the backend.</p></div>
                <Badge variant="outline">resolver · bounded iterative</Badge>
              </div>
              <div className="max-h-[680px] min-h-[440px] space-y-4 overflow-y-auto p-5">
                {!conversation.length ? (
                  <div className="mx-auto flex min-h-80 max-w-lg flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-700"><Bot className="h-7 w-7" /></div>
                    <h3 className="mt-4 text-lg font-semibold">Ask about {session?.selectedService || "the selected service"}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Read calls execute remotely. Restart requests stop at a durable confirmation receipt.</p>
                  </div>
                ) : null}
                {conversation.map((item) => (
                  <div key={item.id} className={item.role === "user" ? "ml-auto max-w-2xl" : "mr-auto max-w-3xl"}>
                    {item.role === "user" ? (
                      <div className="rounded-md bg-slate-950 px-4 py-3 text-sm leading-6 text-white">{item.text}</div>
                    ) : item.execution ? (
                      <ExecutionCard execution={item.execution} disabled={Boolean(busy)} onDecision={(receipt, decision) => void decide(receipt, decision)} />
                    ) : item.decision ? (
                      <section className={`rounded-md border p-4 ${item.decision.outcome ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                        <div className="flex items-start gap-3">{item.decision.outcome ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" /> : <Info className="mt-0.5 h-5 w-5 text-amber-700" />}<div><p className="font-semibold">{humanize(item.decision.status || "decision recorded")}</p><p className="mt-1 text-sm leading-6">{item.text}</p>{item.decision.outcome ? <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{Object.entries(item.decision.outcome.data).slice(0, 8).map(([key, value]) => <div key={key}><dt className="text-xs uppercase text-muted-foreground">{humanize(key)}</dt><dd className="mt-0.5 font-medium">{displayValue(value)}</dd></div>)}</dl> : null}</div></div>
                      </section>
                    ) : (
                      <Alert variant="destructive"><XCircle className="h-4 w-4" /><AlertTitle>Request failed</AlertTitle><AlertDescription>{item.text}</AlertDescription></Alert>
                    )}
                  </div>
                ))}
                {busy === "chat" ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Specialist is calling approved tools...</div> : null}
              </div>
              <form className="border-t bg-slate-50 p-4" onSubmit={submit}>
                <div className="mb-3 flex flex-wrap gap-2">{STARTER_PROMPTS.map((prompt) => <Button key={prompt} disabled={Boolean(busy)} size="sm" type="button" variant="outline" onClick={() => setMessage(prompt)}>{prompt.replace(" this sandbox service", "")}</Button>)}</div>
                <div className="flex items-end gap-2">
                  <Textarea aria-label="Operations question" disabled={Boolean(busy)} value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-24 resize-none bg-white" placeholder="Ask for status, incidents, or a sandbox restart..." />
                  <Button aria-label="Send operations question" disabled={Boolean(busy) || !message.trim()} size="icon" type="submit" className="h-11 w-11 shrink-0"><Send className="h-5 w-5" /></Button>
                </div>
              </form>
            </section>

            <aside className="min-w-0 space-y-4">
              <ConnectionPanel connection={connection} />
              <section className="rounded-md border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-emerald-700" />Current source state</h2><Badge className={tone(String(sandbox?.status.status || "UNKNOWN"))} variant="outline">{displayValue(sandbox?.status.status)}</Badge></div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">{statusFields.map(([key, value]) => <div key={key} className="rounded-md border bg-slate-50 p-3"><dt className="text-xs uppercase text-muted-foreground">{humanize(key)}</dt><dd className="mt-1 font-semibold">{displayValue(value)}</dd></div>)}</dl>
              </section>
              <section className="rounded-md border bg-white p-4 shadow-sm">
                <h2 className="flex items-center gap-2 text-sm font-semibold"><Wrench className="h-4 w-4 text-violet-700" />Allowed tool policy</h2>
                <div className="mt-3 space-y-2">{tools.map((tool) => <div key={tool.actionId} className="rounded-md border p-3"><div className="flex items-center justify-between gap-2"><span className="break-all font-mono text-[11px] font-semibold">{tool.toolName}</span><Badge variant="outline">{tool.accessMode}</Badge></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{tool.description}</p><p className="mt-1 text-xs font-medium">{tool.requiresConfirmation ? "Confirmation required" : "Read-only execution"}</p></div>)}</div>
              </section>
            </aside>
          </div>

          <Tabs defaultValue="timeline" className="rounded-md border bg-white p-4 shadow-sm md:p-6">
            <TabsList className="grid h-auto w-full grid-cols-3">
              <TabsTrigger value="timeline"><Clock3 className="mr-2 h-4 w-4" />Tool timeline</TabsTrigger>
              <TabsTrigger value="canary"><ShieldCheck className="mr-2 h-4 w-4" />Binding canary</TabsTrigger>
              <TabsTrigger value="incidents"><TriangleAlert className="mr-2 h-4 w-4" />Incidents</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="mt-5"><ToolTimeline timeline={sandbox?.timeline || []} /></TabsContent>
            <TabsContent value="canary" className="mt-5">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div><h2 className="font-semibold">Prove exact server selection fails closed</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">The backend requests the same read tool name through an unresolved server reference. The call must fail with no write delta, even though the approved server exposes a tool with the same name.</p></div>
                <Button disabled={Boolean(busy)} onClick={() => void runCanary()}>{busy === "canary" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}Run binding canary</Button>
              </div>
              {canary ? <Alert className={`mt-5 ${canary.passed ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-red-200 bg-red-50 text-red-950"}`}>{canary.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}<AlertTitle>{canary.passed ? "Fail-closed boundary passed" : "Boundary proof failed"}</AlertTitle><AlertDescription>Rejected {canary.rejectedServerRef}; required {canary.requiredServerRef}; error {canary.errorCode}; write delta {canary.writeDelta}.</AlertDescription></Alert> : null}
            </TabsContent>
            <TabsContent value="incidents" className="mt-5">
              {sandbox?.incidents.length ? <div className="grid gap-3 md:grid-cols-2">{sandbox.incidents.map((incident, index) => <div key={String(incident.incidentId || index)} className="rounded-md border p-4"><div className="flex items-center justify-between gap-2"><span className="font-mono text-xs font-semibold">{displayValue(incident.incidentId)}</span><Badge className={tone(String(incident.severity || incident.status))} variant="outline">{displayValue(incident.severity || incident.status)}</Badge></div><p className="mt-3 text-sm leading-6">{displayValue(incident.summary)}</p><p className="mt-2 text-xs text-muted-foreground">Observed {displayValue(incident.observedAt || incident.openedAt)}</p></div>)}</div> : <p className="py-8 text-center text-sm text-muted-foreground">No recent incident evidence for this service.</p>}
            </TabsContent>
          </Tabs>

          <section className="grid gap-4 rounded-md border border-slate-200 bg-slate-950 p-5 text-slate-100 md:grid-cols-4">
            {[
              [KeyRound, "Authentication", "MCP key is attached server-to-server and never enters browser state."],
              [ShieldCheck, "Governance", "AI Fabric owns action policy, confirmation, receipt, and replay."],
              [Database, "Durability", "Sessions, audits, remote state, and receipts use persistent JDBC storage."],
              [TerminalSquare, "No fallback", "Provider, auth, transport, and tool failures stay visible."],
            ].map(([Icon, title, copy]) => {
              const TypedIcon = Icon as typeof Code2;
              return <div key={String(title)}><TypedIcon className="h-5 w-5 text-cyan-300" /><p className="mt-3 font-semibold">{String(title)}</p><p className="mt-2 text-sm leading-6 text-slate-300">{String(copy)}</p></div>;
            })}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Backend: {MCP_OPERATIONS_BASE_URL}</span>
            <a href={`${MCP_OPERATIONS_BASE_URL}/api/demo/health`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">Open safe health response <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        </section>
      </main>

      <ConsultationCtaBand compact title="Building a governed MCP workflow?" body="Relate this exact-server, trusted-argument, confirmation, and replay pattern to a public or properly redacted Spring Boot use case." />
      <Footer />
    </div>
  );
}
