import { resolveMarkdownHref } from "../lib/markdown";

describe("course Markdown links", () => {
  const sourceUrl =
    "https://github.com/Loom-AI-Labs/ai-fabric-framework/blob/ai-fabric-course-v0.3.3.2/docs/course/core/03-evidence-grounded-rag/lesson.md";

  it("resolves repository-relative links against the immutable lesson source", () => {
    expect(resolveMarkdownHref("../../labs/AI_FABRIC_CHAT_UI_LAB.md", sourceUrl)).toBe(
      "https://github.com/Loom-AI-Labs/ai-fabric-framework/blob/ai-fabric-course-v0.3.3.2/docs/course/labs/AI_FABRIC_CHAT_UI_LAB.md",
    );
  });

  it("preserves website routes, anchors, and external URLs", () => {
    expect(resolveMarkdownHref("/course", sourceUrl)).toBe("/course");
    expect(resolveMarkdownHref("#done-when", sourceUrl)).toBe("#done-when");
    expect(resolveMarkdownHref("https://ai-fabric.dev", sourceUrl)).toBe("https://ai-fabric.dev");
  });
});
