import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Loader2,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const configuredBehaviorBaseUrl =
  import.meta.env.VITE_BEHAVIOR_SIGNALS_API_URL ||
  "https://behavior-churn-signals.46.224.145.148.sslip.io";

const BEHAVIOR_BASE_URL = configuredBehaviorBaseUrl.replace(/\/$/, "");
const BEHAVIOR_API_URL = `${BEHAVIOR_BASE_URL}/api/behavior-demo`;
const SESSION_STORAGE_KEY = "ai-fabric-behavior-signals-session-v2";

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

interface BehaviorEventSummary {
  id: number | null;
  userId: string;
  eventType: string;
  eventTimestamp: string;
  eventData: string;
  source: string | null;
}

interface BehaviorScenarioResult {
  scenario: DemoScenarioSummary;
  insight: InsightSummary | null;
  events: BehaviorEventSummary[];
}

interface AgenticUiComponent {
  id: string;
  type: string;
  title: string;
  priority: number;
  rationale: string;
  props: Record<string, unknown>;
}

interface AgenticUiPlan {
  layout: string;
  summary: string;
  source: string;
  model: string;
  attempts: number;
  generatedAt: string;
  allowedComponentTypes: string[];
  components: AgenticUiComponent[];
}

interface AgenticUiEvidence {
  eventCount: number;
  eventTypes: string[];
  eventTypeCounts: Record<string, number>;
  recentEvents: Array<Record<string, unknown>>;
}

interface AgenticUiResponse {
  userId: string;
  accountId: string;
  customerName: string;
  scenario: DemoScenarioSummary;
  evidence: AgenticUiEvidence;
  plan: AgenticUiPlan;
}

interface RecoveryComparison {
  before: InsightSummary | null;
  after: InsightSummary | null;
  addedEventTypes: string[];
}

const EMPTY_DASHBOARD: BehaviorDemoDashboard = {
  scenarios: [],
  insights: [],
  trendDistribution: {},
  sentimentDistribution: {},
  immediateAction: [],
  totalEvents: 0,
};

const componentIcons: Record<string, LucideIcon> = {
  RISK_SUMMARY_CARD: CircleAlert,
  RECOMMENDED_ACTION_CARD: ListChecks,
  EVENT_TIMELINE: Clock3,
  RETENTION_OFFER_PANEL: CreditCard,
  EXPANSION_NUDGE_CARD: TrendingUp,
  SUPPORT_ESCALATION_PANEL: MessageSquareText,
  PRODUCT_ESCALATION_PANEL: Zap,
  ADOPTION_HELP_PANEL: UserRound,
  MONITORING_CARD: Activity,
  HEALTH_SCORE_CARD: ShieldCheck,
  NEXT_BEST_ACTIONS: Sparkles,
};

const componentTone: Record<string, string> = {
  RISK_SUMMARY_CARD: "border-rose-200 bg-rose-50/70",
  RECOMMENDED_ACTION_CARD: "border-blue-200 bg-blue-50/70",
  EVENT_TIMELINE: "border-slate-200 bg-slate-50/80",
  RETENTION_OFFER_PANEL: "border-amber-200 bg-amber-50/80",
  EXPANSION_NUDGE_CARD: "border-emerald-200 bg-emerald-50/80",
  SUPPORT_ESCALATION_PANEL: "border-violet-200 bg-violet-50/80",
  PRODUCT_ESCALATION_PANEL: "border-orange-200 bg-orange-50/80",
  ADOPTION_HELP_PANEL: "border-cyan-200 bg-cyan-50/80",
  MONITORING_CARD: "border-sky-200 bg-sky-50/80",
  HEALTH_SCORE_CARD: "border-green-200 bg-green-50/80",
  NEXT_BEST_ACTIONS: "border-purple-200 bg-purple-50/80",
};

