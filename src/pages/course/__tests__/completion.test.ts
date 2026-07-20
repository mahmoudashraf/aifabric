import { describe, expect, it } from "vitest";

import { calculateCourseProgress, getLessonDisplayStatus } from "../lib/completion";
import type { CourseLessonSummary, LessonProgress } from "../types";

const lesson = (availability: CourseLessonSummary["availability"]): CourseLessonSummary => ({
  id: "lesson-1",
  slug: "lesson-1",
  title: "Lesson",
  description: "Description",
  durationMinutes: 30,
  availability,
  route: "/course/lesson",
  relatedStories: [],
  relatedDemos: [],
});

const progress = (completedAt: string | null): LessonProgress => ({
  userId: "user-1",
  courseVersion: "course-1",
  lessonId: "lesson-1",
  videoCompletedAt: "2026-07-20T10:00:00Z",
  questionsAnswered: 3,
  questionScore: 100,
  questionAnswers: {},
  questionsSubmittedAt: "2026-07-20T10:05:00Z",
  completedAt,
  updatedAt: "2026-07-20T10:05:00Z",
});

describe("course completion", () => {
  it("keeps planned and preview states honest", () => {
    expect(getLessonDisplayStatus(lesson("planned"))).toBe("planned");
    expect(getLessonDisplayStatus(lesson("preview"))).toBe("preview");
  });

  it("reports saved partial and complete states", () => {
    expect(getLessonDisplayStatus(lesson("published"), progress(null))).toBe("in-progress");
    expect(getLessonDisplayStatus(lesson("published"), progress("2026-07-20T10:05:00Z"))).toBe("complete");
  });

  it("calculates progress only from required lesson IDs", () => {
    expect(calculateCourseProgress(["lesson-1", "lesson-2"], [progress("2026-07-20T10:05:00Z")])).toBe(50);
  });
});
