import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Container,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  HardDrive,
  Layers3,
  ListChecks,
  Monitor,
  PlugZap,
  Route,
  Server,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  DemoArchitectureStageTone,
  DemoBackendArchitectureConfig,
  DemoBackendArchitectureTone,
  DemoDeveloperDetails,
} from "./demoBackendArchitectures";

interface DemoBackendArchitectureProps {
  architecture: DemoBackendArchitectureConfig;
  className?: string;
}

const toneClasses: Record<DemoBackendArchitectureTone, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  candidate: "border-amber-200 bg-amber-50 text-amber-700",
  concept: "border-slate-200 bg-slate-50 text-slate-700",
};

const diagramToneClasses: Record<
  DemoArchitectureStageTone,
  { card: string; icon: string; badge: string }
> = {
  ui: {
    card: "border-sky-200 bg-sky-50/70",
    icon: "bg-sky-600 text-white",
    badge: "border-sky-200 bg-sky-100 text-sky-800",
  },
  api: {
    card: "border-emerald-200 bg-emerald-50/70",
    icon: "bg-emerald-600 text-white",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-800",
  },
  framework: {
    card: "border-violet-200 bg-violet-50/70",
    icon: "bg-violet-600 text-white",
    badge: "border-violet-200 bg-violet-100 text-violet-800",
  },
  rag: {
    card: "border-amber-200 bg-amber-50/70",
    icon: "bg-amber-600 text-white",
    badge: "border-amber-200 bg-amber-100 text-amber-900",
  },
  provider: {
    card: "border-fuchsia-200 bg-fuchsia-50/70",
    icon: "bg-fuchsia-600 text-white",
    badge: "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-800",
  },
  storage: {
    card: "border-slate-200 bg-slate-50/80",
    icon: "bg-slate-700 text-white",
    badge: "border-slate-200 bg-slate-100 text-slate-800",
  },
  guard: {
    card: "border-rose-200 bg-rose-50/70",
    icon: "bg-rose-600 text-white",
    badge: "border-rose-200 bg-rose-100 text-rose-800",
  },
};

const diagramIcons: Record<DemoArchitectureStageTone, typeof Layers3> = {
  ui: Monitor,
  api: Server,
  framework: BrainCircuit,
  rag: Workflow,
  provider: Cpu,
  storage: HardDrive,
  guard: ShieldCheck,
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

function ArchitectureDiagram({ architecture }: { architecture: DemoBackendArchitectureConfig }) {
  if (!architecture.diagram?.length) {
    return null;
  }

  return (
    <div className="mb-5 rounded-xl border border-border/70 bg-background p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Workflow className="h-4 w-4 text-primary" />
            Architecture Diagram
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Developer request flow from the public UI into the deployed AI Fabric backend.
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-1 bg-muted/40">
          <Code2 className="h-3.5 w-3.5" />
          Runtime map
        </Badge>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
        {architecture.diagram.map((stage, index) => {
          const tone = diagramToneClasses[stage.tone];
          const Icon = diagramIcons[stage.tone];

          return (
            <div key={stage.title} className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row">
              <div className={`min-w-0 flex-1 rounded-lg border p-4 ${tone.card}`}>
                <div className="mb-3 flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold">{stage.title}</h3>
                    <Badge variant="outline" className={`mt-1 text-[11px] ${tone.badge}`}>
                      {stage.subtitle}
                    </Badge>
                  </div>
                </div>

                <ul className="space-y-2">
                  {stage.items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {index < (architecture.diagram?.length || 0) - 1 ? (
                <div className="hidden items-center justify-center xl:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DevValue({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Layers3;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="break-all rounded-md bg-muted/40 px-2 py-1.5 font-mono text-xs text-foreground">
        {value}
      </div>
    </div>
  );
}

function DevList({
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
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="break-words rounded-md bg-muted/40 px-2 py-1.5 font-mono text-xs text-muted-foreground">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function DeveloperDetails({ developer }: { developer?: DemoDeveloperDetails }) {
  if (!developer) {
    return null;
  }

  return (
    <div className="mb-5 rounded-xl border border-border/70 bg-muted/20 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Terminal className="h-4 w-4 text-primary" />
            Developer Integration Notes
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Repo paths, deploy entry points, API contract, runtime variables, and files to inspect first.
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-1 bg-background">
          <FileCode2 className="h-3.5 w-3.5" />
          Code-backed
        </Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <DevValue label="Backend app" value={developer.sourcePath} icon={GitBranch} />
        <DevValue label="Dockerfile" value={developer.dockerfilePath} icon={Container} />
        <DevValue label="Health proof" value={developer.healthEndpoint} icon={ShieldCheck} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <DevList title="Primary Endpoints" items={developer.primaryEndpoints} icon={Route} />
        <DevList title="Local Run Notes" items={developer.localRun} icon={Terminal} />
        <DevList title="Runtime Env Vars" items={developer.envVars} icon={ListChecks} />
        <DevList title="Code Hotspots" items={developer.codeHotspots} icon={FileCode2} />
      </div>
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

      <ArchitectureDiagram architecture={architecture} />

      <DeveloperDetails developer={architecture.developer} />

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
