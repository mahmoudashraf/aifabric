import { describe, expect, it } from "vitest";

import {
  courseTheoryVideos,
  resolveCourseVideoSource,
} from "../lib/courseVideoCatalog";

describe("course video catalog", () => {
  it("maps the English and Arabic course introductions", () => {
    const introduction = courseTheoryVideos.find((video) => video.id === "course-introduction");

    expect(introduction?.sources.en.videoId).toBe("wYlGylSS7DY");
    expect(introduction?.sources.ar?.videoId).toBe("5ilCq__D1A0");
  });

  it("maps both language versions of the AI Fabric introduction", () => {
    const introduction = courseTheoryVideos.find((video) => video.id === "what-is-ai-fabric");

    expect(introduction?.sources.en.videoId).toBe("hGEfZQeqHks");
    expect(introduction?.sources.ar?.videoId).toBe("_iiLnn0Ap7U");
  });

  it("falls back to English only when the requested Arabic recording is missing", () => {
    const architecture = courseTheoryVideos.find((video) => video.id === "architecture-and-modules");
    if (!architecture) throw new Error("Architecture video is missing from the course catalog");

    expect(resolveCourseVideoSource(architecture, "ar")).toEqual({
      source: { videoId: "A35b0-9wU78", durationLabel: "9 min" },
      language: "en",
      fallback: true,
    });
  });
});
