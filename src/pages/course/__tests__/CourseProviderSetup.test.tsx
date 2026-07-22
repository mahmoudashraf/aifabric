import { fireEvent, render, screen } from "@testing-library/react";

import { CourseProviderSetup } from "../components/CourseProviderSetup";
import { getRenderedLesson } from "../lib/courseCatalog";

describe("CourseProviderSetup", () => {
  it("keeps PROD-08 keyless while showing optional OpenAI secret guidance", () => {
    const lesson = getRenderedLesson("prod-08");
    if (!lesson) throw new Error("PROD-08 generated lesson is missing");

    render(<CourseProviderSetup lesson={lesson} />);

    expect(screen.getByText("Required path is keyless")).toBeInTheDocument();
    expect(screen.getByText("Docker required")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /runtime and optional provider setup/i }));
    expect(screen.getByText(/OPENAI_API_KEY=<set in your secret store>/)).toBeInTheDocument();
    expect(screen.getByText("Continuous integration")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows Qdrant Cloud variables only in the Qdrant lesson", () => {
    const lesson = getRenderedLesson("prod-07");
    if (!lesson) throw new Error("PROD-07 generated lesson is missing");

    render(<CourseProviderSetup lesson={lesson} />);
    fireEvent.click(screen.getByRole("button", { name: /runtime and optional provider setup/i }));

    expect(screen.getByText(/AI_PROVIDERS_QDRANT_API_KEY=<set in your secret store>/)).toBeInTheDocument();
    expect(screen.queryByText(/OPENAI_API_KEY=/)).not.toBeInTheDocument();
  });
});
