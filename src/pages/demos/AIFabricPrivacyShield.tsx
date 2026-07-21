import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
  EyeOff,
  FileSearch,
  Info,
  Loader2,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import Footer from "@/components/Footer";
import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DemoFullPageLoader } from "./components/DemoFullPageLoader";

const API_BASE = (
  import.meta.env.VITE_PRIVACY_SHIELD_API_URL ||
  "https://ai-fabric-privacy-shield.46.224.145.148.sslip.io"
).replace(/\/$/, "");

const SESSION_KEY = "ai-fabric-privacy-shield-session-v1";
const UI_BUILD_MARKER = "privacy-shield-ui-2026-07-09";

type ApiStatus = "loading" | "connected" | "offline";

interface DemoSample {
  personaId: string;
  title: string;
  channel: string;
  subject: string;
  message: string;
  expectedDetections: string[];
}

interface PrivacyMessageCard {
  id: number;
  personaId: string;
  personaName: string;
  channel: string;
  piiDetected: boolean;
  modeApplied: string | null;
  detectionsCount: number;
  detectionsSummary: string;
  processedSubject: string;
  processedMessage: string;
  originalEvidencePolicy: string;
  rawInputWithheld: boolean;
  createdAt: string;
}

interface PrivacyMetrics {
  totalMessages: number;
  piiMessages: number;
  safeMessages: number;
  detectionsTotal: number;
  rawInputWithheld: boolean;
}

interface PipelineStage {
  name: string;
  description: string;
  owner: string;
}

interface DemoDashboard {
  sessionId: string;
  samples: DemoSample[];
  messages: PrivacyMessageCard[];
  metrics: PrivacyMetrics;
  pipeline: PipelineStage[];
}

interface MessageResult {
  message: PrivacyMessageCard;
  dashboard: DemoDashboard;
}

interface SearchResult {
  sessionId: string;
  processedQuery: string;
  queryPiiDetected: boolean;
  queryDetectionsSummary: string;
  resultCount: number;
  results: PrivacyMessageCard[];
}

interface DemoHealth {
  status?: string;
  version?: string;
  commit?: string;
  branch?: string;
  builtAt?: string;
  aiFabricVersion?: string;
  [key: string]: unknown;
}

