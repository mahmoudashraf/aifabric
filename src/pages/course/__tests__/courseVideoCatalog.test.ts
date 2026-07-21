import { describe, expect, it } from "vitest";

import {
  courseTheoryVideos,
  resolveCourseVideoSource,
} from "../lib/courseVideoCatalog";

describe("course video catalog", () => {
  const expectedEnglishVideos = {
    "course-introduction": "wYlGylSS7DY",
    "what-is-ai-fabric": "hGEfZQeqHks",
    "architecture-and-modules": "A35b0-9wU78",
    "request-lifecycle": "mZsoJwFDlZ4",
    "configuration-and-extension-model": "bJpeLbrqZb0",
    "searchable-evidence": "G_qBre7Be1s",
    "evidence-grounded-rag": "T-h-BMjwaXc",
    "governed-actions-and-confirmation": "bTZ08ApmpUQ",
    "backend-conversation-memory": "O1wf-w1Hg0k",
    "tenant-security-and-privacy": "mhO8CrOqpt0",
    "testing-and-shipping": "W_mlsCxAePs",
  };

  it("maps every published English theory video exactly once", () => {
    expect(courseTheoryVideos).toHaveLength(Object.keys(expectedEnglishVideos).length);
    expect(Object.fromEntries(courseTheoryVideos.map((video) => [video.id, video.sources.en.videoId])))
      .toEqual(expectedEnglishVideos);
    expect(new Set(courseTheoryVideos.map((video) => video.sources.en.videoId)).size)
      .toBe(courseTheoryVideos.length);
  });

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

  it("uses the published Arabic request-lifecycle recording without fallback", () => {
    const requestLifecycle = courseTheoryVideos.find((video) => video.id === "request-lifecycle");
    if (!requestLifecycle) throw new Error("Request-lifecycle video is missing from the course catalog");

    expect(resolveCourseVideoSource(requestLifecycle, "ar")).toEqual({
      source: { videoId: "k5El0gzVnGY", durationLabel: "7 min 49 sec" },
      language: "ar",
      fallback: false,
    });
  });
});
