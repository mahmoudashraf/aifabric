import courseData from "@/content/course/generated/course.json";
import core01Data from "@/content/course/generated/lessons/core-01.json";
import core02Data from "@/content/course/generated/lessons/core-02.json";
import core03Data from "@/content/course/generated/lessons/core-03.json";
import core04Data from "@/content/course/generated/lessons/core-04.json";
import core05Data from "@/content/course/generated/lessons/core-05.json";
import core06Data from "@/content/course/generated/lessons/core-06.json";
import core07Data from "@/content/course/generated/lessons/core-07.json";
import prod01Data from "@/content/course/generated/lessons/prod-01.json";
import prod02Data from "@/content/course/generated/lessons/prod-02.json";
import prod03Data from "@/content/course/generated/lessons/prod-03.json";
import prod04Data from "@/content/course/generated/lessons/prod-04.json";
import prod05Data from "@/content/course/generated/lessons/prod-05.json";
import prod06Data from "@/content/course/generated/lessons/prod-06.json";
import prod07Data from "@/content/course/generated/lessons/prod-07.json";
import prod08Data from "@/content/course/generated/lessons/prod-08.json";
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
  "core-02": core02Data as RenderedCourseLesson,
  "core-03": core03Data as RenderedCourseLesson,
  "core-04": core04Data as RenderedCourseLesson,
  "core-05": core05Data as RenderedCourseLesson,
  "core-06": core06Data as RenderedCourseLesson,
  "core-07": core07Data as RenderedCourseLesson,
  "prod-01": prod01Data as RenderedCourseLesson,
  "prod-02": prod02Data as RenderedCourseLesson,
  "prod-03": prod03Data as RenderedCourseLesson,
  "prod-04": prod04Data as RenderedCourseLesson,
  "prod-05": prod05Data as RenderedCourseLesson,
  "prod-06": prod06Data as RenderedCourseLesson,
  "prod-07": prod07Data as RenderedCourseLesson,
  "prod-08": prod08Data as RenderedCourseLesson,
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
