import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Database,
  Loader2,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserRound,
  XCircle,
  Zap,
} from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const configuredBehaviorBaseUrl =
  import.meta.env.VITE_BEHAVIOR_SIGNALS_API_URL ||
  "https://behavior-churn-signals.46.224.145.148.sslip.io";

const BEHAVIOR_BASE_URL = configuredBehaviorBaseUrl.replace(/\/$/, "");
const BEHAVIOR_API_URL = `${BEHAVIOR_BASE_URL}/api/behavior-demo`;
const SESSION_STORAGE_KEY = "ai-fabric-behavior-signals-session-v2";
const UI_BUILD_MARKER = "behavior-signals-ai-hardening-2026-07-06";

type ApiStatus = "loading" | "connected" | "offline";

interface BehaviorDemoHealth {
  app?: string;
  version?: string;
  aiFabricVersion?: string;
  commit?: string;
  buildBranch?: string;
  buildTime?: string;
  buildMetadataSource?: string;
  provider?: string;
  providerMode?: "deterministic-local" | "live-external" | string;
  behaviorEnabled?: boolean;
  behaviorMode?: string;
  totalEvents?: number;
  insights?: number;
  scenarios?: number;
  checkedAt?: string;
}

interface InsightSummary {
  userId: string;
  segment: string | null;
  sentimentLabel: string | null;
  sentimentScore: number | null;
  churnRisk: number | null;
  churnReason: string | null;
  trend: string | null;
  patterns: string[];
  recommendations: string[];
  confidence: number | null;
  model: string | null;
  processingTimeMs: number | null;
  requiresImmediateAction: boolean;
  analyzedAt: string | null;
}

interface DemoScenarioSummary {
  id: string;
  baseUserId: string;
  userId: string;
  accountId: string;
  customerName: string;
  planId: string;
  title: string;
  useCase: string;
  operatorGoal: string;
  defaultSignalType: string;
  defaultSignalMessage: string;
  defaultDiscountPercent: number;
  usageDropPercent: number;
  failedPayments: number;
  supportTickets: number;
  expectedActionFamily: string;
  eventCount: number;
  insight: InsightSummary | null;
}

interface BehaviorDemoDashboard {
  scenarios: DemoScenarioSummary[];
  insights: InsightSummary[];
  trendDistribution: Record<string, number>;
  sentimentDistribution: Record<string, number>;
  immediateAction: InsightSummary[];
  totalEvents: number;
}

interface DemoSessionResponse {
  sessionId: string;
  scenarios: DemoScenarioSummary[];
  dashboard: BehaviorDemoDashboard;
}

interface ResetResult {
  success: boolean;
  message: string;
  deletedUsers: number;
  dashboard: BehaviorDemoDashboard;
}

interface BehaviorEventSummary {
  id: number | null;
  userId: string;
  eventType: string;
  eventTimestamp: string;
  eventData: string;
  source: string | null;
}

interface RetentionReviewResult {
  accountId: string;
  userId: string;
  riskCategory: "HIGH" | "MEDIUM" | "LOW" | string;
  actionFamily: string;
  evidenceIds: string[];
  recommendation: string;
  policyExplanation: string;
}

interface RetentionOfferResult {
  success: boolean;
  confirmationRequired: boolean;
  message: string;
  errorCode: string | null;
  data: Record<string, unknown>;
}

interface RetentionOfferDemoResult {
  userId: string;
  accountId: string;
  customerName: string;
  actionName: string;
  confirmationMessage: string;
  result: RetentionOfferResult;
}

interface BehaviorScenarioResult {
  scenario: DemoScenarioSummary;
  insight: InsightSummary | null;
  events: BehaviorEventSummary[];
  retentionReview: RetentionReviewResult;
  retentionOfferPreview: RetentionOfferDemoResult;
}

const EMPTY_DASHBOARD: BehaviorDemoDashboard = {
  scenarios: [],
  insights: [],
  trendDistribution: {},
  sentimentDistribution: {},
  immediateAction: [],
  totalEvents: 0,
};

