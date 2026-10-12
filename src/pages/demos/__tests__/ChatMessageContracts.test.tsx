import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatMessage } from "../AIFabricFramework/components/Chat/ChatMessage";
import type { ChatMessage as ChatMessageType } from "../AIFabricFramework/types";

const clarificationMessage = (data: Record<string, unknown>, metadata?: Record<string, unknown>): ChatMessageType => ({
  id: "clarification-1",
  type: "ai",
  content: "Complete the approved action inputs.",
  timestamp: "2026-10-12T12:00:00Z",
  resultType: "CLARIFICATION_REQUIRED",
  result: {
    type: "CLARIFICATION_REQUIRED",
    success: false,
    metadata,
    sanitizedPayload: {
      type: "CLARIFICATION_REQUIRED",
      success: false,
      message: "More information is required.",
      data,
    },
  },
});

describe("ChatMessage action contracts", () => {
  it("submits only declared public parameters with their structured types", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ChatMessage
        message={clarificationMessage(
          {
            action: "request_refund",
            missingRequiredParameters: ["amount", "resolutionType", "tenantId"],
            providedParameters: {
              reason: "Support incident charge",
              undeclaredCallerValue: "must-not-cross-the-boundary",
            },
          },
          {
            parameterSchemas: {
              amount: { type: "NUMBER", min: 1, max: 50 },
              resolutionType: { type: "STRING", allowedValues: ["REFUND", "CREDIT"] },
              reason: { type: "STRING" },
              tenantId: { type: "STRING", visibility: "INTERNAL", askUser: false },
            },
          },
        )}
        onClarificationSubmit={onSubmit}
      />,
    );

    expect(screen.queryByText(/tenant id/i)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("must-not-cross-the-boundary")).not.toBeInTheDocument();
    expect(screen.getByText("Minimum: 1 · Maximum: 50")).toBeInTheDocument();
    expect(screen.getByText("Allowed: REFUND or CREDIT")).toBeInTheDocument();

    await user.type(screen.getByRole("spinbutton"), "11");
    await user.selectOptions(screen.getByRole("combobox"), "REFUND");
    await user.click(screen.getByRole("button", { name: /submit & proceed/i }));

    expect(onSubmit).toHaveBeenCalledWith("request_refund", {
      reason: "Support incident charge",
      amount: 11,
      resolutionType: "REFUND",
    });
  });

  it("keeps a strict last-four-digits draft disabled until the value is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ChatMessage
        message={clarificationMessage(
          {
            action: "update_payment_method",
            missingRequiredParameters: ["last4"],
            providedParameters: {},
          },
          {
            parameterSchemas: {
              last4: { type: "STRING", pattern: "\\d{4}" },
            },
          },
        )}
        onClarificationSubmit={onSubmit}
      />,
    );

    const input = screen.getByRole("textbox");
    const submit = screen.getByRole("button", { name: /submit & proceed/i });
    expect(submit).toBeDisabled();

    await user.type(input, "12");
    expect(submit).toBeDisabled();
    expect(screen.getByText("Format: \\d{4}")).toHaveClass("text-red-600");

    await user.clear(input);
    await user.type(input, "4242");
    expect(submit).toBeEnabled();
    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledWith("update_payment_method", { last4: "4242" });
  });

  it("shows exact-once read execution and compound RAG proof", () => {
    render(
      <ChatMessage
        message={{
          id: "read-proof-1",
          type: "ai",
          content: "The matching products and return policy are grounded below.",
          timestamp: "2026-10-12T12:00:00Z",
          resultType: "INFORMATION_PROVIDED",
          result: {
            type: "INFORMATION_PROVIDED",
            success: true,
            sanitizedPayload: {
              type: "INFORMATION_PROVIDED",
              success: true,
              message: "Grounded response",
              data: {
                readActionResolution: {
                  attempted: true,
                  planningMode: "ITERATIVE",
                  useRag: true,
                  finalDecision: "COMPLETE",
                  executedActionsCount: 1,
                  deduplicatedActionsCount: 1,
                  rejectedActionProposalsCount: 1,
                  executedActions: [{
                    action: "search_products",
                    actionExecutionId: "read-exec-123",
                    groundingSufficiency: "SUFFICIENT",
                    success: true,
                  }],
                },
              },
            },
          },
        }}
      />,
    );

    expect(screen.getByText("READ execution proof")).toBeInTheDocument();
    expect(screen.getByText(/ITERATIVE.*1 executed.*1 deduplicated.*1 rejected.*RAG joined/)).toBeInTheDocument();
    expect(screen.getByText("search_products")).toBeInTheDocument();
    expect(screen.getByText("read-exec-123")).toBeInTheDocument();
    expect(screen.getByText("SUFFICIENT")).toBeInTheDocument();
  });
});
