import { describe, expect, it } from "vitest";

import {
  bootcampEnrollmentSchema,
  bootcampInterestSchema,
  normalizeInternationalPhone,
} from "../lib/bootcampValidation";

describe("bootcamp enrollment validation", () => {
  it("normalizes a valid international WhatsApp number", () => {
    const result = bootcampEnrollmentSchema.parse({
      invitationCode: " AIFABRIC-AR-CODE ",
      phone: "+44 7700-900-123",
      whatsappConsent: true,
    });

    expect(result).toEqual({
      invitationCode: "AIFABRIC-AR-CODE",
      phone: "+447700900123",
      whatsappConsent: true,
    });
  });

  it("requires both an international phone and communication consent", () => {
    expect(
      bootcampEnrollmentSchema.safeParse({
        invitationCode: "AIFABRIC-AR-CODE",
        phone: "07700 900123",
        whatsappConsent: false,
      }).success,
    ).toBe(false);
  });
});

describe("bootcamp interest validation", () => {
  const base = {
    contactEmail: "developer@example.com",
    phone: "",
    emailConsent: true,
    whatsappConsent: false,
    website: "",
  };

  it("allows email-only registration for the coming-soon English cohort", () => {
    expect(bootcampInterestSchema.safeParse(base).success).toBe(true);
  });

  it("requires WhatsApp consent only when an optional phone is supplied", () => {
    expect(
      bootcampInterestSchema.safeParse({ ...base, phone: "+447700900123" }).success,
    ).toBe(false);
    expect(
      bootcampInterestSchema.safeParse({
        ...base,
        phone: "+447700900123",
        whatsappConsent: true,
      }).success,
    ).toBe(true);
  });

  it("keeps phone normalization consistent with the backend", () => {
    expect(normalizeInternationalPhone("+44 (7700) 900-123")).toBe("+447700900123");
  });
});
