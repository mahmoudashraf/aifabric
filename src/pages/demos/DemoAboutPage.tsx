import { ArrowLeft, ExternalLink, Info, Play, Server } from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "@/components/Footer";
import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoBackendArchitecture } from "./components/DemoBackendArchitecture";
import type { DemoBackendArchitectureConfig } from "./components/demoBackendArchitectures";

interface DemoAboutPageProps {
  architecture: DemoBackendArchitectureConfig;
  demoLabel: string;
  demoPath: string;
}

export default function DemoAboutPage({ architecture, demoLabel, demoPath }: DemoAboutPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-24">
        <section className="container mx-auto px-4">
          <Link
            to={demoPath}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {demoLabel}
          </Link>

          <div className="mb-8 rounded-xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-4 gap-1 border-blue-200 bg-blue-50 text-blue-700">
                  <Info className="h-3.5 w-3.5" />
                  About this demo
                </Badge>
                <h1 className="text-3xl font-bold tracking-normal md:text-5xl">{demoLabel}</h1>
                <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                  Developer map for the deployed demo: request flow, backend app, Docker entry point,
                  AI Fabric modules, provider wiring, API routes, and the code files to inspect first.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to={demoPath}>
                    <Play className="mr-2 h-4 w-4" />
                    Open live demo
                  </Link>
                </Button>
                {architecture.publicBackend ? (
                  <Button asChild variant="outline">
                    <a href={architecture.publicBackend} target="_blank" rel="noreferrer">
                      <Server className="mr-2 h-4 w-4" />
                      Backend
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <DemoBackendArchitecture architecture={architecture} />
        </section>
      </main>

      <ConsultationCtaBand
        compact
        className="bg-background pb-10"
        title={`Want to adapt ${demoLabel} to your app?`}
        body="Book a free AI Fabric architecture discussion to turn this demo architecture into a realistic proof-of-concept plan for your own Spring Boot system."
      />

      <Footer />
    </div>
  );
}
