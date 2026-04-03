import generatedProductsData from "@/data/generated/products.json";
import generatedReviewsData from "@/data/generated/reviews.json";
import generatedPoliciesData from "@/data/generated/policies.json";
import generatedCouponsData from "@/data/generated/coupons.json";
import generatedTicketsData from "@/data/generated/tickets.json";

export const API_BASE_URL = "https://rest-connector-dep-1bf14c33-dev.up.railway.app/api";
export const CRUD_API_BASE_URL = "https://ai-fabric-framework-production-a247.up.railway.app/api";
export const API_AUTH_HEADERS = { "X-AIFABRIC-API-KEY": "test" };

// Map generated products to match the expected format (100 products)
export const SAMPLE_PRODUCTS = generatedProductsData.map((product: any) => ({
  sku: product.sku,
  name: product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  inStockQty: product.stockQuantity,
  imageUrl: product.imageUrl,
}));

// Map generated policies to match the expected format (20 policies)
export const SAMPLE_POLICIES = generatedPoliciesData.map((policy: any) => ({
  title: policy.title,
  text: policy.content,
  classification: policy.category,
}));

// Map generated reviews to match the expected format (200 reviews)
export const SAMPLE_REVIEWS = generatedReviewsData.map((review: any) => ({
  productId: null, // Will be set dynamically during migration
  userId: review.userId,
  rating: review.rating,
  title: review.title,
  text: review.text,
}));

// Map generated coupons to match the expected format (20 coupons)
export const SAMPLE_COUPONS = generatedCouponsData.map((coupon: any) => ({
  code: coupon.code,
  description: coupon.description,
  discountType: coupon.type.toUpperCase(),
  discountValue: coupon.value,
  minPurchaseAmount: coupon.minPurchase,
  maxDiscountAmount: null,
  validFrom: coupon.startDate,
  validUntil: coupon.endDate,
  usageLimit: coupon.usageLimit,
  isActive: coupon.isActive,
}));

// Map generated tickets to match the expected format (50 tickets)
export const SAMPLE_TICKETS = generatedTicketsData.map((ticket: any) => ({
  userId: ticket.userId,
  issueType: ticket.category,
  description: ticket.description,
}));

export const DEFAULT_USER_ID = "demo-user";
export const DEFAULT_SESSION_ID = "demo-session";
