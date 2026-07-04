import type { ChatPosition } from "../types";

export type RagJourneyStageKey = "empty" | "products" | "reviews" | "policies" | "coupons" | "full";
export type RagJourneySeedStage = "products" | "reviews" | "policies" | "coupons" | "tickets" | "full";
export type RagJourneyPromptKey =
  | "gaming_laptop_analysis"
  | "return_policy"
  | "discount_search"
  | "cart_action"
  | "checkout_action"
  | "support_ticket";

export interface RagJourneyPrompt {
  key: RagJourneyPromptKey;
  label: string;
  text: string;
  position: ChatPosition;
}

export interface RagJourneyStage {
  key: RagJourneyStageKey;
  number: number;
  label: string;
  shortLabel: string;
  dataLabel: string;
  seedStage?: RagJourneySeedStage;
  expectedVectorSpaces: string[];
  promptKeys: RagJourneyPromptKey[];
}

export const RAG_JOURNEY_PROMPTS: Record<RagJourneyPromptKey, RagJourneyPrompt> = {
  gaming_laptop_analysis: {
    key: "gaming_laptop_analysis",
    label: "Gaming laptop analysis",
    text: "Find high performance laptops for gaming and analyze results.",
    position: "search",
  },
  return_policy: {
    key: "return_policy",
    label: "Return policy",
    text: "Can I return a gaming laptop if I opened it?",
    position: "support",
  },
  discount_search: {
    key: "discount_search",
    label: "Discount search",
    text: "Find a strong laptop and any discount I can use.",
    position: "cart",
  },
  cart_action: {
    key: "cart_action",
    label: "Add to cart",
    text: "Add the best gaming laptop to my cart.",
    position: "cart",
  },
  checkout_action: {
    key: "checkout_action",
    label: "Checkout",
    text: "Checkout my cart and place the order.",
    position: "checkout",
  },
  support_ticket: {
    key: "support_ticket",
    label: "Support request",
    text: "I had a delivery issue. Help me create a support request.",
    position: "support",
  },
};

export const RAG_JOURNEY_STAGES: RagJourneyStage[] = [
  {
    key: "empty",
    number: 0,
    label: "No Evidence",
    shortLabel: "Empty",
    dataLabel: "No indexed catalog evidence",
    expectedVectorSpaces: [],
    promptKeys: ["gaming_laptop_analysis"],
  },
  {
    key: "products",
    number: 1,
    label: "Products Indexed",
    shortLabel: "Products",
    dataLabel: "Catalog products",
    seedStage: "products",
    expectedVectorSpaces: ["product"],
    promptKeys: ["gaming_laptop_analysis"],
  },
  {
    key: "reviews",
    number: 2,
    label: "Reviews Added",
    shortLabel: "Reviews",
    dataLabel: "Products and reviews",
    seedStage: "reviews",
    expectedVectorSpaces: ["product", "review"],
    promptKeys: ["gaming_laptop_analysis"],
  },
  {
    key: "policies",
    number: 3,
    label: "Policies Added",
    shortLabel: "Policies",
    dataLabel: "Products, reviews, and policies",
    seedStage: "policies",
    expectedVectorSpaces: ["product", "review", "policy"],
    promptKeys: ["return_policy"],
  },
  {
    key: "coupons",
    number: 4,
    label: "Coupons Added",
    shortLabel: "Coupons",
    dataLabel: "Coupons and commerce workflow data",
    seedStage: "coupons",
    expectedVectorSpaces: ["product", "review", "policy"],
    promptKeys: ["discount_search"],
  },
  {
    key: "full",
    number: 5,
    label: "Full Commerce",
    shortLabel: "Full",
    dataLabel: "Full commerce fixture set",
    seedStage: "full",
    expectedVectorSpaces: ["product", "review", "policy"],
    promptKeys: ["cart_action", "checkout_action", "support_ticket"],
  },
];

export function stageFromReadiness(stage?: string, stageNumber?: number): RagJourneyStage {
  const normalized = stage?.trim().toLowerCase();
  return (
    RAG_JOURNEY_STAGES.find((item) => item.key === normalized) ||
    RAG_JOURNEY_STAGES.find((item) => item.number === stageNumber) ||
    RAG_JOURNEY_STAGES[0]
  );
}

export function nextJourneyStage(current: RagJourneyStage): RagJourneyStage | undefined {
  return RAG_JOURNEY_STAGES.find((stage) => stage.number === current.number + 1);
}
