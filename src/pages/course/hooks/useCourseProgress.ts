import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCourseProgress,
  markTheoryWatched,
  resetLessonProgress,
  submitKnowledgeCheck,
} from "../api/courseProgressApi";
import type { KnowledgeAnswers } from "../types";
import { useCourseAuth } from "./useCourseAuth";

const courseProgressKey = (userId: string | undefined, courseVersion: string) => [
  "course-progress",
  userId,
  courseVersion,
];

export const useCourseProgress = (courseVersion: string) => {
  const auth = useCourseAuth();
  const queryClient = useQueryClient();
  const queryKey = courseProgressKey(auth.user?.id, courseVersion);

  const progressQuery = useQuery({
    queryKey,
    queryFn: () => getCourseProgress(courseVersion),
    enabled: auth.configured && Boolean(auth.user),
    staleTime: 30_000,
  });

  const saveKnowledge = useMutation({
    mutationFn: (input: {
      lessonId: string;
      answers: KnowledgeAnswers;
      answered: number;
      score: number;
      passed: boolean;
      videoCompletedAt: string | null;
    }) => {
      if (!auth.user) throw new Error("Sign in to save course progress");
      return submitKnowledgeCheck({
        ...input,
        userId: auth.user.id,
        courseVersion,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const saveTheory = useMutation({
    mutationFn: (input: {
      lessonId: string;
      questionScore: number | null;
      passingScorePercent: number;
    }) => {
      if (!auth.user) throw new Error("Sign in to save course progress");
      return markTheoryWatched({
        ...input,
        userId: auth.user.id,
        courseVersion,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const resetLesson = useMutation({
    mutationFn: (lessonId: string) => {
      if (!auth.user) throw new Error("Sign in to reset course progress");
      return resetLessonProgress(auth.user.id, courseVersion, lessonId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    ...progressQuery,
    progress: progressQuery.data ?? [],
    saveKnowledge,
    saveTheory,
    resetLesson,
  };
};