const EMPTY_DASHBOARD: DemoDashboard = {
  sessionId: "",
  samples: [],
  messages: [],
  metrics: {
    totalMessages: 0,
    piiMessages: 0,
    safeMessages: 0,
    detectionsTotal: 0,
    rawInputWithheld: true,
  },
  pipeline: [],
};

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api/privacy-demo${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Privacy Shield API ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function healthRequest(): Promise<DemoHealth> {
  const response = await fetch(`${API_BASE}/api/demo/health`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Privacy Shield health ${response.status}: ${text || response.statusText}`);
  }
  return response.json() as Promise<DemoHealth>;
}

function getOrCreateSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = `privacy-demo-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(SESSION_KEY, id);
  return id;
}

function shortId(value?: string) {
  if (!value || value === "unknown") return "unknown";
  return value.length > 10 ? value.slice(0, 10) : value;
}

function formatDate(value: string) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function splitDetections(summary: string) {
  if (!summary) return [];
  return summary.split(",").map((item) => item.trim()).filter(Boolean);
}

function detectionLabel(value: string) {
  const [type, field] = value.split(":");
  return field ? `${type} in ${field}` : value;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  tone = "blue",
}: {
  title: string;
  value: string;
  icon: typeof ShieldCheck;
  tone?: "blue" | "emerald" | "rose" | "amber";
}) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-normal">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function MessageCard({ message }: { message: PrivacyMessageCard }) {
  const detections = splitDetections(message.detectionsSummary);

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold tracking-normal">{message.processedSubject || "Support message"}</h3>
            <Badge variant="outline" className={message.piiDetected ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>
              {message.piiDetected ? "PII detected" : "No PII"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {message.personaName} · {message.channel} · {formatDate(message.createdAt)}
          </p>
        </div>
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
          {message.modeApplied || "mode unknown"}
        </Badge>
      </div>

      <p className="rounded-md border border-border bg-muted/30 p-3 text-sm leading-6 text-foreground">
        {message.processedMessage}
      </p>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="rounded-md bg-muted/30 p-3">
          <div className="text-xs font-bold uppercase text-muted-foreground">Detections</div>
          <div className="mt-1 text-lg font-bold">{message.detectionsCount}</div>
        </div>
        <div className="rounded-md bg-muted/30 p-3">
          <div className="text-xs font-bold uppercase text-muted-foreground">Original evidence</div>
          <div className="mt-1 text-sm font-semibold">{message.originalEvidencePolicy}</div>
        </div>
        <div className="rounded-md bg-muted/30 p-3">
          <div className="text-xs font-bold uppercase text-muted-foreground">Raw returned</div>
          <div className="mt-1 text-sm font-semibold">{message.rawInputWithheld ? "No" : "Check API"}</div>
        </div>
      </div>

      {detections.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {detections.map((detection) => (
            <Badge key={detection} variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
              {detectionLabel(detection)}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Pipeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <Card className="border-border/70">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          AI Fabric privacy pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-5">
          {stages.map((stage, index) => (
            <div key={stage.name} className="rounded-lg border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <Badge variant="outline" className={stage.owner === "ai-fabric" ? "border-violet-200 bg-violet-50 text-violet-700" : "border-slate-200 bg-slate-50 text-slate-700"}>
                  {stage.owner}
                </Badge>
              </div>
              <div className="text-sm font-semibold">{stage.name}</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{stage.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AIFabricPrivacyShield() {
  const { toast } = useToast();
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [dashboard, setDashboard] = useState<DemoDashboard>(EMPTY_DASHBOARD);
  const [health, setHealth] = useState<DemoHealth | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [pageLoading, setPageLoading] = useState(true);
  const [pageLoadingMode, setPageLoadingMode] = useState<"loading" | "resetting">("loading");
  const [selectedSample, setSelectedSample] = useState<DemoSample | null>(null);
  const [personaId, setPersonaId] = useState("billing");
  const [channel, setChannel] = useState("webchat");
  const [subject, setSubject] = useState("Billing update request");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("find sara.ahmed@example.com subscription update");
  const [latestMessage, setLatestMessage] = useState<PrivacyMessageCard | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const sortedMessages = useMemo(
    () => [...dashboard.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [dashboard.messages],
  );

  const applySample = useCallback((sample: DemoSample) => {
    setSelectedSample(sample);
    setPersonaId(sample.personaId);
    setChannel(sample.channel);
    setSubject(sample.subject);
    setMessage(sample.message);
    setLatestMessage(null);
  }, []);

  const loadHealth = useCallback(async () => {
    const nextHealth = await healthRequest();
    setHealth(nextHealth);
  }, []);

  const loadDashboard = useCallback(async () => {
    let next = await apiRequest<DemoDashboard>(`/dashboard?sessionId=${encodeURIComponent(sessionId)}`);
    if (next.messages.length === 0) {
      next = await apiRequest<DemoDashboard>("/sessions", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });
    }
    setDashboard(next);
    setApiStatus("connected");
    return next;
  }, [sessionId]);

  useEffect(() => {
    if (!selectedSample && dashboard.samples.length > 0) {
      applySample(dashboard.samples[0]);
    }
  }, [applySample, dashboard.samples, selectedSample]);

  useEffect(() => {
    let mounted = true;
    setPageLoading(true);
    setPageLoadingMode("loading");
    Promise.all([loadDashboard(), loadHealth()])
      .then(() => {
        if (!mounted) return;
        setLastError(null);
      })
      .catch((error) => {
        if (!mounted) return;
        const message = error instanceof Error ? error.message : "Unable to load Privacy Shield.";
        setApiStatus("offline");
        setLastError(message);
        toast({ title: "Privacy Shield API is offline", description: message, variant: "destructive" });
      })
      .finally(() => {
        if (mounted) setPageLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [loadDashboard, loadHealth, toast]);

  const resetSession = useCallback(async () => {
    setPageLoading(true);
    setPageLoadingMode("resetting");
    setLatestMessage(null);
    setSearchResult(null);
    try {
      const next = await apiRequest<DemoDashboard>("/sessions", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });
      setDashboard(next);
      setApiStatus("connected");
      setLastError(null);
      if (next.samples.length > 0) {
        applySample(next.samples[0]);
      }
      await loadHealth();
      toast({ title: "Privacy Shield reset", description: "Your isolated privacy demo records were reseeded." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset Privacy Shield.";
      setApiStatus("offline");
      setLastError(message);
      toast({ title: "Reset failed", description: message, variant: "destructive" });
    } finally {
      setPageLoading(false);
    }
  }, [applySample, loadHealth, sessionId, toast]);

  const refreshDashboard = useCallback(async () => {
    setApiStatus("loading");
    try {
      await Promise.all([loadDashboard(), loadHealth()]);
      setLastError(null);
      toast({ title: "Privacy Shield refreshed", description: "Latest safe records and deployment health loaded." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to refresh Privacy Shield.";
      setApiStatus("offline");
      setLastError(message);
      toast({ title: "Refresh failed", description: message, variant: "destructive" });
    }
  }, [loadDashboard, loadHealth, toast]);

  const submitMessage = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const result = await apiRequest<MessageResult>("/messages", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          personaId,
          channel,
          subject,
          message,
        }),
      });
      setLatestMessage(result.message);
      setDashboard(result.dashboard);
      setApiStatus("connected");
      setLastError(null);
      toast({ title: "Message protected", description: "AI Fabric returned only the processed support record." });
    } catch (error) {
      const text = error instanceof Error ? error.message : "Unable to submit support message.";
      setLastError(text);
      toast({ title: "Submission failed", description: text, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [channel, message, personaId, sessionId, subject, toast]);

  const runSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const result = await apiRequest<SearchResult>(
        `/search?sessionId=${encodeURIComponent(sessionId)}&q=${encodeURIComponent(searchQuery)}&limit=6`,
      );
      setSearchResult(result);
      setApiStatus("connected");
      setLastError(null);
      toast({ title: "Safe index searched", description: "The backend sanitized the query before retrieval." });
    } catch (error) {
      const text = error instanceof Error ? error.message : "Unable to search safe support records.";
      setLastError(text);
      toast({ title: "Search failed", description: text, variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, sessionId, toast]);

  if (pageLoading) {
    return (
      <DemoFullPageLoader
        title={pageLoadingMode === "resetting" ? "Resetting Privacy Shield session" : "Preparing Privacy Shield"}
        description={
          pageLoadingMode === "resetting"
            ? "Clearing your isolated demo records, reseeding sensitive samples, and loading fresh privacy proof."
            : "Creating or recovering an isolated browser session, loading backend health, and proving the safe support-message store before interaction."
        }
        steps={[
          "Create session-scoped customer IDs",
          "Run PII detection on seeded support messages",
          "Expose redacted records and deployment metadata",
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pb-16 pt-24">
        <section className="container mx-auto px-4">
          <Link to="/demos" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to demos
          </Link>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  AI Fabric privacy
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    apiStatus === "connected"
                      ? "gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                      : apiStatus === "loading"
                        ? "gap-1 border-amber-200 bg-amber-50 text-amber-700"
                        : "gap-1 border-rose-200 bg-rose-50 text-rose-700"
                  }
                >
                  {apiStatus === "connected" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  API {apiStatus}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-normal md:text-4xl">AI Fabric Privacy Shield</h1>
              <p className="mt-2 max-w-3xl text-muted-foreground">
                Submit sensitive customer-support text, then inspect the redacted record, detection evidence, safe index search, and deployment proof returned by the backend.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/demos/ai-fabric-privacy-shield/about">
                  <Info className="h-4 w-4" />
                  About this demo
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" onClick={refreshDashboard} disabled={apiStatus === "loading"}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="gap-2" onClick={resetSession}>
                <Sparkles className="h-4 w-4" />
                Reset my session
              </Button>
            </div>
          </div>

          {lastError ? (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <div className="font-semibold">Backend issue</div>
                  <p className="mt-1 break-words">{lastError}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard title="Safe records" value={String(dashboard.metrics.totalMessages)} icon={Database} />
            <MetricCard title="PII records" value={String(dashboard.metrics.piiMessages)} icon={EyeOff} tone="rose" />
            <MetricCard title="Clean records" value={String(dashboard.metrics.safeMessages)} icon={CheckCircle2} tone="emerald" />
            <MetricCard title="Detections" value={String(dashboard.metrics.detectionsTotal)} icon={FileSearch} tone="amber" />
            <MetricCard title="Raw withheld" value={dashboard.metrics.rawInputWithheld ? "Yes" : "No"} icon={LockKeyhole} tone="emerald" />
          </div>

          <div className="mb-6 grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_360px]">
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  Sensitive session samples
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard.samples.map((sample) => {
                  const selected = selectedSample?.personaId === sample.personaId;
                  return (
                    <button
                      key={sample.personaId}
                      onClick={() => applySample(sample)}
                      className={`w-full rounded-lg border p-3 text-left transition hover:border-primary/40 ${
                        selected ? "border-primary bg-primary/5" : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{sample.title}</div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{sample.message}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 bg-card">
                          {sample.channel}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {sample.expectedDetections.length ? (
                          sample.expectedDetections.map((detection) => (
                            <Badge key={detection} variant="outline" className="border-rose-200 bg-rose-50 text-[11px] text-rose-700">
                              {detection}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700">
                            clean
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Send className="h-4 w-4 text-primary" />
                  Support message intake
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[1fr_150px]">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Subject</label>
                    <Input value={subject} onChange={(event) => setSubject(event.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Channel</label>
                    <Input value={channel} onChange={(event) => setChannel(event.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-muted-foreground">Raw customer text entering the backend</label>
                  <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="min-h-[170px] resize-none text-base leading-7"
                  />
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-xs leading-5 text-muted-foreground">
                    The UI sends this text once. The demo API returns processed fields and privacy evidence, not the raw submitted payload.
                  </div>
                  <Button onClick={submitMessage} disabled={isSubmitting || !message.trim()} className="gap-2 md:min-w-[210px]">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    Secure message
                  </Button>
                </div>

                {latestMessage ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4" />
                      Backend returned safe record
                    </div>
                    <p className="text-sm leading-6 text-emerald-900">{latestMessage.processedMessage}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-4 w-4 text-slate-700" />
                  Runtime proof
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <div className="text-xs font-bold uppercase text-muted-foreground">Backend</div>
                  <p className="mt-1 break-all font-mono text-xs">{API_BASE}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-muted/30 p-3">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Commit</div>
                    <div className="mt-1 font-semibold">{shortId(health?.commit)}</div>
                  </div>
                  <div className="rounded-md bg-muted/30 p-3">
                    <div className="text-xs font-bold uppercase text-muted-foreground">AI Fabric</div>
                    <div className="mt-1 font-semibold">{health?.aiFabricVersion || "unknown"}</div>
                  </div>
                  <div className="rounded-md bg-muted/30 p-3">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Version</div>
                    <div className="mt-1 font-semibold">{health?.version || "unknown"}</div>
                  </div>
                  <div className="rounded-md bg-muted/30 p-3">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Built</div>
                    <div className="mt-1 font-semibold">{health?.builtAt ? formatDate(String(health.builtAt)) : "unknown"}</div>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <div className="mb-1 text-xs font-bold uppercase text-muted-foreground">Session</div>
                  <p className="break-all font-mono text-xs text-muted-foreground">{dashboard.sessionId || sessionId}</p>
                  <p className="mt-2 break-all text-[11px] text-muted-foreground">{UI_BUILD_MARKER}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <Pipeline stages={dashboard.pipeline} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="h-4 w-4 text-emerald-600" />
                  Latest safe support records
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sortedMessages.length ? (
                  sortedMessages.map((record) => <MessageCard key={record.id} message={record} />)
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No safe records are available for this session yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Search className="h-4 w-4 text-blue-600" />
                  Safe index search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  Search can include sensitive text. The backend sanitizes the query before AI Fabric vector retrieval and returns the processed query for proof.
                </p>
                <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
                <Button onClick={runSearch} disabled={isSearching || !searchQuery.trim()} className="w-full gap-2">
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
                  Search safe index
                </Button>

                {searchResult ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <div className="text-xs font-bold uppercase text-blue-800">Processed query sent to retrieval</div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-blue-950">{searchResult.processedQuery}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className={searchResult.queryPiiDetected ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>
                          {searchResult.queryPiiDetected ? "query PII detected" : "query clean"}
                        </Badge>
                        {splitDetections(searchResult.queryDetectionsSummary).map((detection) => (
                          <Badge key={detection} variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
                            {detectionLabel(detection)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                        Session-scoped results · {searchResult.resultCount}
                      </div>
                      <div className="space-y-2">
                        {searchResult.results.length ? (
                          searchResult.results.map((record) => (
                            <div key={record.id} className="rounded-md border border-border bg-background p-3">
                              <div className="font-semibold">{record.processedSubject}</div>
                              <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted-foreground">{record.processedMessage}</p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                            No result matched this session after safe retrieval.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <ConsultationCtaBand
        compact
        className="bg-background py-10"
        title="Exploring sensitive-data guardrails?"
        body="Join a free AI Fabric open-source maintainer session to discuss how PII detection, redacted persistence, and sanitized retrieval may relate to a public or properly redacted support workflow."
      />

      <Footer />
    </div>
  );
}
