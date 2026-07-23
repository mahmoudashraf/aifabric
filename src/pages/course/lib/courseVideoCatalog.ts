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
  {
    id: "request-lifecycle",
    title: "Request lifecycle",
    description: "Follow a request through mode and intent handling, retrieval, actions, providers, and session persistence.",
    courseContext: "Core 01 request flow",
    sources: {
      en: { videoId: "mZsoJwFDlZ4", durationLabel: "8 min 56 sec" },
      ar: { videoId: "k5El0gzVnGY", durationLabel: "7 min 49 sec" },
    },
  },
  {
    id: "configuration-and-extension-model",
    title: "Configuration and extension model",
    description: "Understand auto-configuration, precedence, provider selection, curated overlays, and application extension points.",
    courseContext: "Core 01 configuration",
    sources: {
      en: { videoId: "bJpeLbrqZb0", durationLabel: "9 min 26 sec" },
    },
  },
  {
    id: "searchable-evidence",
    title: "Model application data as searchable evidence",
    description: "See how application content and metadata become governed, retrievable evidence for AI workflows.",
    courseContext: "Core 02 theory",
    sources: {
      en: { videoId: "G_qBre7Be1s", durationLabel: "7 min 47 sec" },
    },
  },
  {
    id: "evidence-grounded-rag",
    title: "Evidence-grounded RAG",
    description: "Connect retrieval, approved context, citations, and no-evidence behavior to grounded generation.",
    courseContext: "Core 03 theory",
    sources: {
      en: { videoId: "T-h-BMjwaXc", durationLabel: "8 min 5 sec" },
    },
  },
  {
    id: "governed-actions-and-confirmation",
    title: "Governed actions and confirmation",
    description: "Trace typed action discovery, authorization, confirmation, execution, and safe result projection.",
    courseContext: "Core 04 theory",
    sources: {
      en: { videoId: "bTZ08ApmpUQ", durationLabel: "5 min 44 sec" },
    },
  },
  {
    id: "backend-conversation-memory",
    title: "Backend-owned conversation memory",
    description: "Learn how sessions, recent turns, follow-ups, and pending actions stay under backend ownership.",
    courseContext: "Core 05 theory",
    sources: {
      en: { videoId: "O1wf-w1Hg0k", durationLabel: "9 min 0 sec" },
    },
  },
  {
    id: "tenant-security-and-privacy",
    title: "Tenant security and privacy",
    description: "Apply identity, tenant filters, access policy, PII handling, and fail-closed evidence boundaries.",
    courseContext: "Core 06 theory",
    sources: {
      en: { videoId: "mhO8CrOqpt0", durationLabel: "7 min 34 sec" },
    },
  },
  {
    id: "testing-and-shipping",
    title: "Testing and shipping AI workflows",
    description: "Separate deterministic, packaged-runtime, live-provider, and deployed release evidence.",
    courseContext: "Core 07 theory",
    sources: {
      en: { videoId: "W_mlsCxAePs", durationLabel: "8 min 42 sec" },
    },
  },
  {
    id: "provider-architecture-purpose-routing",
    title: "Provider architecture and purpose routing",
    description: "Route orchestration, generation, embeddings, and vector work through explicit provider purposes.",
    courseContext: "Production 01 theory",
    sources: {
      en: { videoId: "2lRTNp63NNI", durationLabel: "6 min 55 sec" },
    },
  },
  {
    id: "modes-positions-orchestration-policy",
    title: "Modes, positions, and orchestration policy",
    description: "Separate application positions from server-owned capability modes and authorization boundaries.",
    courseContext: "Production 02 theory",
    sources: {
      en: { videoId: "G0WvJ1PQj0s", durationLabel: "8 min 7 sec" },
    },
  },
  {
    id: "state-storage-map",
    title: "State and storage in an AI Fabric application",
    description: "Map business truth, derived vector evidence, durable workflow state, and ephemeral runtime state.",
    courseContext: "Production 04 theory",
    sources: {
      en: { videoId: "epjF29WfEUM", durationLabel: "8 min 2 sec" },
    },
  },
  {
    id: "live-data-sync",
    title: "Keep AI evidence synchronized",
    description: "Move from initial migration to trusted create, update, and delete synchronization without stale evidence.",
    courseContext: "Production 05 theory",
    sources: {
      en: { videoId: "wZ5e0MPSXRI", durationLabel: "7 min 39 sec" },
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
