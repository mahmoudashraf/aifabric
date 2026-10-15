import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AIFabricConversationHandover from "../AIFabricConversationHandover";
import * as api from "../conversation-handover/api";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/ConsultationCtaBand", () => ({ default: () => null }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("../conversation-handover/api", async (importOriginal) => ({
  ...await importOriginal<typeof api>(),
  createConversationSession: vi.fn(),
  readHandoverHealth: vi.fn(),
  loginOperator: vi.fn(),
  readOperatorQueue: vi.fn(),
  readOperatorConversation: vi.fn(),
}));

const conversation: api.ConversationView = {
  control: {
    scope: { tenantId: "demo", deploymentId: "demo", conversationId: "own-conversation", ownerId: "own-session" },
    state: "AI_ACTIVE", version: 0, controlEpoch: 0,
    activeHandoverId: null, channelBindingId: null, updatedAt: "2026-10-15T00:00:00Z",
  },
  messages: [],
  handoverIntakeSchema: { schemaVersion: "v1", anonymousAllowed: false, fields: [] },
  handoverIntakeRequired: false,
  contactIntake: null,
};

const health: api.HandoverDemoHealth = {
  status: "UP", service: "conversation-handover-demo", aiFabricVersion: "0.8.33",
  proof: "Live backend", handoverAction: "request_conversation_handover",
  handoverIntakeSchema: "v1", requiredHandoverField: "email",
  publicOperatorEnabled: true, demoOperatorAccessCode: "demo-handover",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(api.createConversationSession).mockResolvedValue({ conversationId: "own-conversation", conversation });
  vi.mocked(api.readHandoverHealth).mockResolvedValue(health);
  vi.mocked(api.loginOperator).mockResolvedValue({ authenticated: true, operatorId: "own-operator", displayName: "Demo operator" });
  vi.mocked(api.readOperatorQueue).mockResolvedValue([]);
});

afterEach(cleanup);

describe("conversation handover public operator", () => {
  it("shows the backend-provided public code in plain text and opens the session queue", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AIFabricConversationHandover /></MemoryRouter>);

    const code = await screen.findByLabelText("Demo operator code");
    expect(code).toHaveValue("demo-handover");
    expect(code).toHaveAttribute("type", "text");
    expect(screen.getByText(/Your queue is limited to your own session/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open my demo queue" }));
    await waitFor(() => expect(api.loginOperator).toHaveBeenCalledWith("demo-handover"));
    await waitFor(() => expect(api.readOperatorQueue).toHaveBeenCalled());
    expect(await screen.findByText("No conversation selected")).toBeInTheDocument();
  });

  it("does not invent or reveal a code when public access is disabled", async () => {
    vi.mocked(api.readHandoverHealth).mockResolvedValue({ ...health, publicOperatorEnabled: false, demoOperatorAccessCode: "" });
    render(<MemoryRouter><AIFabricConversationHandover /></MemoryRouter>);

    const code = await screen.findByLabelText("Operator access code");
    expect(code).toHaveValue("");
    expect(code).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Open queue" })).toBeDisabled();
    expect(api.loginOperator).not.toHaveBeenCalled();
  });
});
