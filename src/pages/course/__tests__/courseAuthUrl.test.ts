import { describe, expect, it } from "vitest";

import { getCourseAuthCallbackIssue, getCourseAuthCleanUrl } from "../lib/courseAuthUrl";

describe("course OAuth callback URLs", () => {
  it("recognizes an external provider profile failure from the query or hash", () => {
    const description = "Error getting user profile from external provider";
    const href = `https://ai-fabric.dev/course?error=server_error&error_description=${encodeURIComponent(
      description,
    )}#error=server_error&error_description=${encodeURIComponent(description)}&sb=`;

    expect(getCourseAuthCallbackIssue(href)).toBe(
      "GitHub could not provide your profile. This is usually temporary; please retry shortly.",
    );
  });

  it("removes OAuth failure state while preserving ordinary course parameters", () => {
    const cleanUrl = getCourseAuthCleanUrl(
      "https://ai-fabric.dev/course?lesson=quickstart&error=server_error&error_code=unexpected_failure#error=server_error&sb=",
    );

    expect(cleanUrl).toBe("https://ai-fabric.dev/course?lesson=quickstart");
  });

  it("preserves a normal lesson anchor", () => {
    const href = "https://ai-fabric.dev/course/quickstart#knowledge-check";

    expect(getCourseAuthCleanUrl(href)).toBe(href);
    expect(getCourseAuthCallbackIssue(href)).toBeNull();
  });
});
