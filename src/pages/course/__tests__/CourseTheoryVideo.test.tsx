import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { CourseTheoryVideo } from "../components/CourseTheoryVideo";
import { getRenderedLesson } from "../lib/courseCatalog";

vi.mock("../hooks/useCourseAuth", () => ({
  useCourseAuth: () => ({
    user: null,
    githubAvailable: false,
    configurationIssue: "Sign-in is unavailable in this test",
    signInWithGitHub: vi.fn(),
  }),
}));

describe("CourseTheoryVideo", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the complete Core 01 theory sequence", () => {
    const lesson = getRenderedLesson("core-01");
    if (!lesson) throw new Error("CORE-01 generated lesson is missing");

    render(
      <CourseTheoryVideo
        lesson={lesson}
        saving={false}
        onMarkWatched={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Assigned theory videos").querySelectorAll("button")).toHaveLength(4);
    expect(screen.getByTitle("What is AI Fabric? lesson video in English")).toHaveAttribute(
      "src",
      expect.stringContaining("hGEfZQeqHks"),
    );
  });

  it("uses Arabic when published and identifies a per-topic English fallback", () => {
    const lesson = getRenderedLesson("core-01");
    if (!lesson) throw new Error("CORE-01 generated lesson is missing");

    render(
      <CourseTheoryVideo
        lesson={lesson}
        saving={false}
        onMarkWatched={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "العربية" }));
    expect(screen.getByTitle("What is AI Fabric? lesson video in Arabic")).toHaveAttribute(
      "src",
      expect.stringContaining("_iiLnn0Ap7U"),
    );

    fireEvent.click(screen.getByRole("button", { name: /architecture and module map/i }));
    expect(screen.getByTitle("Architecture and module map lesson video in English")).toHaveAttribute(
      "src",
      expect.stringContaining("A35b0-9wU78"),
    );
    expect(screen.getByText(/the arabic recording for this topic is not available yet/i)).toBeInTheDocument();
  });
});
