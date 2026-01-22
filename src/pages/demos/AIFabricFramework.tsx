import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  relevanceScore?: number;
}

interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  orderDate: string;
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
}

const AIFabricFramework = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      sku: "LAPTOP-001",
      name: "Ultra Performance Laptop",
      description: "High-end laptop with 32GB RAM and RTX 4080",
      price: 2499.99,
      category: "Electronics",
    },
    {
      id: "2",
      sku: "MOUSE-001",
      name: "Wireless Gaming Mouse",
      description: "Ergonomic wireless mouse with RGB lighting",
      price: 79.99,
      category: "Accessories",
    },
    {
      id: "3",
      sku: "DESK-001",
      name: "Adjustable Standing Desk",
      description: "Electric height-adjustable desk with memory settings",
      price: 599.99,
      category: "Furniture",
    },
  ]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      userId: "user-123",
      productId: "1",
      productName: "Ultra Performance Laptop",
      quantity: 1,
      totalPrice: 2499.99,
      status: "Delivered",
      orderDate: "2026-01-15",
    },
    {
      id: "ORD-002",
      userId: "user-123",
      productId: "2",
      productName: "Wireless Gaming Mouse",
      quantity: 2,
      totalPrice: 159.98,
      status: "Shipped",
      orderDate: "2026-01-20",
    },
  ]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProductSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(p => ({
        ...p,
        relevanceScore: Math.random() * 0.3 + 0.7, // Mock relevance score
      }));

      setProducts(filtered.length > 0 ? filtered : products);
      setIsLoading(false);

      toast({
        title: "Search Complete",
        description: `Found ${filtered.length} products matching "${searchQuery}"`,
      });
    }, 800);
  };

  const handleChatQuery = async () => {
    if (!chatQuery.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatQuery,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatQuery("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(chatQuery),
        timestamp: new Date().toISOString(),
        orchestration: {
          intent: detectIntent(chatQuery),
          confidence: 0.92,
          actions: ["search_products", "retrieve_context", "generate_response"],
        },
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const detectIntent = (query: string): string => {
    if (query.toLowerCase().includes("order") || query.toLowerCase().includes("purchase")) {
      return "order_inquiry";
    } else if (query.toLowerCase().includes("product") || query.toLowerCase().includes("find")) {
      return "product_search";
    } else if (query.toLowerCase().includes("price")) {
      return "price_inquiry";
    }
    return "general_query";
  };

  const generateAIResponse = (query: string): string => {
    if (query.toLowerCase().includes("laptop")) {
      return "I found the Ultra Performance Laptop for $2,499.99. It features 32GB RAM and an RTX 4080 GPU, perfect for high-performance tasks. Would you like to know more details or check similar products?";
    } else if (query.toLowerCase().includes("order")) {
      return `You have 2 recent orders. Your latest order (ORD-002) for 2 Wireless Gaming Mice is currently being shipped. Would you like to track this order or view order details?`;
    } else if (query.toLowerCase().includes("cheap") || query.toLowerCase().includes("affordable")) {
      return "I recommend the Wireless Gaming Mouse at $79.99 - it's our most affordable accessory with excellent reviews. It features ergonomic design and RGB lighting.";
    }
    return "I can help you find products, check orders, or answer questions about our inventory. What would you like to know?";
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast({
      title: "Product Deleted",
      description: "Product has been removed from the inventory.",
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
          <Link
            to="/demos"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Demos
          </Link>

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
                and orchestrated chat experiences. Explore real-time endpoints with semantic search,
                natural language processing, and context-aware responses.
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Receipt className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Chat
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
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Product Search & Management
                  </CardTitle>
                  <CardDescription>
                    Search products using semantic understanding with ONNX embeddings.
                    Try: "find affordable accessories" or "laptop for gaming"
                  </CardDescription>
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
                    <Button onClick={handleProductSearch} disabled={isLoading}>
                      <Search className="h-4 w-4 mr-2" />
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
                      >
                        {example}
                      </Button>
                    ))}
                  </div>

                  {/* Products Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <AnimatePresence mode="popLayout">
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
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
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-primary">
                                  ${product.price.toFixed(2)}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button size="icon" variant="ghost" onClick={() => setSelectedProduct(product)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost">
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

                  {/* Add Product Button */}
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
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
                        <p className="text-2xl font-bold">{products.length}</p>
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
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Purchase Orders
                  </CardTitle>
                  <CardDescription>
                    View and manage customer orders with real-time status tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-all">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <ShoppingCart className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold">{order.productName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Order ID: {order.id}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={
                                  order.status === "Delivered"
                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                }
                              >
                                {order.status === "Delivered" ? (
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
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Conversational AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Intelligent chat with orchestration, intent detection, and context-aware responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Chat Messages */}
                  <div className="space-y-4 mb-6 h-[400px] overflow-y-auto p-4 bg-muted/30 rounded-lg">
                    <AnimatePresence>
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground">
                            Start a conversation! Ask about products, orders, or anything else.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {[
                              "Show me laptops",
                              "What are my recent orders?",
                              "Find affordable accessories",
                            ].map((suggestion) => (
                              <Button
                                key={suggestion}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setChatQuery(suggestion);
                                  setTimeout(handleChatQuery, 100);
                                }}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-4 rounded-lg ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              {message.orchestration && (
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Badge variant="secondary" className="text-xs">
                                      Intent: {message.orchestration.intent}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      Confidence: {(message.orchestration.confidence * 100).toFixed(0)}%
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Actions: {message.orchestration.actions.join(" → ")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                    {isLoading && activeTab === "chat" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask about products, orders, or anything..."
                      value={chatQuery}
                      onChange={(e) => setChatQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleChatQuery();
                        }
                      }}
                      className="min-h-[60px]"
                    />
                    <Button onClick={handleChatQuery} disabled={isLoading || !chatQuery.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default AIFabricFramework;
