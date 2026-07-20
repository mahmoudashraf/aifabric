import {
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { courseCatalog, courseTracks, requiredLessons } from "../lib/courseCatalog";
import { calculateCourseProgress, getLessonDisplayStatus } from "../lib/completion";
import { useCourseProgress } from "../hooks/useCourseProgress";
import type { LessonDisplayStatus } from "../types";

const statusIcon: Record<LessonDisplayStatus, typeof Circle> = {
  complete: CheckCircle2,
  "in-progress": Clock3,
  available: Circle,
  preview: BookOpenCheck,
  planned: LockKeyhole,
};

export const CourseSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const { progress } = useCourseProgress(courseCatalog.courseVersion);
  const overallProgress = calculateCourseProgress(
    requiredLessons.map((lesson) => lesson.id),
    progress,
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-border px-5 py-5">
        <Link to="/course" onClick={onNavigate} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-foreground">AI Fabric Course</span>
            <span className="block text-xs text-muted-foreground">{courseCatalog.courseVersion}</span>
          </span>
        </Link>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Required course</span>
            <span className="font-semibold text-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-1.5 bg-slate-100 [&>div]:bg-blue-600" />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav className="space-y-6 px-3 py-5" aria-label="Course navigation">
          <div className="space-y-1">
            <Link
              to="/course"
              onClick={onNavigate}
              className={cn(
                "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                location.pathname === "/course"
                  ? "bg-blue-50 text-blue-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Course overview
            </Link>
            <Link
              to="/course/progress"
              onClick={onNavigate}
              className={cn(
                "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                location.pathname === "/course/progress"
                  ? "bg-blue-50 text-blue-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              My progress
            </Link>
          </div>

          {courseTracks.map((track) => {
            const visibleLessons = track.lessons.filter((lesson) => lesson.availability !== "planned");
            return (
              <section key={track.id} aria-labelledby={`course-track-${track.id}`}>
                <div className="mb-2 flex items-center justify-between px-3">
                  <h2
                    id={`course-track-${track.id}`}
                    className="text-xs font-bold uppercase text-muted-foreground"
                  >
                    {track.title}
                  </h2>
                  {track.required && <span className="text-[10px] font-semibold text-blue-700">Required</span>}
                </div>
                {visibleLessons.length > 0 ? (
                  <div className="space-y-1">
                    {visibleLessons.map((lesson) => {
                      const lessonProgress = progress.find((entry) => entry.lessonId === lesson.id);
                      const status = getLessonDisplayStatus(lesson, lessonProgress);
                      const StatusIcon = statusIcon[status];
                      const active = location.pathname === lesson.route;
                      return (
                        <Link
                          key={lesson.id}
                          to={lesson.route}
                          onClick={onNavigate}
                          className={cn(
                            "group flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-blue-50 font-semibold text-blue-700"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <StatusIcon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              status === "complete" && "text-emerald-600",
                              status === "preview" && "text-blue-600",
                            )}
                          />
                          <span className="min-w-0 flex-1 leading-5">{lesson.title}</span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    Lessons in preparation
                  </div>
                )}
              </section>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};
