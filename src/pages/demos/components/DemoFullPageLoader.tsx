import { Activity, Loader2 } from "lucide-react";

interface DemoFullPageLoaderProps {
  title: string;
  description: string;
  steps?: string[];
}

export function DemoFullPageLoader({ title, description, steps = [] }: DemoFullPageLoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-normal">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {steps.length > 0 ? (
          <div className="mt-5 grid gap-2 text-left text-xs text-muted-foreground">
            {steps.map((step) => (
              <div key={step} className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
