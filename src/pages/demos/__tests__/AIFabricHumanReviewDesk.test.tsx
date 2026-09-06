import { describe, expect, it } from "vitest";

import { REVIEW_JOURNEYS, responseFor } from "../agentic-resolver/reviewJourneys";

describe("Human Review Desk guided journeys", () => {
  it("covers every policy-supported review decision", () => {
    expect(new Set(REVIEW_JOURNEYS.map((journey) => journey.decision))).toEqual(
      new Set(["APPROVE", "REJECT", "CORRECT", "REQUEST_INFORMATION", "ESCALATE"]),
    );
    expect(REVIEW_JOURNEYS.every((journey) => journey.steps.length >= 3)).toBe(true);
  });

  it("builds only the safe response fields required by correction and information decisions", () => {
    expect(responseFor("CORRECT", "20", "Approved limit")).toEqual({
      resolutionType: "ACCOUNT_CREDIT",
      amount: 20,
      reason: "Approved limit",
    });
    expect(responseFor("REQUEST_INFORMATION", "20", "Provide incident reference")).toEqual({
      question: "Provide incident reference",
    });
    expect(responseFor("APPROVE", "20", "ignored")).toBeUndefined();
  });
});
