import type {
  CourseLessonSummary,
  LessonDisplayStatus,
  LessonProgress,
  RenderedCourseLesson,
} from "../types";

export const isTheoryAvailable = (lesson: RenderedCourseLesson) =>
  lesson.video.status === "published" && Boolean(lesson.video.publicUrl);

export const getLessonDisplayStatus = (
  lesson: CourseLessonSummary,
  progress?: LessonProgress,
): LessonDisplayStatus => {
  if (lesson.availability === "planned") return "planned";
  if (progress?.completedAt) return "complete";
  if (progress?.videoCompletedAt || progress?.questionsSubmittedAt) return "in-progress";
  if (lesson.availability === "preview") return "preview";
  return "available";
};

export const canCompleteLesson = (lesson: RenderedCourseLesson, score: number | null) =>
  isTheoryAvailable(lesson) && score !== null && score >= lesson.knowledgeCheck.passingScorePercent;

export const calculateCourseProgress = (
  requiredLessonIds: string[],
  progress: LessonProgress[],
) => {
  if (requiredLessonIds.length === 0) return 0;
  const completed = requiredLessonIds.filter((lessonId) =>
    progress.some((entry) => entry.lessonId === lessonId && Boolean(entry.completedAt)),
  ).length;
  return Math.round((completed / requiredLessonIds.length) * 100);
};
