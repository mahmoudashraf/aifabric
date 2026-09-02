import { render, screen } from "@testing-library/react";

import { DemoBackendArchitecture } from "../DemoBackendArchitecture";
import { demoBackendArchitectures } from "../demoBackendArchitectures";

describe("DemoBackendArchitecture", () => {
  it("allows long developer identifiers to shrink inside mobile grid tracks", () => {
    render(<DemoBackendArchitecture architecture={demoBackendArchitectures.agenticActionResolver} />);

    const longEnvironmentVariable = screen.getByText("AI_EXECUTION_RECEIPT_FINGERPRINT_SECRET");

    expect(longEnvironmentVariable).toHaveClass("min-w-0", "break-all");
    expect(longEnvironmentVariable.parentElement).toHaveClass("min-w-0");
    expect(longEnvironmentVariable.parentElement?.parentElement).toHaveClass("min-w-0");
  });
});
