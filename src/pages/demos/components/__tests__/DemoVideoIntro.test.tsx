import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import DemoVideoIntro from "../DemoVideoIntro";
import { demoVideoCatalog, demoVideoDismissalKey } from "../demoVideoCatalog";

const renderIntro = (config = demoVideoCatalog.accountResolver) =>
  render(
    <MemoryRouter>
      <DemoVideoIntro config={config}>
        <div>Interactive demo content</div>
      </DemoVideoIntro>
    </MemoryRouter>
  );

describe("DemoVideoIntro", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.scrollTo = vi.fn();
  });

  it("shows the walkthrough before the interactive demo", () => {
    renderIntro();

    expect(screen.getByRole("heading", { name: /see ai fabric account resolver in action/i })).toBeInTheDocument();
    expect(screen.getByTitle("AI Fabric Account Resolver walkthrough")).toHaveAttribute(
      "src",
      expect.stringContaining("GJ9H16eMdO0")
    );
    expect(screen.queryByText("Interactive demo content")).not.toBeInTheDocument();
  });

  it("dismisses the walkthrough for the current browser session", () => {
    renderIntro();

    fireEvent.click(screen.getByRole("button", { name: "Open live demo" }));

    expect(screen.getByText("Interactive demo content")).toBeInTheDocument();
    expect(window.sessionStorage.getItem(demoVideoDismissalKey("account-resolver"))).toBe("true");
  });

  it("honors an existing dismissal", () => {
    window.sessionStorage.setItem(demoVideoDismissalKey("account-resolver"), "true");

    renderIntro();

    expect(screen.getByText("Interactive demo content")).toBeInTheDocument();
    expect(screen.queryByTitle("AI Fabric Account Resolver walkthrough")).not.toBeInTheDocument();
  });

  it("switches between the English and Arabic shopping videos", () => {
    renderIntro(demoVideoCatalog.shopping);

    expect(screen.getByTitle("AI Shopping Experience walkthrough in English")).toHaveAttribute(
      "src",
      expect.stringContaining("xnLuz-mlKMY")
    );

    fireEvent.click(screen.getByRole("button", { name: "العربية" }));

    expect(screen.getByTitle("AI Shopping Experience walkthrough in Arabic")).toHaveAttribute(
      "src",
      expect.stringContaining("PMRN4xA874Y")
    );
  });
});
