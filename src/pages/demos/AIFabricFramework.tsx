import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
  { sku: "ELEC-LAPTOP-001", name: "UltraBook Pro 15", description: "High-performance laptop with Intel i7, 16GB RAM, 512GB SSD", price: 1299.99, category: "Electronics", inStockQty: 15 },
  { sku: "ELEC-LAPTOP-002", name: "Gaming Beast X1", description: "Gaming laptop with RTX 4070, 32GB RAM, 1TB SSD", price: 2499.99, category: "Electronics", inStockQty: 8 },
  { sku: "ELEC-PHONE-001", name: "SmartPhone Pro Max", description: "Latest flagship smartphone with 5G, 256GB storage", price: 999.99, category: "Electronics", inStockQty: 50 },
  { sku: "ELEC-PHONE-002", name: "Budget Phone Plus", description: "Affordable smartphone with great battery life", price: 299.99, category: "Electronics", inStockQty: 100 },
  { sku: "ELEC-TABLET-001", name: "ProTab Ultra", description: "Professional tablet with stylus, 12.9 inch display", price: 899.99, category: "Electronics", inStockQty: 25 },
  { sku: "ELEC-WATCH-001", name: "SmartWatch Fitness Pro", description: "Fitness tracker with heart rate monitor, GPS", price: 249.99, category: "Electronics", inStockQty: 75 },
  { sku: "ELEC-HEADPHONE-001", name: "Wireless Noise-Cancelling Headphones", description: "Premium over-ear headphones with ANC", price: 349.99, category: "Electronics", inStockQty: 40 },
  { sku: "ELEC-EARBUDS-001", name: "True Wireless Earbuds", description: "Compact earbuds with charging case", price: 129.99, category: "Electronics", inStockQty: 120 },
  { sku: "ELEC-SPEAKER-001", name: "Portable Bluetooth Speaker", description: "Waterproof speaker with 360° sound", price: 79.99, category: "Electronics", inStockQty: 60 },
  { sku: "ELEC-CAMERA-001", name: "Mirrorless Camera Kit", description: "Professional camera with 24MP sensor and lens", price: 1499.99, category: "Electronics", inStockQty: 12 },

  // Women's Footwear
  { sku: "FOOT-HEEL-001", name: "Classic Stiletto Heels", description: "Elegant high heels perfect for formal occasions", price: 89.99, category: "Women's Footwear", inStockQty: 45 },
  { sku: "FOOT-HEEL-002", name: "Block Heel Pumps", description: "Comfortable block heels for all-day wear", price: 69.99, category: "Women's Footwear", inStockQty: 55 },
  { sku: "FOOT-BOOT-001", name: "Ankle Boots Leather", description: "Premium leather ankle boots with zipper", price: 129.99, category: "Women's Footwear", inStockQty: 30 },
  { sku: "FOOT-BOOT-002", name: "Knee-High Boots", description: "Stylish knee-high boots for winter", price: 159.99, category: "Women's Footwear", inStockQty: 20 },
  { sku: "FOOT-SNEAKER-001", name: "Running Sneakers", description: "Lightweight running shoes with cushioning", price: 79.99, category: "Women's Footwear", inStockQty: 85 },
  { sku: "FOOT-SNEAKER-002", name: "Fashion Sneakers", description: "Trendy casual sneakers for everyday wear", price: 59.99, category: "Women's Footwear", inStockQty: 90 },
  { sku: "FOOT-SANDAL-001", name: "Summer Flat Sandals", description: "Comfortable flat sandals for warm weather", price: 39.99, category: "Women's Footwear", inStockQty: 70 },
  { sku: "FOOT-SANDAL-002", name: "Wedge Sandals", description: "Elegant wedge sandals with ankle strap", price: 69.99, category: "Women's Footwear", inStockQty: 35 },
  { sku: "FOOT-FLAT-001", name: "Ballet Flats", description: "Classic ballet flats in multiple colors", price: 49.99, category: "Women's Footwear", inStockQty: 65 },
  { sku: "FOOT-LOAFER-001", name: "Leather Loafers", description: "Professional leather loafers for office", price: 89.99, category: "Women's Footwear", inStockQty: 40 },
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

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  inStockQty?: number;
  relevanceScore?: number;
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
  attachedProduct?: Product;
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
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [isMigratingPolicies, setIsMigratingPolicies] = useState(false);
  const [policyMigrationProgress, setPolicyMigrationProgress] = useState(0);
  const [currentMigratingPolicy, setCurrentMigratingPolicy] = useState("");
  const [policyCount, setPolicyCount] = useState(0);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [attachedProduct, setAttachedProduct] = useState<Product | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current && isChatExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatExpanded]);

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
    setAttachedProduct(product);
    setIsChatExpanded(true);
    toast({
      title: "Product Attached",
      description: `${product.name} attached to chat`,
    });
  };

  const handleRemoveAttachment = () => {
    setAttachedProduct(null);
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

  const handleChatQuery = async () => {
    if (!chatQuery.trim()) return;

    // Build query with product context if attached
    let enhancedQuery = chatQuery;
    if (attachedProduct) {
      enhancedQuery = `${chatQuery}\n\n[Product Context: ${attachedProduct.name} - ${attachedProduct.description}, Price: $${attachedProduct.price}, SKU: ${attachedProduct.sku}]`;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatQuery,
      timestamp: new Date().toISOString(),
      attachedProduct: attachedProduct || undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentQuery = enhancedQuery;
    const currentAttachment = attachedProduct;
    setChatQuery("");
    setIsLoading(true);
    setIsChatExpanded(true);

    // Remove attachment after sending
    setAttachedProduct(null);

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
          body: JSON.stringify(product),
        });

        if (response.ok) {
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

            <div className="flex gap-3">
              <Button
                onClick={handleFillStock}
                disabled={isFilling || isMigratingPolicies}
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
                disabled={isMigratingPolicies || isFilling}
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
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
                    <Button onClick={loadProducts} variant="outline" size="sm">
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
                            <Card className="hover:shadow-lg transition-all group">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                      SKU: {product.sku}
                                    </CardDescription>
                                  </div>
                                  {product.relevanceScore && (
                                    <Badge variant="secondary" className="text-xs">
                                      {(product.relevanceScore * 100).toFixed(0)}% match
                                    </Badge>
                                  )}
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
                                      onClick={() => handleAttachProduct(product)}
                                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                      title="Ask AI about this product"
                                    >
                                      <Bot className="h-4 w-4" />
                                    </Button>
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
              className="fixed inset-0 z-40"
              onClick={() => setIsChatExpanded(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              className="fixed bottom-[100px] left-0 right-0 z-50 px-4"
            >
              <div className="container mx-auto max-w-4xl">
                <Card className="border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20">
                  <CardHeader className="pb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 max-h-[400px] overflow-y-auto mb-3">
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
                                {message.type === "user" && message.attachedProduct && (
                                  <div className="mb-2 p-2 bg-white/20 rounded-lg border border-white/30">
                                    <div className="flex items-center gap-2">
                                      <Package className="h-3 w-3" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate">{message.attachedProduct.name}</p>
                                        <p className="text-[10px] opacity-90">${message.attachedProduct.price}</p>
                                      </div>
                                    </div>
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
                                {message.result?.sanitizedPayload?.data?.actionResult?.data?.orders && (
                                  <div className="mt-3 space-y-2">
                                    {message.result.sanitizedPayload.data.actionResult.data.orders
                                      .slice(0, expandedOrders[message.id] || 3)
                                      .map((order: any, idx: number) => (
                                        <Card key={idx} className="text-xs">
                                          <CardContent className="p-3">
                                            <div className="flex items-start justify-between mb-2">
                                              <div>
                                                <p className="font-semibold text-foreground">Order #{order.orderId}</p>
                                                <p className="text-muted-foreground text-[10px]">{order.sku}</p>
                                              </div>
                                              <Badge variant={order.status === "CREATED" ? "default" : "secondary"} className="text-[10px]">
                                                {order.status}
                                              </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                              <div>
                                                <span className="text-muted-foreground">Quantity:</span> {order.quantity}
                                              </div>
                                              <div>
                                                <span className="text-muted-foreground">Total:</span> ${order.totalPrice}
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    {message.result.sanitizedPayload.data.actionResult.data.orders.length > (expandedOrders[message.id] || 3) && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="w-full text-xs"
                                        onClick={() => {
                                          setExpandedOrders(prev => ({
                                            ...prev,
                                            [message.id]: (prev[message.id] || 3) + 3
                                          }));
                                        }}
                                      >
                                        Show {Math.min(3, message.result.sanitizedPayload.data.actionResult.data.orders.length - (expandedOrders[message.id] || 3))} more
                                      </Button>
                                    )}
                                  </div>
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
        <div className="container mx-auto max-w-4xl">
          {attachedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2"
            >
              <Card className="border-purple-500/50 bg-purple-500/5">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Package className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{attachedProduct.name}</p>
                      <p className="text-xs text-muted-foreground">${attachedProduct.price}</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleRemoveAttachment}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                placeholder={attachedProduct ? `Ask about ${attachedProduct.name}...` : "Ask AI about products, orders, or anything..."}
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatQuery();
                  }
                }}
                onFocus={() => {
                  if (chatMessages.length > 0 && !isChatExpanded) {
                    setIsChatExpanded(true);
                  }
                }}
                className="min-h-[60px] pr-12 resize-none shadow-lg border-2 focus:border-purple-500"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleChatQuery}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFabricFramework;