const scenarioTone: Record<string, { border: string; bg: string; text: string; icon: typeof AlertTriangle }> = {
  "billing-cancellation-risk": {
    border: "border-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
    icon: AlertTriangle,
  },
  "expansion-ready-account": {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: TrendingUp,
  },
  "onboarding-friction": {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: UserRound,
  },
  "release-regression": {
    border: "border-orange-200",
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: Zap,
  },
  "silent-churn": {
    border: "border-sky-200",
    bg: "bg-sky-50",
    text: "text-sky-700",
    icon: TrendingDown,
  },
};

const pipelineSteps = [
  {
    title: "Behavior events",
    detail: "Login, usage, payment, support, release, and no-login signals.",
  },
  {
    title: "ExternalEventProvider",
    detail: "The app exposes events to AI Fabric through the behavior SPI.",
  },
  {
    title: "BehaviorAnalysisService",
    detail: "AI Fabric builds the prompt, calls the configured provider, and parses structured insight.",
  },
  {
    title: "Persisted insight",
    detail: "Churn, sentiment, trend, patterns, and recommendations are stored as BehaviorInsights.",
  },
  {
    title: "Governed operator action",
    detail: "The app maps evidence to support, escalation, expansion, check-in, or retention offer.",
  },
];

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BEHAVIOR_API_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as T) : (null as T);
  if (!response.ok) {
    throw new Error(`Behavior API ${response.status}: ${text || response.statusText}`);
  }
  return body;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "behavior-browser-session";
  }
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }
  const suffix =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  const sessionId = `browser-${suffix}`;
  window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

function percent(value: number | null | undefined): number {
  return Math.max(0, Math.min(100, Math.round((value ?? 0) * 100)));
}

function sentimentPercent(value: number | null | undefined): number {
  return Math.max(0, Math.min(100, Math.round((((value ?? 0) + 1) / 2) * 100)));
}

