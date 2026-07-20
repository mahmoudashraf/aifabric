import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  GitBranch,
  GraduationCap,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { CourseAuthButton } from "./components/CourseAuthButton";
import { CourseLayout } from "./components/CourseLayout";
import { useCourseAuth } from "./hooks/useCourseAuth";
import { useCourseProgress } from "./hooks/useCourseProgress";
import {
  availableDurationMinutes,
  courseCatalog,
  courseDurationMinutes,
  courseTracks,
  previewLessons,
  requiredLessons,
} from "./lib/courseCatalog";
import { calculateCourseProgress } from "./lib/completion";

const flowSteps = [
  { label: "Search", detail: "Semantic evidence", icon: Database, tone: "bg-blue-50 text-blue-700" },
  { label: "Ground", detail: "RAG with sources", icon: BookOpenCheck, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Act", detail: "Governed writes", icon: GitBranch, tone: "bg-amber-50 text-amber-800" },
  { label: "Remember", detail: "Backend sessions", icon: MessageSquareText, tone: "bg-cyan-50 text-cyan-700" },
  { label: "Protect", detail: "Tenant + PII policy", icon: ShieldCheck, tone: "bg-rose-50 text-rose-700" },
  { label: "Ship", detail: "Release evidence", icon: TestTube2, tone: "bg-slate-100 text-slate-700" },
];

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${minutes} min`;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
};

const CourseHubPage = () => {
  const auth = useCourseAuth();
  const { progress } = useCourseProgress(courseCatalog.courseVersion);
  const progressPercent = calculateCourseProgress(
    requiredLessons.map((lesson) => lesson.id),
    progress,
  );
  const completedLessons = progress.filter((entry) => entry.completedAt).length;

  return (
    <CourseLayout>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <section className="grid gap-9 border-b border-border pb-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Course beta
              </Badge>
              <Badge variant="outline">AI Fabric {courseCatalog.frameworkVersion}</Badge>
              <Badge variant="outline">Java {courseCatalog.javaVersion}</Badge>
              <Badge variant="outline">Spring Boot {courseCatalog.springBootVersion}</Badge>
            </div>
            <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
              {courseCatalog.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {courseCatalog.subtitle}. Build one support assistant from its first useful result through
              production verification.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link to="/course/quickstart">
                  Start Quickstart
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {!auth.user && <CourseAuthButton />}
              {auth.user && (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/course/progress">View my progress</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="border-l-4 border-emerald-500 bg-white px-5 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-700">Available now</p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">QS-01: First Useful Result</h2>
              </div>
              <BookOpenCheck className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Trace a local semantic-search flow, inspect ownership, and pass the first knowledge check.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />75 minutes</span>
              <span>No cloud key</span>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-b border-border py-9 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-bold uppercase text-blue-700">One continuing application</p>
            <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-950">Build capability in layers</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Each required lesson extends the same Support Knowledge Assistant, keeping the domain stable
              while the AI workflow grows.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative border border-border bg-white p-4">
                  <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-md", step.tone)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-4 text-sm font-bold text-slate-900">{step.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="py-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase text-blue-700">Learning path</p>
              <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-950">Five focused tracks</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                The catalog is visible so you can assess the complete path. Only reviewed lesson material is
                available to open.
              </p>
            </div>
            <div className="flex gap-7 text-sm">
              <span><strong className="block text-xl text-slate-950">{previewLessons.length}</strong>preview lesson</span>
              <span><strong className="block text-xl text-slate-950">{courseTracks.length}</strong>tracks</span>
              <span><strong className="block text-xl text-slate-950">{formatDuration(courseDurationMinutes)}</strong>planned</span>
            </div>
          </div>

          {auth.user && (
            <div className="mt-7 flex items-center gap-5 border-y border-border bg-white px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-slate-900">Required course progress</span>
                  <span className="text-slate-500">{completedLessons} complete</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-700">{progressPercent}%</span>
            </div>
          )}

          <div className="mt-7 divide-y divide-border border-y border-border bg-white">
            {courseTracks.map((track, trackIndex) => {
              const available = track.lessons.filter((lesson) => lesson.availability !== "planned");
              const trackCompleted = track.lessons.filter((lesson) =>
                progress.some((entry) => entry.lessonId === lesson.id && entry.completedAt),
              ).length;
              return (
                <article key={track.id} className="grid gap-5 px-5 py-6 md:grid-cols-[70px_240px_minmax(0,1fr)_auto] md:items-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 font-mono text-sm font-bold text-white">
                    {String(trackIndex + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-950">{track.title}</h3>
                      {track.required && <Badge variant="outline" className="text-[10px]">Required</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {track.lessons.length} lessons · {trackCompleted} complete
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{track.description}</p>
                  <div className="justify-self-start md:justify-self-end">
                    {available[0] ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={available[0].route}>
                          Open track
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                        <LockKeyhole className="h-3.5 w-3.5" />
                        In preparation
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 border-t border-border py-9 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Boxes className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold tracking-normal text-slate-950">Course integrity</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Lesson content is generated from the framework repository and pinned to AI Fabric
              {` ${courseCatalog.frameworkVersion}`}. Preview, planned, and published states remain visible;
              missing required media or starter checkpoints are never presented as complete.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-slate-500">
              <span>source {courseCatalog.sourceCommit.slice(0, 12)}</span>
              <span>{formatDuration(availableDurationMinutes)} available</span>
              <span>certificate: not yet open</span>
            </div>
          </div>
          <div className="flex items-center justify-start gap-3 md:justify-end">
            <Button variant="outline" asChild>
              <Link to="/docs/getting-started">
                <Code2 className="h-4 w-4" />
                Canonical docs
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/course/progress">
                <GraduationCap className="h-4 w-4" />
                Progress
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </CourseLayout>
  );
};

export default CourseHubPage;
