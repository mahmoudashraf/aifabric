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

export interface ChatResult {
  type: ResultType;
  success: boolean;
  smartSuggestion?: any;
  sanitizedPayload: SanitizedPayload;
}

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
  type: "search" | "cart" | "browse" | "action";
  label: string;
  query: string;
  icon?: string;
  timestamp?: string;
}
