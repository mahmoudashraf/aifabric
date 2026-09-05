import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SpecialistOutput } from "../AIFabricAgenticActionResolver";

describe("Agentic Action Resolver specialist output", () => {
  it("renders the billing advisor contract returned after typed-input resume", () => {
    render(
      <SpecialistOutput
        output={{
          resolutionType: "REFUND",
          amount: 75,
          decision: "REVIEW_REQUIRED",
          expectedStatus: "PENDING_REVIEW",
          automaticLimit: 50,
          explanation: "Routed to review because this refund is above the automatic limit.",
        }}
      />,
    );

    expect(screen.getByText("REVIEW REQUIRED")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
    expect(screen.getByText("PENDING REVIEW")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });

  it("fails visibly for an unknown output contract instead of crashing or dumping raw data", () => {
    render(<SpecialistOutput output={{ unexpected: "shape" }} />);

    expect(screen.getByText("Unsupported specialist output")).toBeInTheDocument();
    expect(screen.queryByText("shape")).not.toBeInTheDocument();
  });
});
