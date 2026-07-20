import { describe, expect, it } from "vitest";

import { canSubmitKnowledgeCheck, scoreKnowledgeCheck } from "../lib/knowledgeCheck";
import type { KnowledgeCheck } from "../types";

const knowledgeCheck: KnowledgeCheck = {
  schemaVersion: 1,
  lessonId: "test-01",
  passingScorePercent: 80,
  questions: [
    {
      id: "q1",
      type: "single-choice",
      competency: "flow",
      prompt: "Pick one",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionIds: ["b"],
      sourcePaths: ["docs/source.md"],
    },
    {
      id: "q2",
      type: "multiple-choice",
      competency: "ownership",
      prompt: "Pick two",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
      ],
      correctOptionIds: ["a", "c"],
      sourcePaths: ["docs/source.md"],
    },
  ],
};

describe("scoreKnowledgeCheck", () => {
  it("scores exact answers and ignores multiple-choice order", () => {
    const result = scoreKnowledgeCheck(knowledgeCheck, { q1: ["b"], q2: ["c", "a"] });
    expect(result).toMatchObject({ answered: 2, graded: 2, correct: 2, score: 100, passed: true });
  });

  it("does not award partial credit for an incomplete multiple-choice answer", () => {
    const result = scoreKnowledgeCheck(knowledgeCheck, { q1: ["b"], q2: ["a"] });
    expect(result).toMatchObject({ correct: 1, score: 50, passed: false });
  });

  it("requires every gradable question before submission", () => {
    expect(canSubmitKnowledgeCheck(knowledgeCheck, { q1: ["b"] })).toBe(false);
    expect(canSubmitKnowledgeCheck(knowledgeCheck, { q1: ["b"], q2: ["a", "c"] })).toBe(true);
  });
});
