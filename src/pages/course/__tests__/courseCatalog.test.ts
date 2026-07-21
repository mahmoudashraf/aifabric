import { describe, expect, it } from "vitest";

import { courseCatalog, courseLessons, getRenderedLesson, previewLessons } from "../lib/courseCatalog";

describe("generated course catalog", () => {
  it("pins the UI to the supported framework release", () => {
    expect(courseCatalog.title).toBe(
      "Build AI-Enabled Applications with Java and Spring Boot",
    );
    expect(courseCatalog.frameworkVersion).toBe("0.3.3");
    expect(courseCatalog.frameworkTag).toBe("ai-fabric-framework-v0.3.3");
    expect(courseCatalog.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
  });

  it("has unique IDs and routes across the complete catalog", () => {
    expect(courseLessons).toHaveLength(20);
    expect(new Set(courseLessons.map((lesson) => lesson.id)).size).toBe(courseLessons.length);
    expect(new Set(courseLessons.map((lesson) => lesson.route)).size).toBe(courseLessons.length);
  });

  it("renders the Quickstart and first Core preview lessons", () => {
    expect(previewLessons.map((lesson) => lesson.id)).toEqual(["qs-01", "core-01"]);
    expect(getRenderedLesson("qs-01")?.video).toBeUndefined();
    expect(getRenderedLesson("core-01")?.theoryVideoIds).toEqual([
      "what-is-ai-fabric",
      "architecture-and-modules",
      "request-lifecycle",
      "configuration-and-extension-model",
    ]);
  });

  it("keeps QS-01 action-first and hands architecture teaching to the Core track", () => {
    const lesson = getRenderedLesson("qs-01");

    expect(lesson?.markdown).toContain(
      "AI Fabric adds application-level AI capabilities to Spring Boot",
    );
    expect(lesson?.markdown).toContain("before the Core track explains the complete architecture");
    expect(lesson?.markdown).toContain("## Build Sequence");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.markdown).not.toContain("NotebookLM pre-lesson theory");
    expect(lesson?.video).toBeUndefined();
  });

  it("publishes Core 01 as a user-directed architecture lesson with verifiable outputs", () => {
    const lesson = getRenderedLesson("core-01");

    expect(lesson?.route).toBe("/course/core/mental-model");
    expect(lesson?.markdown).toContain("## Step 1: Establish The Ownership Boundary");
    expect(lesson?.markdown).toContain("### Expected Final Result");
    expect(lesson?.markdown).toContain("### Intentional Failure");
    expect(lesson?.markdown).toContain("## Troubleshooting");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.knowledgeCheck.questions).toHaveLength(6);
    expect(lesson?.assistant.mode).toBe("analyze");
  });
});
