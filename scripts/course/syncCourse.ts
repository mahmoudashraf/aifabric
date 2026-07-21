import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

import {
  courseSchema,
  knowledgeCheckSchema,
  lessonFrontMatterSchema,
  notebookSourceManifestSchema,
  type CourseLessonSource,
  type CourseSource,
  type LessonFrontMatter,
} from "./schemas";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const generatedRoot = path.join(repositoryRoot, "src/content/course/generated");

const argumentValue = (name: string) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const sourceDirectory = path.resolve(
  repositoryRoot,
  argumentValue("--source-dir") ?? process.env.AI_FABRIC_COURSE_SOURCE ?? "../ai-fabric-framework/docs/course",
);
const frameworkRoot = path.resolve(sourceDirectory, "../..");

const readText = async (filePath: string) => readFile(filePath, "utf8");
const readYaml = async (filePath: string) => parseYaml(await readText(filePath));

const checksum = (content: string) => createHash("sha256").update(content).digest("hex");

const assertInsideFramework = (filePath: string) => {
  const relativePath = path.relative(frameworkRoot, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Course source escapes the framework repository: ${filePath}`);
  }
};

const relativeFromFramework = (filePath: string) =>
  path.relative(frameworkRoot, filePath).split(path.sep).join("/");

const routeForLesson = (trackId: string, lesson: CourseLessonSource) => {
  if (trackId === "quickstart") return "/course/quickstart";
  if (trackId === "case-studies") return `/course/case-studies/${lesson.slug}`;
  if (trackId === "coding-assistants") return `/course/coding-assistants/${lesson.slug}`;
  return `/course/${trackId}/${lesson.slug}`;
};

const getSourceCommit = () => {
  try {
    return execFileSync("git", ["-C", frameworkRoot, "rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return "unknown";
  }
};

const assertUnique = (values: string[], description: string) => {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate ${description}: ${[...new Set(duplicates)].join(", ")}`);
  }
};

const validateQuestion = (question: ReturnType<typeof knowledgeCheckSchema.parse>["questions"][number]) => {
  const choiceQuestion = question.type === "single-choice" || question.type === "multiple-choice";
  if (choiceQuestion) {
    if (!question.options?.length || !question.correctOptionIds?.length || !question.explanation) {
      throw new Error(`${question.id} must define options, correctOptionIds, and an explanation`);
    }
    const optionIds = question.options.map((option) => option.id);
    assertUnique(optionIds, `option IDs in ${question.id}`);
    for (const answerId of question.correctOptionIds) {
      if (!optionIds.includes(answerId)) {
        throw new Error(`${question.id} references missing answer option ${answerId}`);
      }
    }
  }

  if (question.type === "answer-reveal" && !question.modelAnswer) {
    throw new Error(`${question.id} must define modelAnswer`);
  }
  if (question.type === "implementation-defense" && !question.reviewCriteria?.length) {
    throw new Error(`${question.id} must define reviewCriteria`);
  }
};

