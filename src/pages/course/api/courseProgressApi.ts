import { courseSupabase } from "@/integrations/course-supabase/client";
import type { CourseJson, CourseTable } from "@/integrations/course-supabase/types";

import type { KnowledgeAnswers, LessonProgress } from "../types";

type CourseProgressRow = CourseTable<"course_progress">;

const asKnowledgeAnswers = (value: CourseJson): KnowledgeAnswers => {
  if (!value || Array.isArray(value) || typeof value !== "object") return {};
  const answers: KnowledgeAnswers = {};
  for (const [questionId, answer] of Object.entries(value)) {
    if (Array.isArray(answer) && answer.every((item) => typeof item === "string")) {
      answers[questionId] = answer as string[];
    }
  }
  return answers;
};

const toLessonProgress = (row: CourseProgressRow): LessonProgress => ({
  userId: row.user_id,
  courseVersion: row.course_version,
  lessonId: row.lesson_id,
  videoCompletedAt: row.video_completed_at,
  questionsAnswered: row.questions_answered,
  questionScore: row.question_score,
  questionAnswers: asKnowledgeAnswers(row.question_answers),
  questionsSubmittedAt: row.questions_submitted_at,
  completedAt: row.completed_at,
  updatedAt: row.updated_at,
});

export const getCourseProgress = async (courseVersion: string) => {
  const { data, error } = await courseSupabase
    .from("course_progress")
    .select("*")
    .eq("course_version", courseVersion)
    .order("lesson_id");
  if (error) throw error;
  return (data ?? []).map(toLessonProgress);
};

const getLessonProgressRow = async (userId: string, courseVersion: string, lessonId: string) => {
  const { data, error } = await courseSupabase
    .from("course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_version", courseVersion)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

interface KnowledgeSubmission {
  userId: string;
  courseVersion: string;
  lessonId: string;
  answers: KnowledgeAnswers;
  answered: number;
  score: number;
  passed: boolean;
  videoCompletedAt: string | null;
}

export const submitKnowledgeCheck = async (submission: KnowledgeSubmission) => {
  const now = new Date().toISOString();
  const current = await getLessonProgressRow(
    submission.userId,
    submission.courseVersion,
    submission.lessonId,
  );
  const videoCompletedAt = current?.video_completed_at ?? submission.videoCompletedAt;
  const { data, error } = await courseSupabase
    .from("course_progress")
    .upsert(
      {
        user_id: submission.userId,
        course_version: submission.courseVersion,
        lesson_id: submission.lessonId,
        question_answers: submission.answers,
        questions_answered: submission.answered,
        question_score: submission.score,
        questions_submitted_at: now,
        video_completed_at: videoCompletedAt,
        completed_at: videoCompletedAt && submission.passed ? current?.completed_at ?? now : null,
      },
      { onConflict: "user_id,course_version,lesson_id" },
    )
    .select("*")
    .single();
  if (error) throw error;
  return toLessonProgress(data);
};

interface TheoryCompletion {
  userId: string;
  courseVersion: string;
  lessonId: string;
  questionScore: number | null;
  passingScorePercent: number;
}

export const markTheoryWatched = async (completion: TheoryCompletion) => {
  const now = new Date().toISOString();
  const current = await getLessonProgressRow(
    completion.userId,
    completion.courseVersion,
    completion.lessonId,
  );
  const questionScore = current?.question_score ?? completion.questionScore;
  const { data, error } = await courseSupabase
    .from("course_progress")
    .upsert(
      {
        user_id: completion.userId,
        course_version: completion.courseVersion,
        lesson_id: completion.lessonId,
        video_completed_at: now,
        questions_answered: current?.questions_answered ?? 0,
        question_answers: current?.question_answers ?? {},
        question_score: questionScore,
        questions_submitted_at: current?.questions_submitted_at ?? null,
        completed_at:
          questionScore !== null && questionScore >= completion.passingScorePercent
            ? current?.completed_at ?? now
            : null,
      },
      { onConflict: "user_id,course_version,lesson_id" },
    )
    .select("*")
    .single();
  if (error) throw error;
  return toLessonProgress(data);
};

export const resetLessonProgress = async (userId: string, courseVersion: string, lessonId: string) => {
  const { error } = await courseSupabase
    .from("course_progress")
    .delete()
    .eq("user_id", userId)
    .eq("course_version", courseVersion)
    .eq("lesson_id", lessonId);
  if (error) throw error;
};