const scenarioIcons: Record<string, LucideIcon> = {
  "billing-cancellation-risk": CircleAlert,
  "expansion-ready-account": TrendingUp,
  "onboarding-friction": UserRound,
  "release-regression": Zap,
  "silent-churn": TrendingDown,
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

function formatLabel(value: string | null | undefined): string {
  if (!value) return "Unknown";
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function percent(value: number | null | undefined): number {
  return Math.max(0, Math.min(100, Math.round((value ?? 0) * 100)));
}

function numberProp(props: Record<string, unknown>, key: string, fallback = 0): number {
  const value = props[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringProp(props: Record<string, unknown>, key: string, fallback = "Unknown"): string {
  const value = props[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function booleanProp(props: Record<string, unknown>, key: string, fallback = false): boolean {
  const value = props[key];
  return typeof value === "boolean" ? value : fallback;
}

function stringListProp(props: Record<string, unknown>, key: string): string[] {
  const value = props[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function recordProp(props: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = props[key];
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function objectListProp(props: Record<string, unknown>, key: string): Array<Record<string, unknown>> {
  const value = props[key];
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    : [];
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "None";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function compactTime(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ComponentShell({ component, children }: { component: AgenticUiComponent; children: React.ReactNode }) {
  const Icon = componentIcons[component.type] || LayoutDashboard;
  const wide = component.type === "EVENT_TIMELINE" || component.type === "NEXT_BEST_ACTIONS";
  return (
    <article
      className={`rounded-lg border p-5 shadow-sm ${componentTone[component.type] || "border-border bg-card"} ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 text-primary shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight text-foreground">{component.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{component.rationale}</p>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {component.priority}
        </Badge>
      </div>
      {children}
    </article>
  );
}

function MetricRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-white/70 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[55%] truncate text-right font-semibold text-foreground">{displayValue(value)}</span>
    </div>
  );
}

function RiskSummaryCard({ component }: { component: AgenticUiComponent }) {
  const props = component.props;
  const churn = percent(numberProp(props, "churnRisk"));
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Churn risk</span>
            <span className="font-semibold text-rose-700">{churn}%</span>
          </div>
          <Progress value={churn} className="h-2" />
        </div>
        <MetricRow label="Segment" value={formatLabel(stringProp(props, "segment"))} />
        <MetricRow label="Sentiment" value={formatLabel(stringProp(props, "sentiment"))} />
        <MetricRow label="Trend" value={formatLabel(stringProp(props, "trend"))} />
        <p className="rounded-lg bg-white/70 p-3 text-sm text-muted-foreground">{stringProp(props, "churnReason", "No churn reason available.")}</p>
      </div>
    </ComponentShell>
  );
}

function RecommendedActionCard({ component }: { component: AgenticUiComponent }) {
  const evidenceIds = stringListProp(component.props, "evidenceIds");
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <MetricRow label="Action family" value={formatLabel(stringProp(component.props, "actionFamily"))} />
        <p className="rounded-lg bg-white/70 p-3 text-sm font-medium text-foreground">
          {stringProp(component.props, "recommendation", "No recommendation available.")}
        </p>
        <p className="text-sm text-muted-foreground">{stringProp(component.props, "policyExplanation", "")}</p>
        <div className="flex flex-wrap gap-2">
          {evidenceIds.map((id) => (
            <Badge key={id} variant="outline" className="bg-white/70">
              {id}
            </Badge>
          ))}
        </div>
      </div>
    </ComponentShell>
  );
}

function EventTimeline({ component }: { component: AgenticUiComponent }) {
  const events = objectListProp(component.props, "events");
  return (
    <ComponentShell component={component}>
      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {events.length ? (
          events.map((event, index) => (
            <div key={`${displayValue(event.type)}-${index}`} className="grid min-w-0 gap-2 rounded-lg bg-white/75 p-3 md:grid-cols-[minmax(0,150px)_minmax(0,1fr)_90px]">
              <div className="min-w-0 break-words font-semibold text-foreground">{displayValue(event.type)}</div>
              <div className="min-w-0 break-words text-sm text-muted-foreground">{displayValue(event.summary)}</div>
              <div className="text-right text-xs text-muted-foreground">{compactTime(displayValue(event.timestamp))}</div>
            </div>
          ))
        ) : (
          <p className="rounded-lg bg-white/70 p-3 text-sm text-muted-foreground">No events were returned for this component.</p>
        )}
      </div>
    </ComponentShell>
  );
}

function RetentionOfferPanel({ component }: { component: AgenticUiComponent }) {
  const data = recordProp(component.props, "data");
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <MetricRow label="Discount" value={`${numberProp(component.props, "discountPercent")}%`} />
        <MetricRow label="Confirmation required" value={booleanProp(component.props, "confirmationRequired")} />
        <p className="rounded-lg bg-white/75 p-3 text-sm text-foreground">{stringProp(component.props, "confirmationMessage", "")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <MetricRow label="Policy decision" value={data.policyDecision} />
          <MetricRow label="Max discount" value={data.maxDiscountPercent ? `${data.maxDiscountPercent}%` : "Policy bound"} />
        </div>
      </div>
    </ComponentShell>
  );
}

function ExpansionNudgeCard({ component }: { component: AgenticUiComponent }) {
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <MetricRow label="Customer" value={stringProp(component.props, "customerName")} />
        <MetricRow label="Plan" value={formatLabel(stringProp(component.props, "planId"))} />
        <p className="rounded-lg bg-white/75 p-3 text-sm font-medium text-emerald-800">
          {stringProp(component.props, "recommendation", "Route to expansion follow-up.")}
        </p>
      </div>
    </ComponentShell>
  );
}

function ProductEscalationPanel({ component }: { component: AgenticUiComponent }) {
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <MetricRow label="Customer" value={stringProp(component.props, "customerName")} />
        <p className="rounded-lg bg-white/75 p-3 text-sm text-foreground">{stringProp(component.props, "policyExplanation", "")}</p>
        <div className="flex flex-wrap gap-2">
          {stringListProp(component.props, "evidenceIds").map((id) => (
            <Badge key={id} variant="outline" className="bg-white/70">
              {id}
            </Badge>
          ))}
        </div>
      </div>
    </ComponentShell>
  );
}

function AdoptionHelpPanel({ component }: { component: AgenticUiComponent }) {
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <MetricRow label="Customer" value={stringProp(component.props, "customerName")} />
        <MetricRow label="Support tickets" value={numberProp(component.props, "supportTickets")} />
        <p className="rounded-lg bg-white/75 p-3 text-sm text-foreground">{stringProp(component.props, "operatorGoal", "")}</p>
      </div>
    </ComponentShell>
  );
}

function MonitoringCard({ component }: { component: AgenticUiComponent }) {
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <MetricRow label="Customer" value={stringProp(component.props, "customerName")} />
        <MetricRow label="Usage drop" value={`${numberProp(component.props, "usageDropPercent")}%`} />
        <MetricRow label="Action family" value={formatLabel(stringProp(component.props, "actionFamily"))} />
      </div>
    </ComponentShell>
  );
}

function HealthScoreCard({ component }: { component: AgenticUiComponent }) {
  const risk = numberProp(component.props, "churnRisk");
  const score = Math.max(0, Math.min(100, Math.round((1 - risk) * 100)));
  return (
    <ComponentShell component={component}>
      <div className="space-y-3">
        <div className="text-5xl font-bold text-emerald-700">{score}</div>
        <Progress value={score} className="h-2" />
        <MetricRow label="Sentiment" value={formatLabel(stringProp(component.props, "sentiment"))} />
        <MetricRow label="Confidence" value={`${percent(numberProp(component.props, "confidence"))}%`} />
      </div>
    </ComponentShell>
  );
}

function NextBestActions({ component }: { component: AgenticUiComponent }) {
  const recommendations = stringListProp(component.props, "recommendations");
  return (
    <ComponentShell component={component}>
      <div className="space-y-2">
        {recommendations.map((recommendation) => (
          <div key={recommendation} className="flex gap-3 rounded-lg bg-white/75 p-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{recommendation}</span>
          </div>
        ))}
        <MetricRow label="Action family" value={formatLabel(stringProp(component.props, "actionFamily"))} />
      </div>
    </ComponentShell>
  );
}

function renderAgenticComponent(component: AgenticUiComponent) {
  switch (component.type) {
    case "RISK_SUMMARY_CARD":
      return <RiskSummaryCard component={component} />;
    case "RECOMMENDED_ACTION_CARD":
      return <RecommendedActionCard component={component} />;
    case "EVENT_TIMELINE":
      return <EventTimeline component={component} />;
    case "RETENTION_OFFER_PANEL":
      return <RetentionOfferPanel component={component} />;
    case "EXPANSION_NUDGE_CARD":
      return <ExpansionNudgeCard component={component} />;
    case "PRODUCT_ESCALATION_PANEL":
      return <ProductEscalationPanel component={component} />;
    case "ADOPTION_HELP_PANEL":
      return <AdoptionHelpPanel component={component} />;
    case "MONITORING_CARD":
      return <MonitoringCard component={component} />;
    case "HEALTH_SCORE_CARD":
      return <HealthScoreCard component={component} />;
    case "NEXT_BEST_ACTIONS":
      return <NextBestActions component={component} />;
    default:
      return null;
  }
}

export default function AIFabricAgenticUI() {
  const { toast } = useToast();
  const [sessionId] = useState(getOrCreateSessionId);
  const [dashboard, setDashboard] = useState<BehaviorDemoDashboard>(EMPTY_DASHBOARD);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [agenticResponse, setAgenticResponse] = useState<AgenticUiResponse | null>(null);
  const [recoveryComparison, setRecoveryComparison] = useState<RecoveryComparison | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const selectedScenario = useMemo(
    () => dashboard.scenarios.find((scenario) => scenario.userId === selectedUserId) || dashboard.scenarios[0],
    [dashboard.scenarios, selectedUserId]
  );
  const activeInsight = agenticResponse?.scenario.insight || selectedScenario?.insight || null;
  const activeEvidence = agenticResponse?.evidence || null;
  const canRunRecoveryExperiment = selectedScenario?.id === "billing-cancellation-risk";

  const composeUi = useCallback(
    async (userId: string) => {
      setIsComposing(true);
      try {
        const response = await apiRequest<AgenticUiResponse>(`/scenarios/${encodeURIComponent(userId)}/agentic-ui`, {
          method: "POST",
        });
        setAgenticResponse(response);
        setSelectedUserId(userId);
        setApiStatus("connected");
        return response;
      } catch (error) {
        setApiStatus("offline");
        toast({
          title: "Home preview composition failed",
          description: error instanceof Error ? error.message : "Unable to compose home modules from behavior insight.",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsComposing(false);
      }
    },
    [toast]
  );

  const refreshDashboard = useCallback(async () => {
    const next = await apiRequest<BehaviorDemoDashboard>(`/dashboard?sessionId=${encodeURIComponent(sessionId)}`);
    setDashboard(next);
    return next;
  }, [sessionId]);

  const createSession = useCallback(
    async (resetFirst = false) => {
      setIsLoading(true);
      setIsResetting(resetFirst);
      setRecoveryComparison(null);
      try {
        if (resetFirst) {
          await apiRequest("/reset", {
            method: "POST",
            body: JSON.stringify({ sessionId, confirm: true }),
          });
        }
        const response = await apiRequest<DemoSessionResponse>("/sessions", {
          method: "POST",
          body: JSON.stringify({ sessionId, analyze: true }),
        });
        const first =
          response.dashboard.scenarios.find((scenario) => scenario.id === "billing-cancellation-risk") ||
          response.dashboard.scenarios[0];
        setDashboard(response.dashboard);
        setSelectedUserId(first?.userId || "");
        if (first) {
          await composeUi(first.userId);
        }
        setApiStatus("connected");
      } catch (error) {
        setApiStatus("offline");
        toast({
          title: "Behavior backend is offline",
          description: error instanceof Error ? error.message : "Unable to prepare the agentic UI demo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsResetting(false);
      }
    },
    [composeUi, sessionId, toast]
  );

  useEffect(() => {
    void createSession(false);
  }, [createSession]);

  const handleScenarioSelect = (scenario: DemoScenarioSummary) => {
    setSelectedUserId(scenario.userId);
    setRecoveryComparison(null);
    void composeUi(scenario.userId);
  };

  const recordPositiveRecovery = async () => {
    if (!selectedScenario) return;
    setIsRecovering(true);
    const before = activeInsight;
    try {
      const result = await apiRequest<BehaviorScenarioResult>(
        `/scenarios/${encodeURIComponent(selectedScenario.userId)}/positive-recovery`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );
      setRecoveryComparison({
        before,
        after: result.insight,
        addedEventTypes: result.events.slice(-5).reverse().map((event) => event.eventType),
      });
      await refreshDashboard();
      toast({
        title: "Recovery events recorded",
        description: "Positive raw app events were added. Click \"Refresh user insight\" to recompose the home preview.",
      });
    } catch (error) {
      toast({
        title: "Recovery event run failed",
        description: error instanceof Error ? error.message : "Unable to record positive recovery events.",
        variant: "destructive",
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const activePlan = agenticResponse?.plan;
  const activeComponents = activePlan?.components || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <Link to="/demos/ai-fabric-behavior-signals" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Behavior Signals
          </Link>

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                Behavior Signals subpage
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Behavior-driven home preview</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                The same Behavior Signals users feed an LLM component plan, then this page previews which home modules each user should see.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={
                  apiStatus === "connected"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : apiStatus === "offline"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                }
              >
                {apiStatus === "connected" ? "Connected" : apiStatus === "offline" ? "Offline" : "Loading"}
              </Badge>
              <Button variant="outline" onClick={() => void createSession(true)} disabled={isLoading || isComposing || isResetting}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Reset session
              </Button>
            </div>
          </div>

          {isResetting ? (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/90 backdrop-blur-sm">
              <div className="rounded-xl border border-amber-200 bg-white/90 px-6 py-5 shadow-lg">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Resetting Behavior Signals session</p>
                    <p className="text-xs text-muted-foreground">Preparing the same users, rebuilding insights, and refreshing the home preview.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_330px]">
            <aside className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Same behavior session</p>
                <h2 className="mt-1 text-xl font-semibold">Current users</h2>
              </div>
              <div className="space-y-3">
                {dashboard.scenarios.map((scenario) => {
                  const Icon = scenarioIcons[scenario.id] || Activity;
                  const selected = scenario.userId === selectedUserId;
                  return (
                    <button
                      key={scenario.userId}
                      type="button"
                      onClick={() => handleScenarioSelect(scenario)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-semibold">{scenario.title}</p>
                            <span className="text-xs text-muted-foreground">{scenario.eventCount}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{scenario.useCase}</p>
                          <Badge variant="outline" className="mt-3 bg-background text-xs">
                            {formatLabel(scenario.expectedActionFamily)}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="min-w-0 rounded-lg border bg-card shadow-sm">
              <div className="border-b p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">User home preview from AI component plan</p>
                    <h2 className="mt-1 text-2xl font-bold">{agenticResponse?.customerName || selectedScenario?.customerName || "Customer"}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {activePlan?.summary || "Run behavior analysis to preview the user's behavior-aware home modules."}
                    </p>
                  </div>
                  <Button onClick={() => selectedScenario && void composeUi(selectedScenario.userId)} disabled={!selectedScenario || isComposing}>
                    {isComposing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Refresh user insight
                  </Button>
                </div>
                {canRunRecoveryExperiment && (
                  <div className="mt-4 flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Positive recovery event case</p>
                      <p className="mt-1 text-sm text-emerald-800">
                        Add successful payment, usage recovery, feature usage, login, and positive feedback events to this churning account.
                      </p>
                    </div>
                    <Button onClick={() => void recordPositiveRecovery()} disabled={isRecovering || isComposing} className="bg-emerald-600 hover:bg-emerald-700">
                      {isRecovering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                      Record recovery events
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-5">
                {isLoading && !activePlan ? (
                  <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      <p className="mt-3 text-sm text-muted-foreground">Loading behavior users and composing the first home preview...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recoveryComparison && canRunRecoveryExperiment && (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-5">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Analytics reaction</p>
                            <h3 className="mt-1 text-xl font-semibold text-foreground">Churn insight after positive events</h3>
                          </div>
                          <Badge className="bg-emerald-600 text-white">Rerun</Badge>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-lg bg-white/75 p-4">
                            <p className="text-sm font-semibold text-muted-foreground">Before</p>
                            <div className="mt-3 grid gap-2">
                              <MetricRow label="Churn risk" value={`${percent(recoveryComparison.before?.churnRisk)}%`} />
                              <MetricRow label="Sentiment" value={formatLabel(recoveryComparison.before?.sentimentLabel)} />
                              <MetricRow label="Trend" value={formatLabel(recoveryComparison.before?.trend)} />
                            </div>
                          </div>
                          <div className="rounded-lg bg-white/75 p-4">
                            <p className="text-sm font-semibold text-muted-foreground">After</p>
                            <div className="mt-3 grid gap-2">
                              <MetricRow label="Churn risk" value={`${percent(recoveryComparison.after?.churnRisk)}%`} />
                              <MetricRow label="Sentiment" value={formatLabel(recoveryComparison.after?.sentimentLabel)} />
                              <MetricRow label="Trend" value={formatLabel(recoveryComparison.after?.trend)} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {recoveryComparison.addedEventTypes.map((type, index) => (
                            <Badge key={`${type}-${index}`} variant="outline" className="border-emerald-200 bg-white text-emerald-800">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid gap-4 lg:grid-cols-2">
                      {activeComponents.map((component) => (
                        <div
                          key={component.id}
                          className={
                            component.type === "EVENT_TIMELINE" || component.type === "NEXT_BEST_ACTIONS"
                              ? "lg:col-span-2"
                              : undefined
                          }
                        >
                          {renderAgenticComponent(component)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Structured plan</p>
                  <h2 className="text-xl font-semibold">{activePlan?.layout || "Pending"}</h2>
                </div>
              </div>

              <div className="space-y-3">
                <MetricRow label="Plan source" value={activePlan?.source || "pending"} />
                <MetricRow label="Model" value={activePlan?.model || "unknown"} />
                <MetricRow label="Attempts" value={activePlan?.attempts ?? 0} />
                <MetricRow label="Components" value={activeComponents.length} />
              </div>

              <Separator className="my-5" />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Insight event evidence</p>
                  <Badge variant="secondary">{activeEvidence?.eventCount || 0} events</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeEvidence?.eventTypes?.length ? (
                    activeEvidence.eventTypes.map((type) => (
                      <Badge key={type} variant="outline" className="bg-background">
                        {type}
                        <span className="ml-1 text-muted-foreground">{activeEvidence.eventTypeCounts?.[type] || 0}</span>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No event evidence loaded yet.</p>
                  )}
                </div>
                <div className="space-y-2">
                  {(activeEvidence?.recentEvents || []).slice(-4).reverse().map((event, index) => (
                    <div key={`${displayValue(event.type)}-${index}`} className="rounded-lg border bg-background p-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">{displayValue(event.type)}</span>
                        <span className="text-muted-foreground">{displayValue(event.source)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-muted-foreground">{displayValue(event.summary)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-5" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">LLM returned components</p>
                  <Badge variant="secondary">{activePlan?.allowedComponentTypes?.length || 0} allowed</Badge>
                </div>
                {activeComponents.map((component) => (
                  <div key={`plan-${component.id}`} className="rounded-lg border bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold">{component.type}</p>
                      <Badge variant="outline">{component.priority}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{component.rationale}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
                  <ShieldCheck className="h-4 w-4" />
                  Safe rendering
                </div>
                <p className="text-sm text-blue-800">
                  The backend validates component types and fills trusted props before this page renders anything.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