const syncLesson = async (
  course: CourseSource,
  trackId: string,
  lesson: CourseLessonSource,
  collectedFiles: Map<string, string>,
) => {
  if (!lesson.source) return null;

  const lessonPath = path.resolve(sourceDirectory, lesson.source);
  const lessonRaw = await readText(lessonPath);
  const parsedLesson = matter(lessonRaw);
  const frontMatter = lessonFrontMatterSchema.parse(parsedLesson.data);

  if (frontMatter.id !== lesson.id || frontMatter.slug !== lesson.slug || frontMatter.track !== trackId) {
    throw new Error(`Manifest/front-matter mismatch for ${lesson.id}`);
  }
  if (frontMatter.availability !== lesson.availability) {
    throw new Error(`Availability mismatch for ${lesson.id}`);
  }
  if (
    frontMatter.theoryVideoIds.length !== lesson.theoryVideoIds.length ||
    frontMatter.theoryVideoIds.some((videoId, index) => videoId !== lesson.theoryVideoIds[index])
  ) {
    throw new Error(`Theory-video assignment mismatch for ${lesson.id}`);
  }
  assertUnique(frontMatter.theoryVideoIds, `theory video IDs in ${lesson.id}`);
  if (
    frontMatter.courseVersion !== course.courseVersion ||
    frontMatter.frameworkVersion !== course.frameworkVersion ||
    frontMatter.frameworkTag !== course.frameworkTag
  ) {
    throw new Error(`Version mismatch for ${lesson.id}`);
  }

  if (!lesson.knowledgeCheck || !lesson.assistantPrompt || !lesson.assistantReviewPrompt) {
    throw new Error(`${lesson.id} is missing required source paths`);
  }
  if (Boolean(frontMatter.video) !== Boolean(lesson.notebookSourceManifest)) {
    throw new Error(`${lesson.id} must declare both video metadata and a NotebookLM source manifest, or neither`);
  }

  const knowledgePath = path.resolve(sourceDirectory, lesson.knowledgeCheck);
  const implementationPromptPath = path.resolve(sourceDirectory, lesson.assistantPrompt);
  const reviewPromptPath = path.resolve(sourceDirectory, lesson.assistantReviewPrompt);

  const [knowledgeRaw, implementationPrompt, reviewPrompt] = await Promise.all([
    readText(knowledgePath),
    readText(implementationPromptPath),
    readText(reviewPromptPath),
  ]);

  const knowledgeCheck = knowledgeCheckSchema.parse(parseYaml(knowledgeRaw));

  if (knowledgeCheck.lessonId !== lesson.id) {
    throw new Error(`Lesson source ID mismatch for ${lesson.id}`);
  }
  if (
    frontMatter.knowledgeCheck.source !== path.basename(knowledgePath) ||
    frontMatter.assistant.implementationPrompt !== path.basename(implementationPromptPath) ||
    frontMatter.assistant.reviewPrompt !== path.basename(reviewPromptPath)
  ) {
    throw new Error(`Lesson source-path contract mismatch for ${lesson.id}`);
  }

  assertUnique(knowledgeCheck.questions.map((question) => question.id), `question IDs in ${lesson.id}`);
  knowledgeCheck.questions.forEach(validateQuestion);

  if (frontMatter.availability === "published") {
    if (frontMatter.video && (!frontMatter.video.publicUrl || frontMatter.video.status !== "published")) {
      throw new Error(`Published lesson ${lesson.id} requires a published theory video`);
    }
    if (frontMatter.starterRef === "planned" || frontMatter.solutionRef === "planned") {
      throw new Error(`Published lesson ${lesson.id} requires immutable starter and solution refs`);
    }
  }

  const sourceFiles: Array<readonly [string, string]> = [
    [lessonPath, lessonRaw],
    [knowledgePath, knowledgeRaw],
    [implementationPromptPath, implementationPrompt],
    [reviewPromptPath, reviewPrompt],
  ];
  const lessonReferenceSources = await Promise.all(
    frontMatter.sourcePaths.map(async (sourcePath) => {
      const filePath = path.resolve(frameworkRoot, sourcePath);
      assertInsideFramework(filePath);
      return [filePath, await readText(filePath)] as const;
    }),
  );
  const knowledgeReferenceSources = await Promise.all(
    [...new Set(knowledgeCheck.questions.flatMap((question) => question.sourcePaths))].map(async (sourcePath) => {
      const filePath = path.resolve(frameworkRoot, sourcePath);
      assertInsideFramework(filePath);
      return [filePath, await readText(filePath)] as const;
    }),
  );
  sourceFiles.push(...lessonReferenceSources, ...knowledgeReferenceSources);

  let video:
    | (NonNullable<LessonFrontMatter["video"]> & {
        transcript: string;
        notebookStatus: NonNullable<LessonFrontMatter["video"]>["status"];
        reviewedAt: string | null;
        reviewedBy: string | null;
      })
    | undefined;
  if (frontMatter.video && lesson.notebookSourceManifest) {
    const notebookManifestPath = path.resolve(sourceDirectory, lesson.notebookSourceManifest);
    const notebookRaw = await readText(notebookManifestPath);
    const notebookManifest = notebookSourceManifestSchema.parse(parseYaml(notebookRaw));

    if (notebookManifest.lessonId !== lesson.id) {
      throw new Error(`NotebookLM lesson ID mismatch for ${lesson.id}`);
    }
    if (
      notebookManifest.frameworkVersion !== course.frameworkVersion ||
      notebookManifest.frameworkTag !== course.frameworkTag ||
      notebookManifest.courseVersion !== course.courseVersion
    ) {
      throw new Error(`NotebookLM source version mismatch for ${lesson.id}`);
    }
    if (frontMatter.video.sourceManifest !== path.relative(path.dirname(lessonPath), notebookManifestPath)) {
      throw new Error(`NotebookLM source-path contract mismatch for ${lesson.id}`);
    }
    if (notebookManifest.status !== frontMatter.video.status) {
      throw new Error(`NotebookLM publication status mismatch for ${lesson.id}`);
    }

    const transcriptPath = path.resolve(path.dirname(lessonPath), frontMatter.video.transcript);
    const transcript = await readText(transcriptPath);
    if (notebookManifest.outputs.transcript !== relativeFromFramework(transcriptPath)) {
      throw new Error(`NotebookLM transcript mismatch for ${lesson.id}`);
    }
    if (notebookManifest.outputs.videoUrl !== frontMatter.video.publicUrl) {
      throw new Error(`NotebookLM video URL mismatch for ${lesson.id}`);
    }

    const notebookSources = await Promise.all(
      notebookManifest.sources.map(async (source) => {
        const filePath = path.resolve(frameworkRoot, source.path);
        assertInsideFramework(filePath);
        return [filePath, await readText(filePath)] as const;
      }),
    );
    sourceFiles.push([notebookManifestPath, notebookRaw], [transcriptPath, transcript], ...notebookSources);
    video = {
      ...frontMatter.video,
      transcript,
      notebookStatus: notebookManifest.status,
      reviewedAt: notebookManifest.reviewedAt,
      reviewedBy: notebookManifest.reviewedBy,
    };
  }

  sourceFiles.forEach(([filePath, content]) => collectedFiles.set(relativeFromFramework(filePath), checksum(content)));

  return {
    ...lesson,
    track: trackId,
    route: routeForLesson(trackId, lesson),
    frontMatter,
    markdown: parsedLesson.content.trim(),
    knowledgeCheck,
    assistant: {
      mode: frontMatter.assistant.mode,
      validationStatus: frontMatter.assistant.validationStatus,
      implementationPrompt,
      reviewPrompt,
    },
    video,
    sourcePath: relativeFromFramework(lessonPath),
    sourceUrl: `https://github.com/Loom-AI-Labs/ai-fabric-framework/blob/${course.courseSourceTag === "unreleased" ? "main" : course.courseSourceTag}/${relativeFromFramework(lessonPath)}`,
  };
};

