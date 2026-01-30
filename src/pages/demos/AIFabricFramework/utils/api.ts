import { API_BASE_URL } from "../constants";
import type { Product, Policy, Review, Coupon, Conversation } from "../types";

// Products API
export async function fetchProducts(limit = 50): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function fetchProductCount(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/products/count`);
  if (!response.ok) throw new Error("Failed to fetch product count");
  const data = await response.json();
  return data.count;
}

export async function searchProducts(query: string, limit = 20, threshold = 0.3): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&threshold=${threshold}`
  );
  if (!response.ok) throw new Error("Failed to search products");
  return response.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
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
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

// Orders API
export async function fetchOrders(userId: string, limit = 50): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/orders?userId=${userId}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

// Conversations API
export async function fetchConversations(ownerId: string): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE_URL}/chat/conversations?ownerId=${ownerId}`);
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
}

// Position types for routing
export type ChatPosition = "landing" | "catalog" | "checkout";
export type ChatMode = "navigator" | "copilot";

// Chat API
export async function sendChatQuery(
  query: string,
  userId: string,
  sessionId: string,
  conversationId?: string,
  attachments?: any[],
  position?: ChatPosition,
  mode?: ChatMode,
  activeAttachmentIds?: string[]
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/chat/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      userId,
      sessionId,
      conversationId: conversationId || undefined,
      position: position || "landing",
      mode: mode || "navigator",
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      activeAttachmentIds: activeAttachmentIds && activeAttachmentIds.length > 0 ? activeAttachmentIds : undefined,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to process chat query");
  }
  return response.json();
}

export async function fetchSuggestions(
  userId: string,
  sessionId: string,
  products: Product[],
  reviews?: Review[],
  coupons?: Coupon[]
): Promise<string[]> {
  // Build attachments with vector space format - same as sendChatQuery
  const attachmentsWithMetadata = [
    ...products.map((p) => ({
      id: p.id,
      vectorSpace: "product",
      contentSnippet: p.description || p.name || "",
      metadata: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        inStockQty: p.inStockQty,
        imageUrl: p.imageUrl,
        rating: p.rating,
        reviewCount: p.reviewCount,
      },
      source: "product",
      url: "",
      imageUrl: p.imageUrl || "",
    })),
    ...(reviews || []).map((r) => ({
      id: r.id,
      vectorSpace: "review",
      contentSnippet: r.comment || "",
      metadata: {
        id: r.id,
        productId: r.productId,
        userId: r.userId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      },
      source: "review",
      url: "",
      imageUrl: "",
    })),
    ...(coupons || []).map((c) => ({
      id: c.id,
      vectorSpace: "coupon",
      contentSnippet: c.description || c.code || "",
      metadata: {
        id: c.id,
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minPurchase: c.minPurchase,
        maxDiscount: c.maxDiscount,
        validFrom: c.validFrom,
        validUntil: c.validUntil,
        usageLimit: c.usageLimit,
        usedCount: c.usedCount,
      },
      source: "coupon",
      url: "",
      imageUrl: "",
    })),
  ];

  const activeAttachmentIds = attachmentsWithMetadata.map(a => a.id);

  const response = await fetch(`${API_BASE_URL}/chat/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Give me most suitable 5 suggestion (questions/actions) based on available actions and attached items",
      userId,
      sessionId,
      position: "checkout",
      mode: "copilot",
      attachments: attachmentsWithMetadata.length > 0 ? attachmentsWithMetadata : undefined,
      activeAttachmentIds: activeAttachmentIds.length > 0 ? activeAttachmentIds : undefined,
    }),
  });

  if (!response.ok) throw new Error("Failed to fetch suggestions");
  const data = await response.json();

  // Extract suggestions from the response - they might be in the result payload
  if (data.result && data.result.sanitizedPayload && data.result.sanitizedPayload.suggestions) {
    return data.result.sanitizedPayload.suggestions;
  }
  // Fallback: try to parse suggestions from the message if it's an array
  if (data.result && data.result.sanitizedPayload && data.result.sanitizedPayload.message) {
    // Try to extract suggestions from the message if they're formatted as a list
    const message = data.result.sanitizedPayload.message;
    // Check if message contains numbered list
    const lines = message.split('\n').filter((line: string) => line.trim());
    const suggestions = lines
      .filter((line: string) => /^\d+[\.\)]\s*/.test(line.trim()))
      .map((line: string) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter((s: string) => s.length > 0);
    if (suggestions.length > 0) {
      return suggestions;
    }
  }
  return data.suggestions || [];
}

// Policies API
export async function fetchPolicies(limit = 50): Promise<Policy[]> {
  const response = await fetch(`${API_BASE_URL}/policies?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch policies");
  return response.json();
}

export async function fetchPolicyCount(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/policies/count`);
  if (!response.ok) throw new Error("Failed to fetch policy count");
  const data = await response.json();
  return data.count;
}

export async function createPolicy(policy: Partial<Policy>): Promise<Policy> {
  const response = await fetch(`${API_BASE_URL}/policies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!response.ok) throw new Error("Failed to create policy");
  return response.json();
}

export async function deletePolicy(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/policies/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete policy");
}

// Reviews API
export async function fetchReviews(limit = 50): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/reviews?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch reviews");
  return response.json();
}

export async function fetchReviewCount(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/reviews/count`);
  if (!response.ok) throw new Error("Failed to fetch review count");
  const data = await response.json();
  return data.count;
}

export async function createReview(review: Partial<Review>): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!response.ok) throw new Error("Failed to create review");
  return response.json();
}

// Coupons API
export async function fetchCoupons(limit = 50): Promise<Coupon[]> {
  const response = await fetch(`${API_BASE_URL}/coupons?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch coupons");
  return response.json();
}

export async function fetchCouponCount(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/coupons/count`);
  if (!response.ok) throw new Error("Failed to fetch coupon count");
  const data = await response.json();
  return data.count;
}

export async function createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
  const response = await fetch(`${API_BASE_URL}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coupon),
  });
  if (!response.ok) throw new Error("Failed to create coupon");
  return response.json();
}

// Support Tickets API
export async function createTicket(ticket: { userId: string; issueType: string; description: string }): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
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
  const response = await fetch(`${API_BASE_URL}/admin/migration/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      confirm: true,
      clearVectors: true,
      clearIndexingQueue: true,
    }),
  });
  if (!response.ok) throw new Error("Failed to clear data");
}
