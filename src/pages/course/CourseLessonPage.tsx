import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CourseKnowledgeCheck } from "./components/CourseKnowledgeCheck";
import { CourseLayout } from "./components/CourseLayout";
import { CoursePathWorkspace } from "./components/CoursePathWorkspace";
import { CourseTheoryVideo } from "./components/CourseTheoryVideo";
import { useCourseProgress } from "./hooks/useCourseProgress";
import { courseCatalog, getRenderedLesson } from "./lib/courseCatalog";

const renderedLesson = getRenderedLesson("qs-01");
if (!renderedLesson) throw new Error("QS-01 generated course content is missing");
const lesson = renderedLesson;

const CourseLessonPage = () => {
  const { progress, saveTheory, isError } = useCourseProgress(courseCatalog.courseVersion);
  const lessonProgress = progress.find((entry) => entry.lessonId === lesson.id);

  useEffect(() => {
    document.title = `${lesson.title} | AI Fabric Course`;
    return () => {
      document.title = "AI Fabric";
    };
  }, []);

  return (
    <CourseLayout>
      <div className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-11">
        <header className="border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/course" className="hover:text-blue-700">Course</Link>
            <span>/</span>
            <span>Quickstart</span>
            <span>/</span>
            <span>Lesson 1</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">Preview lesson</Badge>
            <Badge variant="outline">AI Fabric {lesson.frontMatter.frameworkVersion}</Badge>
            <Badge variant="outline"><Clock3 className="mr-1 h-3.5 w-3.5" />{lesson.durationMinutes} minutes</Badge>
          </div>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{lesson.description}</p>

          <div className="mt-7 border-l-4 border-amber-400 bg-amber-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <p className="font-bold text-slate-950">What is ready in this preview</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  The architecture, lesson source, assistant prompts, and knowledge check are available for
                  review. The executable starter, solution refs, and approved theory recording remain publication
                  gates, so this lesson cannot yet count as complete.
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Lesson sections">
            <Button variant="outline" size="sm" asChild><a href="#theory"><PlayCircle className="h-4 w-4" />Theory</a></Button>
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

        <CourseTheoryVideo
          lesson={lesson}
          progress={lessonProgress}
          saving={saveTheory.isPending}
          onMarkWatched={() =>
            saveTheory.mutateAsync({
              lessonId: lesson.id,
              questionScore: lessonProgress?.questionScore ?? null,
              passingScorePercent: lesson.knowledgeCheck.passingScorePercent,
            })
          }
        />

        <CoursePathWorkspace lesson={lesson} />
        <CourseKnowledgeCheck lesson={lesson} progress={lessonProgress} />

        <section className="border-t border-border pt-9" aria-labelledby="completion-heading">
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-amber-600" />
            <h2 id="completion-heading" className="text-xl font-bold tracking-normal text-slate-950">Publication-aware completion</h2>
          </div>
          <div className="mt-5 divide-y divide-border border-y border-border bg-white">
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <span className="flex items-center gap-3 text-sm font-medium text-slate-800">
                <LockKeyhole className="h-4 w-4 text-amber-600" />
                Watch the approved theory recording
              </span>
              <span className="text-xs font-semibold text-amber-700">Blocked until publication</span>
            </div>
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
              <p className="mt-1 text-sm font-bold text-slate-900">AI Fabric Mental Model · in preparation</p>
            </div>
          </div>
        </section>
      </div>
    </CourseLayout>
  );
};

export default CourseLessonPage;