function formatLabel(value: string | null | undefined): string {
  if (!value) return "Unknown";
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function shortId(value: string | null | undefined, fallback = "unknown"): string {
  if (!value) return fallback;
  return value.length > 12 ? value.slice(0, 12) : value;
}

function riskClass(risk: string | null | undefined): string {
  if (risk === "HIGH") return "border-rose-200 bg-rose-50 text-rose-700";
  if (risk === "MEDIUM") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function insightRisk(insight: InsightSummary | null | undefined): string {
  if (!insight) return "NOT_ANALYZED";
  if (insight.requiresImmediateAction || (insight.churnRisk ?? 0) >= 0.8) return "HIGH";
  if ((insight.churnRisk ?? 0) >= 0.45 || insight.trend === "DECLINING") return "MEDIUM";
  return "LOW";
}

function providerPosture(health: BehaviorDemoHealth | null): {
  label: string;
  badgeClass: string;
  description: string;
} {
  if (!health) {
    return {
      label: "Checking provider",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      description: "The page is loading backend runtime posture.",
    };
  }
  if (health.providerMode === "live-external") {
    return {
      label: "Live LLM provider",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      description: "Behavior insight is generated through the configured AI Fabric LLM provider.",
    };
  }
  if (health.providerMode === "deterministic-local") {
    return {
      label: "Offline deterministic provider",
      badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
      description: "This run is no-key and repeatable; it still travels through AI Fabric behavior analysis.",
    };
  }
  return {
    label: "Provider unknown",
    badgeClass: "border-muted bg-muted/50 text-muted-foreground",
    description: "The backend did not report a recognized provider posture.",
  };
}

function parseEventData(data: string): string {
  try {
    const parsed = JSON.parse(data) as Record<string, unknown>;
    const message = parsed.message || parsed.reason || parsed.topic || parsed.feature || parsed.query || parsed.metric;
    return typeof message === "string" ? message : data;
  } catch {
    return data;
  }
}

function importantActionRows(data: Record<string, unknown>): Array<[string, string]> {
  const rows: Array<[string, string]> = [];
  const add = (label: string, key: string, suffix = "") => {
    const value = data[key];
    if (value !== undefined && value !== null && typeof value !== "object") {
      rows.push([label, `${String(value)}${suffix}`]);
    }
  };
  add("Policy decision", "policyDecision");
  add("Requested discount", "requestedDiscountPercent", "%");
  add("Approved discount", "discountPercent", "%");
  add("Auto-approval max", "maxDiscountPercent", "%");
  add("Offer id", "offerId");
  return rows;
}

export default function AIFabricBehaviorSignals() {
  const { toast } = useToast();
  const [sessionId] = useState(getOrCreateSessionId);
  const [health, setHealth] = useState<BehaviorDemoHealth | null>(null);
  const [dashboard, setDashboard] = useState<BehaviorDemoDashboard>(EMPTY_DASHBOARD);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [scenarioResult, setScenarioResult] = useState<BehaviorScenarioResult | null>(null);
  const [offerResult, setOfferResult] = useState<RetentionOfferDemoResult | null>(null);
  const [customSignal, setCustomSignal] = useState("");
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOffering, setIsOffering] = useState(false);

  const selectedScenario = useMemo(
    () => dashboard.scenarios.find((scenario) => scenario.userId === selectedUserId) || dashboard.scenarios[0],
    [dashboard.scenarios, selectedUserId]
  );

  const selectedInsight = scenarioResult?.insight || selectedScenario?.insight || null;
  const activeReview = scenarioResult?.retentionReview || null;
  const activeEvents = scenarioResult?.events || [];
  const preview = offerResult || scenarioResult?.retentionOfferPreview || null;
  const runtimePosture = providerPosture(health);
  const averageChurn = dashboard.insights.length
    ? dashboard.insights.reduce((sum, insight) => sum + (insight.churnRisk ?? 0), 0) / dashboard.insights.length
    : 0;

  const fetchHealth = useCallback(async () => {
    const next = await apiRequest<BehaviorDemoHealth>("/health");
    setHealth(next);
    return next;
  }, []);

  const applyDashboard = useCallback((next: BehaviorDemoDashboard) => {
    setDashboard(next);
    setSelectedUserId((current) => {
      if (next.scenarios.some((scenario) => scenario.userId === current)) {
        return current;
      }
      return next.scenarios[0]?.userId || "";
    });
    if (next.scenarios[0]) {
      setCustomSignal((current) => current || next.scenarios[0].defaultSignalMessage);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    const next = await apiRequest<BehaviorDemoDashboard>(`/dashboard?sessionId=${encodeURIComponent(sessionId)}`);
    applyDashboard(next);
    return next;
  }, [applyDashboard, sessionId]);

  const createSession = useCallback(
    async (resetFirst = false) => {
      setIsLoading(true);
      setScenarioResult(null);
      setOfferResult(null);
      try {
        if (resetFirst) {
          await apiRequest<ResetResult>("/reset", {
            method: "POST",
            body: JSON.stringify({ sessionId, confirm: true }),
          });
        }
        const response = await apiRequest<DemoSessionResponse>("/sessions", {
          method: "POST",
          body: JSON.stringify({ sessionId, analyze: true }),
        });
        applyDashboard(response.dashboard);
        const first =
          response.dashboard.scenarios.find((scenario) => scenario.id === "billing-cancellation-risk") ||
          response.dashboard.scenarios[0];
        if (first) {
          setSelectedUserId(first.userId);
          setCustomSignal(first.defaultSignalMessage);
        }
        await fetchHealth();
        setApiStatus("connected");
      } catch (error) {
        setApiStatus("offline");
        toast({
          title: "Behavior demo API is offline",
          description: error instanceof Error ? error.message : "Unable to connect to the behavior demo backend.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [applyDashboard, fetchHealth, sessionId, toast]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const [session] = await Promise.all([
          apiRequest<DemoSessionResponse>("/sessions", {
            method: "POST",
            body: JSON.stringify({ sessionId, analyze: true }),
          }),
          fetchHealth(),
        ]);
        if (cancelled) return;
        applyDashboard(session.dashboard);
        const first =
          session.dashboard.scenarios.find((scenario) => scenario.id === "billing-cancellation-risk") ||
          session.dashboard.scenarios[0];
        if (first) {
          setSelectedUserId(first.userId);
          setCustomSignal(first.defaultSignalMessage);
        }
        setApiStatus("connected");
      } catch {
        if (!cancelled) {
          setApiStatus("offline");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [applyDashboard, fetchHealth, sessionId]);

  const analyzeScenario = async (userId = selectedScenario?.userId) => {
    if (!userId) return;
    setIsAnalyzing(true);
    setOfferResult(null);
    try {
      const result = await apiRequest<BehaviorScenarioResult>(`/scenarios/${userId}/analyze`, { method: "POST" });
      setScenarioResult(result);
      setSelectedUserId(userId);
      setCustomSignal(result.scenario.defaultSignalMessage);
      await refreshDashboard();
      await fetchHealth();
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("offline");
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unable to analyze the behavior scenario.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const recordSignal = async () => {
    if (!selectedScenario) return;
    setIsRecording(true);
    setOfferResult(null);
    try {
      const message = customSignal.trim() || selectedScenario.defaultSignalMessage;
      const result = await apiRequest<BehaviorScenarioResult>(`/scenarios/${selectedScenario.userId}/signals`, {
        method: "POST",
        body: JSON.stringify({
          eventType: selectedScenario.defaultSignalType,
          eventData: { message },
          source: "ai-fabric-dev-demo",
        }),
      });
      setScenarioResult(result);
      setSelectedUserId(result.scenario.userId);
      await refreshDashboard();
      await fetchHealth();
      toast({
        title: "Signal recorded",
        description: `${selectedScenario.defaultSignalType} was added and analyzed.`,
      });
    } catch (error) {
      toast({
        title: "Signal failed",
        description: error instanceof Error ? error.message : "Unable to record the behavior signal.",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };

  const requestOffer = async (confirmed: boolean) => {
    if (!selectedScenario) return;
    setIsOffering(true);
    try {
      const result = await apiRequest<RetentionOfferDemoResult>(`/scenarios/${selectedScenario.userId}/retention-offer`, {
        method: "POST",
        body: JSON.stringify({
          discountPercent: selectedScenario.defaultDiscountPercent,
          confirmed,
        }),
      });
      setOfferResult(result);
      toast({
        title: confirmed ? "Retention action executed" : "Confirmation required",
        description: result.result.message || result.confirmationMessage,
      });
    } catch (error) {
      toast({
        title: "Retention action failed",
        description: error instanceof Error ? error.message : "Unable to run the retention action.",
        variant: "destructive",
      });
    } finally {
      setIsOffering(false);
    }
  };

  const selectScenario = (scenario: DemoScenarioSummary) => {
    setSelectedUserId(scenario.userId);
    setCustomSignal(scenario.defaultSignalMessage);
    setScenarioResult(null);
    setOfferResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-24">
        <section className="container mx-auto px-4">
          <Link
            to="/demos"
            className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700">
                  <Activity className="h-3 w-3" />
                  AI Fabric Behavior
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
                <Badge variant="outline" className={`gap-1 ${runtimePosture.badgeClass}`}>
                  <Sparkles className="h-3 w-3" />
                  {runtimePosture.label}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-normal md:text-4xl">AI Fabric Behavior Signals</h1>
              <p className="mt-2 max-w-3xl text-muted-foreground">
                Watch account events flow through AI Fabric behavior analysis into persisted sentiment, churn, trend, and governed operator actions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2" onClick={() => refreshDashboard()} disabled={isLoading}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="gap-2" onClick={() => createSession(true)} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Reset my session
              </Button>
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard title="Session Events" value={String(dashboard.totalEvents)} icon={Database} />
            <MetricCard title="AI Insights" value={String(dashboard.insights.length)} icon={UserRound} />
            <MetricCard title="Immediate Action" value={String(dashboard.immediateAction.length)} icon={AlertTriangle} tone="rose" />
            <MetricCard title="Average Churn" value={`${percent(averageChurn)}%`} icon={TrendingDown} tone="amber" />
            <MetricCard title="Scenarios" value={String(dashboard.scenarios.length)} icon={BarChart3} tone="emerald" />
          </div>

          <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-blue-600" />
                  AI Fabric Behavior Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-5">
                  {pipelineSteps.map((step, index) => (
                    <div key={step.title} className="rounded-lg border bg-card p-3">
                      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="text-sm font-semibold">{step.title}</div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Runtime Proof
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{runtimePosture.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <ProofValue label="Provider" value={health?.provider || "checking"} />
                  <ProofValue label="Mode" value={health?.behaviorMode || "checking"} />
                  <ProofValue label="Commit" value={shortId(health?.commit)} />
                  <ProofValue label="AI Fabric" value={health?.aiFabricVersion || "unknown"} />
                </div>
                <div className="rounded-lg border bg-muted/20 p-3">
                  <div className="mb-1 text-xs font-bold uppercase text-muted-foreground">Session</div>
                  <p className="break-all font-mono text-xs text-muted-foreground">{sessionId}</p>
                  <p className="mt-2 break-all text-[11px] text-muted-foreground">{UI_BUILD_MARKER}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)_400px]">
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Scenario Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard.scenarios.map((scenario) => {
                  const tone = scenarioTone[scenario.id] || scenarioTone["onboarding-friction"];
                  const Icon = tone.icon;
                  const selected = selectedScenario?.userId === scenario.userId;
                  const risk = insightRisk(scenario.insight);
                  return (
                    <button
                      key={scenario.userId}
                      onClick={() => selectScenario(scenario)}
                      className={`w-full rounded-lg border p-3 text-left transition-all hover:border-primary/40 ${
                        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate font-semibold">{scenario.customerName}</div>
                            <Badge variant="outline" className={riskClass(risk)}>
                              {formatLabel(risk)}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{scenario.title}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-background text-[11px]">
                              {scenario.eventCount} events
                            </Badge>
                            <Badge variant="outline" className="bg-background text-[11px]">
                              {formatLabel(scenario.expectedActionFamily)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {!dashboard.scenarios.length && (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Start or reset your session to seed behavior scenarios.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-base">AI Behavior Analysis</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedScenario?.useCase || "Select a scenario to analyze behavior signals."}
                    </p>
                  </div>
                  <Button className="gap-2" onClick={() => analyzeScenario()} disabled={!selectedScenario || isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                    Run analysis
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedScenario ? (
                  <>
                    <div className="grid gap-3 md:grid-cols-3">
                      <SignalGauge
                        title="Churn Risk"
                        value={`${percent(selectedInsight?.churnRisk)}%`}
                        progress={percent(selectedInsight?.churnRisk)}
                        tone="rose"
                      />
                      <SignalGauge
                        title="Sentiment"
                        value={formatLabel(selectedInsight?.sentimentLabel)}
                        progress={sentimentPercent(selectedInsight?.sentimentScore)}
                        tone="blue"
                      />
                      <SignalGauge
                        title="Trend"
                        value={formatLabel(selectedInsight?.trend)}
                        progress={selectedInsight?.requiresImmediateAction ? 92 : 38}
                        tone={selectedInsight?.requiresImmediateAction ? "amber" : "emerald"}
                      />
                    </div>

                    <div className="rounded-lg border bg-muted/20 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        AI-generated insight
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedInsight?.churnReason || selectedScenario.operatorGoal}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedInsight?.recommendations.length ? selectedInsight.recommendations : [selectedScenario.operatorGoal]).map((item) => (
                          <Badge key={item} variant="outline" className="bg-background">
                            {item}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-2 md:grid-cols-3">
                        <ProofValue label="Segment" value={formatLabel(selectedInsight?.segment)} />
                        <ProofValue label="Confidence" value={`${percent(selectedInsight?.confidence)}%`} />
                        <ProofValue label="Model" value={selectedInsight?.model || health?.provider || "not analyzed"} />
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase text-muted-foreground">Event Timeline</div>
                        <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
                          {activeEvents.map((event) => (
                            <div key={`${event.id}-${event.eventTimestamp}`} className="rounded-lg border bg-card p-3">
                              <div className="flex items-center justify-between gap-2">
                                <Badge variant="outline" className="bg-muted/40">
                                  {event.eventType}
                                </Badge>
                                <span className="text-[11px] text-muted-foreground">{event.source || "demo"}</span>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">{parseEventData(event.eventData)}</p>
                            </div>
                          ))}
                          {!activeEvents.length && (
                            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                              Run analysis to load event evidence for this account.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs font-bold uppercase text-muted-foreground">Inject New Signal</div>
                        <Textarea
                          value={customSignal}
                          onChange={(event) => setCustomSignal(event.target.value)}
                          className="min-h-[132px] resize-none"
                          placeholder={selectedScenario.defaultSignalMessage}
                        />
                        <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
                          This records a real event for your session user, then re-runs AI Fabric behavior analysis.
                        </div>
                        <Button className="w-full gap-2" onClick={recordSignal} disabled={isRecording}>
                          {isRecording ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Record signal
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    Connect the behavior demo API to load scenarios.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-amber-600" />
                  Governed Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeReview ? (
                  <>
                    <div className={`rounded-lg border p-4 ${riskClass(activeReview.riskCategory)}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-bold">Recommended action family</div>
                        <Badge variant="outline" className="bg-white/70">
                          {formatLabel(activeReview.actionFamily)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm">{activeReview.recommendation}</p>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Backend policy explanation
                      </div>
                      <p className="text-sm text-muted-foreground">{activeReview.policyExplanation}</p>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                      <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Evidence IDs</div>
                      <div className="space-y-2">
                        {activeReview.evidenceIds.map((id) => (
                          <div key={id} className="rounded-md bg-muted/40 px-3 py-2 font-mono text-xs">
                            {id}
                          </div>
                        ))}
                      </div>
                    </div>

                    {preview && (
                      <div
                        className={`rounded-lg border p-4 ${
                          preview.result.success ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          {preview.result.success ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-700" />
                          )}
                          {preview.result.success ? "Action Executed" : "Confirmation Required"}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {preview.result.message || preview.confirmationMessage}
                        </p>
                        <div className="mt-3 space-y-2">
                          {importantActionRows(preview.result.data).map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between gap-3 rounded-md bg-white/70 px-3 py-2 text-xs">
                              <span className="font-semibold text-muted-foreground">{label}</span>
                              <span className="text-right font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button variant="outline" className="gap-2" onClick={() => requestOffer(false)} disabled={isOffering}>
                        {isOffering ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                        Preview offer
                      </Button>
                      <Button className="gap-2" onClick={() => requestOffer(true)} disabled={isOffering}>
                        <CheckCircle2 className="h-4 w-4" />
                        Confirm offer
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                    Run a scenario analysis to produce an action recommendation and backend policy explanation.
                  </div>
                )}

                <div className="rounded-lg border bg-muted/20 p-3">
                  <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Backend</div>
                  <p className="break-all text-xs text-muted-foreground">{BEHAVIOR_BASE_URL}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Build source: {health?.buildMetadataSource || "checking"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  tone = "blue",
}: {
  title: string;
  value: string;
  icon: typeof Activity;
  tone?: "blue" | "amber" | "rose" | "emerald";
}) {
  const toneClass =
    tone === "rose"
      ? "text-rose-700 bg-rose-50"
      : tone === "amber"
        ? "text-amber-700 bg-amber-50"
        : tone === "emerald"
          ? "text-emerald-700 bg-emerald-50"
          : "text-blue-700 bg-blue-50";
  return (
    <Card className="border-border/70">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
          <div className="mt-1 text-2xl font-bold">{value}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function SignalGauge({
  title,
  value,
  progress,
  tone,
}: {
  title: string;
  value: string;
  progress: number;
  tone: "rose" | "blue" | "amber" | "emerald";
}) {
  const valueClass =
    tone === "rose"
      ? "text-rose-700"
      : tone === "amber"
        ? "text-amber-700"
        : tone === "emerald"
          ? "text-emerald-700"
          : "text-blue-700";
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs font-bold uppercase text-muted-foreground">{title}</div>
      <div className={`mt-2 min-h-8 text-xl font-bold ${valueClass}`}>{value}</div>
      <Progress value={progress} className="mt-3 h-2" />
    </div>
  );
}

function ProofValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2">
      <div className="text-[11px] font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}
