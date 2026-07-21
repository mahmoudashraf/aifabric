import { describe, expect, it } from "vitest";

import {
  calculateCourseProgress,
  canCompleteLesson,
  getLessonDisplayStatus,
  shouldPersistLessonCompletion,
} from "../lib/completion";
import type { CourseLessonSummary, LessonProgress, RenderedCourseLesson } from "../types";

const lesson = (availability: CourseLessonSummary["availability"]): CourseLessonSummary => ({
  id: "lesson-1",
  slug: "lesson-1",
  title: "Lesson",
  description: "Description",
  durationMinutes: 30,
  availability,
  route: "/course/lesson",
  theoryVideoIds: [],
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

const renderedLesson = (video: RenderedCourseLesson["video"]): RenderedCourseLesson => ({
  ...lesson("published"),
  track: "quickstart",
  markdown: "Lesson",
  sourcePath: "lesson.md",
  sourceUrl: "https://example.com/lesson.md",
  frontMatter: {
    order: 1,
    courseVersion: "course-1",
    frameworkVersion: "0.3.3",
    frameworkTag: "ai-fabric-framework-v0.3.3",
    courseSourceTag: "course-1",
    requiresOpenAi: false,
    requiresDocker: false,
    starterRef: "starter",
    solutionRef: "solution",
    sourcePaths: ["source.md"],
    theoryVideoIds: [],
    video: video
      ? {
          status: video.status,
          targetDurationMinutes: video.targetDurationMinutes,
          title: video.title,
          publicUrl: video.publicUrl,
        }
      : undefined,
  },
  knowledgeCheck: {
    schemaVersion: 1,
    lessonId: "lesson-1",
    passingScorePercent: 80,
    questions: [],
  },
  assistant: {
    mode: "implement",
    validationStatus: "passed",
    implementationPrompt: "Implement",
    reviewPrompt: "Review",
  },
  video,
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

  it("does not require a video when a published lesson intentionally has none", () => {
    expect(canCompleteLesson(renderedLesson(undefined), 80)).toBe(true);
    expect(
      shouldPersistLessonCompletion({
        completionEligible: true,
        theoryRequired: false,
        videoCompletedAt: null,
        passed: true,
      }),
    ).toBe(true);
    expect(
      shouldPersistLessonCompletion({
        completionEligible: false,
        theoryRequired: false,
        videoCompletedAt: null,
        passed: true,
      }),
    ).toBe(false);
  });

  it("still requires a published video when the lesson declares theory", () => {
    const unpublishedVideo: NonNullable<RenderedCourseLesson["video"]> = {
      status: "script-ready",
      generator: "notebooklm",
      purpose: "pre-lesson-theory",
      placement: "before-lab",
      targetDurationMinutes: 7,
      title: "Theory",
      publicUrl: null,
      transcript: "Script",
      notebookStatus: "script-ready",
      reviewedAt: null,
      reviewedBy: null,
    };

    expect(canCompleteLesson(renderedLesson(unpublishedVideo), 100)).toBe(false);
  });

  it("recognizes an assigned published theory collection", () => {
    const lessonWithTheory = renderedLesson(undefined);
    lessonWithTheory.theoryVideoIds = ["what-is-ai-fabric", "request-lifecycle"];
    lessonWithTheory.frontMatter.theoryVideoIds = lessonWithTheory.theoryVideoIds;

    expect(canCompleteLesson(lessonWithTheory, 80)).toBe(true);
  });
});
