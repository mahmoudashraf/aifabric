export type LessonAvailability = "preview" | "published" | "planned";
export type CourseStatus = "draft" | "beta" | "published";
export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "answer-reveal"
  | "implementation-defense";

export interface CourseLink {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface CourseLessonSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMinutes: number;
  availability: LessonAvailability;
  route: string;
  source?: string;
  relatedStories: CourseLink[];
  relatedDemos: CourseLink[];
}

export interface CourseTrack {
  id: string;
  title: string;
  description: string;
  required: boolean;
  lessons: CourseLessonSummary[];
}

export interface CourseCatalog {
  schemaVersion: number;
  courseId: string;
  courseVersion: string;
  status: CourseStatus;
  title: string;
  subtitle: string;
  frameworkVersion: string;
  frameworkTag: string;
  courseSourceTag: string;
  javaVersion: string | number;
  springBootVersion: string;
  learnerRepository: string;
  certificate: {
    enabled: boolean;
    title: string;
    reason: string;
  };
  tracks: CourseTrack[];
  sourceCommit: string;
  generatedAt: string;
}

export interface KnowledgeOption {
  id: string;
  text: string;
}

export interface KnowledgeQuestion {
  id: string;
  type: QuestionType;
  competency: string;
  prompt: string;
  options?: KnowledgeOption[];
  correctOptionIds?: string[];
  explanation?: string;
  modelAnswer?: string;
  reviewCriteria?: string[];
  sourcePaths: string[];
}

export interface KnowledgeCheck {
  schemaVersion: number;
  lessonId: string;
  passingScorePercent: number;
  questions: KnowledgeQuestion[];
}

export interface RenderedCourseLesson extends CourseLessonSummary {
  track: string;
  markdown: string;
  sourcePath: string;
  sourceUrl: string;
  frontMatter: {
    order: number;
    courseVersion: string;
    frameworkVersion: string;
    frameworkTag: string;
    courseSourceTag: string;
    requiresOpenAi: boolean;
    requiresDocker: boolean;
    starterRef: string;
    solutionRef: string;
    sourcePaths: string[];
    video?: {
      status: "planned" | "script-ready" | "reviewed" | "published";
      targetDurationMinutes: number;
      title: string;
      publicUrl: string | null;
    };
  };
  knowledgeCheck: KnowledgeCheck;
  assistant: {
    mode: "implement" | "analyze" | "reproduce" | "verify";
    validationStatus: "planned" | "passed" | "failed";
    implementationPrompt: string;
    reviewPrompt: string;
  };
  video?: {
    status: "planned" | "script-ready" | "reviewed" | "published";
    generator: string;
    purpose: "pre-lesson-theory";
    placement: "before-lab";
    targetDurationMinutes: number;
    title: string;
    publicUrl: string | null;
    transcript: string;
    notebookStatus: "planned" | "script-ready" | "reviewed" | "published";
    reviewedAt: string | null;
    reviewedBy: string | null;
  };
}

export type KnowledgeAnswers = Record<string, string[]>;

export interface KnowledgeCheckResult {
  answered: number;
  graded: number;
  correct: number;
  score: number;
  passed: boolean;
  outcomes: Record<string, boolean>;
}

export interface LessonProgress {
  userId: string;
  courseVersion: string;
  lessonId: string;
  videoCompletedAt: string | null;
  questionsAnswered: number;
  questionScore: number | null;
  questionAnswers: KnowledgeAnswers;
  questionsSubmittedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export type LessonDisplayStatus = "complete" | "in-progress" | "available" | "preview" | "planned";
