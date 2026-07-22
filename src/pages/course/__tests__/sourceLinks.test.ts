import { describe, expect, it } from "vitest";

import { courseEvidenceSourceUrl } from "../lib/sourceLinks";

const publishedLesson = {
  availability: "published" as const,
  courseSourceTag: "ai-fabric-course-v1",
  frameworkTag: "ai-fabric-framework-v1",
};

describe("courseEvidenceSourceUrl", () => {
  it("uses main for canonical documentation cited by a preview lesson", () => {
    expect(
      courseEvidenceSourceUrl(
        { ...publishedLesson, availability: "preview" },
        "docs/course/production/08-production-ready/lesson.md",
      ),
    ).toContain("/blob/main/docs/course/production/08-production-ready/lesson.md");
  });

  it("keeps published course documentation on its immutable course tag", () => {
    expect(courseEvidenceSourceUrl(publishedLesson, "docs/course/core/lesson.md")).toContain(
      "/blob/ai-fabric-course-v1/docs/course/core/lesson.md",
    );
  });

  it("keeps framework code citations on the immutable framework tag", () => {
    expect(
      courseEvidenceSourceUrl(
        { ...publishedLesson, availability: "preview" },
        "ai-infrastructure-module/ai-fabric-core/src/main/java/ai/fabric/core/AICoreService.java",
      ),
    ).toContain("/blob/ai-fabric-framework-v1/ai-infrastructure-module/");
  });
});
