import type { ReactNode } from "react";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  inStockQty?: number;
  relevanceScore?: number;
  imageUrl?: string;
  // Optional fields returned by some API responses
  rating?: number;
  reviewCount?: number;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName?: string;
  quantity: number;
  totalPrice: number;
  status: string;
  orderDate: string;
}

export type ResultType =
  | "ACTION_EXECUTED"
  | "ACTION_DENIED"
  | "INFORMATION_PROVIDED"
  | "CONFIRMATION_REQUIRED"
  | "CLARIFICATION_REQUIRED"
  | "OUT_OF_SCOPE"
  | "COMPOUND_HANDLED"
  | "ERROR";

export interface SanitizedPayload {
  type: ResultType;
  success: boolean;
  message: string;
  data?: any;
  safeSummary?: string;
  sanitization?: {
    risk: string;
    detectedTypes: string[];
  };
}

export interface SmartSuggestion {
  intent: string;
  title: string;
  query: string;
  confidence: number;
  priority?: string;
  rationale: string;
  response?: string;
  documents?: any[];
  metadata?: any;
}

export interface NextStep {
  intent: string;
  query: string;
  rationale: string;
  confidence: number;
  vectorSpace?: string;
}

export interface ChatResult {
  type: ResultType;
  success: boolean;
  smartSuggestion?: SmartSuggestion;
  nextSteps?: NextStep[];
  sanitizedPayload: SanitizedPayload;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: string;
  metadata?: any;
  messageId?: string;
  similarity?: number;
  score?: number;
}

export type ChatPosition = "landing" | "catalog" | "search" | "product_detail" | "cart" | "checkout" | "orders" | "support";
export type ChatMode = "navigator" | "navigator_deep" | "cart_assistant" | "executor";

export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  orchestration?: {
    intent: string;
    confidence: number;
    actions: string[];
  };
  result?: ChatResult;
  resultType?: ResultType;
  documents?: Document[];
  attachedProduct?: Product;
  attachedProducts?: Product[];
  actionTag?: ActionTag;
}

export interface Conversation {
  id: string;
  ownerId: string;
  title?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  lastInteractionAt?: string;
  turnsCount?: number;
}

export interface ConversationTurn {
  timestamp: string;
  userQuery: string;
  aiResponse: string;
}

export interface ConversationDetail extends Conversation {
  turns: ConversationTurn[];
}

export interface Policy {
  id: string;
  title: string;
  text: string;
  classification: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id?: string;
  productId: string | null;
  userId: string;
  rating: number;
  title: string;
  text: string;
  // Some endpoints use `comment` naming
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number | null;
  validFrom: string;
  validUntil: string;
  usageLimit?: number | null;
  isActive: boolean;
  // Some endpoints use shorter naming
  minPurchase?: number;
  maxDiscount?: number | null;
  usedCount?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportTicket {
  id?: string | number;
  userId: string;
  issueType: string;
  description: string;
  orderNumber?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  price: string;
  category: string;
  inStockQty: string;
  imageUrl: string;
}

export interface MigrationState {
  isRunning: boolean;
  progress: number;
  currentItem: string;
  count: number;
}

export interface ActionTag {
  id: string;
  type: "search" | "cart" | "browse" | "checkout" | "support" | "action";
  label: string;
  query: string;
  icon?: string;
  timestamp?: string;
}

export interface DemoReadiness {
  ready: boolean;
  stage: string;
  stageNumber: number;
  counts: {
    products?: number;
    reviews?: number;
    policies?: number;
    coupons?: number;
    tickets?: number;
    [key: string]: number | undefined;
  };
  vectorSpaces?: Record<string, {
    name: string;
    present: boolean;
    vectorCount: number;
    provider?: string;
    searchFilterMode?: string;
    scanFilterMode?: string;
    retrievalProof?: {
      checked: boolean;
      found: boolean;
      method?: string;
      sampleVectorId?: string | null;
      sampleEntityId?: string | null;
      warning?: string | null;
    };
    warning?: string;
  }>;
  indexingQueueSize?: number;
  nextRecommendedStep?: string;
  warnings?: string[];
  checkedAt?: string;
}

export interface DemoHealth {
  app: string;
  version: string;
  aiFabricVersion?: string;
  commit?: string;
  buildTime?: string;
  checkedAt?: string;
  demoControlsEnabled?: boolean;
  chatSessionEnabled?: boolean;
  ragEnabled?: boolean;
  dataSyncEnabled?: boolean;
  vectorProvider?: string;
  readiness?: DemoReadiness;
}

export interface CartItem {
  id?: string | number;
  sku: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface Cart {
  id?: string | number;
  userId?: string;
  status?: string;
  couponCode?: string | null;
  subtotal?: number;
  discount?: number;
  total?: number;
  currency?: string;
  items?: CartItem[];
}

export interface ActionProjectionInput {
  data: any;
  messageId: string;
}

export interface DemoActionProjection {
  id: string;
  canRender: (input: ActionProjectionInput) => boolean;
  render: (input: ActionProjectionInput) => ReactNode;
}

export interface ActionProjectionInput {
  data: any;
  messageId: string;
}

export interface DemoActionProjection {
  canRender: (input: ActionProjectionInput) => boolean;
  render: (input: ActionProjectionInput) => ReactNode;
}
