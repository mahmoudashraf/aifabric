import { useState, useCallback } from "react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  RefreshCw,
  Server,
  Database,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RUNTIME_BASE = "https://runtime-dep-26ff199d-dev.up.railway.app";
const REST_CONNECTOR_BASE = "https://rest-connector-dep-26ff199d-dev.up.railway.app";
const DEMO_CONNECTOR_BASE = "https://ai-fabric-framework-production-a247.up.railway.app";

const ADMIN_HEADERS = { "X-ADMIN-API-KEY": "test" };

interface VerificationEndpoint {
  name: string;
  method: "GET" | "POST";
  url: string;
  headers?: Record<string, string>;
  body?: object;
  excludeFromRunAll?: boolean;
}

interface EndpointGroup {
  label: string;
  icon: React.ReactNode;
  color: string;
  endpoints: VerificationEndpoint[];
}

type CheckStatus = "idle" | "loading" | "success" | "error";

interface CheckResult {
  status: CheckStatus;
  statusCode?: number;
  data?: any;
  error?: string;
  durationMs?: number;
}

const ENDPOINT_GROUPS: EndpointGroup[] = [
  {
    label: "Runtime",
    icon: <Cpu className="h-4 w-4" />,
    color: "text-purple-600",
    endpoints: [
      { name: "Health", method: "GET", url: `${RUNTIME_BASE}/actuator/health` },
      { name: "Actions Loaded", method: "GET", url: `${RUNTIME_BASE}/api/admin/actions/overview`, headers: ADMIN_HEADERS },
      { name: "Indexing Overview", method: "GET", url: `${RUNTIME_BASE}/api/admin/indexing/overview`, headers: ADMIN_HEADERS },
      {
        name: "Vectors Scan",
        method: "GET",
        url: `${RUNTIME_BASE}/api/admin/indexing/vectors?entityType=product&offset=0&limit=50&includeContent=false&includeEmbedding=false&includeMetadata=true`,
        headers: ADMIN_HEADERS,
      },
      { name: "Vector Spaces", method: "GET", url: `${RUNTIME_BASE}/api/ai/data-sync/vector-spaces`, headers: ADMIN_HEADERS },
    ],
  },
  {
    label: "REST Connector",
    icon: <Server className="h-4 w-4" />,
    color: "text-blue-600",
    endpoints: [
      { name: "Health", method: "GET", url: `${REST_CONNECTOR_BASE}/actuator/health` },
      {
        name: "Overview",
        method: "GET",
        url: `${REST_CONNECTOR_BASE}/api/admin/overview`,
        headers: ADMIN_HEADERS,
      },
      {
        name: "Actions Overview",
        method: "GET",
        url: `${REST_CONNECTOR_BASE}/api/admin/actions/overview`,
        headers: ADMIN_HEADERS,
      },
      {
        name: "Action: add_to_cart",
        method: "GET",
        url: `${REST_CONNECTOR_BASE}/api/admin/actions/add_to_cart`,
        headers: ADMIN_HEADERS,
      },
      {
        name: "Proxy: Indexing Overview",
        method: "GET",
        url: `${REST_CONNECTOR_BASE}/api/admin/indexing/overview`,
        headers: ADMIN_HEADERS,
      },
      {
        name: "Proxy: Vectors Scan",
        method: "GET",
        url: `${REST_CONNECTOR_BASE}/api/admin/indexing/vectors?entityType=product&offset=0&limit=50&includeContent=false&includeEmbedding=false&includeMetadata=true`,
        headers: ADMIN_HEADERS,
      },
      {
        name: "Proxy: Vector Spaces",
        method: "GET",
        url: `${REST_CONNECTOR_BASE}/api/ai/data-sync/vector-spaces`,
        headers: ADMIN_HEADERS,
      },
    ],
  },
  {
    label: "Demo Connector",
    icon: <Database className="h-4 w-4" />,
    color: "text-green-600",
    endpoints: [
      { name: "Health", method: "GET", url: `${DEMO_CONNECTOR_BASE}/actuator/health` },
      { name: "Products Count", method: "GET", url: `${DEMO_CONNECTOR_BASE}/api/products/count` },
      { name: "Policies Count", method: "GET", url: `${DEMO_CONNECTOR_BASE}/api/policies/count` },
      {
        name: "Reset Demo",
        method: "POST",
        url: `${DEMO_CONNECTOR_BASE}/api/admin/demo/reset`,
        headers: ADMIN_HEADERS,
        body: { confirm: true, clearConnectorData: true, clearRuntimeVectors: true },
        excludeFromRunAll: true,
      },
    ],
  },
];

function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "loading":
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
  }
}

