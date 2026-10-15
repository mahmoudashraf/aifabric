import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  Bot,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  ExternalLink,
  Headphones,
  Info,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";
import {
  CONVERSATION_HANDOVER_BASE_URL,
  ConversationControlState,
  ConversationMessage,
  ConversationView,
  HandoverDemoHealth,
  OperatorQueueItem,
  cancelHandover,
  claimConversation,
  closeConversation,
  createConversationSession,
  loginOperator,
  readConversation,
  readHandoverHealth,
  readOperatorConversation,
  readOperatorQueue,
  returnConversationToAi,
  sendOperatorMessage,
  sendVisitorMessage,
  submitHandover,
} from "./conversation-handover/api";

const STARTER_PROMPTS = [
  "I want to speak to a human operator.",
  "Please explain when a human should take over this conversation.",
];

const CONTROL_STATES: Array<{ state: ConversationControlState; label: string }> = [
  { state: "AI_ACTIVE", label: "AI active" },
  { state: "HUMAN_PENDING", label: "Human requested" },
  { state: "HUMAN_ACTIVE", label: "Human active" },
  { state: "AI_RESUME_PENDING", label: "AI resuming" },
  { state: "CLOSED", label: "Closed" },
];

function humanize(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusTone(state: ConversationControlState): string {
  switch (state) {
    case "AI_ACTIVE":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "HUMAN_PENDING":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "HUMAN_ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "AI_RESUME_PENDING":
      return "border-violet-200 bg-violet-50 text-violet-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function authorityText(state: ConversationControlState): string {
  switch (state) {
    case "AI_ACTIVE":
      return "AI may respond to new visitor messages.";
    case "HUMAN_PENDING":
      return "AI is paused while a human operator is requested.";
    case "HUMAN_ACTIVE":
      return "Only the claimed human operator may respond.";
    case "AI_RESUME_PENDING":
      return "Human authority ended; AI response authority is being restored.";
    default:
      return "This conversation is closed.";
  }
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const actor = message.role === "USER"
    ? "Visitor"
    : message.role === "HUMAN"
      ? "Human operator"
      : message.role === "AI"
        ? "Demo AI"
        : "Control system";
  const alignment = message.role === "USER" ? "ml-auto" : "mr-auto";
  const tone = message.role === "USER"
    ? "border-blue-700 bg-blue-700 text-white"
    : message.role === "HUMAN"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : message.role === "AI"
        ? "border-slate-200 bg-white text-slate-900"
        : "border-amber-200 bg-amber-50 text-amber-950";
  const action = typeof message.metadata?.action === "string" ? message.metadata.action : null;
  const outcome = typeof message.metadata?.outcome === "string" ? message.metadata.outcome : null;

  return (
    <article className={`max-w-[88%] rounded-lg border px-4 py-3 shadow-sm ${alignment} ${tone}`}>
      <div className="mb-2 flex items-center justify-between gap-4 text-xs font-semibold opacity-80">
        <span>{actor}</span>
        <span>#{message.sequence}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
      {action ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-current/15 pt-2">
          <Badge variant="outline" className="border-current/25 bg-white/70 font-mono text-[10px] text-slate-800">
            {action}
          </Badge>
          {outcome ? (
            <Badge variant="outline" className="border-current/25 bg-white/70 text-[10px] text-slate-800">
              {humanize(outcome)}
            </Badge>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ConversationTranscript({ view, emptyText }: { view: ConversationView | null; emptyText: string }) {
  if (!view?.messages.length) {
    return <div className="flex min-h-52 items-center justify-center px-6 text-center text-sm text-muted-foreground">{emptyText}</div>;
  }

  return (
    <div className="flex max-h-[520px] min-h-[340px] flex-col gap-3 overflow-y-auto bg-slate-50/70 p-4">
      {view.messages.map((message) => <MessageBubble key={message.messageId} message={message} />)}
    </div>
  );
}

function ControlRail({ state }: { state: ConversationControlState }) {
  const activeIndex = CONTROL_STATES.findIndex((item) => item.state === state);
  const terminalClosed = state === "CLOSED";

  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {CONTROL_STATES.map((item, index) => {
        const active = item.state === state;
        const completed = !terminalClosed && index < activeIndex;
        return (
          <div
            key={item.state}
            className={`flex min-h-16 items-center gap-3 rounded-md border px-3 py-2 ${
              active ? statusTone(item.state) : completed ? "border-emerald-200 bg-emerald-50/60 text-emerald-800" : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            {active || completed ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-current/50" />}
            <span className="text-xs font-semibold leading-4">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AIFabricConversationHandover() {
  const { toast } = useToast();
  const [pageLoading, setPageLoading] = useState(true);
  const [health, setHealth] = useState<HandoverDemoHealth | null>(null);
  const [conversationId, setConversationId] = useState("");
  const [visitor, setVisitor] = useState<ConversationView | null>(null);
  const [visitorText, setVisitorText] = useState("");
  const [operatorText, setOperatorText] = useState("");
  const [operatorCode, setOperatorCode] = useState("");
  const [operatorAuthenticated, setOperatorAuthenticated] = useState(false);
  const [queue, setQueue] = useState<OperatorQueueItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [operatorConversation, setOperatorConversation] = useState<ConversationView | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [intakeValues, setIntakeValues] = useState<Record<string, string>>({});
  const [consentedFields, setConsentedFields] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshOperator = useCallback(async (preferredConversationId?: string) => {
    const nextQueue = await readOperatorQueue();
    setQueue(nextQueue);
    const preferred = preferredConversationId || selectedConversationId;
    const nextId = nextQueue.some((item) => item.conversationId === preferred)
      ? preferred
      : nextQueue.some((item) => item.conversationId === conversationId)
        ? conversationId
        : nextQueue[0]?.conversationId || "";
    setSelectedConversationId(nextId);
    if (nextId) {
      setOperatorConversation(await readOperatorConversation(nextId));
    } else {
      setOperatorConversation(null);
    }
  }, [conversationId, selectedConversationId]);

  useEffect(() => {
    let active = true;
    const prepare = async () => {
      try {
        const [session, nextHealth] = await Promise.all([
          createConversationSession(),
          readHandoverHealth(),
        ]);
        if (!active) return;
        setConversationId(session.conversationId);
        setVisitor(session.conversation);
        setHealth(nextHealth);
        if (nextHealth.publicOperatorEnabled && nextHealth.demoOperatorAccessCode) {
          setOperatorCode(nextHealth.demoOperatorAccessCode);
        }
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "The handover backend is unavailable.");
      } finally {
        if (active) setPageLoading(false);
      }
    };
    void prepare();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (visitor?.handoverIntakeRequired && visitor.control.state === "AI_ACTIVE") {
      setIntakeOpen(true);
    }
  }, [visitor?.handoverIntakeRequired, visitor?.control.state]);

  useEffect(() => {
    if (!conversationId) return undefined;
    const interval = window.setInterval(() => {
      void readConversation(conversationId).then(setVisitor).catch(() => undefined);
      if (operatorAuthenticated) {
        void refreshOperator().catch(() => undefined);
      }
    }, 2500);
    return () => window.clearInterval(interval);
  }, [conversationId, operatorAuthenticated, refreshOperator]);

  const control = visitor?.control;
  const publicOperatorEnabled = Boolean(health?.publicOperatorEnabled && health.demoOperatorAccessCode);
  const visitorClosed = control?.state === "CLOSED" || control?.state === "AI_RESUME_PENDING";

  const perform = async (label: string, work: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    try {
      await work();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The operation failed.";
      setError(message);
      toast({ title: "Demo operation failed", description: message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const submitVisitorText = async (text: string) => {
    const nextText = text.trim();
    if (!nextText || !conversationId) return;
    await perform("visitor-message", async () => {
      setVisitor(await sendVisitorMessage(conversationId, nextText));
      setVisitorText("");
    });
  };

  const onVisitorSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submitVisitorText(visitorText);
  };

  const onIntakeSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!visitor || !conversationId) return;
    void perform("handover", async () => {
      const intake = Object.fromEntries(
        Object.entries(intakeValues)
          .map(([key, value]) => [key, value.trim()])
          .filter(([, value]) => value),
      );
      const nextView = await submitHandover(conversationId, {
        expectedVersion: visitor.control.version,
        intake,
        consentedFields,
      });
      setVisitor(nextView);
      setIntakeOpen(false);
      setIntakeValues({});
      setConsentedFields([]);
      if (operatorAuthenticated) await refreshOperator(conversationId);
    });
  };

  const onOperatorLogin = (event: FormEvent) => {
    event.preventDefault();
    if (!operatorCode.trim()) return;
    void perform("operator-login", async () => {
      await loginOperator(operatorCode.trim());
      setOperatorAuthenticated(true);
      await refreshOperator(conversationId);
    });
  };

  const selectConversation = (id: string) => {
    void perform("operator-select", async () => {
      setSelectedConversationId(id);
      setOperatorConversation(await readOperatorConversation(id));
    });
  };

  const runOperatorTransition = (
    label: string,
    operation: (id: string, expectedVersion: number) => Promise<ConversationView>,
  ) => {
    if (!selectedConversationId || !operatorConversation) return;
    void perform(label, async () => {
      const nextView = await operation(selectedConversationId, operatorConversation.control.version);
      setOperatorConversation(nextView);
      if (selectedConversationId === conversationId) setVisitor(nextView);
      await refreshOperator(selectedConversationId);
    });
  };

  const onOperatorMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedConversationId || !operatorText.trim()) return;
    void perform("operator-message", async () => {
      const nextView = await sendOperatorMessage(selectedConversationId, operatorText.trim());
      setOperatorConversation(nextView);
      setOperatorText("");
      if (selectedConversationId === conversationId) setVisitor(nextView);
    });
  };

  if (pageLoading) {
    return (
      <DemoFullPageLoader
        title="Opening the conversation handover demo"
        description="Creating an isolated visitor session and loading the live AI Fabric authority state."
        steps={["Create backend-owned session", "Load handover intake contract", "Connect live conversation"]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <main className="pb-16 pt-24">
        <section className="border-b border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-8">
            <Link to="/demos" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
              <ArrowLeft className="h-4 w-4" />All live demos
            </Link>
            <div className="mt-5 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-blue-200 bg-blue-50 text-blue-800" variant="outline">
                    <Headphones className="mr-1 h-3.5 w-3.5" />Human-in-the-loop
                  </Badge>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800" variant="outline">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />Live backend
                  </Badge>
                  <Badge variant="secondary">AI Fabric {health?.aiFabricVersion || "0.8.32"}</Badge>
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-normal md:text-5xl">AI Fabric Conversation Handover</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                  Let the model select a governed handover action, collect required contact consent, pause AI response authority, and move the same ordered conversation to a human operator and back.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link to="/demos/ai-fabric-conversation-handover/about"><Info className="mr-2 h-4 w-4" />About this demo</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={CONVERSATION_HANDOVER_BASE_URL} target="_blank" rel="noreferrer">
                    Standalone app<ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase text-slate-500">Response authority</p>
                <p className="mt-1 text-lg font-bold">{control ? humanize(control.state) : "Unavailable"}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase text-slate-500">Control version</p>
                <p className="mt-1 text-lg font-bold">{control?.version ?? "-"}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase text-slate-500">Authority epoch</p>
                <p className="mt-1 text-lg font-bold">{control?.controlEpoch ?? "-"}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-6">
          {error ? (
            <Alert variant="destructive" className="mb-5">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Live operation did not complete</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {control ? (
            <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold">Conversation authority lifecycle</p>
                  <p className="mt-1 text-sm text-slate-600">{authorityText(control.state)}</p>
                </div>
                <Badge variant="outline" className={`w-fit ${statusTone(control.state)}`}>{humanize(control.state)}</Badge>
              </div>
              <ControlRail state={control.state} />
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <header className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-700 text-white"><Bot className="h-5 w-5" /></div>
                  <div>
                    <h2 className="font-bold">Visitor conversation</h2>
                    <p className="text-xs text-slate-500">AI and human messages share one ordered thread</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {control?.state === "AI_ACTIVE" ? (
                    <Button size="sm" variant="outline" onClick={() => setIntakeOpen(true)}>
                      <Headphones className="mr-2 h-4 w-4" />Talk to a person
                    </Button>
                  ) : null}
                  {control?.state === "HUMAN_PENDING" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={Boolean(busy)}
                      onClick={() => void perform("cancel-handover", async () => {
                        setVisitor(await cancelHandover(conversationId, control.version));
                      })}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />Cancel request
                    </Button>
                  ) : null}
                </div>
              </header>

              <ConversationTranscript view={visitor} emptyText="The live conversation has not loaded." />

              <div className="border-t border-slate-200 p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={Boolean(busy) || Boolean(visitorClosed)}
                      onClick={() => void submitVisitorText(prompt)}
                      className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <form onSubmit={onVisitorSubmit} className="flex gap-2">
                  <Textarea
                    value={visitorText}
                    onChange={(event) => setVisitorText(event.target.value)}
                    disabled={Boolean(busy) || Boolean(visitorClosed)}
                    placeholder={control?.state === "AI_ACTIVE" ? "Ask AI or request a human operator" : "Continue with the human operator"}
                    className="min-h-20 resize-none"
                  />
                  <Button type="submit" size="icon" className="h-20 w-12 shrink-0" disabled={Boolean(busy) || Boolean(visitorClosed) || !visitorText.trim()} aria-label="Send visitor message">
                    {busy === "visitor-message" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </form>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white"><Headphones className="h-5 w-5" /></div>
                  <div>
                    <h2 className="font-bold">Human operator</h2>
                    <p className="text-xs text-slate-500">Application-owned identity and queue</p>
                  </div>
                </div>
                {operatorAuthenticated ? (
                  <Button size="icon" variant="ghost" disabled={Boolean(busy)} onClick={() => void perform("operator-refresh", () => refreshOperator().then(() => undefined))} aria-label="Refresh operator queue">
                    <RefreshCw className={`h-4 w-4 ${busy === "operator-refresh" ? "animate-spin" : ""}`} />
                  </Button>
                ) : null}
              </header>

              {!operatorAuthenticated ? (
                <form onSubmit={onOperatorLogin} className="p-5">
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                    <div className="flex gap-3">
                      <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
                      <p>{publicOperatorEnabled
                        ? "Try the human operator side with the public demo code below. Your queue is limited to your own session. Use sample contact details."
                        : "The operator identity belongs to the application, not the model. Enter the configured demo access code to inspect and claim pending conversations."}</p>
                    </div>
                  </div>
                  <Label htmlFor="handover-operator-code" className="mt-5 block">{publicOperatorEnabled ? "Demo operator code" : "Operator access code"}</Label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="handover-operator-code"
                      type={publicOperatorEnabled ? "text" : "password"}
                      autoComplete={publicOperatorEnabled ? "off" : "current-password"}
                      spellCheck={false}
                      value={operatorCode}
                      onChange={(event) => setOperatorCode(event.target.value)}
                      placeholder={publicOperatorEnabled ? "Public demo code" : "Configured hosted-demo code"}
                    />
                    <Button type="submit" disabled={Boolean(busy) || !operatorCode.trim()}>
                      {busy === "operator-login" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                      {publicOperatorEnabled ? "Open my demo queue" : "Open queue"}
                    </Button>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">The code is checked by the backend and is never included in an AI prompt.</p>
                </form>
              ) : (
                <div className="grid min-h-[540px] lg:grid-cols-[170px_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[170px_minmax(0,1fr)]">
                  <aside className="border-b border-slate-200 bg-slate-50 p-3 lg:border-b-0 lg:border-r xl:border-b xl:border-r-0 2xl:border-b-0 2xl:border-r">
                    <p className="mb-2 text-xs font-bold uppercase text-slate-500">Pending queue</p>
                    <div className="space-y-2">
                      {queue.length ? queue.map((item) => (
                        <button
                          key={item.conversationId}
                          type="button"
                          onClick={() => selectConversation(item.conversationId)}
                          className={`w-full rounded-md border p-3 text-left transition ${item.conversationId === selectedConversationId ? "border-emerald-400 bg-white shadow-sm" : "border-slate-200 bg-white/70 hover:border-slate-300"}`}
                        >
                          <span className="block truncate text-xs font-bold">{item.safeLabel}</span>
                          <span className="mt-1 block text-[11px] text-slate-500">{humanize(item.state)} · v{item.version}</span>
                        </button>
                      )) : <p className="py-5 text-center text-xs text-slate-500">No handover is waiting.</p>}
                    </div>
                  </aside>

                  <div className="min-w-0">
                    {operatorConversation ? (
                      <>
                        <div className="border-b border-slate-200 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Badge variant="outline" className={statusTone(operatorConversation.control.state)}>{humanize(operatorConversation.control.state)}</Badge>
                            <span className="text-xs text-slate-500">Version {operatorConversation.control.version}</span>
                          </div>
                          {operatorConversation.contactIntake ? (
                            <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{operatorConversation.contactIntake.email}</span></div>
                              {operatorConversation.contactIntake.name ? <div className="flex items-center gap-2"><CircleUserRound className="h-3.5 w-3.5" /><span>{operatorConversation.contactIntake.name}</span></div> : null}
                              {operatorConversation.contactIntake.phone ? <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /><span>{operatorConversation.contactIntake.phone}</span></div> : null}
                            </dl>
                          ) : null}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {operatorConversation.control.state === "HUMAN_PENDING" ? (
                              <Button size="sm" disabled={Boolean(busy)} onClick={() => runOperatorTransition("claim", claimConversation)}>
                                <UserRoundCheck className="mr-2 h-4 w-4" />Claim conversation
                              </Button>
                            ) : null}
                            {operatorConversation.control.state === "HUMAN_ACTIVE" ? (
                              <>
                                <Button size="sm" disabled={Boolean(busy)} onClick={() => runOperatorTransition("return-ai", returnConversationToAi)}>
                                  <ArrowRightLeft className="mr-2 h-4 w-4" />Return to AI
                                </Button>
                                <Button size="sm" variant="outline" disabled={Boolean(busy)} onClick={() => runOperatorTransition("close", closeConversation)}>
                                  <XCircle className="mr-2 h-4 w-4" />Close
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </div>
                        <ConversationTranscript view={operatorConversation} emptyText="Select a pending conversation." />
                        <form onSubmit={onOperatorMessage} className="flex gap-2 border-t border-slate-200 p-3">
                          <Input
                            value={operatorText}
                            onChange={(event) => setOperatorText(event.target.value)}
                            disabled={Boolean(busy) || operatorConversation.control.state !== "HUMAN_ACTIVE"}
                            placeholder="Reply as the human operator"
                          />
                          <Button type="submit" size="icon" disabled={Boolean(busy) || operatorConversation.control.state !== "HUMAN_ACTIVE" || !operatorText.trim()} aria-label="Send operator message">
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </>
                    ) : (
                      <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                        <MessageSquare className="h-9 w-9 text-slate-300" />
                        <p className="mt-3 font-semibold">No conversation selected</p>
                        <p className="mt-1 text-sm text-slate-500">Request a human from the visitor side to populate this queue.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>

          <section className="mt-6 border-y border-slate-200 bg-white px-4 py-5">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><div><h3 className="text-sm font-bold">Governed model choice</h3><p className="mt-1 text-sm leading-6 text-slate-600">The LLM can select the allowlisted handover action; application policy still controls admission.</p></div></div>
              <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><h3 className="text-sm font-bold">Versioned authority</h3><p className="mt-1 text-sm leading-6 text-slate-600">Every claim, cancel, close, and return-to-AI transition checks the current control version.</p></div></div>
              <div className="flex gap-3"><ArrowRightLeft className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div><h3 className="text-sm font-bold">One ordered conversation</h3><p className="mt-1 text-sm leading-6 text-slate-600">USER, AI, HUMAN, and SYSTEM messages remain ordered while response authority changes.</p></div></div>
            </div>
          </section>
        </section>
      </main>

      <Dialog open={intakeOpen} onOpenChange={setIntakeOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Headphones className="h-5 w-5 text-blue-700" />Share contact details for handover</DialogTitle>
            <DialogDescription>
              AI response authority does not change until the required intake fields and consent pass backend validation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onIntakeSubmit} className="mt-2 space-y-5">
            {(visitor?.handoverIntakeSchema.fields || []).map((field) => {
              const value = intakeValues[field.key] || "";
              const showConsent = field.consentRequired && (field.required || Boolean(value.trim()));
              return (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`handover-${field.key}`}>
                    {field.label}{field.required ? <span className="ml-1 text-red-600">*</span> : <span className="ml-1 text-slate-400">optional</span>}
                  </Label>
                  <Input
                    id={`handover-${field.key}`}
                    type={field.type === "EMAIL" ? "email" : field.type === "PHONE" ? "tel" : "text"}
                    maxLength={field.maxLength}
                    required={field.required}
                    value={value}
                    onChange={(event) => setIntakeValues((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.type === "EMAIL" ? "you@example.com" : field.type === "PHONE" ? "+44 ..." : "Your name"}
                  />
                  <p className="text-xs leading-5 text-slate-500">{field.purpose}</p>
                  {showConsent ? (
                    <label className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm leading-5 text-blue-950">
                      <input
                        type="checkbox"
                        required
                        checked={consentedFields.includes(field.key)}
                        onChange={(event) => setConsentedFields((current) => event.target.checked
                          ? [...new Set([...current, field.key])]
                          : current.filter((item) => item !== field.key))}
                        className="mt-0.5 h-4 w-4 accent-blue-700"
                      />
                      <span>I consent to share this {field.label.toLowerCase()} with the human operator for this handover.</span>
                    </label>
                  ) : null}
                </div>
              );
            })}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIntakeOpen(false)}>Not now</Button>
              <Button type="submit" disabled={Boolean(busy)}>
                {busy === "handover" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Headphones className="mr-2 h-4 w-4" />}
                Request human support
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConsultationCtaBand
        compact
        title="Designing a governed human handover?"
        body="Use AI Fabric for the durable authority state machine while your application keeps workforce identity, contact policy, and operator channels under its own control."
      />
      <Footer />
    </div>
  );
}