const main = async () => {
  const coursePath = path.join(sourceDirectory, "course.yml");
  const courseRaw = await readText(coursePath);
  const course = courseSchema.parse(parseYaml(courseRaw));
  if (course.status === "published" && course.courseSourceTag === "unreleased") {
    throw new Error("A published course requires an immutable courseSourceTag");
  }
  const lessonIds = course.tracks.flatMap((track) => track.lessons.map((lesson) => lesson.id));
  const routes = course.tracks.flatMap((track) => track.lessons.map((lesson) => routeForLesson(track.id, lesson)));
  assertUnique(lessonIds, "lesson IDs");
  assertUnique(routes, "lesson routes");

  const collectedFiles = new Map<string, string>();
  collectedFiles.set(relativeFromFramework(coursePath), checksum(courseRaw));

  const generatedLessons = [];
  for (const track of course.tracks) {
    for (const lesson of track.lessons) {
      const generated = await syncLesson(course, track.id, lesson, collectedFiles);
      if (generated) generatedLessons.push(generated);
    }
  }

  await rm(generatedRoot, { recursive: true, force: true });
  await mkdir(path.join(generatedRoot, "lessons"), { recursive: true });

  const generatedCourse = {
    ...course,
    sourceCommit: getSourceCommit(),
    generatedAt: new Date().toISOString(),
    tracks: course.tracks.map((track) => ({
      ...track,
      lessons: track.lessons.map((lesson) => ({
        ...lesson,
        route: routeForLesson(track.id, lesson),
      })),
    })),
  };

  await writeFile(path.join(generatedRoot, "course.json"), `${JSON.stringify(generatedCourse, null, 2)}\n`);
  for (const lesson of generatedLessons) {
    await writeFile(path.join(generatedRoot, "lessons", `${lesson.id}.json`), `${JSON.stringify(lesson, null, 2)}\n`);
  }

  const sourceManifest = {
    schemaVersion: 1,
    frameworkRepository: "https://github.com/Loom-AI-Labs/ai-fabric-framework",
    courseVersion: course.courseVersion,
    frameworkVersion: course.frameworkVersion,
    frameworkTag: course.frameworkTag,
    courseSourceTag: course.courseSourceTag,
    sourceCommit: generatedCourse.sourceCommit,
    generatedAt: generatedCourse.generatedAt,
    files: [...collectedFiles.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([sourcePath, sha256]) => ({ sourcePath, sha256 })),
  };
  await writeFile(path.join(generatedRoot, "source-manifest.json"), `${JSON.stringify(sourceManifest, null, 2)}\n`);

  process.stdout.write(
    `Synced ${generatedLessons.length} course lesson(s) from ${sourceDirectory}\n` +
      `Course ${course.courseVersion}, framework ${course.frameworkVersion}, source ${generatedCourse.sourceCommit}\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
