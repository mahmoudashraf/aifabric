import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Circle,
  Copy,
  Database,
  FileSearch,
  Loader2,
  Lock,
  MessageSquare,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  nextJourneyStage,
  RAG_JOURNEY_PROMPTS,
  RAG_JOURNEY_STAGES,
  stageFromReadiness,
  type RagJourneyPromptKey,
  type RagJourneySeedStage,
  type RagJourneyStage,
} from "../constants/ragJourney";
import type { ChatMessage, ChatPosition, DemoHealth, DemoReadiness, Document, ResultType } from "../types";

interface RagJourneyPanelProps {
  readiness: DemoReadiness | null;
  health: DemoHealth | null;
  isRunning: boolean;
  runningLabel?: string;
  onRefresh: () => Promise<void> | void;
  onReset: () => Promise<void> | void;
  onSeedStage: (stage: RagJourneySeedStage) => Promise<void> | void;
  onRunPrompt: (prompt: string, position: ChatPosition) => Promise<ChatMessage | undefined>;
}

interface RagJourneyRunDoc {
  id: string;
  title: string;
  type: string;
  vectorSpace?: string;
  score?: number;
  similarity?: number;
}

interface RagJourneyRun {
  id: string;
  stage: string;
  stageNumber: number;
  promptKey: RagJourneyPromptKey;
  prompt: string;
  answer: string;
  documents: RagJourneyRunDoc[];
  vectorSpaces: string[];
  resultType?: ResultType;
  actionType?: string;
  createdAt: string;
}

const STORAGE_KEY = "ai-shopping-rag-journey-runs-v1";

function loadRuns(): RagJourneyRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRuns(runs: RagJourneyRun[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runs.slice(-12)));
}

function stageStatus(stage: RagJourneyStage, currentStage: RagJourneyStage) {
  if (stage.number < currentStage.number) return "complete";
  if (stage.number === currentStage.number) return "current";
  if (stage.number === currentStage.number + 1) return "available";
  return "locked";
}

function primaryPromptKey(stage: RagJourneyStage): RagJourneyPromptKey {
  return stage.promptKeys[0] || "gaming_laptop_analysis";
}

function toRunDocs(documents: Document[] | undefined): RagJourneyRunDoc[] {
  return (documents || []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    type: doc.type,
    vectorSpace: doc.metadata?.vectorSpace || doc.type,
    score: doc.score,
    similarity: doc.similarity,
  }));
}

function inferActionType(message: ChatMessage): string | undefined {
  const data = message.result?.sanitizedPayload?.data;
  if (!data || typeof data !== "object") return undefined;
  return (
    data.actionName ||
    data.action ||
    data.actionType ||
    data.name ||
    data?.actionRequest?.actionName ||
    undefined
  );
}

