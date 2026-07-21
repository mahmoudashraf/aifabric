import courseData from "@/content/course/generated/course.json";
import core01Data from "@/content/course/generated/lessons/core-01.json";
import quickstartData from "@/content/course/generated/lessons/qs-01.json";

import type {
  CourseCatalog,
  CourseLessonSummary,
  CourseTrack,
  RenderedCourseLesson,
} from "../types";

export const courseCatalog = courseData as CourseCatalog;

const renderedLessons: Record<string, RenderedCourseLesson> = {
  "qs-01": quickstartData as RenderedCourseLesson,
  "core-01": core01Data as RenderedCourseLesson,
};

export const courseTracks = courseCatalog.tracks;

export const courseLessons = courseTracks.flatMap((track) =>
  track.lessons.map((lesson) => ({ ...lesson, trackId: track.id, trackTitle: track.title })),
);

export const requiredLessons = courseTracks
  .filter((track) => track.required)
  .flatMap((track) => track.lessons);

export const publishedLessons = courseLessons.filter((lesson) => lesson.availability === "published");
export const previewLessons = courseLessons.filter((lesson) => lesson.availability === "preview");

export const getRenderedLesson = (lessonId: string) => renderedLessons[lessonId] ?? null;

export const getLessonByRoute = (route: string) =>
  courseLessons.find((lesson) => lesson.route === route) ?? null;

export const getLessonByTrackAndSlug = (trackId: string, slug: string) =>
  courseLessons.find((lesson) => lesson.trackId === trackId && lesson.slug === slug) ?? null;

export const getTrack = (trackId: string): CourseTrack | null =>
  courseTracks.find((track) => track.id === trackId) ?? null;

export const getNextAvailableLesson = (lessonId: string): CourseLessonSummary | null => {
  const index = courseLessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return null;
  return courseLessons.slice(index + 1).find((lesson) => lesson.availability !== "planned") ?? null;
};

export const courseDurationMinutes = courseLessons.reduce(
  (duration, lesson) => duration + lesson.durationMinutes,
  0,
);

export const availableDurationMinutes = courseLessons
  .filter((lesson) => lesson.availability !== "planned")
  .reduce((duration, lesson) => duration + lesson.durationMinutes, 0);
