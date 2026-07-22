import type { RenderedCourseLesson } from "../types";

type SourceLinkLesson = Pick<
  RenderedCourseLesson["frontMatter"],
  "availability" | "courseSourceTag" | "frameworkTag"
>;

const FRAMEWORK_REPOSITORY = "https://github.com/Loom-AI-Labs/ai-fabric-framework";

export const courseEvidenceSourceUrl = (lesson: SourceLinkLesson, sourcePath: string) => {
  const sourceRef = sourcePath.startsWith("docs/")
    ? lesson.availability === "preview" || lesson.courseSourceTag === "unreleased"
      ? "main"
      : lesson.courseSourceTag
    : lesson.frameworkTag;

  return `${FRAMEWORK_REPOSITORY}/blob/${sourceRef}/${sourcePath}`;
};