function compactText(value: string, limit = 520) {
  if (!value) return "";
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit).trim()}...` : normalized;
}

function formatScore(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return `${Math.round(value * 100)}%`;
}

function vectorProofFor(readiness: DemoReadiness | null, vectorSpace: string) {
  return readiness?.vectorSpaces?.[vectorSpace]?.retrievalProof;
}

function vectorCountFor(readiness: DemoReadiness | null, vectorSpace: string) {
  return readiness?.vectorSpaces?.[vectorSpace]?.vectorCount || 0;
}

function RunSummary({ run, label }: { run: RagJourneyRun | undefined; label: string }) {
  if (!run) {
    return (
      <div className="rounded-lg border border-dashed bg-background px-4 py-5 text-sm text-muted-foreground">
        No captured answer yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{label}</Badge>
          <Badge variant="outline">stage {run.stageNumber}</Badge>
          {run.resultType && <Badge>{run.resultType}</Badge>}
        </div>
        <div className="text-xs text-muted-foreground">{new Date(run.createdAt).toLocaleTimeString()}</div>
      </div>

      <div className="mt-3 text-sm font-semibold text-foreground">{run.prompt}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{compactText(run.answer)}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline">{run.documents.length} docs</Badge>
        {run.vectorSpaces.length > 0 ? (
          run.vectorSpaces.map((space) => (
            <Badge key={space} variant="secondary">
              {space}
            </Badge>
          ))
        ) : (
          <Badge variant="outline">no vector docs</Badge>
        )}
        {run.actionType && <Badge variant="outline">{run.actionType}</Badge>}
      </div>

      {run.documents.length > 0 && (
        <div className="mt-3 space-y-2">
          {run.documents.slice(0, 3).map((doc) => (
            <div key={`${run.id}-${doc.id}`} className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-foreground">{doc.title}</span>
                <span className="text-muted-foreground">{formatScore(doc.score ?? doc.similarity)}</span>
              </div>
              <div className="mt-1 text-muted-foreground">{doc.vectorSpace || doc.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RagJourneyPanel({
  readiness,
  health,
  isRunning,
  runningLabel,
  onRefresh,
  onReset,
  onSeedStage,
  onRunPrompt,
}: RagJourneyPanelProps) {
  const [runs, setRuns] = useState<RagJourneyRun[]>(() => loadRuns());
  const [selectedPromptKey, setSelectedPromptKey] = useState<RagJourneyPromptKey>("gaming_laptop_analysis");
  const [runningPromptKey, setRunningPromptKey] = useState<RagJourneyPromptKey | null>(null);
  const [copied, setCopied] = useState(false);

  const currentStage = useMemo(
    () => stageFromReadiness(readiness?.stage, readiness?.stageNumber),
    [readiness?.stage, readiness?.stageNumber],
  );
  const nextStage = nextJourneyStage(currentStage);
  const selectedPrompt = RAG_JOURNEY_PROMPTS[selectedPromptKey];
  const currentStagePrompt = RAG_JOURNEY_PROMPTS[primaryPromptKey(currentStage)];
  const baselineRun = runs.find((run) => run.stageNumber === 0);
  const latestRun = runs[runs.length - 1];

  useEffect(() => {
    const preferredKey = primaryPromptKey(currentStage);
    setSelectedPromptKey((current) => currentStage.promptKeys.includes(current) ? current : preferredKey);
  }, [currentStage]);

  useEffect(() => {
    saveRuns(runs);
  }, [runs]);

  async function runPrompt(promptKey: RagJourneyPromptKey) {
    const prompt = RAG_JOURNEY_PROMPTS[promptKey];
    setSelectedPromptKey(promptKey);
    setRunningPromptKey(promptKey);
    setCopied(false);
    try {
      const stageSnapshot = stageFromReadiness(readiness?.stage, readiness?.stageNumber);
      const message = await onRunPrompt(prompt.text, prompt.position);
      if (!message) return;

      const documents = toRunDocs(message.documents);
      const vectorSpaces = Array.from(new Set(documents.map((doc) => doc.vectorSpace || doc.type).filter(Boolean)));
      const run: RagJourneyRun = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        stage: stageSnapshot.key,
        stageNumber: stageSnapshot.number,
        promptKey,
        prompt: prompt.text,
        answer: message.content,
        documents,
        vectorSpaces,
        resultType: message.resultType,
        actionType: inferActionType(message),
        createdAt: new Date().toISOString(),
      };
      setRuns((previous) => [...previous, run].slice(-12));
    } finally {
      setRunningPromptKey(null);
    }
  }

  async function seedNextStage() {
    if (!nextStage?.seedStage) return;
    setCopied(false);
    await onSeedStage(nextStage.seedStage);
  }

  async function copySmokeReport() {
    const report = {
      capturedAt: new Date().toISOString(),
      health,
      readiness,
      runs,
    };
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
  }

  function clearRuns() {
    setRuns([]);
    setCopied(false);
  }

  const expectedProofs = currentStage.expectedVectorSpaces.map((space) => ({
    space,
    count: vectorCountFor(readiness, space),
    proof: vectorProofFor(readiness, space),
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSearch className="h-5 w-5 text-blue-600" />
              RAG Journey
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={readiness?.ready ? "default" : "secondary"}>{currentStage.label}</Badge>
              <Badge variant="outline">stage {currentStage.number}</Badge>
              {readiness?.indexingQueueSize != null && (
                <Badge variant="outline">{readiness.indexingQueueSize} queued</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {RAG_JOURNEY_STAGES.map((stage) => {
              const status = stageStatus(stage, currentStage);
              const locked = status === "locked";
              const Icon = status === "complete" ? CheckCircle2 : status === "locked" ? Lock : Circle;

              return (
                <div
                  key={stage.key}
                  className={cn(
                    "rounded-lg border bg-background p-3",
                    status === "current" && "border-blue-400 bg-blue-50",
                    status === "complete" && "border-emerald-200 bg-emerald-50",
                    locked && "opacity-60",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", status === "complete" && "text-emerald-600", status === "current" && "text-blue-600")} />
                      <span className="text-sm font-semibold">{stage.shortLabel}</span>
                    </div>
                    <Badge variant="outline">{stage.number}</Badge>
                  </div>
                  <div className="mt-2 min-h-[36px] text-xs leading-5 text-muted-foreground">{stage.dataLabel}</div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {stage.expectedVectorSpaces.length > 0 ? (
                      stage.expectedVectorSpaces.map((space) => (
                        <Badge key={space} variant="secondary" className="text-[10px]">
                          {space}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        no vectors
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {runningLabel && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">
              {runningLabel}
            </div>
          )}

          {readiness?.warnings && readiness.warnings.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {readiness.warnings.join(" ")}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-violet-600" />
              AI Test Run
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-background p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{selectedPrompt.label}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedPrompt.text}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline">{selectedPrompt.position}</Badge>
                  <Button
                    size="sm"
                    onClick={() => runPrompt(selectedPromptKey)}
                    disabled={isRunning || !!runningPromptKey}
                    className="gap-2"
                  >
                    {runningPromptKey === selectedPromptKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Run
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.values(RAG_JOURNEY_PROMPTS).map((prompt) => (
                  <Button
                    key={prompt.key}
                    size="sm"
                    variant={prompt.key === selectedPromptKey ? "default" : "outline"}
                    onClick={() => setSelectedPromptKey(prompt.key)}
                    disabled={isRunning || !!runningPromptKey}
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                onClick={() => runPrompt(currentStagePrompt.key)}
                disabled={isRunning || !!runningPromptKey}
                className="h-12 gap-2 sm:col-span-2"
              >
                {runningPromptKey === currentStagePrompt.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                Run Stage Prompt
              </Button>
              <Button variant="outline" onClick={seedNextStage} disabled={isRunning || !!runningPromptKey || !nextStage?.seedStage} className="gap-2">
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {nextStage ? `Seed ${nextStage.shortLabel}` : "All Stages Ready"}
              </Button>
              <Button variant="outline" onClick={onRefresh} disabled={isRunning || !!runningPromptKey} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="destructive" onClick={onReset} disabled={isRunning || !!runningPromptKey} className="gap-2 sm:col-span-2">
                <RotateCcw className="h-4 w-4" />
                Reset To No Evidence
              </Button>
            </div>

            <Separator />

            <div className="grid gap-2 sm:grid-cols-3">
              {["products", "reviews", "policies", "coupons", "tickets"].map((key) => (
                <div key={key} className="rounded-lg border bg-background px-3 py-2">
                  <div className="text-xs font-semibold uppercase text-muted-foreground">{key}</div>
                  <div className="mt-1 text-xl font-bold">{readiness?.counts?.[key] || 0}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Database className="h-4 w-4 text-emerald-600" />
                Vector Proof
              </div>
              {expectedProofs.length > 0 ? (
                <div className="space-y-2">
                  {expectedProofs.map(({ space, count, proof }) => (
                    <div key={space} className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm">
                      <div>
                        <div className="font-semibold">{space}</div>
                        <div className="text-xs text-muted-foreground">{count} vectors</div>
                      </div>
                      <Badge variant={proof?.found ? "default" : "secondary"}>
                        {proof?.found ? "retrievable" : proof?.checked ? "checked" : "not loaded"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                  No vector evidence is expected for this stage.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Evidence Comparison
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={copySmokeReport} disabled={runs.length === 0} className="gap-2">
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy Report"}
                </Button>
                <Button size="sm" variant="outline" onClick={clearRuns} disabled={runs.length === 0} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
              <RunSummary run={baselineRun} label="baseline" />
              <div className="hidden items-center justify-center lg:flex">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <RunSummary run={latestRun} label="latest" />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-semibold">Captured AI Fabric Runs</div>
              {runs.length === 0 ? (
                <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                  Run a prompt to capture the actual AI Fabric answer and evidence.
                </div>
              ) : (
                <div className="space-y-2">
                  {runs.slice().reverse().map((run) => (
                    <div key={run.id} className="rounded-lg border bg-background px-3 py-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">stage {run.stageNumber}</Badge>
                          <span className="text-sm font-semibold">{RAG_JOURNEY_PROMPTS[run.promptKey].label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary">{run.documents.length} docs</Badge>
                          {run.vectorSpaces.map((space) => (
                            <Badge key={`${run.id}-${space}`} variant="outline">
                              {space}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{compactText(run.answer, 220)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
