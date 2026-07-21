export type CourseVideoLanguage = "en" | "ar";

export interface CourseVideoSource {
  videoId: string;
  durationLabel: string;
}

export interface CourseTheoryVideoEntry {
  id: string;
  title: string;
  description: string;
  courseContext: string;
  sources: Partial<Record<CourseVideoLanguage, CourseVideoSource>> & {
    en: CourseVideoSource;
  };
}

export const COURSE_VIDEO_LANGUAGE_KEY = "ai-fabric-course-video-language";

export const courseVideoPlaylists: Record<CourseVideoLanguage, string> = {
  en: "https://www.youtube.com/playlist?list=PLVFJlx2bD2oM",
  ar: "https://www.youtube.com/playlist?list=PLYkPlfe8pjNE",
};

export const courseTheoryVideos: CourseTheoryVideoEntry[] = [
  {
    id: "course-introduction",
    title: "Course introduction",
    description: "Understand the learning path and the production problems the course will solve.",
    courseContext: "Course overview",
    sources: {
      en: { videoId: "wYlGylSS7DY", durationLabel: "6 min 32 sec" },
      ar: { videoId: "5ilCq__D1A0", durationLabel: "7 min 2 sec" },
    },
  },
  {
    id: "what-is-ai-fabric",
    title: "What is AI Fabric?",
    description: "Learn why the framework exists and where it fits in a Spring Boot application.",
    courseContext: "Core 01 foundation",
    sources: {
      en: { videoId: "hGEfZQeqHks", durationLabel: "8 min 48 sec" },
      ar: { videoId: "_iiLnn0Ap7U", durationLabel: "8 min 3 sec" },
    },
  },
  {
    id: "architecture-and-modules",
    title: "Architecture and module map",
    description: "Trace the framework layers, module boundaries, and application-owned responsibilities.",
    courseContext: "Core 01 architecture",
    sources: {
      en: { videoId: "A35b0-9wU78", durationLabel: "9 min" },
    },
  },
];

export const resolveCourseVideoSource = (
  video: CourseTheoryVideoEntry,
  language: CourseVideoLanguage,
) => ({
  source: video.sources[language] ?? video.sources.en,
  language: video.sources[language] ? language : "en",
  fallback: language !== "en" && !video.sources[language],
});

export const courseVideoEmbedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
