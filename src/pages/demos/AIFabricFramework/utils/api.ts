import { API_BASE_URL, CRUD_API_BASE_URL, API_AUTH_HEADERS, ADMIN_API_HEADERS } from "../constants";
import type {
  Cart,
  Product,
  Policy,
  Review,
  Coupon,
  SupportTicket,
  Conversation,
  ConversationDetail,
  ChatPosition,
  ChatMode,
  DemoHealth,
  DemoReadiness,
} from "../types";

function readCount(data: any, ...keys: string[]): number {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim()) return Number(value);
  }
  return 0;
}

function normalizeCoupon(coupon: any): Coupon {
  const discountPercent = coupon.discountPercent;
  const discountAmount = coupon.discountAmount;
  const isPercentage = discountPercent !== undefined && discountPercent !== null;

  return {
    ...coupon,
    id: coupon.id?.toString(),
    isActive: coupon.isActive ?? coupon.active ?? true,
    discountType: coupon.discountType ?? (isPercentage ? "PERCENTAGE" : "FIXED"),
    discountValue: coupon.discountValue ?? discountPercent ?? Number(discountAmount ?? 0),
    validUntil: coupon.validUntil ?? coupon.updatedAt ?? coupon.createdAt ?? new Date().toISOString(),
  };
}

// Products API
export async function fetchProducts(limit = 50): Promise<Product[]> {
  const response = await fetch(`${CRUD_API_BASE_URL}/products?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function fetchProductCount(): Promise<number> {
  const response = await fetch(`${CRUD_API_BASE_URL}/products/count`);
  if (!response.ok) throw new Error("Failed to fetch product count");
  const data = await response.json();
  return readCount(data, "count", "totalProducts");
}

export async function searchProducts(query: string, limit = 20, threshold = 0.3): Promise<Product[]> {
  const response = await fetch(
    `${CRUD_API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&threshold=${threshold}`
  );
  if (!response.ok) throw new Error("Failed to search products");
  return response.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${CRUD_API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create product");
  }
  return response.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${CRUD_API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to update product");
  }
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${CRUD_API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

// Orders API
export async function fetchOrders(userId: string, limit = 50): Promise<any[]> {
  const response = await fetch(`${CRUD_API_BASE_URL}/orders?userId=${userId}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

// Conversations API
export async function fetchConversations(ownerId: string): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE_URL}/chat/conversations?ownerId=${ownerId}`, {
    headers: { ...API_AUTH_HEADERS },
  });
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
}

export async function getConversation(conversationId: string, ownerId?: string): Promise<ConversationDetail> {
  const params = new URLSearchParams();
  if (ownerId) params.append("ownerId", ownerId);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}${queryString}`, {
    headers: { ...API_AUTH_HEADERS },
  });
  if (!response.ok) throw new Error("Failed to fetch conversation");
  return response.json();
}

export async function deleteConversation(conversationId: string, ownerId?: string): Promise<void> {
  const params = new URLSearchParams();
  if (ownerId) params.append("ownerId", ownerId);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}${queryString}`, {
    method: "DELETE",
    headers: { ...API_AUTH_HEADERS },
  });
  if (!response.ok) throw new Error("Failed to delete conversation");
}

// Re-export position/mode types from types for backward compat
export type { ChatPosition, ChatMode } from "../types";

// Chat API
export async function sendChatQuery(
  query: string,
  userId: string,
  sessionId: string,
  conversationId?: string,
  attachments?: any[],
  position?: ChatPosition,
  mode?: ChatMode,
): Promise<any> {
  // Let backend map position to mode unless the UI explicitly selected a specialized mode.
  const explicitMode = (mode === "navigator_deep" || mode === "cart_assistant" || mode === "executor") ? mode : undefined;

  const response = await fetch(`${API_BASE_URL}/chat/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...API_AUTH_HEADERS },
    body: JSON.stringify({
      query,
      userId,
      sessionId,
      conversationId: conversationId || undefined,
      position: position || "landing",
      ...(explicitMode ? { mode: explicitMode } : {}),
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to process chat query");
  }
  return response.json();
}

