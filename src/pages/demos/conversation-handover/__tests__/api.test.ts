import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CONVERSATION_HANDOVER_BASE_URL,
  createConversationSession,
  loginOperator,
} from "../api";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("conversation handover API", () => {
  it("keeps the backend-owned visitor session on cross-origin requests", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      conversationId: "conversation-1",
      conversation: {},
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));

    await createConversationSession();

    expect(fetchMock).toHaveBeenCalledWith(
      `${CONVERSATION_HANDOVER_BASE_URL}/api/demo/session`,
      expect.objectContaining({ method: "POST", credentials: "include", cache: "no-store" }),
    );
  });

  it("keeps operator authentication out of the URL", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      authenticated: true,
      operatorId: "operator-1",
      displayName: "Demo operator",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));

    await loginOperator("private-code");

    const [url, request] = fetchMock.mock.calls[0];
    expect(String(url)).not.toContain("private-code");
    expect(String(request?.body)).toContain("private-code");
  });
});
