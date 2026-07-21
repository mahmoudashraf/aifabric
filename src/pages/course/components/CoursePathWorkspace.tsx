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

export const CoursePathWorkspace = ({ lesson }: { lesson: RenderedCourseLesson }) => {
  const analysisLesson = lesson.assistant.mode === "analyze";

  return (
    <section id="lesson-workspace" className="scroll-mt-32 py-9" aria-labelledby="workspace-heading">
      <div className="mb-5">
      <p className="text-xs font-bold uppercase text-blue-700">Choose your path</p>
      <h2 id="workspace-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
        {analysisLesson ? "Produce the architecture contract" : "Build the same behavior contract"}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        {analysisLesson
          ? "Manual and assistant paths use the same pinned sources, required artifacts, failure case, and review criteria."
          : "Manual and assistant paths share the same source version, expected evidence, failure case, and tests."}
      </p>
      </div>

      <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid h-11 w-full max-w-md grid-cols-2">
        <TabsTrigger value="manual" className="gap-2">
          <TerminalSquare className="h-4 w-4" />
          {analysisLesson ? "Analyze manually" : "Build manually"}
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
        <div className="border-l-4 border-amber-400 bg-amber-50 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-white">Mode: {lesson.assistant.mode}</Badge>
            <Badge variant="outline" className="bg-white">Validation: {lesson.assistant.validationStatus}</Badge>
            <Badge variant="outline" className="bg-white">Starter: {lesson.frontMatter.starterRef}</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {analysisLesson
              ? "This prompt produces the same architecture artifacts as the manual path. It remains marked planned until its output receives an independent framework-source review. Copying it does not change progress."
              : "This prompt is visible for review but remains marked planned until the standalone starter is published and the complete path passes from a clean checkout. Copying it does not change progress."}
          </p>
        </div>
        <PromptBlock title="Implementation prompt" prompt={lesson.assistant.implementationPrompt} />
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
