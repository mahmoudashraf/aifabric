import { z } from "zod";

const relatedLinkSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1),
  label: z.string().min(1),
});

export const courseLessonSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  availability: z.enum(["preview", "published", "planned"]),
  source: z.string().min(1).optional(),
  knowledgeCheck: z.string().min(1).optional(),
  assistantPrompt: z.string().min(1).optional(),
  assistantReviewPrompt: z.string().min(1).optional(),
  notebookSourceManifest: z.string().min(1).optional(),
  theoryVideoIds: z.array(z.string().min(1)).default([]),
  relatedStories: z.array(relatedLinkSchema).default([]),
  relatedDemos: z.array(relatedLinkSchema).default([]),
});

export const courseTrackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  required: z.boolean(),
  lessons: z.array(courseLessonSchema).min(1),
});

export const courseSchema = z.object({
  schemaVersion: z.number().int().positive(),
  assistantPromptSchemaVersion: z.number().int().positive(),
  knowledgeCheckSchemaVersion: z.number().int().positive(),
  notebookLmVideoSchemaVersion: z.number().int().positive(),
  courseId: z.string().min(1),
  courseVersion: z.string().min(1),
  status: z.enum(["draft", "beta", "published"]),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  frameworkVersion: z.string().min(1),
  frameworkTag: z.string().min(1),
  courseSourceTag: z.string().min(1),
  javaVersion: z.union([z.string(), z.number()]),
  springBootVersion: z.string().min(1),
  learnerRepository: z.string().url(),
  certificate: z.object({
    enabled: z.boolean(),
    title: z.string().min(1),
    reason: z.string().min(1),
  }),
  tracks: z.array(courseTrackSchema).min(1),
});

const questionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const knowledgeQuestionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["single-choice", "multiple-choice", "answer-reveal", "implementation-defense"]),
  competency: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(questionOptionSchema).optional(),
  correctOptionIds: z.array(z.string().min(1)).optional(),
  explanation: z.string().min(1).optional(),
  modelAnswer: z.string().min(1).optional(),
  reviewCriteria: z.array(z.string().min(1)).optional(),
  sourcePaths: z.array(z.string().min(1)).min(1),
});

export const knowledgeCheckSchema = z.object({
  schemaVersion: z.number().int().positive(),
  lessonId: z.string().min(1),
  passingScorePercent: z.number().min(0).max(100),
  questions: z.array(knowledgeQuestionSchema).min(1),
});

export const lessonFrontMatterSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  track: z.string().min(1),
  order: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
  availability: z.enum(["preview", "published"]),
  courseVersion: z.string().min(1),
  frameworkVersion: z.string().min(1),
  frameworkTag: z.string().min(1),
  courseSourceTag: z.string().min(1),
  starterRef: z.string().min(1),
  solutionRef: z.string().min(1),
  requiresOpenAi: z.boolean(),
  requiresDocker: z.boolean(),
  optionalProviderExercises: z.array(z.enum(["openai", "qdrant-cloud"])).default([]),
  sourcePaths: z.array(z.string().min(1)).min(1),
  theoryVideoIds: z.array(z.string().min(1)).default([]),
  assistant: z.object({
    mode: z.enum(["implement", "analyze", "reproduce", "verify"]),
    implementationPrompt: z.string().min(1),
    reviewPrompt: z.string().min(1),
    validationStatus: z.enum(["planned", "passed", "failed"]),
  }),
  knowledgeCheck: z.object({
    source: z.string().min(1),
    required: z.boolean(),
    passingScorePercent: z.number().min(0).max(100),
  }),
  video: z.object({
    status: z.enum(["planned", "script-ready", "reviewed", "published"]),
    generator: z.string().min(1),
    purpose: z.literal("pre-lesson-theory"),
    placement: z.literal("before-lab"),
    targetDurationMinutes: z.number().positive(),
    title: z.string().min(1),
    publicUrl: z.string().url().nullable(),
    transcript: z.string().min(1),
    sourceManifest: z.string().min(1),
  }).optional(),
});

export const notebookSourceManifestSchema = z.object({
  schemaVersion: z.number().int().positive(),
  lessonId: z.string().min(1),
  status: z.enum(["planned", "script-ready", "reviewed", "published"]),
  frameworkVersion: z.string().min(1),
  frameworkTag: z.string().min(1),
  courseVersion: z.string().min(1),
  reviewedAt: z.string().nullable(),
  reviewedBy: z.string().nullable(),
  sources: z.array(z.object({ path: z.string().min(1) })).min(1),
  outputs: z.object({
    videoUrl: z.string().url().nullable(),
    transcript: z.string().min(1),
    actualDurationMinutes: z.number().positive().nullable(),
  }),
});

export type CourseSource = z.infer<typeof courseSchema>;
export type CourseLessonSource = z.infer<typeof courseLessonSchema>;
export type KnowledgeCheckSource = z.infer<typeof knowledgeCheckSchema>;
export type LessonFrontMatter = z.infer<typeof lessonFrontMatterSchema>;
