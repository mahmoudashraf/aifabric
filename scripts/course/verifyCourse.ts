import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { courseSchema, knowledgeCheckSchema, lessonFrontMatterSchema } from "./schemas";
import { courseTheoryVideos } from "../../src/pages/course/lib/courseVideoCatalog";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const generatedRoot = path.join(repositoryRoot, "src/content/course/generated");

const readJson = async (filePath: string) => JSON.parse(await readFile(filePath, "utf8"));

const main = async () => {
  const generatedCourse = await readJson(path.join(generatedRoot, "course.json"));
  const course = courseSchema.parse(generatedCourse);
  const lessonIds = new Set<string>();
  const routes = new Set<string>();
  let renderedLessons = 0;
  const assignedTheoryVideos = new Set<string>();
  const knownTheoryVideos = new Set(courseTheoryVideos.map((video) => video.id));

  for (const track of generatedCourse.tracks) {
    for (const lesson of track.lessons) {
      if (lessonIds.has(lesson.id)) throw new Error(`Duplicate lesson ID ${lesson.id}`);
      lessonIds.add(lesson.id);

      const generatedLessonRoute = lesson.route;
      if (!generatedLessonRoute) throw new Error(`${lesson.id} is missing a generated route`);
      if (routes.has(generatedLessonRoute)) throw new Error(`Duplicate lesson route ${generatedLessonRoute}`);
      routes.add(generatedLessonRoute);

      if (!lesson.source) continue;
      const generatedLesson = await readJson(path.join(generatedRoot, "lessons", `${lesson.id}.json`));
      const frontMatter = lessonFrontMatterSchema.parse(generatedLesson.frontMatter);
      const knowledgeCheck = knowledgeCheckSchema.parse(generatedLesson.knowledgeCheck);

      if (frontMatter.id !== lesson.id || knowledgeCheck.lessonId !== lesson.id) {
        throw new Error(`Generated lesson mismatch for ${lesson.id}`);
      }
      if (!generatedLesson.markdown?.trim()) throw new Error(`${lesson.id} has empty Markdown`);
      for (const videoId of frontMatter.theoryVideoIds) {
        if (!knownTheoryVideos.has(videoId)) {
          throw new Error(`${lesson.id} references unknown theory video ${videoId}`);
        }
        if (assignedTheoryVideos.has(videoId)) {
          throw new Error(`Theory video ${videoId} is assigned to more than one rendered lesson`);
        }
        assignedTheoryVideos.add(videoId);
      }
      if (frontMatter.video && !generatedLesson.video?.transcript?.trim()) {
        throw new Error(`${lesson.id} declares theory media but has no transcript/source brief`);
      }
      renderedLessons += 1;
    }
  }

  const sourceManifest = await readJson(path.join(generatedRoot, "source-manifest.json"));
  if (sourceManifest.courseVersion !== course.courseVersion) {
    throw new Error("Generated source manifest course version does not match course.json");
  }
  if (!sourceManifest.sourceCommit || !sourceManifest.files?.length) {
    throw new Error("Generated source manifest is incomplete");
  }

  process.stdout.write(
    `Verified ${course.tracks.length} tracks, ${lessonIds.size} catalog lessons, and ${renderedLessons} rendered lesson(s)\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
