import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProactiveEventCard, SmartAccountChainView, SpecialistOutput } from "../AIFabricAgenticActionResolver";

describe("Agentic Action Resolver specialist output", () => {
  it("renders the billing advisor contract returned after typed-input resume", () => {
    render(
      <SpecialistOutput
        output={{
          resolutionType: "REFUND",
          amount: 75,
          decision: "REVIEW_REQUIRED",
          expectedStatus: "PENDING_REVIEW",
          automaticLimit: 50,
          explanation: "Routed to review because this refund is above the automatic limit.",
        }}
      />,
    );

    expect(screen.getByText("REVIEW REQUIRED")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
    expect(screen.getByText("PENDING REVIEW")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });

  it("fails visibly for an unknown output contract instead of crashing or dumping raw data", () => {
    render(<SpecialistOutput output={{ unexpected: "shape" }} />);

    expect(screen.getByText("Unsupported specialist output")).toBeInTheDocument();
    expect(screen.queryByText("shape")).not.toBeInTheDocument();
  });

  it("shows the trusted event boundary without claiming browser-owned authority", () => {
    render(
      <ProactiveEventCard
        proof={{
          eventId: "payment-event-42",
          eventType: "PAYMENT_VERIFICATION_FAILED",
          failureCode: "DECLINED",
          attemptNumber: 2,
          execution: {
            invocationId: "invocation-123456789",
            durability: "DURABLE",
            status: "SUCCEEDED",
            deadline: null,
            expiresAt: "2026-09-06T12:00:00Z",
            failureReason: null,
          },
          result: null,
        }}
      />,
    );

    expect(screen.getByText("PAYMENT_VERIFICATION_FAILED")).toBeInTheDocument();
    expect(screen.getByText("EVENT")).toBeInTheDocument();
    expect(screen.getByText("Backend service")).toBeInTheDocument();
    expect(screen.getByText("DECLINED, attempt 2")).toBeInTheDocument();
    expect(screen.getByText(/contains no account, tenant, scopes/i)).toBeInTheDocument();
  });

  it("renders durable parallel chain lineage and projected results without raw payloads", () => {
    render(
      <SmartAccountChainView
        busy={false}
        onCancel={vi.fn()}
        onReplay={vi.fn()}
        execution={{
          executionId: "chain-execution-123456789",
          chain: "account-smart-resolution@1",
          status: "COMPLETED",
          nextDecisionIndex: 2,
          replayed: true,
          durable: true,
          submittedAt: "2026-09-14T12:00:00Z",
          updatedAt: "2026-09-14T12:00:03Z",
          deadline: "2026-09-14T12:01:15Z",
          failure: null,
          timeline: [],
          result: {
            executionId: "chain-execution-123456789",
            chain: "account-smart-resolution@1",
            chainContentHash: "a".repeat(64),
            status: "COMPLETED",
            message: "The account is blocked by payment, while this refund requires review.",
            handoffTarget: null,
            conversationSnapshotRevision: "b".repeat(64),
            conversationSourceTurnCount: 2,
            replayed: true,
            durable: true,
            startedAt: "2026-09-14T12:00:00Z",
            completedAt: "2026-09-14T12:00:03Z",
            failure: null,
            results: [
              {
                resultId: "account-result-123456789",
                specialist: "account-resolver-manager-read@1",
                workerInvocationId: "account-invocation-123456789",
                summary: "The account has one blocker.",
                facts: { assessment: "BLOCKED", blockerCount: "1" },
                evidenceReferenceIds: ["PAYMENT_METHOD_REQUIRED"],
                resultHash: "c".repeat(64),
                completedAt: "2026-09-14T12:00:02Z",
              },
              {
                resultId: "billing-result-123456789",
                specialist: "billing-resolution-manager-advisor@1",
                workerInvocationId: "billing-invocation-123456789",
                summary: "The refund requires review.",
                facts: { decision: "REVIEW_REQUIRED", amount: "75" },
                evidenceReferenceIds: ["REFUND_OR_CREDIT_AVAILABLE"],
                resultHash: "d".repeat(64),
                completedAt: "2026-09-14T12:00:02Z",
              },
            ],
            timeline: [
              {
                decisionIndex: 0,
                managerInvocationId: "manager-invocation-123456789",
                directiveType: "INVOKE_PARALLEL",
                reason: "Both independent assessments were requested.",
                parallelGroupId: "parallel-1",
                startedAt: "2026-09-14T12:00:00Z",
                completedAt: "2026-09-14T12:00:02Z",
                remainingBudget: {
                  managerDecisions: 3,
                  workerInvocations: 0,
                  parallelWorkers: 0,
                  projectedResultCharacters: 7000,
                  durationMillis: 70000,
                },
                workers: [
                  {
                    specialist: "account-resolver-manager-read@1",
                    relationship: "DELEGATION",
                    invocationId: "account-invocation-123456789",
                    resultId: "account-result-123456789",
                    status: "SUCCEEDED",
                    evidenceReferenceIds: ["PAYMENT_METHOD_REQUIRED"],
                    failureReason: null,
                    startedAt: "2026-09-14T12:00:00Z",
                    completedAt: "2026-09-14T12:00:02Z",
                  },
                  {
                    specialist: "billing-resolution-manager-advisor@1",
                    relationship: "DELEGATION",
                    invocationId: "billing-invocation-123456789",
                    resultId: "billing-result-123456789",
                    status: "SUCCEEDED",
                    evidenceReferenceIds: ["REFUND_OR_CREDIT_AVAILABLE"],
                    failureReason: null,
                    startedAt: "2026-09-14T12:00:00Z",
                    completedAt: "2026-09-14T12:00:02Z",
                  },
                ],
              },
            ],
          },
        }}
      />,
    );

    expect(screen.getByText("Exact replay")).toBeInTheDocument();
    expect(screen.getByText("Durable JDBC state")).toBeInTheDocument();
    expect(screen.getByText("INVOKE PARALLEL")).toBeInTheDocument();
    expect(screen.getByText("The account has one blocker.")).toBeInTheDocument();
    expect(screen.getByText("The refund requires review.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /replay exact request/i })).toBeInTheDocument();
    expect(screen.queryByText(/\{"assessment"/)).not.toBeInTheDocument();
  });

  it("keeps a chain failure explicit and offers cancellation only while active", () => {
    const cancel = vi.fn();
    render(
      <SmartAccountChainView
        busy={false}
        onCancel={cancel}
        onReplay={vi.fn()}
        execution={{
          executionId: "chain-running",
          chain: "account-smart-resolution@1",
          status: "RUNNING",
          nextDecisionIndex: 0,
          timeline: [],
          failure: null,
          result: null,
          replayed: false,
          durable: true,
          submittedAt: "2026-09-14T12:00:00Z",
          updatedAt: "2026-09-14T12:00:00Z",
          deadline: "2026-09-14T12:01:15Z",
        }}
      />,
    );

    expect(screen.getByText("Coordinator running")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /replay exact request/i })).not.toBeInTheDocument();
  });
});
