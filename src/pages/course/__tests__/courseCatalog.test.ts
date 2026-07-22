import { describe, expect, it } from "vitest";

import { courseCatalog, courseLessons, getRenderedLesson, previewLessons, publishedLessons } from "../lib/courseCatalog";

describe("generated course catalog", () => {
  it("pins the UI to the supported framework release", () => {
    expect(courseCatalog.title).toBe(
      "Build AI-Enabled Applications with Java and Spring Boot",
    );
    expect(courseCatalog.frameworkVersion).toBe("0.3.3");
    expect(courseCatalog.frameworkTag).toBe("ai-fabric-framework-v0.3.3");
    expect(courseCatalog.courseSourceTag).toBe("ai-fabric-course-v0.3.3.1");
    expect(courseCatalog.learnerRepository).toBe(
      "https://github.com/Loom-AI-Labs/ai-fabric-course-support-assistant",
    );
    expect(courseCatalog.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
  });

  it("has unique IDs and routes across the complete catalog", () => {
    expect(courseLessons).toHaveLength(20);
    expect(new Set(courseLessons.map((lesson) => lesson.id)).size).toBe(courseLessons.length);
    expect(new Set(courseLessons.map((lesson) => lesson.route)).size).toBe(courseLessons.length);
  });

  it("publishes the Quickstart and complete Core checkpoint path", () => {
    expect(previewLessons).toEqual([]);
    expect(publishedLessons.map((lesson) => lesson.id)).toEqual([
      "qs-01",
      "core-01",
      "core-02",
      "core-03",
      "core-04",
      "core-05",
      "core-06",
      "core-07",
    ]);
    expect([
      ["qs-01", "course-0.3.3-00-starter", "course-0.3.3-01-first-search"],
      ["core-01", "course-0.3.3-00-starter", "course-0.3.3-00-starter"],
      ["core-02", "course-0.3.3-00-starter", "course-0.3.3-01-first-search"],
      ["core-03", "course-0.3.3-01-first-search", "course-0.3.3-02-rag"],
      ["core-04", "course-0.3.3-02-rag", "course-0.3.3-03-actions"],
      ["core-05", "course-0.3.3-03-actions", "course-0.3.3-04-memory"],
      ["core-06", "course-0.3.3-04-memory", "course-0.3.3-05-security"],
      ["core-07", "course-0.3.3-05-security", "course-0.3.3-06-tested-solution"],
    ]).toEqual(publishedLessons.map((summary) => {
      const rendered = getRenderedLesson(summary.id);
      return [summary.id, rendered?.frontMatter.starterRef, rendered?.frontMatter.solutionRef];
    }));
    expect(publishedLessons.every((summary) => getRenderedLesson(summary.id)?.assistant.validationStatus === "passed"))
      .toBe(true);
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

  it("publishes Core 02 as an evidence-lifecycle lab", () => {
    const lesson = getRenderedLesson("core-02");

    expect(lesson?.route).toBe("/course/core/model-and-index-data");
    expect(lesson?.theoryVideoIds).toEqual(["searchable-evidence"]);
    expect(lesson?.markdown).toContain("## Step 1: Define The Evidence Contract");
    expect(lesson?.markdown).toContain("## Step 6: Run The Complete Lifecycle Test");
    expect(lesson?.markdown).toContain("## Step 7: Trigger And Correct The Metadata Failure");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.knowledgeCheck.questions).toHaveLength(6);
    expect(lesson?.assistant.mode).toBe("implement");
  });

  it("publishes Core 03 as a fail-closed grounded-RAG lab", () => {
    const lesson = getRenderedLesson("core-03");

    expect(lesson?.route).toBe("/course/core/evidence-grounded-rag");
    expect(lesson?.theoryVideoIds).toEqual(["evidence-grounded-rag"]);
    expect(lesson?.markdown).toContain("## Step 3: Retrieve Documents And Context");
    expect(lesson?.markdown).toContain("## Step 4: Stop On Retrieval Failure Or No Evidence");
    expect(lesson?.markdown).toContain("## Step 8: Reproduce The Empty-Index Failure");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.knowledgeCheck.questions).toHaveLength(6);
    expect(lesson?.assistant.mode).toBe("implement");
  });

  it("publishes Core 04 as a governed-action state-machine lab", () => {
    const lesson = getRenderedLesson("core-04");

    expect(lesson?.route).toBe("/course/core/governed-actions");
    expect(lesson?.theoryVideoIds).toEqual(["governed-actions-and-confirmation"]);
    expect(lesson?.markdown).toContain("## Step 4: Keep Context-Owned Values Out Of `@Param`");
    expect(lesson?.markdown).toContain("## Step 7: Test The Confirmation State Machine");
    expect(lesson?.markdown).toContain("### Duplicate Confirm");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.knowledgeCheck.questions).toHaveLength(6);
    expect(lesson?.assistant.mode).toBe("implement");
  });

  it("publishes Core 05 as a backend-owned conversation-memory lab", () => {
    const lesson = getRenderedLesson("core-05");

    expect(lesson?.route).toBe("/course/core/backend-conversation-memory");
    expect(lesson?.theoryVideoIds).toEqual(["backend-conversation-memory"]);
    expect(lesson?.markdown).toContain("## Step 2: Reduce The Client Request To Current-Turn Data");
    expect(lesson?.markdown).toContain("## Step 6: Preserve And Consume Pending Confirmation");
    expect(lesson?.markdown).toContain("## Step 9: Keep Transient Requests Out Of Memory");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.knowledgeCheck.questions).toHaveLength(6);
    expect(lesson?.assistant.mode).toBe("implement");
  });

  it("publishes Core 06 as a pre-generation tenant and privacy boundary lab", () => {
    const lesson = getRenderedLesson("core-06");

    expect(lesson?.route).toBe("/course/core/tenant-security-and-privacy");
    expect(lesson?.theoryVideoIds).toEqual(["tenant-security-and-privacy"]);
    expect(lesson?.markdown).toContain("## Step 4: Implement A Fail-Closed Entry Policy");
    expect(lesson?.markdown).toContain("## Step 7: Verify Hits Before Building Generation Context");
    expect(lesson?.markdown).toContain("## Step 12: Run The Boundary Regression Matrix");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.knowledgeCheck.questions).toHaveLength(6);
    expect(lesson?.assistant.mode).toBe("implement");
  });

  it("publishes Core 07 as a layered release-gate lesson", () => {
    const lesson = getRenderedLesson("core-07");

    expect(lesson?.route).toBe("/course/core/test-and-ship");
    expect(lesson?.theoryVideoIds).toEqual(["testing-and-shipping"]);
    expect(lesson?.markdown).toContain("## Step 1: Build A Requirement-To-Proof Matrix");
    expect(lesson?.markdown).toContain("## Step 10: Prove Live Failure Visibility");
    expect(lesson?.markdown).toContain("## Step 14: Make The Release Decision");
    expect(lesson?.markdown).not.toMatch(/\bthe learner\b/i);
    expect(lesson?.knowledgeCheck.questions).toHaveLength(6);
    expect(lesson?.assistant.mode).toBe("verify");
  });
});
