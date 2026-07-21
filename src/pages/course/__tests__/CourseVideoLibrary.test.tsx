import { fireEvent, render, screen } from "@testing-library/react";

import { CourseVideoLibrary } from "../components/CourseVideoLibrary";
import { COURSE_VIDEO_LANGUAGE_KEY } from "../lib/courseVideoCatalog";

describe("CourseVideoLibrary", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the English course introduction by default", () => {
    render(<CourseVideoLibrary />);

    expect(screen.getByTitle("Course introduction course video in English")).toHaveAttribute(
      "src",
      expect.stringContaining("wYlGylSS7DY"),
    );
    expect(screen.getByText(/lesson text, code, questions, and saved progress stay identical/i)).toBeInTheDocument();
  });

  it("switches only the recording when Arabic is selected", () => {
    render(<CourseVideoLibrary />);
    const unchangedDescription = screen.getByText(
      "Understand the learning path and the production problems the course will solve.",
    );

    fireEvent.click(screen.getByRole("button", { name: "العربية" }));

    expect(screen.getByTitle("Course introduction course video in Arabic")).toHaveAttribute(
      "src",
      expect.stringContaining("5ilCq__D1A0"),
    );
    expect(unchangedDescription).toBeInTheDocument();
    expect(window.localStorage.getItem(COURSE_VIDEO_LANGUAGE_KEY)).toBe("ar");
  });

  it("shows the English architecture recording and an honest fallback notice in Arabic mode", () => {
    render(<CourseVideoLibrary />);

    fireEvent.click(screen.getByRole("button", { name: "العربية" }));
    fireEvent.click(screen.getByRole("button", { name: /architecture and module map/i }));

    expect(screen.getByTitle("Architecture and module map course video in English")).toHaveAttribute(
      "src",
      expect.stringContaining("A35b0-9wU78"),
    );
    expect(screen.getByText(/the arabic recording for this topic is not available yet/i)).toBeInTheDocument();
  });

  it("shows the Arabic request-lifecycle recording when it is available", () => {
    render(<CourseVideoLibrary />);

    fireEvent.click(screen.getByRole("button", { name: "العربية" }));
    fireEvent.click(screen.getByRole("button", { name: /request lifecycle/i }));

    expect(screen.getByTitle("Request lifecycle course video in Arabic")).toHaveAttribute(
      "src",
      expect.stringContaining("k5El0gzVnGY"),
    );
    expect(screen.queryByText(/the arabic recording for this topic is not available yet/i)).not.toBeInTheDocument();
  });

  it("restores the saved video language on a later visit", () => {
    window.localStorage.setItem(COURSE_VIDEO_LANGUAGE_KEY, "ar");

    render(<CourseVideoLibrary />);

    expect(screen.getByRole("button", { name: "العربية" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTitle("Course introduction course video in Arabic")).toBeInTheDocument();
  });
});
