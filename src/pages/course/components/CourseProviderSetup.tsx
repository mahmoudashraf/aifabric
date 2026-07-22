import { Cloud, Container, KeyRound, Laptop, ServerCog, ShieldCheck, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import type { RenderedCourseLesson } from "../types";

const OPENAI_ENV = `OPENAI_ENABLED=true
OPENAI_API_KEY=<set in your secret store>
AI_ORCHESTRATION_MODEL=gpt-4o-mini
AI_GENERATION_MODEL=gpt-4o-mini`;

const QDRANT_ENV = `AI_PROVIDERS_QDRANT_HOST=https://<cluster-host>
AI_PROVIDERS_QDRANT_GRPC_PORT=6334
AI_PROVIDERS_QDRANT_API_KEY=<set in your secret store>
AI_PROVIDERS_QDRANT_PREFER_GRPC=true`;

const SetupStep = ({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) => (
  <div className="border-t border-slate-200 py-4 first:border-t-0">
    <div className="flex items-center gap-2 font-bold text-slate-950">
      <Icon className="h-4 w-4 text-blue-700" />
      {title}
    </div>
    <div className="mt-2 text-sm leading-6 text-slate-600">{children}</div>
  </div>
);

export const CourseProviderSetup = ({ lesson }: { lesson: RenderedCourseLesson }) => {
  const providers = lesson.frontMatter.optionalProviderExercises;
  if (!lesson.frontMatter.requiresDocker && providers.length === 0) return null;

  const openAi = providers.includes("openai");
  const providerName = openAi ? "OpenAI" : "Qdrant Cloud";
  const envBlock = openAi ? OPENAI_ENV : QDRANT_ENV;

  return (
    <section className="mt-6 border-y border-slate-200 bg-slate-50 px-5" aria-label="Lesson runtime setup">
      <Accordion type="single" collapsible>
        <AccordionItem value="provider-setup" className="border-b-0">
          <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
            <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span className="font-bold text-slate-950">Runtime and optional provider setup</span>
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Required path is keyless
              </Badge>
              {lesson.frontMatter.requiresDocker && (
                <Badge variant="outline" className="bg-white">
                  <Container className="mr-1 h-3.5 w-3.5" />
                  Docker required
                </Badge>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="max-w-3xl text-sm leading-6 text-slate-700">
              Complete the required lab without a hosted-provider credential. The configuration below
              is an optional {providerName} exercise and remains separate from keyless completion evidence.
            </p>

            <pre className="mt-4 overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
              {envBlock}
            </pre>

            <div className="mt-4 grid gap-x-8 md:grid-cols-2">
              <SetupStep icon={Laptop} title="Terminal or IDE">
                Set these values in your current shell or private IDE run configuration. Do not add
                them to shared launch files.
              </SetupStep>
              <SetupStep icon={Container} title="Docker">
                Pass the secret at runtime with <code className="font-mono text-xs">--env</code> or a
                protected Compose environment source. Keep it out of image layers and build arguments.
              </SetupStep>
              <SetupStep icon={Workflow} title="Continuous integration">
                Map the credential from your CI secret store and retain keyed output as a separately
                named artifact. A missing secret should report not run or fail according to the gate.
              </SetupStep>
              <SetupStep icon={Cloud} title="Deployment">
                Configure the value in the deployment platform's encrypted environment UI. Rotate it
                there without changing source code.
              </SetupStep>
              <SetupStep icon={ServerCog} title="Runtime proof">
                Verify effective provider and model posture through safe diagnostics, then execute the
                lesson's real request. Process startup alone is not provider proof.
              </SetupStep>
              <SetupStep icon={KeyRound} title="Secret boundary">
                Do not place credentials in browser fields, course progress, HTTP examples, logs,
                screenshots, health responses, or generated evidence files.
              </SetupStep>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
