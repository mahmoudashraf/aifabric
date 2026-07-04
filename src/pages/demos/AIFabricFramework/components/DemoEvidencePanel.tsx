import { Activity, AlertTriangle, Database, FileText, Loader2, RefreshCw, RotateCcw, Server, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DemoHealth, DemoReadiness } from "../types";
import type { MigrationProgress as MigrationProgressType } from "../hooks/useMigration";

interface DemoEvidencePanelProps {
  readiness: DemoReadiness | null;
  health: DemoHealth | null;
  lastStageResult?: any;
  stockFill: MigrationProgressType;
  policyMigration: MigrationProgressType;
  reviewMigration: MigrationProgressType;
  couponMigration: MigrationProgressType;
  ticketMigration: MigrationProgressType;
  isClearing: boolean;
  onRefresh: () => void;
  onSeedProducts: () => void;
  onSeedReviews: () => void;
  onSeedPolicies: () => void;
  onSeedCoupons: () => void;
  onSeedTickets: () => void;
  onSeedFull: () => void;
  onReset: () => void;
}

const countLabels: Record<string, string> = {
  products: "Products",
  reviews: "Reviews",
  policies: "Policies",
  coupons: "Coupons",
  tickets: "Tickets",
};

const stageButtons = [
  { key: "products", label: "Products" },
  { key: "reviews", label: "Reviews" },
  { key: "policies", label: "Policies" },
  { key: "coupons", label: "Coupons" },
  { key: "tickets", label: "Tickets" },
] as const;

export function DemoEvidencePanel({
  readiness,
  health,
  lastStageResult,
  stockFill,
  policyMigration,
  reviewMigration,
  couponMigration,
  ticketMigration,
  isClearing,
  onRefresh,
  onSeedProducts,
  onSeedReviews,
  onSeedPolicies,
  onSeedCoupons,
  onSeedTickets,
  onSeedFull,
  onReset,
}: DemoEvidencePanelProps) {
  const isRunning =
    stockFill.isRunning ||
    policyMigration.isRunning ||
    reviewMigration.isRunning ||
    couponMigration.isRunning ||
    ticketMigration.isRunning ||
    isClearing;

  const runningLabel =
    stockFill.currentItem ||
    policyMigration.currentItem ||
    reviewMigration.currentItem ||
    couponMigration.currentItem ||
    ticketMigration.currentItem ||
    (isClearing ? "Resetting demo data..." : "");

  const seedHandlers: Record<(typeof stageButtons)[number]["key"], () => void> = {
    products: onSeedProducts,
    reviews: onSeedReviews,
    policies: onSeedPolicies,
    coupons: onSeedCoupons,
    tickets: onSeedTickets,
  };

  const vectorSpaces = readiness?.vectorSpaces ? Object.values(readiness.vectorSpaces) : [];
  const counts = readiness?.counts || {};

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-blue-600" />
                Demo Evidence
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={readiness?.ready ? "default" : "secondary"}>
                  {readiness?.stage || "unknown"}
                </Badge>
                {readiness?.indexingQueueSize != null && (
                  <Badge variant="outline">{readiness.indexingQueueSize} queued</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(countLabels).map(([key, label]) => (
                <div key={key} className="rounded-lg border bg-background px-3 py-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-1 text-2xl font-bold">{counts[key] ?? 0}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {stageButtons.map((button) => (
                <Button key={button.key} size="sm" variant="outline" disabled={isRunning} onClick={seedHandlers[button.key]}>
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <Zap className="h-4 w-4 sm:mr-2" />}
                  <span>{button.label}</span>
                </Button>
              ))}
              <Button size="sm" disabled={isRunning} onClick={onSeedFull}>
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <Zap className="h-4 w-4 sm:mr-2" />}
                Full
              </Button>
              <Button size="sm" variant="outline" disabled={isRunning} onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                Refresh
              </Button>
              <Button size="sm" variant="destructive" disabled={isRunning} onClick={onReset}>
                {isClearing ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <RotateCcw className="h-4 w-4 sm:mr-2" />}
                Reset
              </Button>
            </div>

            {runningLabel && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">
                {runningLabel}
              </div>
            )}

            {readiness?.warnings && readiness.warnings.length > 0 && (
              <div className="space-y-2">
                {readiness.warnings.map((warning) => (
                  <div key={warning} className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5 text-slate-600" />
              Runtime
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">App</span>
              <span className="text-right font-semibold">{health?.app || "chat-capabilities-demo"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Version</span>
              <span className="text-right font-semibold">{health?.version || "unknown"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Commit</span>
              <span className="text-right font-mono text-xs">{health?.commit || "unknown"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Vector</span>
              <span className="text-right font-semibold">{health?.vectorProvider || "unknown"}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant={health?.chatSessionEnabled ? "default" : "secondary"}>chat session</Badge>
              <Badge variant={health?.ragEnabled ? "default" : "secondary"}>rag</Badge>
              <Badge variant={health?.dataSyncEnabled ? "default" : "secondary"}>data sync</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-emerald-600" />
            Vector Spaces
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vectorSpaces.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-3">
              {vectorSpaces.map((space) => (
                <div key={space.name} className="rounded-lg border bg-background px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{space.name}</span>
                    <Badge variant={space.present ? "default" : "secondary"}>{space.present ? "present" : "empty"}</Badge>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{space.vectorCount}</div>
                  {space.warning && <div className="mt-1 text-xs text-amber-700">{space.warning}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              No vector status reported yet.
            </div>
          )}
        </CardContent>
      </Card>

      {lastStageResult && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Last Operation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-48 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-50">
              {JSON.stringify(lastStageResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
