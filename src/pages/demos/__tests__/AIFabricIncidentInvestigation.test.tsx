import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DecisionTrace, TransitionView } from "../AIFabricIncidentInvestigation";

describe("Incident Investigation decision surfaces", () => {
  it("renders a valid no-transition intake result without dereferencing null lineage", () => {
    render(
      <TransitionView
        mode="delegations"
        result={{
          intake: {
            invocationId: "exec-intake",
            specialistId: "incident-intake@2",
            status: "SUCCEEDED",
            output: {
              decision: "COMPLETE",
              targetSpecialist: null,
              reason: "The request requires both investigation branches.",
            },
            failure: null,
            startedAt: "2026-09-05T18:00:00Z",
            completedAt: "2026-09-05T18:00:01Z",
            decisionTrace: null,
          },
          transition: null,
          secondTransitionCanary: null,
        }}
      />,
    );

    expect(screen.getByText("No specialist transition was selected")).toBeInTheDocument();
    expect(screen.getByText(/returned COMPLETE/i)).toBeInTheDocument();
  });

  it("distinguishes the model decisions from backend filtering and Java validation", () => {
    render(
      <DecisionTrace
        trace={{
          specialist: "change-risk-reader@2",
          status: "SUCCEEDED",
          dataSources: [
            { action: "read_recent_deployments", candidateCount: 2, groundingUsable: true },
            { action: "read_change_approvals", candidateCount: 1, groundingUsable: true },
          ],
          selectedEvidenceIds: ["change-payment-client-284"],
          runbookEvidenceIds: ["runbook-payment-rollback"],
          sourceRevision: "incident-rev-checkout-7",
          applicationValidation: "ACTION_AND_RAG_CITATIONS_VALIDATED",
        }}
        candidates={[{
          id: "change-payment-client-284",
          tenantId: "public-demo",
          incidentId: "checkout-regression",
          deploymentId: "commerce-api-prod",
          sourceRevision: "incident-rev-checkout-7",
          type: "DEPLOYMENT",
          source: "deployment-ledger",
          summary: "The payment client changed shortly before the regression.",
          severity: "HIGH",
          observedAt: "2026-09-05T18:00:00Z",
          safeAttributes: {},
        }]}
      />,
    );

    expect(screen.getByText(/AI-selected specialist/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-requested data source/i)).toBeInTheDocument();
    expect(screen.getByText(/Backend-authorized candidates/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-cited evidence/i)).toBeInTheDocument();
    expect(screen.getByText(/Application validation/i)).toBeInTheDocument();
    expect(screen.getByText("read_recent_deployments")).toBeInTheDocument();
    expect(screen.getByText("change-payment-client-284")).toBeInTheDocument();
    expect(screen.getByText("runbook-payment-rollback")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/payment client changed/i)).toBeInTheDocument();
  });

  it("labels a denied second transition as an application policy decision", () => {
    render(
      <TransitionView
        mode="handoffs"
        result={{
          intake: {
            invocationId: "exec-intake",
            specialistId: "incident-intake@2",
            status: "SUCCEEDED",
            output: { decision: "ROUTE", targetSpecialist: "service-health-reader@2", reason: "The question concerns current health." },
            failure: null,
            startedAt: "2026-09-05T18:00:00Z",
            completedAt: "2026-09-05T18:00:01Z",
            decisionTrace: null,
          },
          transition: {
            depth: 1,
            status: "SUCCEEDED",
            sourceSpecialistId: "incident-intake@2",
            targetSpecialistId: "service-health-reader@2",
            replayed: false,
            targetExecution: {
              invocationId: "exec-worker",
              specialistId: "service-health-reader@2",
              status: "SUCCEEDED",
              output: { summary: "Current health is degraded." },
              failure: null,
              startedAt: "2026-09-05T18:00:01Z",
              completedAt: "2026-09-05T18:00:02Z",
              decisionTrace: null,
            },
          },
          secondTransitionCanary: {
            depth: 2,
            status: "DENIED",
            replayed: false,
          },
        }}
      />,
    );

    expect(screen.getByText("Second transition blocked by application policy")).toBeInTheDocument();
    expect(screen.getByText(/application-owned guard/i)).toBeInTheDocument();
  });
});
