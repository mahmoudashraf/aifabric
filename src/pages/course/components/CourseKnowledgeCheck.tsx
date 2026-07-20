import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  LogIn,
  RefreshCcw,
  Save,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import { useCourseAuth } from "../hooks/useCourseAuth";
import { useCourseProgress } from "../hooks/useCourseProgress";
import { canSubmitKnowledgeCheck, scoreKnowledgeCheck } from "../lib/knowledgeCheck";
import type {
  KnowledgeAnswers,
  KnowledgeCheckResult,
  LessonProgress,
  RenderedCourseLesson,
} from "../types";

interface CourseKnowledgeCheckProps {
  lesson: RenderedCourseLesson;
  progress?: LessonProgress;
}

export const CourseKnowledgeCheck = ({ lesson, progress }: CourseKnowledgeCheckProps) => {
  const auth = useCourseAuth();
  const { saveKnowledge } = useCourseProgress(lesson.frontMatter.courseVersion ?? "");
  const [answers, setAnswers] = useState<KnowledgeAnswers>({});
  const [result, setResult] = useState<KnowledgeCheckResult | null>(null);
  const [saved, setSaved] = useState(false);

  const knowledgeCheck = lesson.knowledgeCheck;

  useEffect(() => {
    if (!progress?.questionsSubmittedAt || result) return;
    setAnswers(progress.questionAnswers);
    setResult(scoreKnowledgeCheck(knowledgeCheck, progress.questionAnswers));
    setSaved(true);
  }, [knowledgeCheck, progress, result]);

  const ready = useMemo(
    () => canSubmitKnowledgeCheck(knowledgeCheck, answers),
    [answers, knowledgeCheck],
  );

  const setSingleAnswer = (questionId: string, optionId: string) => {
    setResult(null);
    setSaved(false);
    setAnswers((current) => ({ ...current, [questionId]: [optionId] }));
  };

  const toggleMultipleAnswer = (questionId: string, optionId: string, checked: boolean) => {
    setResult(null);
    setSaved(false);
    setAnswers((current) => {
      const existing = current[questionId] ?? [];
      return {
        ...current,
        [questionId]: checked
          ? [...new Set([...existing, optionId])]
          : existing.filter((value) => value !== optionId),
      };
    });
  };

  const submit = async () => {
    const nextResult = scoreKnowledgeCheck(knowledgeCheck, answers);
    setResult(nextResult);
    setSaved(false);

    if (!auth.user) return;

    try {
      await saveKnowledge.mutateAsync({
        lessonId: lesson.id,
        answers,
        answered: nextResult.answered,
        score: nextResult.score,
        passed: nextResult.passed,
        videoCompletedAt: progress?.videoCompletedAt ?? null,
        theoryRequired: Boolean(lesson.video),
        completionEligible: lesson.availability === "published",
      });
      setSaved(true);
      toast.success("Knowledge-check result saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Result scored locally but could not be saved");
    }
  };

  const retry = () => {
    setResult(null);
    setSaved(false);
    setAnswers({});
  };

  return (
    <section id="knowledge-check" className="scroll-mt-32 border-t border-border py-10" aria-labelledby="knowledge-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-blue-700">Knowledge check</p>
          <h2 id="knowledge-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
            Prove the request flow
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This is an educational checkpoint with deterministic answers, not a secured examination.
          </p>
        </div>
        <Badge variant="outline">Pass at {knowledgeCheck.passingScorePercent}%</Badge>
      </div>

      <div className="mt-7 space-y-5">
        {knowledgeCheck.questions.map((question, questionIndex) => {
          const outcome = result?.outcomes[question.id];
          return (
            <fieldset
              key={question.id}
              className={cn(
                "rounded-md border bg-white p-5 sm:p-6",
                result && outcome === true && "border-emerald-300",
                result && outcome === false && "border-rose-300",
              )}
            >
              <legend className="sr-only">Question {questionIndex + 1}</legend>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
                  {questionIndex + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold leading-6 text-slate-950">{question.prompt}</p>
                    {result && outcome !== undefined && (
                      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", outcome ? "text-emerald-700" : "text-rose-700")}>
                        {outcome ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {outcome ? "Correct" : "Review"}
                      </span>
                    )}
                  </div>

                  {question.type === "single-choice" && (
                    <RadioGroup
                      value={answers[question.id]?.[0] ?? ""}
                      onValueChange={(value) => setSingleAnswer(question.id, value)}
                      className="mt-4 space-y-2"
                    >
                      {question.options?.map((option) => (
                        <Label
                          key={option.id}
                          htmlFor={`${question.id}-${option.id}`}
                          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border px-4 py-3 font-normal leading-5 text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/60"
                        >
                          <RadioGroupItem id={`${question.id}-${option.id}`} value={option.id} />
                          {option.text}
                        </Label>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "multiple-choice" && (
                    <div className="mt-4 space-y-2">
                      {question.options?.map((option) => {
                        const optionId = `${question.id}-${option.id}`;
                        return (
                          <Label
                            key={option.id}
                            htmlFor={optionId}
                            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border px-4 py-3 font-normal leading-5 text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/60"
                          >
                            <Checkbox
                              id={optionId}
                              checked={(answers[question.id] ?? []).includes(option.id)}
                              onCheckedChange={(checked) => toggleMultipleAnswer(question.id, option.id, checked === true)}
                            />
                            {option.text}
                          </Label>
                        );
                      })}
                    </div>
                  )}

                  {(question.type === "answer-reveal" || question.type === "implementation-defense") && (
                    <Label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-border p-4 font-normal text-slate-700">
                      <Checkbox
                        checked={(answers[question.id] ?? []).includes("reviewed")}
                        onCheckedChange={(checked) => toggleMultipleAnswer(question.id, "reviewed", checked === true)}
                      />
                      I reviewed the model answer or criteria against my implementation.
                    </Label>
                  )}

                  {result && question.explanation && (
                    <div className="mt-4 border-l-4 border-blue-400 bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-700">
                      {question.explanation}
                    </div>
                  )}
                  {result && question.modelAnswer && (
                    <div className="mt-4 border-l-4 border-emerald-400 bg-emerald-50 px-4 py-3 text-sm leading-6 text-slate-700">
                      <strong className="block text-slate-950">Model answer</strong>
                      {question.modelAnswer}
                    </div>
                  )}
                  {result && question.reviewCriteria?.length && (
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                      {question.reviewCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
                    </ul>
                  )}

                  {result && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.sourcePaths.map((source) => (
                        <a
                          key={source}
                          href={`https://github.com/Loom-AI-Labs/ai-fabric-framework/blob/${lesson.frontMatter.frameworkTag}/${source}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                        >
                          Source
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          );
        })}
      </div>

      {result && (
        <div className={cn("mt-6 flex flex-col gap-4 border-l-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between", result.passed ? "border-emerald-500 bg-emerald-50" : "border-amber-500 bg-amber-50")}>
          <div className="flex items-start gap-3">
            {result.passed ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" /> : <CircleAlert className="mt-0.5 h-5 w-5 text-amber-700" />}
            <div>
              <p className="font-bold text-slate-950">{result.passed ? "Checkpoint passed" : "Review and try again"}: {result.score}%</p>
              <p className="mt-1 text-sm text-slate-600">
                {result.correct} of {result.graded} graded questions correct.
                {saved ? " Result saved to your account." : auth.user ? " Save is pending." : " Sign in to save across devices."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!auth.user && (
              <Button
                variant="outline"
                size="sm"
                disabled={!auth.githubAvailable}
                title={auth.configurationIssue ?? undefined}
                onClick={() => void auth.signInWithGitHub().catch((error) => toast.error(error instanceof Error ? error.message : "GitHub sign-in failed"))}
              >
                <LogIn className="h-4 w-4" />
                Sign in to save
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {!result && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-slate-500">
            Explanations appear after submission. You can retry and the latest saved result replaces the prior one.
          </p>
          <Button disabled={!ready || saveKnowledge.isPending} onClick={() => void submit()}>
            <Save className="h-4 w-4" />
            {auth.user ? "Submit and save" : "Check my answers"}
          </Button>
        </div>
      )}
    </section>
  );
};
