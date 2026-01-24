import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  ShoppingCart,
  Package,
  Receipt,
  Heart,
  Tag,
  Star,
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  Bot,
  Loader2,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Info,
  Ban,
  AlertTriangle,
  Zap,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://ai-fabric-framework-production.up.railway.app/api";

interface MaxModeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  inStockQty?: number;
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
  result?: ChatResult;
  resultType?: ResultType;
  attachedItems?: Array<{ type: string; data: any }>;
}

const MaxMode = ({ isOpen, onClose }: MaxModeProps) => {
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [attachedItems, setAttachedItems] = useState<Array<{ type: string; data: any }>>([]);
  const [expandedData, setExpandedData] = useState<{ [key: string]: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Quick action tools
  const quickActions = [
    { icon: ShoppingCart, label: "My Cart", query: "Show me my cart", color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { icon: Receipt, label: "My Orders", query: "Show my recent orders", color: "text-green-600", bg: "bg-green-500/10", border: "border-green-500/30" },
    { icon: Heart, label: "Wishlist", query: "Show my wishlist", color: "text-pink-600", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    { icon: Tag, label: "Coupons", query: "Show available coupons", color: "text-purple-600", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { icon: Star, label: "Reviews", query: "Show recent reviews", color: "text-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    { icon: TrendingUp, label: "Trending", query: "What's trending?", color: "text-orange-600", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    { icon: Clock, label: "Order History", query: "Show my order history", color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
    { icon: Search, label: "Search", query: "I want to search for something", color: "text-teal-600", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Welcome message
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "ai",
        content: "👋 Welcome to MAX Mode - your AI-powered shopping assistant! I can help you find products, manage orders, apply coupons, and much more. Try the quick actions below or just ask me anything!",
        timestamp: new Date().toISOString(),
        resultType: "INFORMATION_PROVIDED",
      };
      setChatMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleQuickAction = (query: string) => {
    setChatQuery(query);
    setTimeout(() => handleChatQuery(query), 100);
  };

  const handleChatQuery = async (presetQuery?: string) => {
    const query = presetQuery || chatQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date().toISOString(),
      attachedItems: attachedItems.length > 0 ? [...attachedItems] : undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatQuery("");
    setIsLoading(true);
    setAttachedItems([]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          userId: "demo-user",
          sessionId: "demo-session-max",
          conversationId: currentConversationId || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to process query");

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
        result: result,
        resultType: resultType,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date().toISOString(),
        resultType: "ERROR",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultStyles = (resultType?: ResultType) => {
    switch (resultType) {
      case "ACTION_EXECUTED":
        return { icon: CheckCircle2, bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-700", iconColor: "text-green-600", label: "Action Executed" };
      case "ACTION_DENIED":
        return { icon: Ban, bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700", iconColor: "text-red-600", label: "Action Denied" };
      case "INFORMATION_PROVIDED":
        return { icon: Info, bg: "bg-muted", border: "border-transparent", text: "text-foreground", iconColor: "text-muted-foreground", label: "Information", hideBadge: true };
      case "CONFIRMATION_REQUIRED":
        return { icon: HelpCircle, bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-700", iconColor: "text-yellow-600", label: "Confirmation Required" };
      case "ERROR":
        return { icon: XCircle, bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700", iconColor: "text-red-600", label: "Error" };
      default:
        return { icon: Bot, bg: "bg-muted", border: "border-transparent", text: "text-foreground", iconColor: "text-muted-foreground", label: "Response", hideBadge: true };
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 flex items-center justify-between px-6 shadow-lg">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold text-white">MAX Mode - AI Shopping Assistant</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="h-full pt-16 pb-40 flex flex-col">
        {/* Quick Actions Bar */}
        <div className="px-6 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleQuickAction(action.query)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl ${action.bg} border ${action.border} hover:scale-105 transition-all min-w-[80px]`}
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {chatMessages.map((message) => {
                const styles = message.type === "ai" ? getResultStyles(message.resultType) : null;
                const Icon = styles?.icon;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl overflow-hidden shadow-lg ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                          : `${styles?.bg} border-2 ${styles?.border}`
                      }`}
                    >
                      {message.type === "ai" && Icon && !styles?.hideBadge && (
                        <div className={`px-4 py-2 border-b ${styles?.border} flex items-center gap-2 bg-white/50 dark:bg-gray-800/50`}>
                          <Icon className={`h-4 w-4 ${styles?.iconColor}`} />
                          <span className={`text-xs font-semibold ${styles?.text}`}>
                            {styles?.label}
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        {message.attachedItems && message.attachedItems.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {message.attachedItems.map((item, idx) => (
                              <div key={idx} className="p-2 bg-white/20 rounded-lg border border-white/30 text-xs">
                                <span className="font-semibold capitalize">{item.type}:</span> {item.data.name || JSON.stringify(item.data)}
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`whitespace-pre-wrap ${message.type === "ai" && styles ? styles.text : ""}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-muted p-4 rounded-2xl shadow-lg">
                  <div className="flex gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2 h-2 bg-purple-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-pink-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t-2 border-purple-500/30 p-6">
        <div className="max-w-4xl mx-auto">
          {attachedItems.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedItems.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {item.type}: {item.data.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setAttachedItems(prev => prev.filter((_, i) => i !== idx))}
                  />
                </Badge>
              ))}
            </div>
          )}
          <div className="relative">
            <Textarea
              placeholder="Ask me anything... (Try: 'Show my cart', 'Find wireless headphones', 'Apply discount code')"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatQuery();
                }
              }}
              className="min-h-[80px] pr-16 text-lg resize-none border-2 border-purple-500/30 focus:border-purple-500 rounded-2xl shadow-xl"
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={() => handleChatQuery()}
              disabled={isLoading || !chatQuery.trim()}
              className="absolute right-3 bottom-3 h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MaxMode;
