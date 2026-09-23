import { forwardRef, useImperativeHandle } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AIFabricLiveDataSync from "../AIFabricLiveDataSync";

vi.mock("@loom-ai-labs/ai-fabric-chat-ui/react", () => ({
  AiFabricChat: forwardRef(function ChatMock(
    props: { title: string; endpoint: string },
    ref,
  ) {
    useImperativeHandle(ref, () => ({
      newConversation: vi.fn(),
      sendMessage: vi.fn(),
      show: vi.fn(),
    }));
    return (
      <div data-testid="ai-fabric-chat" data-endpoint={props.endpoint}>
        {props.title}
      </div>
    );
  }),
}));

vi.mock("@/components/Navbar", () => ({ default: () => <nav>Navigation</nav> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer>Footer</footer> }));
vi.mock("@/components/ConsultationCtaBand", () => ({ default: () => null }));

const vector = (revision: number, content: string) => ({
  present: true,
  inSync: true,
  vectorId: "vector-product-1",
  content,
  metadata: {
    workspaceId: "sync-demo-test",
    recordKey: "novabook-air",
    title: "NovaBook Air",
    revision,
  },
  message: "Database revision and vector revision match",
});

const indexingWork = (revision = 1) => ({
  workId: `work-product-${revision}`,
  entityType: "sync-product",
  entityId: "novabook-air",
  workType: "UPSERT",
  sourceOperation: "UPDATE",
  strategy: "SYNCHRONOUS",
  status: "COMPLETED",
  retryCount: 0,
  maxRetries: 3,
  errorCode: null,
  deadLetterReason: null,
  correlationId: `correlation-${revision}`,
  terminal: true,
  successfulTerminal: true,
  inProgress: false,
  requiresOperatorReview: false,
  requestedAt: "2026-07-23T12:00:00Z",
  scheduledFor: "2026-07-23T12:00:00Z",
  startedAt: "2026-07-23T12:00:01Z",
  completedAt: "2026-07-23T12:00:02Z",
  lastErrorAt: null,
  updatedAt: "2026-07-23T12:00:02Z",
});

const state = (revision = 1, hours = 18, work = [indexingWork(revision)]) => ({
  workspaceId: "sync-demo-test",
  sourceCounts: { "sync-product": 2, "sync-policy": 2, "sync-guide": 2 },
  vectorCounts: { "sync-product": 2, "sync-policy": 2, "sync-guide": 2 },
  sourceTotal: 6,
  vectorTotal: 6,
  synchronizedTotal: 6,
  entities: [
    {
      kind: "PRODUCT",
      entityType: "sync-product",
      recordKey: "novabook-air",
      title: "NovaBook Air",
      revision,
      updatedAt: "2026-07-23T12:00:00Z",
      fields: {
        summary: "A lightweight notebook.",
        specification: `The battery is rated for ${hours} hours.`,
        category: "Laptops",
        price: 1299,
        status: "PUBLISHED",
      },
      vector: vector(revision, `NovaBook Air The battery is rated for ${hours} hours.`),
    },
    {
      kind: "POLICY",
      entityType: "sync-policy",
      recordKey: "returns",
      title: "Return policy",
      revision: 1,
      updatedAt: "2026-07-23T12:00:00Z",
      fields: {
        guidance: "Return within 21 days.",
        audience: "Retail",
        status: "ACTIVE",
        effectiveDate: "2026-07-01",
      },
      vector: {
        ...vector(1, "Return policy Return within 21 days."),
        vectorId: "vector-policy-1",
        metadata: {
          workspaceId: "sync-demo-test",
          recordKey: "returns",
          title: "Return policy",
          revision: 1,
        },
      },
    },
  ],
  events: [],
  indexingWork: work,
  annotationCoverage: {
    annotations: [
      {
        annotation: "@AICapable",
        location: "SyncProduct",
        proof: "Declares the vector entity type.",
      },
    ],
    extractionOwner: "AnnotationFieldScanner",
    lifecycleOwner: "AICapableAspect",
    consistencyMode: "Synchronous",
  },
  checkedAt: "2026-07-23T12:00:00Z",
});

const response = (body: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(body),
  } as Response);

describe("AIFabricLiveDataSync", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders independent database/vector proof and the reusable AI Fabric chat UI", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith("/api/live-sync/workspaces")) {
        return response({
          workspaceId: "sync-demo-test",
          expiresAt: "2026-07-23T18:00:00Z",
          state: state(),
        });
      }
      if (url.endsWith("/api/demo/health")) {
        return response({ status: "UP", aiFabricVersion: "0.8.4", commit: "abc123" });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });

    render(
      <MemoryRouter>
        <AIFabricLiveDataSync />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "AI Fabric Live Data Sync" })).toBeInTheDocument();
    expect(screen.getByText("6/6")).toBeInTheDocument();
    expect(screen.getAllByText(/battery is rated for 18 hours/i)).toHaveLength(2);
    expect(screen.getByText("Work timeline")).toBeInTheDocument();
    expect(screen.getByText("work work-product-1")).toBeInTheDocument();
    expect(screen.getByTestId("ai-fabric-chat")).toHaveAttribute(
      "data-endpoint",
      expect.stringContaining("/api/live-sync/chat"),
    );
  });

  it("shows the replacement vector content after an annotated entity update", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);
      if (url.endsWith("/api/live-sync/workspaces")) {
        return response({
          workspaceId: "sync-demo-test",
          expiresAt: "2026-07-23T18:00:00Z",
          state: state(),
        });
      }
      if (url.endsWith("/api/demo/health")) {
        return response({ status: "UP", aiFabricVersion: "0.8.4", commit: "abc123" });
      }
      if (url.endsWith("/api/live-sync/entities/products/novabook-air") && init?.method === "PUT") {
        const completedWork = indexingWork(2);
        return response({
          mutation: {
            id: "event-1",
            operation: "UPDATE",
            kind: "PRODUCT",
            entityType: "sync-product",
            recordKey: "novabook-air",
            title: "NovaBook Air",
            revision: 2,
            sourcePresent: true,
            vectorPresent: true,
            inSync: true,
            elapsedMs: 4,
            indexingWorkId: completedWork.workId,
            indexingDispatchStatus: completedWork.status,
            message: "Updated source row and vector",
            occurredAt: "2026-07-23T12:01:00Z",
          },
          state: state(2, 26, [completedWork]),
          metadata: { indexingWorkId: completedWork.workId },
          indexingWork: completedWork,
        });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });

    render(
      <MemoryRouter>
        <AIFabricLiveDataSync />
      </MemoryRouter>,
    );

    const specification = await screen.findByLabelText("Searchable specification");
    fireEvent.change(specification, { target: { value: "The battery is rated for 26 hours." } });
    fireEvent.click(screen.getByRole("button", { name: "Save entity" }));

    await waitFor(() => {
      expect(screen.getByText(/battery is rated for 26 hours/i)).toBeInTheDocument();
    });
    expect(screen.getByText("work work-product-2")).toBeInTheDocument();
    expect(screen.queryByText(/battery is rated for 18 hours/i)).not.toBeInTheDocument();

    const updateCall = fetchMock.mock.calls.find(([input]) =>
      String(input).endsWith("/api/live-sync/entities/products/novabook-air"),
    );
    expect(updateCall?.[1]).toMatchObject({
      method: "PUT",
      headers: expect.objectContaining({ "X-Demo-Workspace-ID": "sync-demo-test" }),
    });
  });
});
