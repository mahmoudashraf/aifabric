import {
  Award,
  CheckCircle2,
  Clock3,
  Github,
  LockKeyhole,
  LogIn,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { CourseLayout } from "./components/CourseLayout";
import { useCourseAuth } from "./hooks/useCourseAuth";
import { useCourseProgress } from "./hooks/useCourseProgress";
import { courseCatalog, courseTracks, requiredLessons } from "./lib/courseCatalog";
import { calculateCourseProgress, getLessonDisplayStatus } from "./lib/completion";

const CourseProgressPage = () => {
  const auth = useCourseAuth();
  const { progress, isLoading, resetLesson } = useCourseProgress(courseCatalog.courseVersion);
  const percentage = calculateCourseProgress(requiredLessons.map((lesson) => lesson.id), progress);

  if (!auth.loading && !auth.user) {
    return (
      <CourseLayout>
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-blue-50 text-blue-700">
            <Github className="h-7 w-7" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-normal text-slate-950">Save progress with GitHub</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
            Every lesson remains public. Sign in only when you want quiz results and completion state to follow
            you across browsers and devices.
          </p>
          <Button
            size="lg"
            className="mt-7"
            disabled={!auth.githubAvailable}
            onClick={() => void auth.signInWithGitHub().catch((error) => toast.error(error instanceof Error ? error.message : "GitHub sign-in failed"))}
          >
            <LogIn className="h-4 w-4" />
            Sign in with GitHub
          </Button>
          {!auth.githubAvailable && (
            <p className="mt-4 text-sm text-amber-700">
              {auth.configurationIssue ?? "GitHub sign-in is not available in this environment."}
            </p>
          )}
          <div className="mt-10 border-t border-border pt-6 text-left">
            <div className="flex items-start gap-3 text-sm leading-6 text-slate-600">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span>Supabase GitHub Auth identifies the learner. Row Level Security restricts each progress row to its owner; no service key is sent to the browser.</span>
            </div>
          </div>
        </div>
      </CourseLayout>
    );
  }

  return (
    <CourseLayout>
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-8 lg:px-10">
        <header className="grid gap-6 border-b border-border pb-8 md:grid-cols-[minmax(0,1fr)_260px] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase text-blue-700">Learner workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">My course progress</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Saved activity is tied to course version {courseCatalog.courseVersion}. Preview activity remains
              visible but cannot satisfy unpublished completion gates.
            </p>
          </div>
          {auth.user && (
            <div className="flex items-center gap-3 border-l-4 border-blue-500 bg-white px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={auth.avatarUrl ?? undefined} alt="" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">{auth.displayName ?? "Course learner"}</p>
                <p className="truncate text-xs text-slate-500">{auth.user.email}</p>
              </div>
            </div>
          )}
        </header>

        <section className="grid gap-6 border-b border-border py-8 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
          <div>
            <p className="text-4xl font-extrabold text-blue-700">{isLoading ? "..." : `${percentage}%`}</p>
            <p className="mt-1 text-sm font-medium text-slate-600">Required course complete</p>
          </div>
          <div>
            <Progress value={percentage} className="h-2.5 bg-slate-100 [&>div]:bg-blue-600" />
            <div className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-slate-500">
              <span>{progress.filter((entry) => entry.completedAt).length} completed lessons</span>
              <span>{requiredLessons.length} required lessons planned</span>
            </div>
          </div>
        </section>

        <section className="py-9" aria-labelledby="track-progress-heading">
          <h2 id="track-progress-heading" className="text-xl font-bold tracking-normal text-slate-950">Track progress</h2>
          <div className="mt-5 divide-y divide-border border-y border-border bg-white">
            {courseTracks.map((track) => (
              <div key={track.id} className="px-5 py-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-950">{track.title}</h3>
                      {track.required && <Badge variant="outline" className="text-[10px]">Required</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{track.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {track.lessons.filter((lesson) => progress.some((entry) => entry.lessonId === lesson.id && entry.completedAt)).length}/{track.lessons.length}
                  </span>
                </div>
                <div className="mt-5 space-y-2">
                  {track.lessons.map((lesson) => {
                    const saved = progress.find((entry) => entry.lessonId === lesson.id);
                    const status = getLessonDisplayStatus(lesson, saved);
                    return (
                      <div key={lesson.id} className="flex min-h-10 items-center gap-3 text-sm">
                        {status === "complete" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : status === "in-progress" ? <Clock3 className="h-4 w-4 text-amber-600" /> : <LockKeyhole className="h-4 w-4 text-slate-300" />}
                        <span className="min-w-0 flex-1 text-slate-700">{lesson.title}</span>
                        <span className="text-xs capitalize text-slate-500">{status.replace("-", " ")}</span>
                        {saved && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title={`Reset ${lesson.title}`}
                            disabled={resetLesson.isPending}
                            onClick={() => {
                              void resetLesson.mutateAsync(lesson.id)
                                .then(() => toast.success("Lesson progress reset"))
                                .catch((error) => toast.error(error instanceof Error ? error.message : "Could not reset progress"));
                            }}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-9" aria-labelledby="certificate-heading">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="certificate-heading" className="text-xl font-bold tracking-normal text-slate-950">Certificate application</h2>
                <Badge variant="outline">Not open</Badge>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{courseCatalog.certificate.reason}</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                The planned process is simple: complete required lessons, submit one immutable capstone commit,
                and receive a manual review. Saved progress alone is not marketed as certification.
              </p>
            </div>
          </div>
        </section>
      </div>
    </CourseLayout>
  );
};

export default CourseProgressPage;
