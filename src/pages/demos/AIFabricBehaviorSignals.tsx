import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  "https://ai-fabric-behavior-signals.46.224.145.148.sslip.io";

const BEHAVIOR_BASE_URL = configuredBehaviorBaseUrl.replace(/\/$/, "");
const BEHAVIOR_API_URL = `${BEHAVIOR_BASE_URL}/api/behavior-demo`;

type ApiStatus = "loading" | "connected" | "offline";

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
  evidenceIds: string[];
  recommendation: string;
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
};

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

function parseEventData(data: string): string {
  try {
    const parsed = JSON.parse(data) as Record<string, unknown>;
    const message = parsed.message || parsed.reason || parsed.topic || parsed.feature || parsed.query;
    return typeof message === "string" ? message : data;
  } catch {
    return data;
  }
}

export default function AIFabricBehaviorSignals() {
  const { toast } = useToast();
  const [dashboard, setDashboard] = useState<BehaviorDemoDashboard>(EMPTY_DASHBOARD);
  const [selectedUserId, setSelectedUserId] = useState("user-1001");
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

  const refreshDashboard = useCallback(async () => {
    const next = await apiRequest<BehaviorDemoDashboard>("/dashboard");
    setDashboard(next);
    if (!next.scenarios.some((scenario) => scenario.userId === selectedUserId) && next.scenarios[0]) {
      setSelectedUserId(next.scenarios[0].userId);
    }
    return next;
  }, [selectedUserId]);

  const resetAndAnalyze = useCallback(async () => {
    setIsLoading(true);
    setOfferResult(null);
    try {
      const next = await apiRequest<BehaviorDemoDashboard>("/seed-and-analyze", { method: "POST" });
      setDashboard(next);
      setApiStatus("connected");
      const first = next.scenarios.find((scenario) => scenario.id === "billing-cancellation-risk") || next.scenarios[0];
      if (first) {
        setSelectedUserId(first.userId);
        const analyzed = await apiRequest<BehaviorScenarioResult>(`/scenarios/${first.userId}/analyze`, { method: "POST" });
        setScenarioResult(analyzed);
        setCustomSignal(analyzed.scenario.defaultSignalMessage);
      }
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
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const next = await apiRequest<BehaviorDemoDashboard>("/dashboard");
        if (cancelled) return;
        if (next.totalEvents === 0 || next.insights.length === 0) {
          await resetAndAnalyze();
          return;
        }
        setDashboard(next);
        setApiStatus("connected");
        const first = next.scenarios.find((scenario) => scenario.id === "billing-cancellation-risk") || next.scenarios[0];
        if (first) {
          setSelectedUserId(first.userId);
          setCustomSignal(first.defaultSignalMessage);
        }
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
  }, [resetAndAnalyze]);

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
      await refreshDashboard();
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
        title: confirmed ? "Retention offer created" : "Confirmation required",
        description: confirmed ? result.result.message : result.confirmationMessage,
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

  const activeEvents = scenarioResult?.events || [];
  const activeReview = scenarioResult?.retentionReview || null;
  const preview = offerResult || scenarioResult?.retentionOfferPreview || null;
  const averageChurn = dashboard.insights.length
    ? dashboard.insights.reduce((sum, insight) => sum + (insight.churnRisk ?? 0), 0) / dashboard.insights.length
    : 0;

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
              </div>
              <h1 className="text-3xl font-bold tracking-normal md:text-4xl">AI Fabric Behavior Signals</h1>
              <p className="mt-2 max-w-3xl text-muted-foreground">
                Review account behavior, generate churn and sentiment insight, inject a new signal, and confirm a retention action from one real AI Fabric app.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2" onClick={() => refreshDashboard()} disabled={isLoading}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="gap-2" onClick={resetAndAnalyze} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Reset & analyze
              </Button>
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-4">
            <MetricCard title="Seeded Events" value={String(dashboard.totalEvents)} icon={Database} />
            <MetricCard title="Analyzed Accounts" value={String(dashboard.insights.length)} icon={UserRound} />
            <MetricCard title="Immediate Action" value={String(dashboard.immediateAction.length)} icon={AlertTriangle} tone="rose" />
            <MetricCard title="Average Churn" value={`${percent(averageChurn)}%`} icon={TrendingDown} tone="amber" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_380px]">
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
                      onClick={() => {
                        setSelectedUserId(scenario.userId);
                        setCustomSignal(scenario.defaultSignalMessage);
                        setScenarioResult(null);
                        setOfferResult(null);
                      }}
                      className={`w-full rounded-lg border p-3 text-left transition-all hover:border-primary/40 ${
                        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}>
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
                          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                            <span>{scenario.eventCount} events</span>
                            <span>{scenario.usageDropPercent}% usage drop</span>
                            <span>{scenario.failedPayments} failed pay</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-base">Behavior Analysis</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedScenario?.useCase || "Select a scenario to analyze behavior signals."}
                    </p>
                  </div>
                  <Button className="gap-2" onClick={() => analyzeScenario()} disabled={!selectedScenario || isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                    Analyze
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
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Evidence-backed recommendation
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
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase text-muted-foreground">Event Timeline</div>
                        <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                          {(activeEvents.length ? activeEvents : []).map((event) => (
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
                  Retention Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeReview ? (
                  <>
                    <div className={`rounded-lg border p-4 ${riskClass(activeReview.riskCategory)}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-bold">Risk Category</div>
                        <Badge variant="outline" className="bg-white/70">
                          {activeReview.riskCategory}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm">{activeReview.recommendation}</p>
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
                      <div className={`rounded-lg border p-4 ${preview.result.success ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                        <div className="flex items-center gap-2 font-semibold">
                          {preview.result.success ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-700" />
                          )}
                          {preview.result.success ? "Action Executed" : "Confirmation Required"}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {preview.result.success ? preview.result.message : preview.confirmationMessage}
                        </p>
                        {preview.result.success && preview.result.data.offerId && (
                          <div className="mt-3 rounded-md bg-white/70 px-3 py-2 font-mono text-xs">
                            {String(preview.result.data.offerId)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button variant="outline" className="gap-2" onClick={() => requestOffer(false)} disabled={isOffering}>
                        {isOffering ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                        Preview
                      </Button>
                      <Button className="gap-2" onClick={() => requestOffer(true)} disabled={isOffering}>
                        <CheckCircle2 className="h-4 w-4" />
                        Confirm
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                    Run a scenario analysis to produce a retention recommendation and confirmation-gated action.
                  </div>
                )}

                <div className="rounded-lg border bg-muted/20 p-3">
                  <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Runtime</div>
                  <p className="break-all text-xs text-muted-foreground">{BEHAVIOR_BASE_URL}</p>
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
  tone?: "blue" | "amber" | "rose";
}) {
  const toneClass = tone === "rose" ? "text-rose-700 bg-rose-50" : tone === "amber" ? "text-amber-700 bg-amber-50" : "text-blue-700 bg-blue-50";
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