// Demo readiness/control API
export async function fetchDemoReadiness(): Promise<DemoReadiness> {
  const response = await fetch(`${CRUD_API_BASE_URL}/demo/readiness`);
  if (!response.ok) throw new Error("Failed to fetch demo readiness");
  return response.json();
}

export async function fetchDemoHealth(): Promise<DemoHealth> {
  const response = await fetch(`${CRUD_API_BASE_URL}/demo/health`);
  if (!response.ok) throw new Error("Failed to fetch demo health");
  return response.json();
}

export async function seedDemoStage(stage: "products" | "reviews" | "policies" | "coupons" | "tickets" | "full"): Promise<any> {
  const response = await fetch(`${CRUD_API_BASE_URL}/demo/stages/${stage}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Failed to seed ${stage}`);
  }
  return response.json();
}

export async function resetDemoData(): Promise<any> {
  const response = await fetch(`${CRUD_API_BASE_URL}/demo/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      confirm: true,
      clearVectors: true,
      clearIndexingQueue: true,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to reset demo data");
  }
  return response.json();
}

// Cart API
export async function fetchActiveCart(userId: string): Promise<Cart> {
  const response = await fetch(`${CRUD_API_BASE_URL}/carts/active?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) throw new Error("Failed to fetch active cart");
  return response.json();
}

export async function addCartItem(userId: string, sku: string, quantity = 1): Promise<Cart> {
  const response = await fetch(`${CRUD_API_BASE_URL}/carts/active/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, sku, quantity }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to add item to cart");
  }
  return response.json();
}

export async function removeCartItem(userId: string, sku: string): Promise<Cart> {
  const params = new URLSearchParams({ userId, sku });
  const response = await fetch(`${CRUD_API_BASE_URL}/carts/active/items?${params.toString()}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to remove cart item");
  return response.json();
}

export async function applyCartCoupon(userId: string, code: string): Promise<Cart> {
  const response = await fetch(`${CRUD_API_BASE_URL}/carts/active/coupon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, code }),
  });
  if (!response.ok) throw new Error("Failed to apply coupon");
  return response.json();
}

export async function fetchSuggestions(
  userId: string,
  sessionId: string,
  products: Product[],
  reviews?: Review[],
  coupons?: Coupon[]
): Promise<string[]> {
  // Build attachments array with vector space format
  const attachments = [
    ...products.map((p) => ({
      id: p.id,
      vectorSpace: "product",
      contentText: `${p.name} - ${p.category || 'General'} - $${p.price}`,
      source: "ui-card",
    })),
    ...(reviews || []).map((r) => ({
      id: r.id || `review-${r.productId}`,
      vectorSpace: "review",
      contentText: `${r.rating} stars - ${r.comment || r.text || ''}`,
      source: "ui-card",
    })),
    ...(coupons || []).map((c) => ({
      id: c.id || c.code,
      vectorSpace: "coupon",
      contentText: `${c.code} - ${c.description}`,
      source: "ui-card",
    })),
  ];

  // Build content description
  const contentParts: string[] = [];
  if (products.length > 0) {
    contentParts.push(`Products: ${products.map(p => p.name).join(', ')}`);
  }
  if (reviews && reviews.length > 0) {
    contentParts.push(`Reviews: ${reviews.length} attached`);
  }
  if (coupons && coupons.length > 0) {
    contentParts.push(`Coupons: ${coupons.map(c => c.code).join(', ')}`);
  }

  const response = await fetch(`${API_BASE_URL}/chat/suggestions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...API_AUTH_HEADERS },
    body: JSON.stringify({
      content: contentParts.join('; ') || "Give me suggestions based on attached items",
      userId,
      maxSuggestions: 5,
      attachments: attachments.length > 0 ? attachments : undefined,
    }),
  });

  if (!response.ok) throw new Error("Failed to fetch suggestions");
  const data = await response.json();

  // Response format: { success, message, suggestions: string[], raw }
  if (data.suggestions && Array.isArray(data.suggestions)) {
    return data.suggestions.filter((s: unknown): s is string =>
      typeof s === 'string' && s.length > 0
    );
  }

  return [];
}

