import {
  Database,
  GitBranch,
  Layers3,
  PlugZap,
  Route,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { DemoBackendArchitectureConfig, DemoBackendArchitectureTone } from "./demoBackendArchitectures";

interface DemoBackendArchitectureProps {
  architecture: DemoBackendArchitectureConfig;
  className?: string;
}

const toneClasses: Record<DemoBackendArchitectureTone, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  candidate: "border-amber-200 bg-amber-50 text-amber-700",
  concept: "border-slate-200 bg-slate-50 text-slate-700",
};

function DetailGroup({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof Layers3;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-background p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DemoBackendArchitecture({ architecture, className = "" }: DemoBackendArchitectureProps) {
  return (
    <section className={`rounded-xl border border-border/70 bg-card p-5 shadow-sm md:p-6 ${className}`}>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`gap-1 ${toneClasses[architecture.tone]}`}>
              <Server className="h-3 w-3" />
              {architecture.status}
            </Badge>
            <Badge variant="outline" className="gap-1 bg-background">
              <GitBranch className="h-3 w-3" />
              {architecture.backendApp}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-normal">{architecture.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{architecture.summary}</p>
        </div>

        <div className="min-w-0 rounded-lg border border-border/70 bg-background p-3 text-sm lg:w-[360px]">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <Route className="h-4 w-4 text-primary" />
            UI and runtime
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            {architecture.uiRoutes.map((route) => (
              <div key={route} className="truncate rounded-md bg-muted/40 px-2 py-1 font-mono">
                {route}
              </div>
            ))}
            <div className="break-all rounded-md bg-muted/40 px-2 py-1 font-mono">
              {architecture.publicBackend || "No live backend URL wired to this page today"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DetailGroup title="Backend Dependencies" items={architecture.dependencies} icon={Server} />
        <DetailGroup title="AI Fabric Modules" items={architecture.modules} icon={Layers3} />
        <DetailGroup title="AI Entities and Actions" items={architecture.aiSurface} icon={ShieldCheck} />
        <DetailGroup title="Providers and Storage" items={architecture.providers} icon={Database} />
      </div>

      <div className="mt-4 rounded-lg border border-border/70 bg-background p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Workflow className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold">AI Data and Request Flow</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {architecture.flow.map((step, index) => (
            <div key={step} className="rounded-md border border-border/60 bg-muted/20 p-3">
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <PlugZap className="h-4 w-4 shrink-0" />
        <span>
          This section describes the backend used or intended by this UI demo; live AI claims should match the runtime status shown by the page.
        </span>
      </div>
    </section>
  );
}