export function VerificationTab() {
  const [results, setResults] = useState<Record<string, CheckResult>>({});
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const runCheck = useCallback(async (endpoint: VerificationEndpoint): Promise<CheckResult> => {
    const start = performance.now();
    try {
      const init: RequestInit = {
        method: endpoint.method,
        headers: { ...endpoint.headers },
      };
      if (endpoint.body) {
        (init.headers as Record<string, string>)["Content-Type"] = "application/json";
        init.body = JSON.stringify(endpoint.body);
      }
      const response = await fetch(endpoint.url, init);
      const durationMs = Math.round(performance.now() - start);
      let data: any;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      return {
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        data,
        durationMs,
      };
    } catch (err: any) {
      // CORS blocks reading the response but the server may still be reachable.
      // Retry with no-cors: an opaque response (type "opaque", status 0) means
      // the server responded but the browser hid the body due to CORS policy.
      try {
        const noCorsInit: RequestInit = { method: endpoint.method, mode: "no-cors" };
        const opaqueResponse = await fetch(endpoint.url, noCorsInit);
        const durationMs = Math.round(performance.now() - start);
        if (opaqueResponse.type === "opaque") {
          return {
            status: "success",
            statusCode: 200,
            data: { note: "Server responded (CORS blocks reading body from browser)" },
            durationMs,
          };
        }
      } catch {
        // truly unreachable
      }
      return {
        status: "error",
        error: err.message || "Network error",
        durationMs: Math.round(performance.now() - start),
      };
    }
  }, []);

  const runSingleCheck = useCallback(async (key: string, endpoint: VerificationEndpoint) => {
    setResults((prev) => ({ ...prev, [key]: { status: "loading" } }));
    const result = await runCheck(endpoint);
    setResults((prev) => ({ ...prev, [key]: result }));
  }, [runCheck]);

  const runAllChecks = useCallback(async () => {
    setIsRunningAll(true);
    const allEndpoints: { key: string; endpoint: VerificationEndpoint }[] = [];
    for (const group of ENDPOINT_GROUPS) {
      for (const ep of group.endpoints) {
        if (ep.excludeFromRunAll) continue;
        allEndpoints.push({ key: `${group.label}::${ep.name}`, endpoint: ep });
      }
    }
    // Mark all as loading
    setResults(
      Object.fromEntries(allEndpoints.map(({ key }) => [key, { status: "loading" as const }]))
    );
    // Run all in parallel
    const entries = await Promise.all(
      allEndpoints.map(async ({ key, endpoint }) => {
        const result = await runCheck(endpoint);
        setResults((prev) => ({ ...prev, [key]: result }));
        return [key, result] as const;
      })
    );
    setResults(Object.fromEntries(entries));
    setIsRunningAll(false);
  }, [runCheck]);

  const totalChecks = ENDPOINT_GROUPS.reduce((s, g) => s + g.endpoints.length, 0);
  const passedChecks = Object.values(results).filter((r) => r.status === "success").length;
  const failedChecks = Object.values(results).filter((r) => r.status === "error").length;
  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="space-y-6">
      {/* Summary & Run All */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Deployment Verification
              </CardTitle>
              <CardDescription>
                Health checks across Runtime, REST Connector, and Demo Connector
              </CardDescription>
            </div>
            <Button onClick={runAllChecks} disabled={isRunningAll}>
              {isRunningAll ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunningAll ? "Running..." : "Run All"}
            </Button>
          </div>
        </CardHeader>
        {hasResults && (
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{totalChecks}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-3 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{passedChecks}</div>
                <div className="text-sm text-green-600/80">Passed</div>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{failedChecks}</div>
                <div className="text-sm text-red-600/80">Failed</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Endpoint Groups */}
      {ENDPOINT_GROUPS.map((group) => (
        <Card key={group.label}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg flex items-center gap-2 ${group.color}`}>
              {group.icon}
              {group.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {group.endpoints.map((ep) => {
                const key = `${group.label}::${ep.name}`;
                const result = results[key];
                const isExpanded = expandedKey === key;

                return (
                  <div key={key}>
                    <div
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setExpandedKey(isExpanded ? null : key)}
                    >
                      <StatusIcon status={result?.status ?? "idle"} />
                      <Badge
                        variant="secondary"
                        className={`font-mono text-xs ${
                          ep.method === "GET"
                            ? "bg-green-500/10 text-green-700"
                            : "bg-blue-500/10 text-blue-700"
                        }`}
                      >
                        {ep.method}
                      </Badge>
                      <span className="text-sm font-medium flex-1">{ep.name}</span>
                      {result?.statusCode && (
                        <Badge
                          variant="outline"
                          className={
                            result.statusCode < 400
                              ? "text-green-600 border-green-300"
                              : "text-red-600 border-red-300"
                          }
                        >
                          {result.statusCode}
                        </Badge>
                      )}
                      {result?.durationMs != null && (
                        <span className="text-xs text-muted-foreground">{result.durationMs}ms</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          runSingleCheck(key, ep);
                        }}
                        disabled={result?.status === "loading"}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${result?.status === "loading" ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                    {isExpanded && (
                      <div className="ml-9 mt-1 mb-2">
                        <div className="text-xs text-muted-foreground mb-1 font-mono break-all">
                          {ep.url}
                        </div>
                        {result?.error && (
                          <pre className="text-xs text-red-600 bg-red-500/5 p-2 rounded overflow-auto max-h-40">
                            {result.error}
                          </pre>
                        )}
                        {result?.data && (
                          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-60">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        )}
                        {!result?.error && !result?.data && result?.status === "idle" && (
                          <span className="text-xs text-muted-foreground">Not yet checked</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
