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

  it.each([
    ["prod-01", "Provider architecture and purpose routing", "2lRTNp63NNI"],
    ["prod-02", "Modes, positions, and orchestration policy", "G0WvJ1PQj0s"],
    ["prod-03", "Prompt bundles, curated packs, and application overlays", "bvKibVVbPcA"],
    ["prod-04", "State and storage in an AI Fabric application", "epjF29WfEUM"],
    ["prod-05", "Keep AI evidence synchronized", "wZ5e0MPSXRI"],
    ["prod-06", "RAG quality and prompt regression", "bSyMDQORJOY"],
    ["prod-07", "Managed vector providers and Qdrant lifecycle", "TCgEbDsUzic"],
    ["prod-08", "Operations and release readiness", "MrvMGlUN0fs"],
  ])("renders the published recording assigned to %s", (lessonId, videoTitle, videoId) => {
    const lesson = getRenderedLesson(lessonId);
    if (!lesson) throw new Error(`${lessonId} generated lesson is missing`);

    render(
      <CourseTheoryVideo
        lesson={lesson}
        saving={false}
        onMarkWatched={vi.fn()}
      />,
    );

    expect(screen.getByTitle(`${videoTitle} lesson video in English`))
      .toHaveAttribute("src", expect.stringContaining(videoId));
  });
});
