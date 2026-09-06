import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DurableAnalysisCard, type DurableAnalysisView } from "../AIFabricBehaviorSignals";

describe("Behavior Signals durable execution proof", () => {
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
