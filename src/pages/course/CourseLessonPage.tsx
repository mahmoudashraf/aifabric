import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  GitBranch,
  KeyRound,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CourseKnowledgeCheck } from "./components/CourseKnowledgeCheck";
import { CourseLayout } from "./components/CourseLayout";
import { CoursePathWorkspace } from "./components/CoursePathWorkspace";
import { CourseProviderSetup } from "./components/CourseProviderSetup";
import { CourseTheoryVideo } from "./components/CourseTheoryVideo";
import { useCourseProgress } from "./hooks/useCourseProgress";
import { hasTheory } from "./lib/completion";
import { courseCatalog, courseLessons, getLessonByRoute, getRenderedLesson, getTrack } from "./lib/courseCatalog";
import CourseUnavailablePage from "./CourseUnavailablePage";

const CourseLessonPage = () => {
  const location = useLocation();
  const lessonSummary = getLessonByRoute(location.pathname);
  const lesson = lessonSummary ? getRenderedLesson(lessonSummary.id) : null;
  const track = lesson ? getTrack(lesson.track) : null;
  const { progress, saveTheory, isError } = useCourseProgress(courseCatalog.courseVersion);

  useEffect(() => {
    if (!lesson) return undefined;
    document.title = `${lesson.title} | AI Fabric Course`;
    return () => {
      document.title = "AI Fabric";
    };
  }, [lesson]);

  if (!lesson) return <CourseUnavailablePage />;

  const lessonProgress = progress.find((entry) => entry.lessonId === lesson.id);
  const theoryRequired = hasTheory(lesson);
  const lessonIndex = courseLessons.findIndex((candidate) => candidate.id === lesson.id);
  const nextLesson = lessonIndex >= 0 ? courseLessons[lessonIndex + 1] : null;
  const published = lesson.availability === "published";
  const theoryCompleted = Boolean(lessonProgress?.videoCompletedAt);
  const starterUrl = `${courseCatalog.learnerRepository}/tree/${lesson.frontMatter.starterRef}`;
  const solutionUrl = `${courseCatalog.learnerRepository}/tree/${lesson.frontMatter.solutionRef}`;
  const sameCheckpoint = lesson.frontMatter.starterRef === lesson.frontMatter.solutionRef;
  const hasCheckpointLinks = lesson.frontMatter.starterRef !== "planned"
    && lesson.frontMatter.solutionRef !== "planned";
  const optionalProviderLabels = lesson.frontMatter.optionalProviderExercises.map((provider) =>
    provider === "openai" ? "Optional OpenAI exercise" : "Optional Qdrant Cloud exercise");
  const previewDescription = lesson.id === "qs-01"
    ? "The practical lesson source, assistant prompts, and knowledge check are available for review. This Quickstart intentionally has no theory-video gate. The executable starter and immutable solution refs still need publication, so this preview cannot yet count as complete."
    : hasCheckpointLinks && lesson.video?.status === "script-ready"
      ? `The executable checkpoint ${lesson.frontMatter.solutionRef} is verified, and the complete lesson, theory script, assistant paths, and knowledge check are ready. Completion remains disabled until the theory recording is reviewed and published.`
      : "The complete lesson, assigned theory recordings, assistant analysis prompts, and knowledge check are available for review. Progress can be practiced and saved, but completion remains disabled until the course publishes an immutable checkpoint.";

  return (
    <CourseLayout>
      <div className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-11">
        <header className="border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/course" className="hover:text-blue-700">Course</Link>
            <span>/</span>
            <span>{track?.title ?? lesson.track}</span>
            <span>/</span>
            <span>Lesson {lesson.frontMatter.order}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
              {lesson.availability === "published" ? "Published lesson" : "Preview lesson"}
            </Badge>
            <Badge variant="outline">AI Fabric {lesson.frontMatter.frameworkVersion}</Badge>
            <Badge variant="outline"><Clock3 className="mr-1 h-3.5 w-3.5" />{lesson.durationMinutes} minutes</Badge>
            <Badge className={lesson.frontMatter.requiresOpenAi
              ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"}>
              <KeyRound className="mr-1 h-3.5 w-3.5" />
              {lesson.frontMatter.requiresOpenAi ? "OpenAI key required" : "No external key required"}
            </Badge>
            {optionalProviderLabels.map((label) => (
              <Badge key={label} className="border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-50">
                {label}
              </Badge>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{lesson.description}</p>

          <div className={`mt-7 border-l-4 px-5 py-4 ${published ? "border-emerald-500 bg-emerald-50" : "border-amber-400 bg-amber-50"}`}>
            <div className="flex items-start gap-3">
              {published
                ? <GitBranch className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                : <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />}
              <div>
                <p className="font-bold text-slate-950">
                  {published ? "Executable learner checkpoint" : "What is ready in this preview"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {published
                    ? sameCheckpoint
                      ? `This analysis lesson uses ${lesson.frontMatter.starterRef} as its concrete application reference and does not require a code change.`
                      : `Begin at ${lesson.frontMatter.starterRef}. Use ${lesson.frontMatter.solutionRef} only after completing the lab to review your result.`
                    : previewDescription}
                </p>
                {hasCheckpointLinks && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-white" asChild>
                      <a href={courseCatalog.learnerRepository} target="_blank" rel="noopener noreferrer">
                        Learner repository
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white" asChild>
                      <a href={starterUrl} target="_blank" rel="noopener noreferrer">
                        {sameCheckpoint ? "Reference checkpoint" : "Starter checkpoint"}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    {!sameCheckpoint && (
                      <Button variant="outline" size="sm" className="bg-white" asChild>
                        <a href={solutionUrl} target="_blank" rel="noopener noreferrer">
                          Solution checkpoint
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <CourseProviderSetup lesson={lesson} />

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Lesson sections">
            {theoryRequired && (
              <Button variant="outline" size="sm" asChild><a href="#theory"><PlayCircle className="h-4 w-4" />Theory</a></Button>
            )}
            <Button variant="outline" size="sm" asChild><a href="#lesson-workspace"><BookOpen className="h-4 w-4" />Build paths</a></Button>
            <Button variant="outline" size="sm" asChild><a href="#knowledge-check"><FileCheck2 className="h-4 w-4" />Knowledge check</a></Button>
            <Button variant="outline" size="sm" asChild>
              <a href={lesson.sourceUrl} target="_blank" rel="noopener noreferrer">
                Canonical source
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </nav>
        </header>

        {isError && (
          <div className="mt-6 border-l-4 border-rose-500 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-900">
            Course content remains available, but saved progress could not be loaded. Check that the course
            Supabase migration has been applied before relying on cross-device progress.
          </div>
        )}

        {theoryRequired && (
          <CourseTheoryVideo
            lesson={lesson}
            progress={lessonProgress}
            saving={saveTheory.isPending}
            onMarkWatched={() =>
              saveTheory.mutateAsync({
                lessonId: lesson.id,
                questionScore: lessonProgress?.questionScore ?? null,
                passingScorePercent: lesson.knowledgeCheck.passingScorePercent,
                completionEligible: lesson.availability === "published",
              })
            }
          />
        )}

        <CoursePathWorkspace lesson={lesson} learnerRepository={courseCatalog.learnerRepository} />
        <CourseKnowledgeCheck lesson={lesson} progress={lessonProgress} />

        <section className="border-t border-border pt-9" aria-labelledby="completion-heading">
          <div className="flex items-center gap-3">
            {published
              ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              : <LockKeyhole className="h-5 w-5 text-amber-600" />}
            <h2 id="completion-heading" className="text-xl font-bold tracking-normal text-slate-950">
              {published ? "Complete this lesson" : "Publication-aware completion"}
            </h2>
          </div>
          <div className="mt-5 divide-y divide-border border-y border-border bg-white">
            {theoryRequired && (
              <div className="flex items-center justify-between gap-4 px-4 py-4">
                <span className="flex items-center gap-3 text-sm font-medium text-slate-800">
                  {published
                    ? <CheckCircle2 className={`h-4 w-4 ${theoryCompleted ? "text-emerald-600" : "text-slate-300"}`} />
                    : <LockKeyhole className="h-4 w-4 text-amber-600" />}
                  Watch the assigned theory recording{lesson.theoryVideoIds.length > 1 ? "s" : ""}
                </span>
                <span className={`text-xs font-semibold ${published ? "text-slate-600" : "text-amber-700"}`}>
                  {published ? theoryCompleted ? "Watched" : "Not watched" : "Blocked until publication"}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <span className="flex items-center gap-3 text-sm font-medium text-slate-800">
                <CheckCircle2 className={`h-4 w-4 ${lessonProgress?.questionScore !== null && lessonProgress?.questionScore !== undefined && lessonProgress.questionScore >= lesson.knowledgeCheck.passingScorePercent ? "text-emerald-600" : "text-slate-300"}`} />
                Pass the knowledge check
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {lessonProgress?.questionScore !== null && lessonProgress?.questionScore !== undefined
                  ? `${lessonProgress.questionScore}% saved`
                  : "Not saved"}
              </span>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <Button variant="outline" asChild><Link to="/course">Back to course overview</Link></Button>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase text-slate-500">Next required lesson</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {nextLesson
                  ? `${nextLesson.title}${nextLesson.availability === "planned" ? " · in preparation" : ""}`
                  : "Required course sequence complete"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </CourseLayout>
  );
};

export default CourseLessonPage;
