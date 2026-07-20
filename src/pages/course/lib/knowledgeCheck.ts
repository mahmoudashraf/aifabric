import type {
  KnowledgeAnswers,
  KnowledgeCheck,
  KnowledgeCheckResult,
  KnowledgeQuestion,
} from "../types";

const sorted = (values: string[] = []) => [...new Set(values)].sort();

const sameAnswers = (left: string[] = [], right: string[] = []) => {
  const normalizedLeft = sorted(left);
  const normalizedRight = sorted(right);
  return (
    normalizedLeft.length === normalizedRight.length &&
    normalizedLeft.every((value, index) => value === normalizedRight[index])
  );
};

export const isGradableQuestion = (question: KnowledgeQuestion) =>
  question.type === "single-choice" || question.type === "multiple-choice";

export const scoreKnowledgeCheck = (
  knowledgeCheck: KnowledgeCheck,
  answers: KnowledgeAnswers,
): KnowledgeCheckResult => {
  const gradableQuestions = knowledgeCheck.questions.filter(isGradableQuestion);
  const outcomes: Record<string, boolean> = {};

  for (const question of gradableQuestions) {
    outcomes[question.id] = sameAnswers(answers[question.id], question.correctOptionIds);
  }

  const correct = Object.values(outcomes).filter(Boolean).length;
  const score = gradableQuestions.length === 0 ? 100 : Math.round((correct / gradableQuestions.length) * 100);
  const answered = knowledgeCheck.questions.filter((question) => (answers[question.id]?.length ?? 0) > 0).length;

  return {
    answered,
    graded: gradableQuestions.length,
    correct,
    score,
    passed: score >= knowledgeCheck.passingScorePercent,
    outcomes,
  };
};

export const canSubmitKnowledgeCheck = (knowledgeCheck: KnowledgeCheck, answers: KnowledgeAnswers) =>
  knowledgeCheck.questions
    .filter(isGradableQuestion)
    .every((question) => (answers[question.id]?.length ?? 0) > 0);
