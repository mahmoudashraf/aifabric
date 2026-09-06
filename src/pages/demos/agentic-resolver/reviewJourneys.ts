import type { ReviewDecision } from "./api";

export interface ReviewJourney {
  id: string;
  title: string;
  description: string;
  decision: ReviewDecision;
  amount: number;
  reason: string;
  steps: string[];
}

export const REVIEW_JOURNEYS: ReviewJourney[] = [
  { id: "approve", title: "Approve", description: "Approve a valid support credit and execute its linked receipt once.", decision: "APPROVE", amount: 25, reason: "Verified service interruption", steps: ["Create review", "Approve", "Inspect executed outcome"] },
  { id: "reject", title: "Reject", description: "Reject a proposal and prove that no account write occurs.", decision: "REJECT", amount: 25, reason: "Insufficient support evidence", steps: ["Create review", "Reject", "Verify no write"] },
  { id: "correct", title: "Correct", description: "Replace the proposed amount with an allowed reviewer correction.", decision: "CORRECT", amount: 20, reason: "Apply the approved support-credit limit", steps: ["Create review", "Edit safe fields", "Correct and execute"] },
  { id: "information", title: "Request information", description: "Pause the durable task, supply an incident reference, then continue review.", decision: "REQUEST_INFORMATION", amount: 25, reason: "Provide the support incident reference.", steps: ["Request information", "Supply incident reference", "Approve or reject"] },
  { id: "escalate", title: "Escalate", description: "Move work from the regular inbox to a senior-review policy and identity.", decision: "ESCALATE", amount: 40, reason: "Senior review required for this customer resolution", steps: ["Escalate", "Switch to Senior", "Decide successor task"] },
];

export function responseFor(
  decision: ReviewDecision,
  amount: string,
  reason: string,
): Record<string, unknown> | undefined {
  if (decision === "CORRECT") {
    return {
      resolutionType: "ACCOUNT_CREDIT",
      amount: Number(amount),
      reason: reason.trim() || "Apply the approved support-credit limit",
    };
  }
  if (decision === "REQUEST_INFORMATION") {
    return { question: reason.trim() || "Provide the support incident reference." };
  }
  return undefined;
}
