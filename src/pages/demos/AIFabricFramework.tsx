import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  MessageSquare,
  Search,
  Package,
  Receipt,
  Bot,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  TrendingUp,
  Database,
  Zap,
  Code,
  Send,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  PackagePlus,
  FileText,
  Scale,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  Ban,
  Star,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://ai-fabric-framework-production.up.railway.app/api";

// Sample products for stock filling
const SAMPLE_PRODUCTS = [
  // Electronics
  { sku: "ELEC-LAPTOP-001", name: "UltraBook Pro 15", description: "High-performance laptop with Intel i7, 16GB RAM, 512GB SSD", price: 1299.99, category: "Electronics", inStockQty: 15, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
  { sku: "ELEC-LAPTOP-002", name: "Gaming Beast X1", description: "Gaming laptop with RTX 4070, 32GB RAM, 1TB SSD", price: 2499.99, category: "Electronics", inStockQty: 8, imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop" },
  { sku: "ELEC-PHONE-001", name: "SmartPhone Pro Max", description: "Latest flagship smartphone with 5G, 256GB storage", price: 999.99, category: "Electronics", inStockQty: 50, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop" },
  { sku: "ELEC-PHONE-002", name: "Budget Phone Plus", description: "Affordable smartphone with great battery life", price: 299.99, category: "Electronics", inStockQty: 100, imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop" },
  { sku: "ELEC-TABLET-001", name: "ProTab Ultra", description: "Professional tablet with stylus, 12.9 inch display", price: 899.99, category: "Electronics", inStockQty: 25, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop" },
  { sku: "ELEC-WATCH-001", name: "SmartWatch Fitness Pro", description: "Fitness tracker with heart rate monitor, GPS", price: 249.99, category: "Electronics", inStockQty: 75, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
  { sku: "ELEC-HEADPHONE-001", name: "Wireless Noise-Cancelling Headphones", description: "Premium over-ear headphones with ANC", price: 349.99, category: "Electronics", inStockQty: 40, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  { sku: "ELEC-EARBUDS-001", name: "True Wireless Earbuds", description: "Compact earbuds with charging case", price: 129.99, category: "Electronics", inStockQty: 120, imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop" },
  { sku: "ELEC-SPEAKER-001", name: "Portable Bluetooth Speaker", description: "Waterproof speaker with 360° sound", price: 79.99, category: "Electronics", inStockQty: 60, imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop" },
  { sku: "ELEC-CAMERA-001", name: "Mirrorless Camera Kit", description: "Professional camera with 24MP sensor and lens", price: 1499.99, category: "Electronics", inStockQty: 12, imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop" },

  // Women's Footwear
  { sku: "FOOT-HEEL-001", name: "Classic Stiletto Heels", description: "Elegant high heels perfect for formal occasions", price: 89.99, category: "Women's Footwear", inStockQty: 45, imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop" },
  { sku: "FOOT-HEEL-002", name: "Block Heel Pumps", description: "Comfortable block heels for all-day wear", price: 69.99, category: "Women's Footwear", inStockQty: 55, imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop" },
  { sku: "FOOT-BOOT-001", name: "Ankle Boots Leather", description: "Premium leather ankle boots with zipper", price: 129.99, category: "Women's Footwear", inStockQty: 30, imageUrl: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400&h=300&fit=crop" },
  { sku: "FOOT-BOOT-002", name: "Knee-High Boots", description: "Stylish knee-high boots for winter", price: 159.99, category: "Women's Footwear", inStockQty: 20, imageUrl: "https://images.unsplash.com/photo-1608256246200-53e6092ff478?w=400&h=300&fit=crop" },
  { sku: "FOOT-SNEAKER-001", name: "Running Sneakers", description: "Lightweight running shoes with cushioning", price: 79.99, category: "Women's Footwear", inStockQty: 85, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { sku: "FOOT-SNEAKER-002", name: "Fashion Sneakers", description: "Trendy casual sneakers for everyday wear", price: 59.99, category: "Women's Footwear", inStockQty: 90, imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop" },
  { sku: "FOOT-SANDAL-001", name: "Summer Flat Sandals", description: "Comfortable flat sandals for warm weather", price: 39.99, category: "Women's Footwear", inStockQty: 70, imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop" },
  { sku: "FOOT-SANDAL-002", name: "Wedge Sandals", description: "Elegant wedge sandals with ankle strap", price: 69.99, category: "Women's Footwear", inStockQty: 35, imageUrl: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400&h=300&fit=crop" },
  { sku: "FOOT-FLAT-001", name: "Ballet Flats", description: "Classic ballet flats in multiple colors", price: 49.99, category: "Women's Footwear", inStockQty: 65, imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop" },
  { sku: "FOOT-LOAFER-001", name: "Leather Loafers", description: "Professional leather loafers for office", price: 89.99, category: "Women's Footwear", inStockQty: 40, imageUrl: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400&h=300&fit=crop" },
];

// Sample policies for migration
const SAMPLE_POLICIES = [
  {
    title: "Refund Policy",
    text: "Customers can request a full refund within 30 days of purchase. Items must be unused and in original packaging. Refunds are processed within 5-7 business days to the original payment method. Shipping costs are non-refundable unless the item is defective.",
    classification: "refund"
  },
  {
    title: "Return Policy",
    text: "Returns are accepted within 30 days of delivery. Items must be in original condition with all tags attached. Return shipping is free for defective items, otherwise customer pays return shipping. Exchange or store credit available.",
    classification: "return"
  },
  {
    title: "Delivery Policy",
    text: "Standard delivery takes 5-7 business days. Express shipping available for 2-3 day delivery. Free shipping on orders over $100. Tracking information provided via email. Signature required for orders over $500.",
    classification: "delivery"
  },
  {
    title: "Shipping Policy",
    text: "We ship to all 50 US states and internationally to select countries. Orders are processed within 24 hours on business days. International shipping may take 10-21 business days. Customs fees may apply for international orders.",
    classification: "shipping"
  },
  {
    title: "Warranty Policy",
    text: "All electronics come with a 1-year manufacturer warranty. Warranty covers defects in materials and workmanship. Does not cover damage from misuse, accidents, or normal wear. Extended warranty available at checkout.",
    classification: "warranty"
  },
  {
    title: "Privacy Policy",
    text: "We collect personal information including name, email, and payment details. Information is used to process orders and improve services. We do not sell personal data to third parties. Data is encrypted and stored securely.",
    classification: "privacy"
  },
  {
    title: "Exchange Policy",
    text: "Exchanges are available within 30 days of purchase. Items must be unworn and in original packaging. We offer size exchanges and product exchanges. Exchange shipping is free. Process takes 7-10 business days.",
    classification: "exchange"
  },
  {
    title: "Cancellation Policy",
    text: "Orders can be cancelled within 24 hours of placement for a full refund. After 24 hours, standard return policy applies. Expedited orders cannot be cancelled once shipped. Cancellations are processed immediately.",
    classification: "cancellation"
  },
  {
    title: "Payment Policy",
    text: "We accept Visa, Mastercard, American Express, and PayPal. Payment is processed securely through encrypted channels. Split payments not available. Payment must clear before order ships. Save payment methods for faster checkout.",
    classification: "payment"
  },
  {
    title: "Terms of Service",
    text: "By using our service, you agree to these terms. Users must be 18 or older. Accounts may be suspended for violations. We reserve the right to modify services. Disputes resolved through arbitration.",
    classification: "terms"
  },
];

// Sample reviews for migration
const SAMPLE_REVIEWS = [
  {
    productId: null, // Will be set dynamically
    userId: "demo-user",
    rating: 5,
    title: "Excellent product!",
    text: "This laptop exceeded my expectations. Fast performance, great build quality, and the battery life is amazing. Highly recommend!",
  },
  {
    productId: null,
    userId: "demo-user",
    rating: 4,
    title: "Very good, minor issues",
    text: "Great product overall. The only downside is the fan can get a bit loud under heavy load. Otherwise, perfect for my needs.",
  },
  {
    productId: null,
    userId: "demo-user",
    rating: 5,
    title: "Best purchase I've made",
    text: "Absolutely love this phone! The camera quality is outstanding and the battery lasts all day. Worth every penny.",
  },
  {
    productId: null,
    userId: "demo-user",
    rating: 3,
    title: "Decent but not perfect",
    text: "It's okay for the price. The screen is good but the speakers could be better. Overall, it's a solid mid-range option.",
  },
  {
    productId: null,
    userId: "demo-user",
    rating: 5,
    title: "Amazing headphones!",
    text: "The noise cancellation is incredible. Perfect for travel and work. Comfortable to wear for hours. Best headphones I've owned.",
  },
  {
    productId: null,
    userId: "demo-user",
    rating: 4,
    title: "Great value",
    text: "These earbuds are fantastic for the price. Good sound quality and battery life. The case is compact and easy to carry.",
  },
  {
    productId: null,
    userId: "demo-user",
    rating: 5,
    title: "Perfect for photography",
    text: "This camera is a game-changer. The image quality is professional-grade and it's surprisingly easy to use. Highly recommend for enthusiasts.",
  },
  {
    productId: null,
    userId: "demo-user",
    rating: 4,
    title: "Comfortable and stylish",
    text: "Love these heels! They're comfortable enough to wear all day and look elegant. Great for both work and special occasions.",
  },
];

// Sample coupons for migration
const SAMPLE_COUPONS = [
  {
    code: "WELCOME10",
    description: "Welcome discount for new customers",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minPurchaseAmount: 50,
    maxDiscountAmount: 100,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    usageLimit: 1000,
    isActive: true,
  },
  {
    code: "SUMMER25",
    description: "Summer sale discount",
    discountType: "PERCENTAGE",
    discountValue: 25,
    minPurchaseAmount: 100,
    maxDiscountAmount: 250,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    usageLimit: 500,
    isActive: true,
  },
  {
    code: "FREESHIP",
    description: "Free shipping on orders over $75",
    discountType: "FIXED",
    discountValue: 0,
    minPurchaseAmount: 75,
    maxDiscountAmount: null,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
    usageLimit: null,
    isActive: true,
  },
  {
    code: "FLASH50",
    description: "Flash sale - 50% off",
    discountType: "PERCENTAGE",
    discountValue: 50,
    minPurchaseAmount: 200,
    maxDiscountAmount: 500,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    usageLimit: 100,
    isActive: true,
  },
  {
    code: "STUDENT15",
    description: "Student discount",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minPurchaseAmount: 25,
    maxDiscountAmount: 50,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    usageLimit: null,
    isActive: true,
  },
];

// Sample tickets for migration
const SAMPLE_TICKETS = [
  {
    userId: "demo-user-001",
    issueType: "Order Issue",
    description: "I placed an order over a week ago and still haven't received it. The tracking shows it was delivered but I never got the package. Can you please help me locate it or send a replacement?"
  },
  {
    userId: "demo-user-002",
    issueType: "Shipping",
    description: "My tracking number hasn't updated in 5 days. Can you check the status of my shipment?"
  },
  {
    userId: "demo-user-003",
    issueType: "Product Quality",
    description: "The product arrived damaged. The box was in good condition but the item inside has visible scratches and dents. I would like to return it for a refund or exchange."
  },
  {
    userId: "demo-user-004",
    issueType: "Returns & Refunds",
    description: "I would like to return this item as it doesn't meet my needs. What is the return process and will I get a full refund?"
  },
  {
    userId: "demo-user-005",
    issueType: "Payment",
    description: "I was charged twice for my order. Please refund the duplicate payment immediately."
  },
  {
    userId: "demo-user-006",
    issueType: "Technical Support",
    description: "I need to file a warranty claim. The product stopped working after just 2 months of use."
  },
  {
    userId: "demo-user-007",
    issueType: "Account",
    description: "I can't log into my account. Password reset isn't working either. Need urgent help."
  },
  {
    userId: "demo-user-008",
    issueType: "Product Information",
    description: "Can you provide detailed installation instructions? The manual that came with it is unclear."
  },
  {
    userId: "demo-user-009",
    issueType: "Order Issue",
    description: "I ordered the blue version but received the red one instead. I need to exchange it for the correct color as soon as possible."
  },
  {
    userId: "demo-user-010",
    issueType: "Shipping",
    description: "My order was supposed to arrive yesterday but there's been a delay. When can I expect delivery?"
  },
  {
    userId: "demo-user-011",
    issueType: "Product Quality",
    description: "The product quality is not as expected. It feels cheap and flimsy. Very disappointed."
  },
  {
    userId: "demo-user-012",
    issueType: "Returns & Refunds",
    description: "The color in person is completely different from the website photos. I want to return this."
  },
  {
    userId: "demo-user-013",
    issueType: "Payment",
    description: "I tried using the discount code from your email but it says it's invalid. Can you help?"
  },
  {
    userId: "demo-user-014",
    issueType: "Technical Support",
    description: "Will this product work with my existing setup? I need compatibility information before installing."
  },
  {
    userId: "demo-user-015",
    issueType: "Website Issue",
    description: "The website keeps giving me an error when I try to checkout. I've tried multiple times with different payment methods."
  },
  {
    userId: "demo-user-016",
    issueType: "Order Issue",
    description: "The product seems to be missing some essential parts mentioned in the manual. Could you send the missing components?"
  },
  {
    userId: "demo-user-017",
    issueType: "Shipping",
    description: "Do you ship to my country? The checkout won't let me select my shipping address."
  },
  {
    userId: "demo-user-018",
    issueType: "Product Quality",
    description: "I received my order but the product doesn't work as described. I've tried troubleshooting but no luck. Please advise on next steps."
  },
  {
    userId: "demo-user-019",
    issueType: "Returns & Refunds",
    description: "I ordered the large size but it fits like a medium. I need to return this for the correct size."
  },
  {
    userId: "demo-user-020",
    issueType: "Other",
    description: "I need to order 50 units for my business. Do you offer bulk discounts?"
  }
];

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  inStockQty?: number;
  relevanceScore?: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  userId: string;
  productId: string;
  productName?: string;
  quantity: number;
  totalPrice: number;
  status: string;
  orderDate: string;
}

type ResultType =
  | "ACTION_EXECUTED"
  | "ACTION_DENIED"
  | "INFORMATION_PROVIDED"
  | "CONFIRMATION_REQUIRED"
  | "CLARIFICATION_REQUIRED"
  | "OUT_OF_SCOPE"
  | "COMPOUND_HANDLED"
  | "ERROR";

interface SanitizedPayload {
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

interface ChatResult {
  type: ResultType;
  success: boolean;
  smartSuggestion?: any;
  sanitizedPayload: SanitizedPayload;
}

interface ChatMessage {
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
  attachedProduct?: Product; // For backward compatibility
  attachedProducts?: Product[]; // For multiple attachments
}

interface Conversation {
  id: string;
  ownerId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

interface Policy {
  id: string;
  title: string;
  text: string;
  classification: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Review {
  id?: string;
  productId: string | null;
  userId: string;
  rating: number;
  title: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Coupon {
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
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to get styling and icons for different result types
const getResultTypeStyles = (resultType?: ResultType) => {
  switch (resultType) {
    case "ACTION_EXECUTED":
      return {
        icon: CheckCircle2,
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        textColor: "text-green-700",
        iconColor: "text-green-600",
        badgeBg: "bg-green-500/20",
        badgeText: "text-green-700",
        label: "Action Executed",
        hideBadge: false,
      };
    case "ACTION_DENIED":
      return {
        icon: Ban,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700",
        iconColor: "text-red-600",
        badgeBg: "bg-red-500/20",
        badgeText: "text-red-700",
        label: "Action Denied",
        hideBadge: false,
      };
    case "INFORMATION_PROVIDED":
      return {
        icon: Info,
        bgColor: "bg-muted",
        borderColor: "border-transparent",
        textColor: "text-foreground",
        iconColor: "text-muted-foreground",
        badgeBg: "bg-transparent",
        badgeText: "text-muted-foreground",
        label: "Information",
        hideBadge: true,
      };
    case "CONFIRMATION_REQUIRED":
      return {
        icon: HelpCircle,
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        textColor: "text-yellow-700",
        iconColor: "text-yellow-600",
        badgeBg: "bg-yellow-500/20",
        badgeText: "text-yellow-700",
        label: "Confirmation Required",
        hideBadge: false,
      };
    case "CLARIFICATION_REQUIRED":
      return {
        icon: AlertCircle,
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        textColor: "text-orange-700",
        iconColor: "text-orange-600",
        badgeBg: "bg-orange-500/20",
        badgeText: "text-orange-700",
        label: "Clarification Needed",
        hideBadge: false,
      };
    case "OUT_OF_SCOPE":
      return {
        icon: AlertTriangle,
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/30",
        textColor: "text-gray-700",
        iconColor: "text-gray-600",
        badgeBg: "bg-gray-500/20",
        badgeText: "text-gray-700",
        label: "Out of Scope",
        hideBadge: false,
      };
    case "COMPOUND_HANDLED":
      return {
        icon: Zap,
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        textColor: "text-purple-700",
        iconColor: "text-purple-600",
        badgeBg: "bg-purple-500/20",
        badgeText: "text-purple-700",
        label: "Multiple Actions",
        hideBadge: false,
      };
    case "ERROR":
      return {
        icon: XCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700",
        iconColor: "text-red-600",
        badgeBg: "bg-red-500/20",
        badgeText: "text-red-700",
        label: "Error",
        hideBadge: false,
      };
    default:
      return {
        icon: Bot,
        bgColor: "bg-muted",
        borderColor: "border-muted",
        textColor: "text-foreground",
        iconColor: "text-muted-foreground",
        badgeBg: "bg-muted",
        badgeText: "text-muted-foreground",
        label: "Response",
        hideBadge: false,
      };
  }
};

// Helper function to format field names
const formatFieldName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Helper function to format field values
const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object" && !Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length} item(s)` : "Empty";
  }
  if (typeof value === "string" && value.includes("T") && value.includes("Z")) {
    // Try to format ISO date strings
    try {
      const date = new Date(value);
      return date.toLocaleString();
    } catch {
      return value;
    }
  }
  return String(value);
};

// Component to render actionResult data generically
const ActionResultRenderer = ({ 
  data, 
  messageId, 
  expandedCount, 
  onExpand 
}: { 
  data: any; 
  messageId: string; 
  expandedCount: number; 
  onExpand: (count: number) => void;
}) => {
  if (!data) return null;

  // Handle arrays
  if (Array.isArray(data)) {
    const visibleItems = data.slice(0, expandedCount || 3);
    const remaining = data.length - visibleItems.length;

    return (
      <div className="mt-3 space-y-2">
        {visibleItems.map((item: any, idx: number) => (
          <Card key={idx} className="text-xs">
            <CardContent className="p-3">
              {typeof item === "object" && item !== null ? (
                // Render object fields
                <div className="space-y-2">
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-2">
                      <span className="text-muted-foreground font-medium min-w-[80px]">
                        {formatFieldName(key)}:
                      </span>
                      <span className="text-foreground text-right flex-1">
                        {typeof value === "object" && value !== null && !Array.isArray(value) ? (
                          <div className="space-y-1">
                            {Object.entries(value).map(([nestedKey, nestedValue]) => (
                              <div key={nestedKey} className="text-[10px]">
                                <span className="text-muted-foreground">{formatFieldName(nestedKey)}: </span>
                                <span>{formatFieldValue(nestedValue)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          formatFieldValue(value)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground">{formatFieldValue(item)}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {remaining > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-xs"
            onClick={() => onExpand((expandedCount || 3) + 3)}
          >
            Show {Math.min(3, remaining)} more
          </Button>
        )}
      </div>
    );
  }

  // Handle objects
  if (typeof data === "object" && data !== null) {
    // Check if object has array-like properties (e.g., { orders: [...], count: 2 })
    const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
    
    if (arrayKeys.length > 0) {
      // Render each array property
      return (
        <div className="mt-3 space-y-3">
          {arrayKeys.map((arrayKey) => {
            const arrayData = data[arrayKey];
            const visibleItems = arrayData.slice(0, expandedCount || 3);
            const remaining = arrayData.length - visibleItems.length;

            return (
              <div key={arrayKey}>
                <h4 className="text-sm font-semibold mb-2">{formatFieldName(arrayKey)}</h4>
                <div className="space-y-2">
                  {visibleItems.map((item: any, idx: number) => (
                    <Card key={idx} className="text-xs">
                      <CardContent className="p-3">
                        {typeof item === "object" && item !== null ? (
                          <div className="space-y-2">
                            {Object.entries(item).map(([key, value]) => (
                              <div key={key} className="flex items-start justify-between gap-2">
                                <span className="text-muted-foreground font-medium min-w-[80px]">
                                  {formatFieldName(key)}:
                                </span>
                                <span className="text-foreground text-right flex-1">
                                  {formatFieldValue(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-foreground">{formatFieldValue(item)}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {remaining > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => onExpand((expandedCount || 3) + 3)}
                    >
                      Show {Math.min(3, remaining)} more
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {/* Render non-array properties */}
          {Object.entries(data)
            .filter(([key]) => !Array.isArray(data[key]))
            .map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-muted-foreground font-medium">{formatFieldName(key)}: </span>
                <span className="text-foreground">{formatFieldValue(value)}</span>
              </div>
            ))}
        </div>
      );
    }

    // Render simple object as key-value pairs
    return (
      <div className="mt-3">
        <Card className="text-xs">
          <CardContent className="p-3">
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground font-medium min-w-[100px]">
                    {formatFieldName(key)}:
                  </span>
                  <span className="text-foreground text-right flex-1">
                    {typeof value === "object" && value !== null && !Array.isArray(value) ? (
                      <div className="space-y-1 pl-2 border-l-2 border-muted">
                        {Object.entries(value).map(([nestedKey, nestedValue]) => (
                          <div key={nestedKey} className="text-[10px]">
                            <span className="text-muted-foreground">{formatFieldName(nestedKey)}: </span>
                            <span>{formatFieldValue(nestedValue)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      formatFieldValue(value)
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle primitive values
  return (
    <div className="mt-3">
      <Card className="text-xs">
        <CardContent className="p-3">
          <p className="text-foreground">{formatFieldValue(data)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const AIFabricFramework = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [isFilling, setIsFilling] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const [currentFillingProduct, setCurrentFillingProduct] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [isMigratingPolicies, setIsMigratingPolicies] = useState(false);
  const [policyMigrationProgress, setPolicyMigrationProgress] = useState(0);
  const [currentMigratingPolicy, setCurrentMigratingPolicy] = useState("");
  const [policyCount, setPolicyCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isMigratingReviews, setIsMigratingReviews] = useState(false);
  const [reviewMigrationProgress, setReviewMigrationProgress] = useState(0);
  const [currentMigratingReview, setCurrentMigratingReview] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isMigratingCoupons, setIsMigratingCoupons] = useState(false);
  const [couponMigrationProgress, setCouponMigrationProgress] = useState(0);
  const [currentMigratingCoupon, setCurrentMigratingCoupon] = useState("");
  const [couponCount, setCouponCount] = useState(0);
  const [isMigratingTickets, setIsMigratingTickets] = useState(false);
  const [ticketMigrationProgress, setTicketMigrationProgress] = useState(0);
  const [currentMigratingTicket, setCurrentMigratingTicket] = useState("");
  const [ticketCount, setTicketCount] = useState(0);
  const [migratedProductIds, setMigratedProductIds] = useState<string[]>([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [attachedProducts, setAttachedProducts] = useState<Product[]>([]);
  const [attachedReviews, setAttachedReviews] = useState<Review[]>([]);
  const [attachedCoupons, setAttachedCoupons] = useState<Coupon[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: number }>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const isUserFocusRef = useRef(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state for add/edit
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    category: "",
    inStockQty: "",
  });

  // Load products on mount
  useEffect(() => {
    loadProducts();
    loadProductCount();
  }, []);

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab]);

  // Load conversations when chat tab is active
  useEffect(() => {
    if (activeTab === "chat") {
      loadConversations();
    }
  }, [activeTab]);

  // Load policies when policies tab is active
  useEffect(() => {
    if (activeTab === "policies") {
      loadPolicies();
      loadPolicyCount();
    }
  }, [activeTab]);

  // Load reviews when reviews tab is active
  useEffect(() => {
    if (activeTab === "reviews") {
      loadReviews();
      loadReviewCount();
    }
  }, [activeTab]);

  // Load coupons when coupons tab is active
  useEffect(() => {
    if (activeTab === "coupons") {
      loadCoupons();
      loadCouponCount();
    }
  }, [activeTab]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current && isChatExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatExpanded]);

  // Fetch suggestions when items are attached
  useEffect(() => {
    if (attachedProducts.length === 0 && attachedReviews.length === 0 && attachedCoupons.length === 0) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        // Build attachment content for suggestions API
        const parts: string[] = [];
        if (attachedProducts.length > 0) {
          parts.push(...attachedProducts.map(p => 
            `Product: ${p.name} - ${p.description}, Price: $${p.price}, SKU: ${p.sku}`
          ));
        }
        if (attachedReviews.length > 0) {
          parts.push(...attachedReviews.map(r => 
            `Review: ${r.title} (${r.rating}/5) - ${r.text}`
          ));
        }
        if (attachedCoupons.length > 0) {
          parts.push(...attachedCoupons.map(c => 
            `Coupon: ${c.code} - ${c.description}, Discount: ${c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `$${c.discountValue}`}`
          ));
        }
        const attachmentContent = parts.join('\n');

        const response = await fetch(`${API_BASE_URL}/chat/suggestions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: attachmentContent,
            maxSuggestions: 5,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Handle different response formats
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else if (data.suggestions && Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          } else if (data.suggestion && Array.isArray(data.suggestion)) {
            setSuggestions(data.suggestion);
          } else {
            setSuggestions([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to load suggestions:", response.status, errorText);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Failed to load suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 5000); // 5 second delay

    return () => clearTimeout(timeoutId);
  }, [attachedProducts, attachedReviews, attachedCoupons]);

  const loadProducts = async (limit = 50) => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadProductCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/count`);
      if (!response.ok) throw new Error("Failed to load product count");
      const data = await response.json();
      setProductCount(data.count || 0);
    } catch (error) {
      console.error("Failed to load product count:", error);
    }
  };

  const loadOrders = async (userId = "demo-user") => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders?userId=${userId}&limit=50`);
      if (!response.ok) throw new Error("Failed to load orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadConversations = async (ownerId = "demo-user") => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations?ownerId=${ownerId}`);
      if (!response.ok) throw new Error("Failed to load conversations");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const handleProductSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    setIsLoadingProducts(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/search?q=${encodeURIComponent(searchQuery)}&limit=20&threshold=0.3`
      );
      if (!response.ok) throw new Error("Failed to search products");
      const data = await response.json();
      setProducts(data);

      toast({
        title: "Search Complete",
        description: `Found ${data.length} products matching "${searchQuery}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search products. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.sku || !formData.name || !formData.description || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sku: formData.sku,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category || undefined,
          inStockQty: formData.inStockQty ? parseInt(formData.inStockQty) : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create product");
      }

      const newProduct = await response.json();
      setProducts([newProduct, ...products]);
      setProductCount(productCount + 1);
      setIsAddDialogOpen(false);
      setFormData({ sku: "", name: "", description: "", price: "", category: "", inStockQty: "" });

      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name || undefined,
          description: formData.description || undefined,
          price: formData.price ? parseFloat(formData.price) : undefined,
          category: formData.category || undefined,
          inStockQty: formData.inStockQty ? parseInt(formData.inStockQty) : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update product");
      }

      const updatedProduct = await response.json();
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      setFormData({ sku: "", name: "", description: "", price: "", category: "", inStockQty: "" });

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete product");
      }

      setProducts(products.filter((p) => p.id !== id));
      setProductCount(Math.max(0, productCount - 1));

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleAttachProduct = (product: Product) => {
    // Check if product is already attached
    if (attachedProducts.some(p => p.id === product.id)) {
      toast({
        title: "Already Attached",
        description: `${product.name} is already attached to chat`,
        variant: "default",
      });
      return;
    }
    
    setAttachedProducts(prev => [...prev, product]);
    toast({
      title: "Product Attached",
      description: `${product.name} attached to chat`,
    });
  };

  const handleRemoveAttachment = (productId: string) => {
    setAttachedProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Product Removed",
      description: "Product removed from attachments",
    });
  };

  const handleAttachReview = (review: Review) => {
    // Check if review is already attached
    if (attachedReviews.some(r => r.id === review.id)) {
      toast({
        title: "Already Attached",
        description: "This review is already attached to chat",
        variant: "default",
      });
      return;
    }
    
    setAttachedReviews(prev => [...prev, review]);
    toast({
      title: "Review Attached",
      description: `${review.title} attached to chat`,
    });
  };

  const handleAttachCoupon = (coupon: Coupon) => {
    // Check if coupon is already attached
    if (attachedCoupons.some(c => c.id === coupon.id)) {
      toast({
        title: "Already Attached",
        description: "This coupon is already attached to chat",
        variant: "default",
      });
      return;
    }
    
    setAttachedCoupons(prev => [...prev, coupon]);
    toast({
      title: "Coupon Attached",
      description: `${coupon.code} attached to chat`,
    });
  };

  const handleRemoveAttachedReview = (reviewId: string) => {
    setAttachedReviews(prev => prev.filter(r => r.id !== reviewId));
    toast({
      title: "Review Removed",
      description: "Review removed from attachments",
    });
  };

  const handleRemoveAttachedCoupon = (couponId: string) => {
    setAttachedCoupons(prev => prev.filter(c => c.id !== couponId));
    toast({
      title: "Coupon Removed",
      description: "Coupon removed from attachments",
    });
  };

  const handleConfirmationAction = async (action: string, messageData?: any) => {
    const query = action === "confirm" ? "Yes, confirm" : "No, cancel";

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          userId: "demo-user",
          sessionId: "demo-session",
          conversationId: currentConversationId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to process chat query");
      }

      const data = await response.json();

      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      let messageContent = "";
      let result: ChatResult | undefined;
      let resultType: ResultType | undefined;

      if (data.result && data.result.sanitizedPayload) {
        messageContent = data.result.sanitizedPayload.message || "I processed your query successfully.";
        result = data.result;
        resultType = data.result.type;
      } else {
        messageContent = data.response || data.message || "I processed your query successfully.";
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: messageContent,
        timestamp: new Date().toISOString(),
        orchestration: data.orchestration ? {
          intent: data.orchestration.intent || "general_query",
          confidence: data.orchestration.confidence || 0.9,
          actions: data.orchestration.actions || ["process_query"],
        } : undefined,
        result: result,
        resultType: resultType,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error processing your request: " + (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to process confirmation. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatQuery = async (queryOverride?: string) => {
    const queryToUse = queryOverride || chatQuery;
    if (!queryToUse.trim()) return;

    // Build query with all attached context
    let enhancedQuery = queryToUse;
    const contexts: string[] = [];
    
    if (attachedProducts.length > 0) {
      const productContexts = attachedProducts.map(p => 
        `${p.name} - ${p.description}, Price: $${p.price}, SKU: ${p.sku}`
      ).join('\n');
      contexts.push(`Product Context:\n${productContexts}`);
    }
    
    if (attachedReviews.length > 0) {
      const reviewContexts = attachedReviews.map(r => 
        `${r.title} (${r.rating}/5): ${r.text}`
      ).join('\n');
      contexts.push(`Review Context:\n${reviewContexts}`);
    }
    
    if (attachedCoupons.length > 0) {
      const couponContexts = attachedCoupons.map(c => 
        `${c.code}: ${c.description}, Discount: ${c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `$${c.discountValue}`}, Min: $${c.minPurchaseAmount || "N/A"}`
      ).join('\n');
      contexts.push(`Coupon Context:\n${couponContexts}`);
    }
    
    if (contexts.length > 0) {
      enhancedQuery = `${queryToUse}\n\n[${contexts.join('\n\n')}]`;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: queryToUse,
      timestamp: new Date().toISOString(),
      attachedProduct: attachedProducts.length > 0 ? attachedProducts[0] : undefined, // Keep for backward compatibility
      attachedProducts: attachedProducts.length > 0 ? [...attachedProducts] : undefined, // Include all attachments
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentQuery = enhancedQuery;
    const currentAttachments = attachedProducts;
    setChatQuery("");
    setIsLoading(true);
    setIsChatExpanded(true);

    // Remove attachments and suggestions after sending
    setAttachedProducts([]);
    setAttachedReviews([]);
    setAttachedCoupons([]);
    setSuggestions([]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: currentQuery,
          userId: "demo-user",
          sessionId: "demo-session",
          conversationId: currentConversationId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to process chat query");
      }

      const data = await response.json();

      // Store conversation ID for future messages
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      // Extract message from sanitizedPayload if available
      let messageContent = "";
      let result: ChatResult | undefined;
      let resultType: ResultType | undefined;

      if (data.result && data.result.sanitizedPayload) {
        // New format with sanitizedPayload
        messageContent = data.result.sanitizedPayload.message || "I processed your query successfully.";
        result = data.result;
        resultType = data.result.type;
      } else {
        // Fallback to old format
        messageContent = data.response || data.message || "I processed your query successfully.";
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: messageContent,
        timestamp: new Date().toISOString(),
        orchestration: data.orchestration ? {
          intent: data.orchestration.intent || "general_query",
          confidence: data.orchestration.confidence || 0.9,
          actions: data.orchestration.actions || ["process_query"],
        } : undefined,
        result: result,
        resultType: resultType,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error processing your request: " + (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to process chat query. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category || "",
      inStockQty: product.inStockQty ? product.inStockQty.toString() : "",
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData({ sku: "", name: "", description: "", price: "", category: "", inStockQty: "" });
    setIsAddDialogOpen(true);
  };

  const handleFillStock = async () => {
    if (isFilling) return;

    setIsFilling(true);
    setFillProgress(0);
    let successCount = 0;
    let failCount = 0;
    const createdProductIds: string[] = [];

    for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
      const product = SAMPLE_PRODUCTS[i];
      setCurrentFillingProduct(product.name);
      setFillProgress(((i + 1) / SAMPLE_PRODUCTS.length) * 100);

      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sku: product.sku,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            inStockQty: product.inStockQty,
            imageUrl: product.imageUrl,
          }),
        });

        if (response.ok) {
          const createdProduct = await response.json();
          if (createdProduct.id) {
            createdProductIds.push(createdProduct.id);
          }
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }

      // Wait 2 seconds before next product
      if (i < SAMPLE_PRODUCTS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Store the created product IDs for review migration
    setMigratedProductIds(createdProductIds);

    setIsFilling(false);
    setCurrentFillingProduct("");

    // Reload products
    await loadProducts();
    await loadProductCount();

    toast({
      title: "Stock Fill Complete",
      description: `Successfully added ${successCount} products. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
    });
  };

  const loadPolicies = async (limit = 50) => {
    setIsLoadingPolicies(true);
    try {
      const response = await fetch(`${API_BASE_URL}/policies?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to load policies");
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load policies. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPolicies(false);
    }
  };

  const loadPolicyCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/policies/count`);
      if (!response.ok) throw new Error("Failed to load policy count");
      const data = await response.json();
      setPolicyCount(data.count || 0);
    } catch (error) {
      console.error("Failed to load policy count:", error);
    }
  };

  const handleMigratePolicies = async () => {
    if (isMigratingPolicies) return;

    setIsMigratingPolicies(true);
    setPolicyMigrationProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < SAMPLE_POLICIES.length; i++) {
      const policy = SAMPLE_POLICIES[i];
      setCurrentMigratingPolicy(policy.title);
      setPolicyMigrationProgress(((i + 1) / SAMPLE_POLICIES.length) * 100);

      try {
        const response = await fetch(`${API_BASE_URL}/policies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(policy),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }

      // Wait 2 seconds before next policy
      if (i < SAMPLE_POLICIES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsMigratingPolicies(false);
    setCurrentMigratingPolicy("");

    // Reload policies
    await loadPolicies();
    await loadPolicyCount();

    toast({
      title: "Policy Migration Complete",
      description: `Successfully added ${successCount} policies. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
    });
  };

  const handleDeletePolicy = async (id: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/policies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete policy");
      }

      setPolicies(policies.filter((p) => p.id !== id));
      setPolicyCount(Math.max(0, policyCount - 1));

      toast({
        title: "Success",
        description: "Policy deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete policy. " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Reviews functions
  const loadReviews = async (limit = 50) => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to load reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const loadReviewCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/count`);
      if (!response.ok) {
        // If count endpoint doesn't exist, try to get count from reviews list
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews?limit=1000`);
        if (reviewsResponse.ok) {
          const reviews = await reviewsResponse.json();
          setReviewCount(Array.isArray(reviews) ? reviews.length : 0);
        } else {
          setReviewCount(0);
        }
        return;
      }
      const data = await response.json();
      setReviewCount(data.count || 0);
    } catch (error) {
      console.error("Failed to load review count:", error);
      // Fallback: try to get count from reviews list
      try {
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews?limit=1000`);
        if (reviewsResponse.ok) {
          const reviews = await reviewsResponse.json();
          setReviewCount(Array.isArray(reviews) ? reviews.length : 0);
        }
      } catch (fallbackError) {
        console.error("Failed to load review count fallback:", fallbackError);
        setReviewCount(0);
      }
    }
  };

  const handleMigrateReviews = async () => {
    if (isMigratingReviews) return;

    // Check if we have migrated product IDs, if not, fetch products from backend
    let productIdsToUse = migratedProductIds;
    
    if (productIdsToUse.length === 0) {
      // Fallback: get products from backend if no migrated IDs available
      const productsResponse = await fetch(`${API_BASE_URL}/products?limit=50`);
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        productIdsToUse = products.map((p: Product) => p.id);
      }
    }

    if (productIdsToUse.length === 0) {
      toast({
        title: "Error",
        description: "No products found. Please run 'Fill Stock' first to create products.",
        variant: "destructive",
      });
      return;
    }

    setIsMigratingReviews(true);
    setReviewMigrationProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < SAMPLE_REVIEWS.length; i++) {
      const review = { ...SAMPLE_REVIEWS[i] };
      // Assign review to product from migrated products (cycle through if needed)
      const productIndex = i % productIdsToUse.length;
      review.productId = productIdsToUse[productIndex];
      
      setCurrentMigratingReview(review.title);
      setReviewMigrationProgress(((i + 1) / SAMPLE_REVIEWS.length) * 100);

      try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(review),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
          const errorText = await response.text();
          console.error(`Failed to create review ${i + 1}:`, errorText);
        }
      } catch (error) {
        failCount++;
        console.error(`Error creating review ${i + 1}:`, error);
      }

      // Small delay between requests
      if (i < SAMPLE_REVIEWS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsMigratingReviews(false);
    setReviewMigrationProgress(0);
    setCurrentMigratingReview("");

    // Reload reviews
    await loadReviews();
    await loadReviewCount();

    toast({
      title: "Review Migration Complete",
      description: `Successfully added ${successCount} reviews. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
    });
  };

  // Coupons functions
  const loadCoupons = async (limit = 50) => {
    setIsLoadingCoupons(true);
    try {
      const response = await fetch(`${API_BASE_URL}/coupons?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to load coupons");
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load coupons. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const loadCouponCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/count`);
      if (!response.ok) throw new Error("Failed to load coupon count");
      const data = await response.json();
      setCouponCount(data.count || 0);
    } catch (error) {
      console.error("Failed to load coupon count:", error);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/migration/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirm: true,
          clearVectors: true,
          clearIndexingQueue: true,
        }),
      });

      if (response.ok) {
        // Reload all data
        await loadProducts();
        await loadProductCount();
        await loadPolicies();
        await loadPolicyCount();
        await loadReviews();
        await loadReviewCount();
        await loadCoupons();
        await loadCouponCount();
        await loadOrders();
        
        // Clear migrated product IDs
        setMigratedProductIds([]);

        toast({
          title: "Data Cleared",
          description: "All data has been cleared successfully",
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to clear data");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleMigrateCoupons = async () => {
    if (isMigratingCoupons) return;

    setIsMigratingCoupons(true);
    setCouponMigrationProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < SAMPLE_COUPONS.length; i++) {
      const coupon = SAMPLE_COUPONS[i];
      setCurrentMigratingCoupon(coupon.code);
      setCouponMigrationProgress(((i + 1) / SAMPLE_COUPONS.length) * 100);

      try {
        const response = await fetch(`${API_BASE_URL}/coupons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(coupon),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
          const errorText = await response.text();
          console.error(`Failed to create coupon ${coupon.code}:`, errorText);
        }
      } catch (error) {
        failCount++;
        console.error(`Error creating coupon ${coupon.code}:`, error);
      }

      // Small delay between requests
      if (i < SAMPLE_COUPONS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsMigratingCoupons(false);
    setCouponMigrationProgress(0);
    setCurrentMigratingCoupon("");

    // Reload coupons
    await loadCoupons();
    await loadCouponCount();

    toast({
      title: "Coupon Migration Complete",
      description: `Successfully added ${successCount} coupons. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
    });
  };

  const handleMigrateTickets = async () => {
    if (isMigratingTickets) return;

    setIsMigratingTickets(true);
    setTicketMigrationProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < SAMPLE_TICKETS.length; i++) {
      const ticket = SAMPLE_TICKETS[i];
      setCurrentMigratingTicket(`Ticket ${i + 1} - ${ticket.issueType}`);
      setTicketMigrationProgress(((i + 1) / SAMPLE_TICKETS.length) * 100);

      try {
        const response = await fetch(`${API_BASE_URL}/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticket),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
          const errorText = await response.text();
          console.error(`Failed to create ticket ${i + 1}:`, errorText);
        }
      } catch (error) {
        failCount++;
        console.error(`Error creating ticket ${i + 1}:`, error);
      }

      // Small delay between requests
      if (i < SAMPLE_TICKETS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsMigratingTickets(false);
    setTicketMigrationProgress(0);
    setCurrentMigratingTicket("");

    // Update ticket count if there's a load function for it
    // await loadTickets(); // Add this if you have a loadTickets function
    // await loadTicketCount(); // Add this if you have a loadTicketCount function

    toast({
      title: "Ticket Migration Complete",
      description: `Successfully added ${successCount} support tickets. ${failCount > 0 ? `Failed: ${failCount}` : ''}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-8 p-4 bg-card border border-border rounded-lg shadow-sm">
            <Link to="/demos">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-5 w-5" />
                Back to Demos
              </Button>
            </Link>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleFillStock}
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isFilling ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Filling Stock...
                  </>
                ) : (
                  <>
                    <PackagePlus className="h-5 w-5" />
                    Fill Stock
                  </>
                )}
              </Button>

              <Button
                onClick={handleMigratePolicies}
                size="lg"
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {isMigratingPolicies ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Migrating Policies...
                  </>
                ) : (
                  <>
                    <Scale className="h-5 w-5" />
                    Migrate Policies
                  </>
                )}
              </Button>

              <Button
                onClick={handleMigrateReviews}
                size="lg"
                className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                {isMigratingReviews ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Migrating Reviews...
                  </>
                ) : (
                  <>
                    <Star className="h-5 w-5" />
                    Migrate Reviews
                  </>
                )}
              </Button>

              <Button
                onClick={handleMigrateCoupons}
                size="lg"
                className="gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
              >
                {isMigratingCoupons ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Migrating Coupons...
                  </>
                ) : (
                  <>
                    <Tag className="h-5 w-5" />
                    Migrate Coupons
                  </>
                )}
              </Button>

              <Button
                onClick={handleMigrateTickets}
                size="lg"
                className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                {isMigratingTickets ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Migrating Tickets...
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-5 w-5" />
                    Migrate Tickets
                  </>
                )}
              </Button>

              <Button
                onClick={handleClearData}
                disabled={isClearing || isFilling || isMigratingPolicies || isMigratingReviews || isMigratingCoupons || isMigratingTickets}
                size="lg"
                variant="destructive"
                className="gap-2"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5" />
                    Clear Data
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar for Stock Filling */}
          {isFilling && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Creating products...</span>
                      <span className="text-muted-foreground">
                        {Math.round(fillProgress)}%
                      </span>
                    </div>
                    <Progress value={fillProgress} className="h-2" />
                    {currentFillingProduct && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4 animate-pulse" />
                        Currently adding: <span className="font-semibold text-foreground">{currentFillingProduct}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Bar for Policy Migration */}
          {isMigratingPolicies && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-emerald-500/50 bg-emerald-500/5">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Migrating policies...</span>
                      <span className="text-muted-foreground">
                        {Math.round(policyMigrationProgress)}%
                      </span>
                    </div>
                    <Progress value={policyMigrationProgress} className="h-2" />
                    {currentMigratingPolicy && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Scale className="h-4 w-4 animate-pulse" />
                        Currently adding: <span className="font-semibold text-foreground">{currentMigratingPolicy}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Bar for Review Migration */}
          {isMigratingReviews && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-amber-500/50 bg-amber-500/5">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Migrating reviews...</span>
                      <span className="text-muted-foreground">
                        {Math.round(reviewMigrationProgress)}%
                      </span>
                    </div>
                    <Progress value={reviewMigrationProgress} className="h-2" />
                    {currentMigratingReview && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Star className="h-4 w-4 animate-pulse" />
                        Currently adding: <span className="font-semibold text-foreground">{currentMigratingReview}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Bar for Coupon Migration */}
          {isMigratingCoupons && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-pink-500/50 bg-pink-500/5">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Migrating coupons...</span>
                      <span className="text-muted-foreground">
                        {Math.round(couponMigrationProgress)}%
                      </span>
                    </div>
                    <Progress value={couponMigrationProgress} className="h-2" />
                    {currentMigratingCoupon && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Tag className="h-4 w-4 animate-pulse" />
                        Currently adding: <span className="font-semibold text-foreground">{currentMigratingCoupon}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Progress Bar for Ticket Migration */}
          {isMigratingTickets && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-indigo-500/50 bg-indigo-500/5">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Migrating support tickets...</span>
                      <span className="text-muted-foreground">
                        {Math.round(ticketMigrationProgress)}%
                      </span>
                    </div>
                    <Progress value={ticketMigrationProgress} className="h-2" />
                    {currentMigratingTicket && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 animate-pulse" />
                        Currently adding: <span className="font-semibold text-foreground">{currentMigratingTicket}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gradient">
                  AI Fabric Framework
                </h1>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  Live API
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Complete AI-powered framework for intelligent product management, conversational commerce,
                and orchestrated chat experiences. All features connected to live Railway API endpoints.
              </p>
            </div>
          </div>

          {/* Capability Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="outline" className="gap-1.5">
              <Database className="h-3.5 w-3.5" />
              Product Management
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Semantic Search
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Bot className="h-3.5 w-3.5" />
              Conversational AI
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              Order Management
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Real-time Orchestration
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 pb-32">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Receipt className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-2">
              <FileText className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2">
              <Tag className="h-4 w-4" />
              Coupons
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="h-4 w-4" />
              API Explorer
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Product Search & Management
                      </CardTitle>
                      <CardDescription>
                        Search products using semantic understanding with ONNX embeddings.
                        Try: "find affordable accessories" or "laptop for gaming"
                      </CardDescription>
                    </div>
                    <Button onClick={() => loadProducts()} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search Bar */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search products with natural language..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleProductSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleProductSearch} disabled={isLoadingProducts}>
                      {isLoadingProducts ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Search
                    </Button>
                  </div>

                  {/* Quick Search Examples */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Try:</span>
                    {["laptop", "gaming accessories", "furniture"].map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(example);
                          setTimeout(handleProductSearch, 100);
                        }}
                        disabled={isLoadingProducts}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>

                  {/* Loading State */}
                  {isLoadingProducts && (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}

                  {/* Products Grid */}
                  {!isLoadingProducts && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <AnimatePresence mode="popLayout">
                        {products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className="hover:shadow-lg transition-all group relative">
                              {product.imageUrl && (
                                <div className="relative w-full h-48 overflow-hidden bg-muted">
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                      SKU: {product.sku}
                                    </CardDescription>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {product.relevanceScore && (
                                      <Badge variant="secondary" className="text-xs">
                                        {(product.relevanceScore * 100).toFixed(0)}% match
                                      </Badge>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleAttachProduct(product)}
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                                      title="Attach to chat"
                                    >
                                      <Bot className="h-5 w-5 mr-2" />
                                      Attach to chat
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {product.description}
                                </p>
                                <div className="flex gap-2 mb-4 flex-wrap">
                                  {product.category && (
                                    <Badge variant="outline">
                                      {product.category}
                                    </Badge>
                                  )}
                                  {product.inStockQty !== undefined && (
                                    <Badge
                                      variant="secondary"
                                      className={product.inStockQty === 0 ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"}
                                    >
                                      Stock: {product.inStockQty}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-2xl font-bold text-primary">
                                    ${product.price.toFixed(2)}
                                  </span>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => openEditDialog(product)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* No Products Message */}
                  {!isLoadingProducts && products.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No products found</p>
                    </div>
                  )}

                  {/* Add Product Button */}
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openAddDialog} className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Create a new product in the inventory
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sku">SKU *</Label>
                          <Input
                            id="sku"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder="e.g., LAPTOP-001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Ultra Performance Laptop"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="e.g., High-end laptop with 32GB RAM..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="e.g., 2499.99"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Electronics"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inStockQty">In Stock Quantity</Label>
                          <Input
                            id="inStockQty"
                            type="number"
                            min="0"
                            value={formData.inStockQty}
                            onChange={(e) => setFormData({ ...formData, inStockQty: e.target.value })}
                            placeholder="e.g., 100"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddProduct} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Product"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Product Dialog */}
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                          Update product details (SKU cannot be changed)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>SKU</Label>
                          <Input value={formData.sku} disabled />
                        </div>
                        <div>
                          <Label htmlFor="edit-name">Name</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-price">Price</Label>
                          <Input
                            id="edit-price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-category">Category</Label>
                          <Input
                            id="edit-category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-inStockQty">In Stock Quantity</Label>
                          <Input
                            id="edit-inStockQty"
                            type="number"
                            min="0"
                            value={formData.inStockQty}
                            onChange={(e) => setFormData({ ...formData, inStockQty: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleEditProduct} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Product"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Product Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{productCount || products.length}</p>
                        <p className="text-sm text-muted-foreground">Total Products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">98.5%</p>
                        <p className="text-sm text-muted-foreground">Search Accuracy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">&lt;100ms</p>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Purchase Orders
                      </CardTitle>
                      <CardDescription>
                        View and manage customer orders with real-time status tracking
                      </CardDescription>
                    </div>
                    <Button onClick={() => loadOrders()} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Receipt className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="hover:shadow-md transition-all">
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      {order.productName || `Product ${order.productId}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Order ID: {order.id}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    order.status === "Delivered" || order.status === "DELIVERED"
                                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  }
                                >
                                  {order.status === "Delivered" || order.status === "DELIVERED" ? (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Clock className="h-3 w-3 mr-1" />
                                  )}
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Quantity</p>
                                  <p className="font-semibold">{order.quantity}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total</p>
                                  <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Order Date</p>
                                  <p className="font-semibold">{order.orderDate}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">User ID</p>
                                  <p className="font-semibold text-xs">{order.userId}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Policy Management
                      </CardTitle>
                      <CardDescription>
                        Manage organizational policies with different classifications (refund, delivery, return, etc.)
                      </CardDescription>
                    </div>
                    <Button onClick={() => loadPolicies()} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingPolicies ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : policies.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No policies found</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Use the "Migrate Policies" button above to add sample policies
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {policies.map((policy, index) => (
                        <motion.div
                          key={policy.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="hover:shadow-md transition-all group">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                                    <Badge
                                      variant="secondary"
                                      className="capitalize"
                                    >
                                      {policy.classification}
                                    </Badge>
                                  </div>
                                  <CardDescription className="text-sm">
                                    {policy.text}
                                  </CardDescription>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeletePolicy(policy.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Policy Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{policyCount || policies.length}</p>
                        <p className="text-sm text-muted-foreground">Total Policies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Scale className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {new Set(policies.map(p => p.classification)).size}
                        </p>
                        <p className="text-sm text-muted-foreground">Classifications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">&lt;50ms</p>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Product Reviews
                      </CardTitle>
                      <CardDescription>
                        View and manage product reviews. All operations are handled via AI chat.
                      </CardDescription>
                    </div>
                    <Button onClick={() => loadReviews()} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingReviews ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews found</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Use the "Migrate Reviews" button at the top to add sample reviews
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <AnimatePresence>
                        {reviews.map((review, index) => (
                          <motion.div
                            key={review.id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className="hover:shadow-lg transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">{review.title}</CardTitle>
                                    <div className="flex items-center gap-1 mt-2">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      ))}
                                      <span className="text-sm text-muted-foreground ml-2">
                                        {review.rating}/5
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleAttachReview(review)}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                                    title="Attach to chat"
                                  >
                                    <Bot className="h-4 w-4 mr-2" />
                                    Attach
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {review.text}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">
                                    User: {review.userId}
                                  </Badge>
                                  {review.productId && (
                                    <Badge variant="outline" className="text-xs">
                                      Product ID: {String(review.productId).slice(0, 8)}...
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Review Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">{reviewCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Reviews</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">
                        {reviews.length > 0
                          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                          : "0"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">
                        {reviews.filter((r) => r.rating === 5).length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">5-Star Reviews</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Coupons & Discounts
                      </CardTitle>
                      <CardDescription>
                        View and manage discount coupons. All operations are handled via AI chat.
                      </CardDescription>
                    </div>
                    <Button onClick={() => loadCoupons()} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingCoupons ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : coupons.length === 0 ? (
                    <div className="text-center py-12">
                      <Tag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No coupons found</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Use the "Migrate Coupons" button at the top to add sample coupons
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <AnimatePresence>
                        {coupons.map((coupon, index) => (
                          <motion.div
                            key={coupon.id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className="hover:shadow-lg transition-all">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg font-mono">{coupon.code}</CardTitle>
                                    <CardDescription className="mt-1">
                                      {coupon.description}
                                    </CardDescription>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={coupon.isActive ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {coupon.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleAttachCoupon(coupon)}
                                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
                                      title="Attach to chat"
                                    >
                                      <Bot className="h-4 w-4 mr-2" />
                                      Attach
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Discount:</span>
                                    <span className="text-lg font-bold text-primary">
                                      {coupon.discountType === "PERCENTAGE"
                                        ? `${coupon.discountValue}%`
                                        : `$${coupon.discountValue}`}
                                    </span>
                                  </div>
                                  {coupon.minPurchaseAmount && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">Min Purchase:</span>
                                      <span className="text-sm font-medium">
                                        ${coupon.minPurchaseAmount}
                                      </span>
                                    </div>
                                  )}
                                  {coupon.maxDiscountAmount && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">Max Discount:</span>
                                      <span className="text-sm font-medium">
                                        ${coupon.maxDiscountAmount}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Valid Until:</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(coupon.validUntil).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {coupon.usageLimit && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">Usage Limit:</span>
                                      <span className="text-sm font-medium">{coupon.usageLimit}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Coupon Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">{couponCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Coupons</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">
                        {coupons.filter((c) => c.isActive).length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Active Coupons</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">
                        {coupons.filter((c) => !c.isActive).length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Inactive Coupons</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* API Explorer Tab */}
          <TabsContent value="api" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Product Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Management Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      method: "GET",
                      path: "/api/products",
                      description: "List all products with optional limit",
                      params: "limit (default: 50)",
                    },
                    {
                      method: "POST",
                      path: "/api/products",
                      description: "Create a new product",
                      params: "sku, name, description, price (required)",
                    },
                    {
                      method: "GET",
                      path: "/api/products/{id}",
                      description: "Get product by ID",
                      params: "id (required)",
                    },
                    {
                      method: "PUT",
                      path: "/api/products/{id}",
                      description: "Update product details",
                      params: "id (required), UpdateProductRequest",
                    },
                    {
                      method: "DELETE",
                      path: "/api/products/{id}",
                      description: "Delete product by ID",
                      params: "id (required)",
                    },
                    {
                      method: "GET",
                      path: "/api/products/search",
                      description: "Semantic product search",
                      params: "q (query), limit (10), threshold (0.3)",
                    },
                    {
                      method: "GET",
                      path: "/api/products/count",
                      description: "Get product count statistics",
                      params: "None",
                    },
                  ].map((endpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Badge
                              className={
                                endpoint.method === "GET"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : endpoint.method === "POST"
                                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                                  : endpoint.method === "PUT"
                                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-600 border-red-500/20"
                              }
                            >
                              {endpoint.method}
                            </Badge>
                            <div className="flex-1">
                              <code className="text-sm font-mono">{endpoint.path}</code>
                              <p className="text-sm text-muted-foreground mt-1">
                                {endpoint.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Params: {endpoint.params}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Order Management Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      method: "GET",
                      path: "/api/orders",
                      description: "List orders for a specific user",
                      params: "userId (required), limit (default: 50)",
                    },
                    {
                      method: "GET",
                      path: "/api/orders/{id}",
                      description: "Get specific order details",
                      params: "id, userId (both required)",
                    },
                  ].map((endpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              {endpoint.method}
                            </Badge>
                            <div className="flex-1">
                              <code className="text-sm font-mono">{endpoint.path}</code>
                              <p className="text-sm text-muted-foreground mt-1">
                                {endpoint.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Params: {endpoint.params}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Chat Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Conversational AI Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      method: "POST",
                      path: "/api/chat/query",
                      description: "Process chat query with orchestration",
                      params: "query (required), userId, sessionId, conversationId (optional)",
                    },
                    {
                      method: "GET",
                      path: "/api/chat/conversations",
                      description: "List user conversations",
                      params: "ownerId (required)",
                    },
                    {
                      method: "GET",
                      path: "/api/chat/conversations/{conversationId}",
                      description: "Get conversation details with turn history",
                      params: "conversationId, ownerId (both required)",
                    },
                    {
                      method: "DELETE",
                      path: "/api/chat/conversations/{conversationId}",
                      description: "Delete conversation",
                      params: "conversationId, ownerId (both required)",
                    },
                  ].map((endpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Badge
                              className={
                                endpoint.method === "GET"
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : endpoint.method === "POST"
                                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                                  : "bg-red-500/10 text-red-600 border-red-500/20"
                              }
                            >
                              {endpoint.method}
                            </Badge>
                            <div className="flex-1">
                              <code className="text-sm font-mono">{endpoint.path}</code>
                              <p className="text-sm text-muted-foreground mt-1">
                                {endpoint.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Params: {endpoint.params}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Framework Stats */}
              <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Framework Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">13</p>
                      <p className="text-sm text-muted-foreground mt-1">REST Endpoints</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">3</p>
                      <p className="text-sm text-muted-foreground mt-1">Core Modules</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">99.9%</p>
                      <p className="text-sm text-muted-foreground mt-1">Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live API Link */}
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <p className="font-semibold">Live API Documentation</p>
                        <p className="text-sm text-muted-foreground">
                          Explore the full Swagger UI documentation
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <a
                        href="https://ai-fabric-framework-production.up.railway.app/swagger-ui/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Swagger UI
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating AI Chat */}
      <AnimatePresence>
        {isChatExpanded && (
          <>
            {/* Backdrop for click-outside-to-dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsChatExpanded(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              className="fixed bottom-[100px] left-0 right-0 z-50 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto max-w-[1080px]">
                <Card 
                  className="border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardHeader className="pb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Assistant
                      </CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsChatExpanded(false)}
                        className="text-white hover:bg-white/20 h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 max-h-[720px] overflow-y-auto mb-3">
                  <AnimatePresence>
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Ask me anything about products!</p>
                      </div>
                    ) : (
                      chatMessages.map((message) => {
                        const styles = message.type === "ai" ? getResultTypeStyles(message.resultType) : null;
                        const Icon = styles?.icon;

                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl overflow-hidden ${
                                message.type === "user"
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                  : `${styles?.bgColor} border ${styles?.borderColor}`
                              }`}
                            >
                              {message.type === "ai" && message.resultType && Icon && !styles?.hideBadge && (
                                <div className={`px-3 py-2 ${styles?.badgeBg} border-b ${styles?.borderColor} flex items-center gap-2`}>
                                  <Icon className={`h-4 w-4 ${styles?.iconColor}`} />
                                  <span className={`text-xs font-semibold ${styles?.badgeText}`}>
                                    {styles?.label}
                                  </span>
                                </div>
                              )}
                              <div className="p-3">
                                {message.type === "user" && (message.attachedProducts || message.attachedProduct) && (
                                  <div className="mb-2 space-y-1">
                                    {(message.attachedProducts || (message.attachedProduct ? [message.attachedProduct] : [])).map((product, idx) => (
                                      <div key={product.id || idx} className="p-2 bg-white/20 rounded-lg border border-white/30">
                                        <div className="flex items-center gap-2">
                                          <Package className="h-3 w-3" />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate">{product.name}</p>
                                            <p className="text-[10px] opacity-90">${product.price}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <p className={`text-sm whitespace-pre-wrap ${message.type === "ai" && styles ? styles.textColor : ""}`}>
                                  {message.content}
                                </p>
                                {message.orchestration && (
                                  <div className="mt-2 pt-2 border-t border-border/20">
                                    <div className="flex gap-1 flex-wrap">
                                      <Badge variant="secondary" className="text-xs">
                                        {message.orchestration.intent}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {(message.orchestration.confidence * 100).toFixed(0)}%
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                                {message.result?.sanitizedPayload?.data?.confirmationRequired && (
                                  <div className="mt-3 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="text-xs"
                                      onClick={() => handleConfirmationAction("confirm", message.result?.sanitizedPayload?.data)}
                                      disabled={isLoading}
                                    >
                                      Confirm
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                      onClick={() => handleConfirmationAction("cancel", message.result?.sanitizedPayload?.data)}
                                      disabled={isLoading}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                                {message.result?.sanitizedPayload?.type === "ACTION_EXECUTED" && 
                                 message.result?.sanitizedPayload?.data?.actionResult?.data && (
                                  <ActionResultRenderer
                                    data={message.result.sanitizedPayload.data.actionResult.data}
                                    messageId={message.id}
                                    expandedCount={expandedOrders[message.id] || 3}
                                    onExpand={(count) => {
                                      setExpandedOrders(prev => ({
                                        ...prev,
                                        [message.id]: count
                                      }));
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted p-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-transparent p-4 backdrop-blur-sm border-t">
        <div className="container mx-auto max-w-[1080px]">
          {(attachedProducts.length > 0 || attachedReviews.length > 0 || attachedCoupons.length > 0) && (
            <div className="mb-2 flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
              <AnimatePresence>
                {attachedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex"
                  >
                  <Card className="border-purple-500/70 bg-purple-500/20 max-w-full">
                    <CardContent className="p-2.5 flex items-center gap-2">
                      <div className="p-1.5 bg-purple-500/25 rounded-lg flex-shrink-0">
                        <Package className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">${product.price}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => handleRemoveAttachment(product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
                {attachedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex"
                  >
                  <Card className="border-amber-500/70 bg-amber-500/20 max-w-full">
                    <CardContent className="p-2.5 flex items-center gap-2">
                      <div className="p-1.5 bg-amber-500/25 rounded-lg flex-shrink-0">
                        <Star className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{review.title}</p>
                        <p className="text-[10px] text-muted-foreground">{review.rating}/5</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => handleRemoveAttachedReview(review.id!)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
                {attachedCoupons.map((coupon) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex"
                  >
                  <Card className="border-pink-500/70 bg-pink-500/20 max-w-full">
                    <CardContent className="p-2.5 flex items-center gap-2">
                      <div className="p-1.5 bg-pink-500/25 rounded-lg flex-shrink-0">
                        <Tag className="h-3.5 w-3.5 text-pink-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate font-mono">{coupon.code}</p>
                        <p className="text-[10px] text-muted-foreground">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => handleRemoveAttachedCoupon(coupon.id!)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Suggestions - Display below attachments */}
          {suggestions.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2"
            >
              <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    Suggested questions:
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setSuggestions([])}
                    aria-label="Dismiss suggestions"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      className="text-xs h-auto py-1.5 px-3 whitespace-normal text-left bg-background hover:bg-purple-50 border-purple-200"
                      onClick={() => {
                        handleChatQuery(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {isLoadingSuggestions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-2"
            >
              <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-purple-600" />
                  Generating suggestions...
                </p>
              </div>
            </motion.div>
          )}
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                placeholder={
                  attachedProducts.length > 0 || attachedReviews.length > 0 || attachedCoupons.length > 0
                    ? `Ask about ${attachedProducts.length + attachedReviews.length + attachedCoupons.length} attached item${(attachedProducts.length + attachedReviews.length + attachedCoupons.length) > 1 ? 's' : ''}...`
                    : "Ask AI about products, orders, or anything..."
                }
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatQuery();
                  }
                }}
                ref={chatInputRef}
                onMouseDown={() => {
                  isUserFocusRef.current = true;
                }}
                onFocus={() => {
                  // Only expand if user explicitly clicked (not programmatic focus)
                  if (isUserFocusRef.current && chatMessages.length > 0 && !isChatExpanded) {
                    setIsChatExpanded(true);
                  }
                  isUserFocusRef.current = false;
                }}
                className="min-h-[108px] pr-12 resize-none shadow-lg border-2 focus:border-purple-500"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={() => handleChatQuery()}
                disabled={isLoading || !chatQuery.trim()}
                className="absolute right-2 bottom-2 h-9 w-9 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={() => navigate('/maxAI')}
              className="h-[108px] px-6 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-xl flex flex-col gap-1"
            >
              <Sparkles className="h-6 w-6" />
              <span className="font-bold text-sm">MAX</span>
              <span className="text-[10px] opacity-90">Mode</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFabricFramework;
