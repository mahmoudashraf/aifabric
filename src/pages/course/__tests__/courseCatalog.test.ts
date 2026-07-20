import { describe, expect, it } from "vitest";

import { courseCatalog, courseLessons, getRenderedLesson, previewLessons } from "../lib/courseCatalog";

describe("generated course catalog", () => {
  it("pins the UI to the supported framework release", () => {
    expect(courseCatalog.frameworkVersion).toBe("0.3.3");
    expect(courseCatalog.frameworkTag).toBe("ai-fabric-framework-v0.3.3");
    expect(courseCatalog.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
  });

  it("has unique IDs and routes across the complete catalog", () => {
    expect(courseLessons).toHaveLength(20);
    expect(new Set(courseLessons.map((lesson) => lesson.id)).size).toBe(courseLessons.length);
    expect(new Set(courseLessons.map((lesson) => lesson.route)).size).toBe(courseLessons.length);
  });

  it("renders only the explicit preview lesson", () => {
    expect(previewLessons.map((lesson) => lesson.id)).toEqual(["qs-01"]);
    expect(getRenderedLesson("qs-01")?.video.status).toBe("script-ready");
    expect(getRenderedLesson("core-01")).toBeNull();
  });

  it("keeps QS-01 developer-facing and ships its complete theory script", () => {
    const lesson = getRenderedLesson("qs-01");

    expect(lesson?.markdown).toContain("By the end of this lesson, you will be able to:");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.video.targetDurationMinutes).toBe(7);
    expect(lesson?.video.transcript).toContain("## Scene 9: Handoff To The Lab");
    expect(lesson?.video.transcript).toContain("## Accuracy Guardrails For NotebookLM");
  });
});
