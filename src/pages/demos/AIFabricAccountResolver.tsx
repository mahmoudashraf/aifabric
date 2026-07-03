import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  XCircle,
  Zap,
} from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { ChatPanel } from "./AIFabricFramework/components/Chat/ChatPanel";
import type { ChatMessage, ChatResult, Document, ResultType } from "./AIFabricFramework/types";

const configuredResolverBaseUrl =
  import.meta.env.VITE_ACCOUNT_RESOLVER_API_URL ||
  "https://ai-fabric-account-resolver.46.224.145.148.sslip.io";

const ACCOUNT_RESOLVER_BASE_URL = configuredResolverBaseUrl.replace(/\/$/, "");
const ACCOUNT_RESOLVER_API_BASE_URL = `${ACCOUNT_RESOLVER_BASE_URL}/api`;
const DEMO_BUILD_MARKER = "account-resolver-overlay-fix-2026-07-02";

type ApiStatus = "loading" | "connected" | "offline";

interface AccountBlocker {
  code: string;
  message: string;
  resolutionAction: string;
  confirmationRequired: boolean;
}

interface ResolutionPolicy {
  code: string;
  title: string;
  description: string;
  actionName: string;
  confirmationRequired: boolean;
}

interface ResolverScenario {
  id: string;
  userId: number;
  title: string;
  description: string;
  suggestedPrompt: string;
}

interface AccountReadiness {
  subscriptionId: string | null;
  userId: string | null;
  numericUserId: number | null;
  subscriptionStatus: string;
  canContinue: boolean;
  blockers: AccountBlocker[];
  policies: ResolutionPolicy[];
  recommendedActions: string[];
  hasVerifiedPaymentMethod: boolean;
  hasValidatedBillingAddress: boolean;
}

type JsonRecord = Record<string, unknown>;
type ManualActionName =
  | "inspect_account_readiness"
  | "update_payment_method"
  | "update_address"
  | "request_refund";

interface ResolverOrchestrationResponse {
  type?: ResultType | string;
  success?: boolean;
  message?: string;
  data?: unknown;
  nextSteps?: ChatResult["nextSteps"];
  smartSuggestion?: ChatResult["smartSuggestion"];
  sanitizedPayload?: JsonRecord;
  ragResponse?: unknown;
  readiness?: AccountReadiness;
}

interface ManualResolverAction {
  name: ManualActionName;
  label: string;
  confirmationMessage: string;
  subscriptionId?: string;
  params: JsonRecord;
  requiresConfirmation: boolean;
}

