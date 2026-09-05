import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TransitionView } from "../AIFabricIncidentInvestigation";

describe("Incident Investigation transition result", () => {
  it("renders a valid no-transition intake result instead of dereferencing null lineage", () => {
    render(
      <TransitionView
        mode="delegations"
        result={{
          intake: {
            invocationId: "exec-intake",
            specialistId: { name: "incident-intake", version: "1" },
            status: "SUCCEEDED",
            output: {
              decision: "COMPLETE",
              targetSpecialist: null,
              reason: "The request requires both investigation branches.",
            },
            evidence: [],
            diagnostics: {},
            failure: null,
            startedAt: "2026-09-05T18:00:00Z",
            completedAt: "2026-09-05T18:00:01Z",
          },
          transition: null,
          secondTransitionCanary: null,
        }}
      />,
    );

    expect(screen.getByText("No specialist transition was selected")).toBeInTheDocument();
    expect(screen.getByText(/returned COMPLETE/i)).toBeInTheDocument();
  });
});
