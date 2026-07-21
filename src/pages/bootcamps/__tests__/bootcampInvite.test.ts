import { describe, expect, it } from "vitest";

import {
  bootcampInvitationStorageKey,
  captureBootcampInvitationFromUrl,
  clearBootcampInvitationCode,
  readBootcampInvitationCode,
  storeBootcampInvitationCode,
} from "../lib/bootcampInvite";

const slug = "ai-enabled-java-arabic";

describe("bootcamp invitation URL state", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("captures the query code and removes it from the browser-safe path", () => {
    const result = captureBootcampInvitationFromUrl(
      "https://ai-fabric.dev/bootcamps/ai-enabled-java-arabic?code=Invite-2026&utm_source=linkedin#join",
      slug,
    );

    expect(result).toEqual({
      code: "Invite-2026",
      cleanPath: "/bootcamps/ai-enabled-java-arabic?utm_source=linkedin#join",
    });
    expect(window.sessionStorage.getItem(bootcampInvitationStorageKey(slug))).toBe("Invite-2026");
  });

  it("restores a manually entered code after authentication navigation", () => {
    storeBootcampInvitationCode(slug, "AIFABRIC-AR-CODE");

    const result = captureBootcampInvitationFromUrl(
      "https://ai-fabric.dev/bootcamps/ai-enabled-java-arabic",
      slug,
    );

    expect(result.code).toBe("AIFABRIC-AR-CODE");
    expect(readBootcampInvitationCode(slug)).toBe("AIFABRIC-AR-CODE");
  });

  it("does not persist malformed short codes and clears successful codes", () => {
    storeBootcampInvitationCode(slug, "x");
    expect(readBootcampInvitationCode(slug)).toBe("");

    storeBootcampInvitationCode(slug, "VALID-CODE");
    clearBootcampInvitationCode(slug);
    expect(readBootcampInvitationCode(slug)).toBe("");
  });
});