function asRecord(value: unknown): JsonRecord {
  return typeof value === "object" && value !== null ? (value as JsonRecord) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

const FALLBACK_POLICIES: ResolutionPolicy[] = [
  {
    code: "ACTIVE_ACCOUNT_REQUIRED",
    title: "Active subscription required",
    description: "The account must have an active subscription before app usage or ordering can continue.",
    actionName: "subscribe",
    confirmationRequired: true,
  },
  {
    code: "PAYMENT_METHOD_REQUIRED",
    title: "Verified payment method required",
    description: "A missing or unverified payment method blocks ordering and paid feature usage.",
    actionName: "update_payment_method",
    confirmationRequired: true,
  },
  {
    code: "BILLING_ADDRESS_REQUIRED",
    title: "Validated billing address required",
    description: "A missing or unvalidated billing address blocks ordering until the address is supplied.",
    actionName: "update_address",
    confirmationRequired: true,
  },
  {
    code: "REFUND_OR_CREDIT_AVAILABLE",
    title: "Refund or credit available",
    description: "Small refunds and account credits can be resolved immediately; larger refunds go to review.",
    actionName: "request_refund",
    confirmationRequired: true,
  },
];

const FALLBACK_SCENARIOS: ResolverScenario[] = [
  {
    id: "ready-account",
    userId: 91,
    title: "Ready account",
    description: "Active subscription, validated address, and verified payment method.",
    suggestedPrompt: "Can I continue using the app and make an order?",
  },
  {
    id: "missing-payment",
    userId: 92,
    title: "Missing payment method",
    description: "Checkout is blocked by a missing payment method.",
    suggestedPrompt: "Why can't I place an order? If payment is missing, add my Visa ending 4242.",
  },
  {
    id: "missing-address",
    userId: 93,
    title: "Missing billing address",
    description: "Checkout is blocked by a missing billing address.",
    suggestedPrompt:
      "Resolve the issue blocking my account and set my billing address to 101 Market St, San Francisco, CA 94105, USA.",
  },
  {
    id: "refund-request",
    userId: 94,
    title: "Refund or account credit",
    description: "The account is usable, but needs a governed billing resolution.",
    suggestedPrompt: "I was charged after a support incident. Please give me a $25 account credit.",
  },
];

const scenarioVisuals = {
  "ready-account": {
    icon: UserCheck,
    tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
    accent: "bg-emerald-500",
  },
  "missing-payment": {
    icon: CreditCard,
    tone: "text-violet-700 bg-violet-50 border-violet-200",
    accent: "bg-violet-500",
  },
  "missing-address": {
    icon: MapPin,
    tone: "text-amber-700 bg-amber-50 border-amber-200",
    accent: "bg-amber-500",
  },
  "refund-request": {
    icon: DollarSign,
    tone: "text-rose-700 bg-rose-50 border-rose-200",
    accent: "bg-rose-500",
  },
} as const;

const documentTypeColors = {
  policy: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  blocker: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  account: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700",
  payment: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700",
  refund: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700",
};

function newSessionId(scenarioId: string) {
  return `account-resolver-${scenarioId}-${Date.now()}`;
}

function formatActionName(action: string) {
  return action.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function createChatResult(type: ResultType, message: string, data?: unknown, success = true): ChatResult {
  return {
    type,
    success,
    sanitizedPayload: {
      type,
      success,
      message,
      data,
    },
  };
}

function normalizeMessage(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${ACCOUNT_RESOLVER_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  return response.json();
}

function unwrapResultData(raw: ResolverOrchestrationResponse) {
  const payload = asRecord(raw.sanitizedPayload);
  const data = payload.data ?? raw.data;
  return { payload, data };
}

function extractReadiness(raw: ResolverOrchestrationResponse): AccountReadiness | undefined {
  const { data } = unwrapResultData(raw);
  const dataRecord = asRecord(data);
  const actionResult = asRecord(dataRecord.actionResult);
  const actionResultData = asRecord(actionResult.data);
  const result = asRecord(dataRecord.result);

  return (
    (dataRecord.readiness as AccountReadiness | undefined) ||
    (actionResultData.readiness as AccountReadiness | undefined) ||
    (result.readiness as AccountReadiness | undefined) ||
    raw.readiness
  );
}

function normalizeOrchestrationResult(raw: ResolverOrchestrationResponse): { content: string; result: ChatResult; resultType: ResultType } {
  const { payload, data } = unwrapResultData(raw);
  const resultType = (payload.type || raw.type || "INFORMATION_PROVIDED") as ResultType;
  const success = (typeof payload.success === "boolean" ? payload.success : raw.success) ?? resultType !== "ERROR";
  const message = asString(payload.message, raw.message || "AI Fabric processed the request.");
  const nextSteps = Array.isArray(raw.nextSteps)
    ? raw.nextSteps
    : Array.isArray(payload.nextSteps)
      ? (payload.nextSteps as ChatResult["nextSteps"])
      : [];

  const sanitizedPayload = {
    ...payload,
    type: resultType,
    success,
    message,
    data,
  };

  return {
    content: normalizeMessage(message),
    resultType,
    result: {
      type: resultType,
      success,
      smartSuggestion: raw.smartSuggestion || (payload.smartSuggestion as ChatResult["smartSuggestion"]),
      nextSteps,
      sanitizedPayload,
    },
  };
}

function buildDocuments(
  raw: ResolverOrchestrationResponse,
  messageId: string,
  fallbackPolicies: ResolutionPolicy[],
): Document[] {
  const documents: Document[] = [];
  const seen = new Set<string>();
  const readiness = extractReadiness(raw);
  const { data } = unwrapResultData(raw);

  const addDocument = (doc: Document) => {
    if (seen.has(doc.id)) return;
    seen.add(doc.id);
    documents.push(doc);
  };

  const policies = readiness?.policies?.length ? readiness.policies : fallbackPolicies;
  for (const policy of policies) {
    addDocument({
      id: `policy-${policy.code}`,
      title: policy.title,
      content: `${policy.description}\n\nAction: ${policy.actionName}\nConfirmation required: ${policy.confirmationRequired ? "yes" : "no"}`,
      type: "policy",
      metadata: {
        code: policy.code,
        actionName: policy.actionName,
        confirmationRequired: policy.confirmationRequired,
      },
      messageId,
      score: 1,
    });
  }

  for (const blocker of readiness?.blockers || []) {
    addDocument({
      id: `blocker-${blocker.code}`,
      title: blocker.code,
      content: blocker.message,
      type: "blocker",
      metadata: {
        resolutionAction: blocker.resolutionAction,
        confirmationRequired: blocker.confirmationRequired,
      },
      messageId,
      score: 1,
    });
  }

  const dataRecord = asRecord(data);
  const ragResponse = asRecord(raw.ragResponse);
  const rawDocuments = Array.isArray(dataRecord.documents)
    ? dataRecord.documents
    : Array.isArray(ragResponse.documents)
      ? ragResponse.documents
      : [];
  if (Array.isArray(rawDocuments)) {
    rawDocuments.forEach((rawDocument, index: number) => {
      const item = asRecord(rawDocument);
      addDocument({
        id: asString(item.id, asString(item._id, `${messageId}-doc-${index}`)),
        title: asString(item.title, asString(item.name, `${asString(item.type, "document")} ${index + 1}`)),
        content: asString(item.content, asString(item.text, asString(item.contentSnippet))),
        type: asString(item.type, asString(item.vectorSpace, "account")),
        metadata: asRecord(item.metadata),
        messageId,
        similarity: typeof item.similarity === "number" ? item.similarity : undefined,
        score: typeof item.score === "number" ? item.score : undefined,
      });
    });
  }

  return documents;
}

const AIFabricAccountResolver = () => {
  const { toast } = useToast();
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [scenarios, setScenarios] = useState<ResolverScenario[]>(FALLBACK_SCENARIOS);
  const [policies, setPolicies] = useState<ResolutionPolicy[]>(FALLBACK_POLICIES);
  const [selectedScenario, setSelectedScenario] = useState<ResolverScenario>(FALLBACK_SCENARIOS[1]);
  const [readiness, setReadiness] = useState<AccountReadiness | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatQuery, setChatQuery] = useState(FALLBACK_SCENARIOS[1].suggestedPrompt);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [pendingManualAction, setPendingManualAction] = useState<ManualResolverAction | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef(newSessionId(FALLBACK_SCENARIOS[1].id));
  const conversationIdRef = useRef(`resolver-${sessionIdRef.current}`);

  const quickPrompts = useMemo(() => {
    const scenarioPrompt = selectedScenario.suggestedPrompt;
    const common = [
      "Inspect this account readiness and explain every blocker.",
      "Resolve the blocker using the safest available action.",
      "Can this user continue using the app and place an order?",
    ];

    if (selectedScenario.id === "refund-request") {
      return [
        scenarioPrompt,
        "Create a $25 account credit for the billing issue if policy allows it.",
        "Explain when this case needs manual review instead of automatic resolution.",
      ];
    }

    return [scenarioPrompt, ...common].slice(0, 4);
  }, [selectedScenario]);

  const readinessStats = useMemo(() => {
    const blockers = readiness?.blockers.length ?? 0;
    const actions = readiness?.recommendedActions.length ?? 0;
    return [
      {
        label: "Can continue",
        value: readiness?.canContinue ? "Yes" : "No",
        tone: readiness?.canContinue ? "text-emerald-700" : "text-amber-700",
      },
      {
        label: "Blockers",
        value: String(blockers),
        tone: blockers === 0 ? "text-emerald-700" : "text-amber-700",
      },
      {
        label: "Actions",
        value: String(actions),
        tone: actions === 0 ? "text-slate-700" : "text-blue-700",
      },
    ];
  }, [readiness]);

  const refreshReadiness = useCallback(
    async (userId: number, silent = false) => {
      if (!silent) setIsRefreshing(true);
      try {
        const data = await apiJson<AccountReadiness>(`/account-resolver/users/${userId}/readiness`);
        setReadiness(data);
        setApiStatus("connected");
        return data;
      } catch (error) {
        setApiStatus("offline");
        if (!silent) {
          toast({
            title: "Readiness check failed",
            description: error instanceof Error ? error.message : "Could not inspect the selected account.",
            variant: "destructive",
          });
        }
        return null;
      } finally {
        if (!silent) setIsRefreshing(false);
      }
    },
    [toast],
  );

  const seedDemo = useCallback(
    async (scenario: ResolverScenario, showToast = true) => {
      setIsSeeding(true);
      try {
        const seeded = await apiJson<Record<string, AccountReadiness>>("/account-resolver/demo/seed", {
          method: "POST",
        });
        setApiStatus("connected");
        const scenarioReadiness = seeded[scenario.id] || null;
        if (scenarioReadiness) {
          setReadiness(scenarioReadiness);
        } else {
          await refreshReadiness(scenario.userId, true);
        }
        if (showToast) {
          toast({
            title: "Demo scenarios seeded",
            description: "Resolver users 91-94 are ready for the live walkthrough.",
          });
        }
      } catch (error) {
        setApiStatus("offline");
        if (showToast) {
          toast({
            title: "Seed failed",
            description: error instanceof Error ? error.message : "The account resolver API is not reachable yet.",
            variant: "destructive",
          });
        }
      } finally {
        setIsSeeding(false);
      }
    },
    [refreshReadiness, toast],
  );

  const resolveSubscriptionId = useCallback(async () => {
    if (readiness?.subscriptionId) {
      return readiness.subscriptionId;
    }
    const refreshed = await refreshReadiness(selectedScenario.userId, true);
    return refreshed?.subscriptionId || undefined;
  }, [readiness?.subscriptionId, refreshReadiness, selectedScenario.userId]);

  const manualActionFor = useCallback(
    async (actionName: string): Promise<ManualResolverAction | null> => {
      if (actionName === "inspect_account_readiness") {
        return {
          name: "inspect_account_readiness",
          label: "Inspect Account Readiness",
          confirmationMessage: "Inspect this account readiness and explain current blockers.",
          params: { userId: selectedScenario.userId },
          requiresConfirmation: false,
        };
      }

      const subscriptionId = await resolveSubscriptionId();
      if (!subscriptionId) {
        toast({
          title: "No active subscription",
          description: "Seed or refresh the selected scenario before running this resolver action.",
          variant: "destructive",
        });
        return null;
      }

      if (actionName === "update_payment_method") {
        return {
          name: "update_payment_method",
          label: "Update Payment Method",
          confirmationMessage: "Use Visa ending in 4242 as the verified payment method for this account?",
          subscriptionId,
          params: { type: "CARD", provider: "Visa", last4: "4242" },
          requiresConfirmation: true,
        };
      }

      if (actionName === "update_address") {
        return {
          name: "update_address",
          label: "Update Billing Address",
          confirmationMessage: "Set the billing address to 101 Market St, San Francisco, CA 94105, USA?",
          subscriptionId,
          params: {
            streetAddress: "101 Market St",
            city: "San Francisco",
            state: "CA",
            postalCode: "94105",
            country: "USA",
          },
          requiresConfirmation: true,
        };
      }

      if (actionName === "request_refund") {
        return {
          name: "request_refund",
          label: "Create Account Credit",
          confirmationMessage: "Create a $25 account credit for the reported billing issue?",
          subscriptionId,
          params: {
            amount: 25,
            reason: "Support incident billing issue",
            resolutionType: "ACCOUNT_CREDIT",
          },
          requiresConfirmation: true,
        };
      }

      return null;
    },
    [resolveSubscriptionId, selectedScenario.userId, toast],
  );

  useEffect(() => {
    let mounted = true;

    async function loadDemo() {
      setApiStatus("loading");
      try {
        const [remoteScenarios, remotePolicies] = await Promise.all([
          apiJson<ResolverScenario[]>("/account-resolver/scenarios"),
          apiJson<ResolutionPolicy[]>("/account-resolver/policies"),
        ]);
        if (!mounted) return;

        const nextScenarios = remoteScenarios.length ? remoteScenarios : FALLBACK_SCENARIOS;
        const nextPolicies = remotePolicies.length ? remotePolicies : FALLBACK_POLICIES;
        const preferred = nextScenarios.find((scenario) => scenario.id === "missing-payment") || nextScenarios[0];

        setScenarios(nextScenarios);
        setPolicies(nextPolicies);
        setSelectedScenario(preferred);
        setChatQuery(preferred.suggestedPrompt);
        sessionIdRef.current = newSessionId(preferred.id);
        conversationIdRef.current = `resolver-${sessionIdRef.current}`;
        setApiStatus("connected");
        await seedDemo(preferred, false);
      } catch (error) {
        if (!mounted) return;
        setApiStatus("offline");
        setScenarios(FALLBACK_SCENARIOS);
        setPolicies(FALLBACK_POLICIES);
      }
    }

    loadDemo();

    return () => {
      mounted = false;
    };
  }, [seedDemo]);

  const selectScenario = async (scenario: ResolverScenario) => {
    setSelectedScenario(scenario);
    setChatQuery(scenario.suggestedPrompt);
    setChatMessages([]);
    setIsChatExpanded(false);
    sessionIdRef.current = newSessionId(scenario.id);
    conversationIdRef.current = `resolver-${sessionIdRef.current}`;
    const seededReadiness = await refreshReadiness(scenario.userId, true);
    if (!seededReadiness && apiStatus !== "connected") {
      setReadiness(null);
    }
  };

  const sendResolverQuery = useCallback(
    async (queryOverride?: string) => {
      const queryToSend = (queryOverride || chatQuery).trim();
      if (!queryToSend || isChatLoading) return;

      const userMessage: ChatMessage = {
        id: `${Date.now()}-user`,
        type: "user",
        content: queryToSend,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((previous) => [...previous, userMessage]);
      setChatQuery("");
      setIsChatExpanded(true);
      setIsChatLoading(true);

      try {
        const raw = await apiJson<ResolverOrchestrationResponse>("/subscriptions/query", {
          method: "POST",
          body: JSON.stringify({
            query: queryToSend,
            userId: String(selectedScenario.userId),
            sessionId: sessionIdRef.current,
            conversationId: conversationIdRef.current,
            mode: "resolver",
            position: "resolver",
          }),
        });

        const msgId = `${Date.now()}-ai`;
        const normalized = normalizeOrchestrationResult(raw);
        const documents = buildDocuments(raw, msgId, policies);
        const aiMessage: ChatMessage = {
          id: msgId,
          type: "ai",
          content: normalized.content,
          timestamp: new Date().toISOString(),
          result: normalized.result,
          resultType: normalized.resultType,
          documents: documents.length > 0 ? documents : undefined,
        };

        setChatMessages((previous) => [...previous, aiMessage]);
        const responseReadiness = extractReadiness(raw);
        if (responseReadiness) {
          setReadiness(responseReadiness);
        } else {
          await refreshReadiness(selectedScenario.userId, true);
        }
        setApiStatus("connected");
      } catch (error) {
        setApiStatus("offline");
        const message = error instanceof Error ? error.message : "The resolver API did not return a response.";
        const errorMessage: ChatMessage = {
          id: `${Date.now()}-error`,
          type: "ai",
          content: message,
          timestamp: new Date().toISOString(),
          resultType: "ERROR",
          result: {
            type: "ERROR",
            success: false,
            sanitizedPayload: {
              type: "ERROR",
              success: false,
              message,
            },
          },
        };
        setChatMessages((previous) => [...previous, errorMessage]);
        toast({
          title: "Resolver query failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsChatLoading(false);
      }
    },
    [chatQuery, isChatLoading, policies, refreshReadiness, selectedScenario.userId, toast],
  );

  const executeManualAction = useCallback(
    async (manualAction: ManualResolverAction) => {
      setPendingManualAction(null);
      setIsChatExpanded(true);
      setIsChatLoading(true);

      try {
        let responseData: unknown;
        let updatedReadiness: AccountReadiness | null = null;

        if (manualAction.name === "inspect_account_readiness") {
          updatedReadiness = await refreshReadiness(selectedScenario.userId, true);
          responseData = updatedReadiness;
        } else if (manualAction.name === "update_payment_method" && manualAction.subscriptionId) {
          responseData = await apiJson<unknown>(
            `/account-resolver/subscriptions/${manualAction.subscriptionId}/payment-method`,
            {
              method: "POST",
              body: JSON.stringify(manualAction.params),
            },
          );
          updatedReadiness = asRecord(responseData).readiness as AccountReadiness | null;
        } else if (manualAction.name === "update_address" && manualAction.subscriptionId) {
          responseData = await apiJson<AccountReadiness>(
            `/account-resolver/subscriptions/${manualAction.subscriptionId}/billing-address`,
            {
              method: "PUT",
              body: JSON.stringify(manualAction.params),
            },
          );
          updatedReadiness = responseData as AccountReadiness;
        } else if (manualAction.name === "request_refund" && manualAction.subscriptionId) {
          responseData = await apiJson<unknown>(
            `/account-resolver/subscriptions/${manualAction.subscriptionId}/refund`,
            {
              method: "POST",
              body: JSON.stringify(manualAction.params),
            },
          );
          updatedReadiness = await refreshReadiness(selectedScenario.userId, true);
        } else {
          throw new Error(`Action ${manualAction.name} is missing required account context.`);
        }

        if (updatedReadiness) {
          setReadiness(updatedReadiness);
        }

        const message =
          manualAction.name === "inspect_account_readiness"
            ? updatedReadiness?.canContinue
              ? "Account is ready to continue."
              : "Account has blockers that need resolution."
            : `${manualAction.label} completed.`;
        const msgId = `${Date.now()}-manual-ai`;
        const data = {
          action: manualAction.name,
          params: manualAction.params,
          result: responseData,
          readiness: updatedReadiness,
        };

        const aiMessage: ChatMessage = {
          id: msgId,
          type: "ai",
          content: message,
          timestamp: new Date().toISOString(),
          resultType: "ACTION_EXECUTED",
          result: createChatResult("ACTION_EXECUTED", message, data),
          documents: buildDocuments({ data: { readiness: updatedReadiness } }, msgId, policies),
        };

        setChatMessages((previous) => [...previous, aiMessage]);
        setApiStatus("connected");
      } catch (error) {
        const message = error instanceof Error ? error.message : "The resolver action failed.";
        const aiMessage: ChatMessage = {
          id: `${Date.now()}-manual-error`,
          type: "ai",
          content: message,
          timestamp: new Date().toISOString(),
          resultType: "ERROR",
          result: createChatResult("ERROR", message, undefined, false),
        };

        setChatMessages((previous) => [...previous, aiMessage]);
        toast({
          title: "Resolver action failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsChatLoading(false);
      }
    },
    [policies, refreshReadiness, selectedScenario.userId, toast],
  );

  const startManualAction = useCallback(
    async (actionName: string) => {
      const manualAction = await manualActionFor(actionName);
      if (!manualAction || isChatLoading) return;

      const userMessage: ChatMessage = {
        id: `${Date.now()}-manual-user`,
        type: "user",
        content: `Action: ${manualAction.name}`,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((previous) => [...previous, userMessage]);
      setIsChatExpanded(true);

      if (!manualAction.requiresConfirmation) {
        await executeManualAction(manualAction);
        return;
      }

      setPendingManualAction(manualAction);
      const aiMessage: ChatMessage = {
        id: `${Date.now()}-manual-confirmation`,
        type: "ai",
        content: manualAction.confirmationMessage,
        timestamp: new Date().toISOString(),
        resultType: "CONFIRMATION_REQUIRED",
        result: createChatResult("CONFIRMATION_REQUIRED", manualAction.confirmationMessage, {
          action: manualAction.name,
          confirmationRequired: true,
          confirmationMessage: manualAction.confirmationMessage,
          params: manualAction.params,
        }),
      };

      setChatMessages((previous) => [...previous, aiMessage]);
    },
    [executeManualAction, isChatLoading, manualActionFor],
  );

  const runSelectedScenario = useCallback(() => {
    sendResolverQuery(selectedScenario.suggestedPrompt);
  }, [selectedScenario.suggestedPrompt, sendResolverQuery]);

  const handlePromptClick = (prompt: string) => {
    sendResolverQuery(prompt);
  };

  const handleConfirmation = (action: "confirm" | "deny") => {
    if (pendingManualAction) {
      if (action === "confirm") {
        executeManualAction(pendingManualAction);
        return;
      }

      const message = `${pendingManualAction.label} was rejected. No account changes were made.`;
      setPendingManualAction(null);
      setChatMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-manual-denied`,
          type: "ai",
          content: message,
          timestamp: new Date().toISOString(),
          resultType: "ACTION_DENIED",
          result: createChatResult("ACTION_DENIED", message, { action: pendingManualAction.name }, false),
        },
      ]);
      return;
    }

    const confirmationQuery =
      action === "confirm"
        ? "Yes, confirm and execute the pending account resolver action."
        : "No, reject the pending action and do not change my account.";
    sendResolverQuery(confirmationQuery);
  };

  const handleClarificationSubmit = (action: string, parameters: Record<string, unknown>) => {
    sendResolverQuery(`Continue ${action} with these details: ${JSON.stringify(parameters)}`);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendResolverQuery();
    }
  };

  const selectedVisual = scenarioVisuals[selectedScenario.id as keyof typeof scenarioVisuals] || scenarioVisuals["ready-account"];
  const SelectedIcon = selectedVisual.icon;

  return (
    <div className="min-h-screen bg-background" data-demo-build={DEMO_BUILD_MARKER}>
      <Navbar />

      <main className="pt-24 pb-44">
        <section className="container mx-auto px-4 py-5">
          <Link
            to="/demos"
            className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-3 gap-1.5">
                <Sparkles className="h-3 w-3" />
                Live AI Fabric real app
              </Badge>
              <h1 className="text-3xl font-bold tracking-normal md:text-4xl">AI Fabric Account Resolver</h1>
              <p className="mt-2 text-muted-foreground">
                Resolve blocked accounts with policy-aware readiness checks, confirmed actions, and live natural-language orchestration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={apiStatus === "connected" ? "default" : "outline"} className="gap-1.5">
                {apiStatus === "loading" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : apiStatus === "connected" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {apiStatus === "connected" ? "API connected" : apiStatus === "loading" ? "Connecting" : "API offline"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                    onClick={() => seedDemo(selectedScenario)}
                disabled={isSeeding}
                className="gap-2"
              >
                {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Seed scenarios
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
            <div className="rounded-lg border bg-card p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">Scenario Queue</h2>
                  <p className="text-xs text-muted-foreground">Seeded users 91-94</p>
                </div>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                {scenarios.map((scenario) => {
                  const visual = scenarioVisuals[scenario.id as keyof typeof scenarioVisuals] || scenarioVisuals["ready-account"];
                  const Icon = visual.icon;
                  const isActive = selectedScenario.id === scenario.id;

                  return (
                    <button
                      key={scenario.id}
                      onClick={() => selectScenario(scenario)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        isActive
                          ? `${visual.tone} shadow-sm`
                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-8 w-8 rounded-md ${isActive ? visual.accent : "bg-muted"} flex items-center justify-center`}>
                          <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold">{scenario.title}</span>
                            <span className="rounded bg-background/70 px-1.5 py-0.5 text-[10px] font-bold">
                              {scenario.userId}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{scenario.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${selectedVisual.tone}`}>
                      <SelectedIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold">{selectedScenario.title}</h2>
                        <Badge variant="outline">User {selectedScenario.userId}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedScenario.description}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshReadiness(selectedScenario.userId)}
                    disabled={isRefreshing}
                    className="gap-2"
                  >
                    {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Refresh
                  </Button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {readinessStats.map((stat) => (
                    <div key={stat.label} className="rounded-lg border bg-background p-3">
                      <div className={`text-2xl font-bold ${stat.tone}`}>{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold">Readiness State</h3>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border bg-background p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {readiness?.hasVerifiedPaymentMethod ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        )}
                        Payment method
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {readiness?.hasVerifiedPaymentMethod ? "Verified method on file" : "Missing or unverified"}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {readiness?.hasValidatedBillingAddress ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        )}
                        Billing address
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {readiness?.hasValidatedBillingAddress ? "Validated address available" : "Missing or unvalidated"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Blockers</div>
                    {readiness?.blockers.length ? (
                      readiness.blockers.map((blocker) => (
                        <div key={blocker.code} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                            <div>
                              <div className="text-sm font-bold text-amber-900">{blocker.code}</div>
                              <p className="mt-1 text-xs text-amber-800">{blocker.message}</p>
                              <Badge variant="outline" className="mt-2 bg-white/70 text-[10px]">
                                {formatActionName(blocker.resolutionAction)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                        No active blockers. This account can continue.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-bold">Resolver Actions</h3>
                  </div>

                  <div className="space-y-2">
                    {(readiness?.recommendedActions.length ? readiness.recommendedActions : ["inspect_account_readiness"]).map((action) => (
                      <button
                        key={action}
                        onClick={() => startManualAction(action)}
                        className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
                      >
                        <span className="text-sm font-semibold">{formatActionName(action)}</span>
                        <Send className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      Policy context
                    </div>
                    <div className="space-y-2">
                      {policies.slice(0, 4).map((policy) => (
                        <div key={policy.code} className="rounded-md bg-background p-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold">{policy.title}</span>
                            {policy.confirmationRequired && (
                              <Badge variant="outline" className="text-[10px]">
                                Confirmed
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{policy.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold">Live Chat Flow</h3>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border bg-background p-3">
                  <div className="text-xs font-bold uppercase text-muted-foreground">Runtime</div>
                  <p className="mt-1 break-all text-xs text-muted-foreground">{ACCOUNT_RESOLVER_BASE_URL}</p>
                </div>

                <div className="rounded-lg border bg-background p-3">
                  <div className="text-xs font-bold uppercase text-muted-foreground">Current prompt</div>
                  <p className="mt-1 text-sm">{selectedScenario.suggestedPrompt}</p>
                </div>

                <Button className="w-full gap-2" onClick={runSelectedScenario} disabled={isChatLoading}>
                  {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                  Run scenario
                </Button>

                <Button variant="outline" className="w-full gap-2" onClick={() => setIsChatExpanded(true)}>
                  <Bot className="h-4 w-4" />
                  Open chat
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ChatPanel
        isExpanded={isChatExpanded}
        onClose={() => setIsChatExpanded(false)}
        messages={chatMessages}
        isLoading={isChatLoading}
        onConfirmation={handleConfirmation}
        messagesEndRef={messagesEndRef}
        onResendAction={(query) => sendResolverQuery(query)}
        onClarificationSubmit={handleClarificationSubmit}
        title="Account Resolver"
        emptyTitle="Ask AI Fabric to inspect or resolve this account"
        emptyDescription="Use the scenario prompts to test readiness checks, policies, confirmations, and write actions."
        documentLabel="Policies"
        documentTypeColors={documentTypeColors}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent px-3 pb-4 pt-8 transition-opacity sm:px-4 sm:pb-6 ${
          isChatExpanded ? "pointer-events-none z-20 opacity-0" : "z-40 opacity-100"
        }`}
      >
        <div className="mx-auto max-w-4xl space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                disabled={isChatLoading}
                className="shrink-0 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-1">
              <Textarea
                ref={chatInputRef}
                value={chatQuery}
                onChange={(event) => setChatQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask the resolver to inspect blockers, update payment, set address, cancel, or resolve a refund..."
                className="min-h-[64px] resize-none rounded-2xl border-0 bg-white/90 pb-4 pl-4 pr-14 pt-4 text-base shadow-lg backdrop-blur-sm transition-all focus:shadow-xl dark:bg-gray-800/90 md:min-h-[80px]"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: "16px",
                }}
              />

              <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                <Badge variant="outline" className="hidden rounded-full bg-white/80 text-[10px] md:inline-flex">
                  User {selectedScenario.userId}
                </Badge>
                <Button
                  size="icon"
                  onClick={() => sendResolverQuery()}
                  disabled={isChatLoading || !chatQuery.trim()}
                  className="h-10 w-10 rounded-xl bg-blue-700 shadow-xl transition-all hover:scale-105 hover:bg-blue-800 disabled:opacity-50"
                >
                  {isChatLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <Send className="h-5 w-5 text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIFabricAccountResolver;
