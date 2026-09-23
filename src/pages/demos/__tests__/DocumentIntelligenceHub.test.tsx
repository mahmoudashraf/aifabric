import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DocumentIntelligenceHub from "../DocumentIntelligenceHub";

vi.mock("@/components/Navbar", () => ({ default: () => <nav>Navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Footer</footer> }));
vi.mock("@/components/ConsultationCtaBand", () => ({ default: () => null }));
vi.mock("../components/DemoFullPageLoader", () => ({
  DemoFullPageLoader: ({ title }: { title: string }) => <div>{title}</div>,
}));

const source = {
  id: "source-returns",
  title: "Returns and Opened Products Policy",
  originalFilename: "returns-policy.txt",
  tenantId: "tenant-docs-demo-0123456789abcdef0123456789abcdef",
  visibility: "internal",
  contentHash: "hash",
  sourceVersion: 1,
  activeVersion: 1,
  status: "INDEXED",
  activeChunks: 1,
  failureCode: null,
  failureMessage: null,
};

const session = {
  sessionId: "docs-demo-0123456789abcdef0123456789abcdef",
  tenantId: source.tenantId,
  sources: [source],
};

const response = (body: unknown) => Promise.resolve({
  ok: true,
  status: 200,
  headers: new Headers({ "content-type": "application/json" }),
  json: () => Promise.resolve(body),
} as Response);

describe("DocumentIntelligenceHub", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("loads a backend-owned workspace and renders real retrieval evidence", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);
      if (url.endsWith("/api/demo/health")) {
        return response({ status: "UP", aiFabricVersion: "0.8.4", commit: "abc123" });
      }
      if (url.endsWith("/api/document-demo/sessions") && init?.method === "POST") {
        return response(session);
      }
      if (url.endsWith(`/api/document-demo/sessions/${session.sessionId}`)) {
        return response(session);
      }
      if (url.includes(`/api/document-demo/sessions/${session.sessionId}/query?`)) {
        return response({
          query: "Can I return an opened laptop?",
          tenantId: session.tenantId,
          resultCount: 1,
          processingTimeMs: 7,
          embeddingModel: "text-embedding-3-small",
          evidence: [{
            entityId: "source-returns:v1:chunk-0",
            sourceId: source.id,
            sourceVersion: 1,
            sourceName: source.title,
            chunkId: "chunk-0",
            chunkIndex: 0,
            content: "Opened laptops may be returned within 14 days of delivery.",
            score: 0.91,
            metadata: { tenantId: session.tenantId },
          }],
        });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });

    render(
      <MemoryRouter>
        <DocumentIntelligenceHub />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Document Knowledge Operations" })).toBeInTheDocument();
    expect(await screen.findAllByText(source.title)).toHaveLength(2);
    expect(screen.getByText("Evidence only · no browser-generated answer")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Retrieval" }));
    await user.click(await screen.findByRole("button", { name: "Retrieve" }));

    expect(await screen.findByText("Opened laptops may be returned within 14 days of delivery.")).toBeInTheDocument();
    expect(screen.getByText("91% score")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(`/api/document-demo/sessions/${session.sessionId}/query?`),
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    await waitFor(() => expect(screen.queryByText("Preparing Document Knowledge Operations")).not.toBeInTheDocument());
  });
});
