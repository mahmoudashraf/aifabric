import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  DurableAnalysisCard,
  pendingComparisonForAnalysis,
  type DurableAnalysisView,
  type RecoveryComparison,
} from "../AIFabricBehaviorSignals";

describe("Behavior Signals durable execution proof", () => {
  it("preserves a pending event comparison until follow-up analysis supplies the after insight", () => {
    const pending: RecoveryComparison = {
      kind: "churn-risk",
      before: null,
      after: null,
      addedEventTypes: ["PAYMENT_FAILED"],
    };
    const completed: RecoveryComparison = {
      ...pending,
      after: {} as RecoveryComparison["after"],
    };

    expect(pendingComparisonForAnalysis(pending)).toBe(pending);
    expect(pendingComparisonForAnalysis(completed)).toBeNull();
    expect(pendingComparisonForAnalysis(null)).toBeNull();
  });

  it("shows the backend-owned scheduled source and system principal", () => {
    const analysis: DurableAnalysisView = {
      invocationId: "behavior-invocation-123456789",
      userId: "behavior-user-1",
      durability: "DURABLE",
      status: "SUCCEEDED",
      executionSource: "SCHEDULED",
      principalType: "SYSTEM",
      replayed: false,
      submittedAt: "2026-09-06T12:00:00Z",
      deadline: null,
      expiresAt: "2026-09-07T12:00:00Z",
      previousInsight: {},
      consideredEvents: [{ eventId: "event-1", eventType: "PLAN_DOWNGRADED" }],
      consideredEventCount: 1,
      projectionStatus: "APPLIED",
      result: null,
      failure: null,
    };

    render(<DurableAnalysisCard analysis={analysis} onCancel={vi.fn()} />);

    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
    expect(screen.getByText("PLAN_DOWNGRADED")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /cancel analysis/i })).not.toBeInTheDocument();
  });
});
