import { Check, Clipboard, Code2, ExternalLink, TerminalSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { RenderedCourseLesson } from "../types";
import { prepareLessonMarkdown } from "../lib/markdown";
import { CourseMarkdown } from "./CourseMarkdown";

const PromptBlock = ({ title, prompt }: { title: string; prompt: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success(`${title} copied`);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold tracking-normal text-slate-950">{title}</h3>
        <Button variant="outline" size="sm" onClick={() => void copy()}>
          {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          {copied ? "Copied" : "Copy prompt"}
        </Button>
      </div>
      <pre className="max-h-[520px] overflow-auto rounded-md border border-slate-700 bg-slate-950 p-5 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-200">
        {prompt}
      </pre>
    </section>
  );
};

export const CoursePathWorkspace = ({
  lesson,
  learnerRepository,
}: {
  lesson: RenderedCourseLesson;
  learnerRepository: string;
}) => {
  const analysisLesson = lesson.assistant.mode === "analyze";
  const verificationLesson = lesson.assistant.mode === "verify";
  const assistantValidated = lesson.assistant.validationStatus === "passed";
  const starterUrl = `${learnerRepository}/tree/${lesson.frontMatter.starterRef}`;
  const workspaceTitle = analysisLesson
    ? "Produce the architecture contract"
    : verificationLesson
      ? "Run the release gate"
      : "Build the same behavior contract";
  const manualTabLabel = analysisLesson
    ? "Analyze manually"
    : verificationLesson
      ? "Verify manually"
      : "Build manually";

  return (
    <section id="lesson-workspace" className="scroll-mt-32 py-9" aria-labelledby="workspace-heading">
      <div className="mb-5">
      <p className="text-xs font-bold uppercase text-blue-700">Choose your path</p>
      <h2 id="workspace-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
        {workspaceTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        {analysisLesson
          ? "Manual and assistant paths use the same pinned sources, required artifacts, failure case, and review criteria."
          : verificationLesson
            ? "Manual and assistant paths use the same release matrix, commands, retained evidence, and decision criteria."
            : "Manual and assistant paths share the same source version, expected evidence, failure case, and tests."}
      </p>
      </div>

      <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid h-11 w-full max-w-md grid-cols-2">
        <TabsTrigger value="manual" className="gap-2">
          <TerminalSquare className="h-4 w-4" />
          {manualTabLabel}
        </TabsTrigger>
        <TabsTrigger value="assistant" className="gap-2">
          <Code2 className="h-4 w-4" />
          Use an assistant
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manual" className="mt-7">
        <CourseMarkdown markdown={prepareLessonMarkdown(lesson.markdown)} />
      </TabsContent>
      <TabsContent value="assistant" className="mt-7 space-y-8">
        <div className={`border-l-4 px-5 py-4 ${assistantValidated ? "border-emerald-500 bg-emerald-50" : "border-amber-400 bg-amber-50"}`}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-white">Mode: {lesson.assistant.mode}</Badge>
            <Badge variant="outline" className="bg-white">Validation: {lesson.assistant.validationStatus}</Badge>
            <Badge variant="outline" className="bg-white">Starter: {lesson.frontMatter.starterRef}</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {assistantValidated
              ? analysisLesson
                ? "This prompt has been validated against the published application shape and produces the same architecture artifacts as the manual path. You remain responsible for reviewing and explaining its output."
                : verificationLesson
                  ? "This prompt has been validated against the published release-gate checkpoint. It audits the same commands, evidence, and decision criteria as the manual path."
                  : "This prompt has been validated from the declared starter against the same behavioral contract as the manual path. Review every change and run the tests before accepting it."
              : "This assistant path is available for review but has not completed independent checkpoint validation."}
          </p>
          <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
            <a href={starterUrl} target="_blank" rel="noopener noreferrer">
              Open declared starter
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
        <PromptBlock
          title={verificationLesson ? "Verification prompt" : "Implementation prompt"}
          prompt={lesson.assistant.implementationPrompt}
        />
        <PromptBlock title="Independent review prompt" prompt={lesson.assistant.reviewPrompt} />
        <Button variant="outline" asChild>
          <a href={lesson.sourceUrl} target="_blank" rel="noopener noreferrer">
            Inspect canonical lesson source
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </TabsContent>
      </Tabs>
    </section>
  );
};