// Policies API
export async function fetchPolicies(limit = 50): Promise<Policy[]> {
  const response = await fetch(`${CRUD_API_BASE_URL}/policies?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch policies");
  return response.json();
}

export async function fetchPolicyCount(): Promise<number> {
  const response = await fetch(`${CRUD_API_BASE_URL}/policies/count`);
  if (!response.ok) throw new Error("Failed to fetch policy count");
  const data = await response.json();
  return readCount(data, "count", "totalPolicies");
}

export async function createPolicy(policy: Partial<Policy>): Promise<Policy> {
  const response = await fetch(`${CRUD_API_BASE_URL}/policies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!response.ok) throw new Error("Failed to create policy");
  return response.json();
}

export async function deletePolicy(id: string): Promise<void> {
  const response = await fetch(`${CRUD_API_BASE_URL}/policies/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete policy");
}

// Reviews API
export async function fetchReviews(limit = 50): Promise<Review[]> {
  const response = await fetch(`${CRUD_API_BASE_URL}/reviews?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch reviews");
  return response.json();
}

export async function fetchReviewCount(): Promise<number> {
  const reviews = await fetchReviews(500);
  return reviews.length;
}

export async function createReview(review: Partial<Review>): Promise<Review> {
  const response = await fetch(`${CRUD_API_BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!response.ok) throw new Error("Failed to create review");
  return response.json();
}

// Coupons API
export async function fetchCoupons(limit = 50): Promise<Coupon[]> {
  const response = await fetch(`${CRUD_API_BASE_URL}/coupons?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch coupons");
  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeCoupon) : [];
}

export async function fetchCouponCount(): Promise<number> {
  const coupons = await fetchCoupons(500);
  return coupons.length;
}

export async function createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
  const payload = {
    code: coupon.code,
    description: coupon.description,
    rules: [
      coupon.minPurchaseAmount ? `Minimum purchase: $${coupon.minPurchaseAmount}` : undefined,
      coupon.maxDiscountAmount ? `Maximum discount: $${coupon.maxDiscountAmount}` : undefined,
      coupon.validUntil ? `Valid until: ${coupon.validUntil}` : undefined,
      coupon.usageLimit ? `Usage limit: ${coupon.usageLimit}` : undefined,
    ].filter(Boolean).join("; "),
    active: coupon.isActive ?? true,
    discountPercent: coupon.discountType === "PERCENTAGE" ? coupon.discountValue : undefined,
    discountAmount: coupon.discountType === "FIXED" ? coupon.discountValue : undefined,
  };
  const response = await fetch(`${CRUD_API_BASE_URL}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create coupon");
  return normalizeCoupon(await response.json());
}

// Support Tickets API
export async function fetchTickets(userId: string, limit = 50): Promise<SupportTicket[]> {
  const response = await fetch(`${CRUD_API_BASE_URL}/tickets?userId=${encodeURIComponent(userId)}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch support tickets");
  return response.json();
}

export async function createTicket(ticket: { userId: string; issueType: string; description: string }): Promise<any> {
  const response = await fetch(`${CRUD_API_BASE_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create ticket: ${errorText}`);
  }
  return response.json();
}

// Admin API
export async function clearAllData(): Promise<void> {
  const response = await fetch(`${CRUD_API_BASE_URL}/admin/migration/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...ADMIN_API_HEADERS },
    body: JSON.stringify({
      confirm: true,
      clearVectors: true,
      clearIndexingQueue: true,
    }),
  });
  if (!response.ok) throw new Error("Failed to clear data");
}
