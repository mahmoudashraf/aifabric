import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMaxModeContextOptional } from "@/contexts/MaxModeContext";
import { AISearchDisplay } from "@/components/AISearchDisplay";
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
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Info,
  Ban,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Paperclip,
  MessageSquarePlus,
  BrainCircuit,
  Wand2,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Truck,
  RotateCcw,
  User,
  MapPin,
  MessageSquare,
  List,
  ShoppingBag,
  Maximize2,
  Minimize2,
  Laptop,
  Smartphone,
  Headphones,
  Camera,
  Monitor,
  History,
  Trash2,
  Lock,
  Tablet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://ai-fabric-framework-production.up.railway.app/api";

// React cannot render plain objects as children. The backend occasionally returns
// structured objects in places we expect strings (e.g. intent metadata), so we
// normalize everything to a safe string for display.
const normalizeMessageContent = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const parseActionMessage = (content: string): { isAction: boolean; actionType: string; query: string; fullMessage: string } => {
  const actionMatch = content.match(/^Action:\s*([^:]+):\s*(.+)$/i);
  if (actionMatch) {
    return {
      isAction: true,
      actionType: actionMatch[1].trim(),
      query: actionMatch[2].trim(),
      fullMessage: content
    };
  }
  return { isAction: false, actionType: '', query: content, fullMessage: content };
};

const getActionIcon = (actionType: string) => {
  const type = actionType.toLowerCase();
  if (type.includes('list') || type.includes('search') || type.includes('find')) {
    return Search;
  } else if (type.includes('add to cart') || type.includes('cart')) {
    return ShoppingCart;
  } else if (type.includes('checkout') || type.includes('order')) {
    return Receipt;
  } else if (type.includes('product') || type.includes('details')) {
    return Package;
  } else if (type.includes('compare')) {
    return TrendingUp;
  } else if (type.includes('recommend')) {
    return Sparkles;
  }
  return Wand2; // Default action icon
};

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

interface DebugData {
  request: {
    endpoint: string;
    method: string;
    timestamp: string;
    payload: any;
  };
  response: {
    timestamp: string;
    status: number;
    data: any;
    durationMs?: number;
  };
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  result?: ChatResult;
  resultType?: ResultType;
  attachedItems?: Array<{ type: string; data: any }>;
  documents?: Document[];
  debugData?: DebugData;
  searchCategory?: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  type: string;
  metadata?: any;
  messageId?: string;
  similarity?: number;
  score?: number;
}

interface Conversation {
  id: string;
  ownerId: string;
  title?: string;
  status?: string;
  createdAt: string;
  lastInteractionAt?: string;
  turnsCount?: number;
}

interface ConversationTurn {
  timestamp: string;
  userQuery: string;
  aiResponse: string;
}

interface ConversationDetail extends Conversation {
  turns: ConversationTurn[];
}

// Helper functions for formatting
const formatFieldName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
};

const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
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
  onExpand,
  onAttach,
  isAttached
}: {
  data: any;
  messageId: string;
  expandedCount: number;
  onExpand: (count: number) => void;
  onAttach?: (item: any) => void;
  isAttached?: (itemId: string) => boolean;
}) => {
  if (!data) return null;

  // Check if item looks like a product (has name/title and price or imageUrl) - handle different casing
  const isProductLike = (item: any) => {
    if (typeof item !== 'object' || item === null) return false;
    const hasName = item.name || item.Name || item.title || item.Title;
    const hasPrice = item.price !== undefined || item.Price !== undefined;
    const hasImage = item.imageUrl || item.ImageUrl || item.image || item.Image;
    const hasSku = item.sku || item.Sku;
    return hasName && (hasPrice || hasImage || hasSku);
  };

  // Render a product card with image
  const renderProductCard = (item: any, idx: number) => {
    // Handle different field casing from API (Name vs name, ImageUrl vs imageUrl, etc.)
    const name = item.name || item.Name || item.title || item.Title || 'Product';
    const price = item.price ?? item.Price;
    const imageUrl = item.imageUrl || item.ImageUrl || item.image || item.Image;
    const category = item.category || item.Category;
    const sku = item.sku || item.Sku;
    const inStock = item.inStock !== undefined ? item.inStock : (item.InStock !== undefined ? item.InStock : (item.inStockQty > 0 || item.InStockQty > 0));
    const stockQty = item.inStockQty ?? item.InStockQty ?? item.stockQuantity ?? item.StockQuantity;
    const rating = item.rating ?? item.Rating;
    const brand = item.brand || item.Brand;
    const itemId = item.id || item.Id || sku;
    const isItemAlreadyAttached = isAttached && itemId ? isAttached(itemId) : false;

    return (
      <div key={itemId || idx} className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-xl overflow-hidden">
        {/* Attach Button */}
        {onAttach && (
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 h-8 w-8 ${
              isItemAlreadyAttached
                ? 'bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                : 'bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
            } text-white shadow-lg border border-white/30 hover:scale-110 transition-all`}
            onClick={(e) => {
              e.stopPropagation();
              onAttach(item);
            }}
            title={isItemAlreadyAttached ? "Already in Chat" : "Attach to Chat"}
          >
            {isItemAlreadyAttached ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Product Image */}
        {imageUrl && (
          <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Product Info */}
        <div className="p-3">
          {/* Brand & Category */}
          <div className="flex items-center gap-2 mb-1">
            {brand && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{brand}</span>
            )}
            {category && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{category}</span>
            )}
          </div>

          {/* Name */}
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 line-clamp-2 mb-2">{name}</h4>

          {/* Price & Stock */}
          <div className="flex items-center justify-between">
            {price !== undefined && (
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ${typeof price === 'number' ? price.toLocaleString() : price}
              </span>
            )}
            {stockQty !== undefined && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                stockQty > 50 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                stockQty > 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {stockQty > 0 ? `${stockQty} in stock` : 'Out of stock'}
              </span>
            )}
          </div>

          {/* Rating & SKU */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{rating}</span>
              </div>
            )}
            {sku && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{sku}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render generic item card (non-product)
  const renderGenericCard = (item: any, idx: number) => {
    const itemId = item.id || item.Id || item.sku || item.Sku;
    const isItemAlreadyAttached = isAttached && itemId ? isAttached(itemId) : false;

    return (
    <Card key={itemId || idx} className="text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-colors relative group" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {onAttach && typeof item === "object" && item !== null && (
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 h-8 w-8 ${
            isItemAlreadyAttached
              ? 'bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              : 'bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
          } text-white shadow-lg border border-white/30 hover:scale-110 transition-all z-10`}
          onClick={(e) => {
            e.stopPropagation();
            onAttach(item);
          }}
          title={isItemAlreadyAttached ? "Already in Chat" : "Attach to Chat"}
        >
          {isItemAlreadyAttached ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Paperclip className="h-4 w-4" />
          )}
        </Button>
      )}
      <CardContent className="p-3 pr-12">
        {typeof item === "object" && item !== null ? (
          <div className="space-y-2">
            {Object.entries(item).filter(([key]) => !['imageUrl', 'image', 'images'].includes(key)).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-2">
                <span className="text-muted-foreground font-semibold min-w-[100px]">
                  {formatFieldName(key)}:
                </span>
                <span className="text-foreground text-right flex-1 font-medium">
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
    );
  };

  // Handle arrays
  if (Array.isArray(data)) {
    const visibleItems = data.slice(0, expandedCount || 6);
    const remaining = data.length - visibleItems.length;
    const hasProducts = visibleItems.some(isProductLike);

    return (
      <div className="mt-3">
        {hasProducts ? (
          // Product grid layout - horizontal cards
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {visibleItems.map((item: any, idx: number) =>
              isProductLike(item) ? renderProductCard(item, idx) : renderGenericCard(item, idx)
            )}
          </div>
        ) : (
          // Standard vertical list for non-products
          <div className="space-y-2">
            {visibleItems.map((item: any, idx: number) => renderGenericCard(item, idx))}
          </div>
        )}
        {remaining > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-3 text-xs bg-gradient-to-r from-blue-500/10 to-blue-400/10 hover:from-blue-500/20 hover:to-blue-400/20 border border-blue-300"
            onClick={() => onExpand((expandedCount || 6) + 6)}
          >
            Show {Math.min(6, remaining)} more
          </Button>
        )}
      </div>
    );
  }

  // Handle objects
  if (typeof data === "object" && data !== null) {
    // Check if object has array-like properties
    const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));

    if (arrayKeys.length > 0) {
      return (
        <div className="mt-3 space-y-3">
          {arrayKeys.map((arrayKey) => {
            const arrayData = data[arrayKey];
            const visibleItems = arrayData.slice(0, expandedCount || 6);
            const remaining = arrayData.length - visibleItems.length;
            const hasProducts = visibleItems.some(isProductLike);

            return (
              <div key={arrayKey}>
                <h4 className="text-sm font-bold mb-2 text-blue-700 dark:text-blue-300">
                  {formatFieldName(arrayKey)}
                </h4>
                {hasProducts ? (
                  // Product grid layout
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {visibleItems.map((item: any, idx: number) =>
                      isProductLike(item) ? renderProductCard(item, idx) : renderGenericCard(item, idx)
                    )}
                  </div>
                ) : (
                  // Standard vertical list
                  <div className="space-y-2">
                    {visibleItems.map((item: any, idx: number) => renderGenericCard(item, idx))}
                  </div>
                )}
                {remaining > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-3 text-xs bg-gradient-to-r from-blue-500/10 to-blue-400/10 hover:from-blue-500/20 hover:to-blue-400/20 border border-blue-300"
                    onClick={() => onExpand((expandedCount || 6) + 6)}
                  >
                    Show {Math.min(6, remaining)} more
                  </Button>
                )}
              </div>
            );
          })}
          {Object.entries(data)
            .filter(([key]) => !Array.isArray(data[key]))
            .map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-muted-foreground font-semibold">{formatFieldName(key)}: </span>
                <span className="text-foreground font-medium">{formatFieldValue(value)}</span>
              </div>
            ))}
        </div>
      );
    }

    // Render simple object
    return (
      <div className="mt-3">
        <Card className="text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-blue-200" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
          <CardContent className="p-3">
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground font-semibold min-w-[120px]">
                    {formatFieldName(key)}:
                  </span>
                  <span className="text-foreground text-right flex-1 font-medium">
                    {formatFieldValue(value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <p className="mt-3 text-xs text-muted-foreground">{formatFieldValue(data)}</p>;
};

const MaxMode = ({ isOpen, onClose }: MaxModeProps) => {
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [attachedItems, setAttachedItems] = useState<Array<{ type: string; data: any }>>([]);
  const [contextDocuments, setContextDocuments] = useState<Document[]>([]);
  const [focusedMessageId, setFocusedMessageId] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [expandedActions, setExpandedActions] = useState<{ [key: string]: number }>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [shownSuggestions, setShownSuggestions] = useState<Set<string>>(new Set());
  const [collectingItem, setCollectingItem] = useState<{ title: string; type: string } | null>(null);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<{ [key: string]: 'pending' | 'confirmed' | 'rejected' }>({});
  const [selectedProduct, setSelectedProduct] = useState<Document | null>(null);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [userId] = useState<string>("demo-user-" + Math.random().toString(36).substr(2, 9));
  const [newDocuments, setNewDocuments] = useState<Document[]>([]);
  const [isNewDocsPreviewOpen, setIsNewDocsPreviewOpen] = useState(false);
  const [viewedDocumentIds, setViewedDocumentIds] = useState<Set<string>>(new Set());
  const [cartData, setCartData] = useState<any>(null);
  const [isCartView, setIsCartView] = useState(false);
  // Position state for routing
  const [currentPosition, setCurrentPosition] = useState<"landing" | "catalog" | "checkout">("landing");
  const [currentMode, setCurrentMode] = useState<"navigator" | "copilot">("navigator");

  // Debug modal state - stores last request/response for inspection
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [lastRequestData, setLastRequestData] = useState<any>(null);
  const [lastResponseData, setLastResponseData] = useState<any>(null);
  // Per-message debug data - when set, shows debug for specific message
  const [selectedDebugMessage, setSelectedDebugMessage] = useState<ChatMessage | null>(null);
  // Full JSON panel expansion state
  const [isJsonPanelExpanded, setIsJsonPanelExpanded] = useState(false);
  // Search category submenu state
  const [isSearchCategoryOpen, setIsSearchCategoryOpen] = useState(false);
  const [isBrowseProductsOpen, setIsBrowseProductsOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<string | null>(null);

  // Conversations history state
  const [isConversationsOpen, setIsConversationsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isViewingOldConversation, setIsViewingOldConversation] = useState(false);
  const [oldConversationLocked, setOldConversationLocked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const contextPanelRef = useRef<HTMLDivElement>(null);
  const contextPanelEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // MaxMode context for state persistence and sharing with demo page
  const maxModeContext = useMaxModeContextOptional();
  const hasLoadedPersistedState = useRef(false);

  // Load persisted state and pending attachments on mount
  useEffect(() => {
    if (!maxModeContext || hasLoadedPersistedState.current) return;
    hasLoadedPersistedState.current = true;

    // Load persisted state
    const persistedState = maxModeContext.loadPersistedState();
    if (persistedState) {
      if (persistedState.chatMessages.length > 0) {
        setChatMessages(persistedState.chatMessages);
      }
      if (persistedState.attachedItems.length > 0) {
        setAttachedItems(persistedState.attachedItems);
      }
      if (persistedState.currentPosition) {
        setCurrentPosition(persistedState.currentPosition);
      }
      if (persistedState.currentMode) {
        setCurrentMode(persistedState.currentMode);
      }
      if (persistedState.conversationId) {
        setCurrentConversationId(persistedState.conversationId);
      }
      if (persistedState.contextDocuments && persistedState.contextDocuments.length > 0) {
        setContextDocuments(persistedState.contextDocuments);
      }
    }

    // Load pending attachments from demo page
    const pending = maxModeContext.getPendingAttachments();
    if (pending && pending.length > 0) {
      setAttachedItems(prev => {
        const newItems = pending.filter(p =>
          !prev.some(existing =>
            existing.type === p.type &&
            (existing.data.id === p.data.id || existing.data.sku === p.data.sku)
          )
        );
        return [...prev, ...newItems];
      });
      maxModeContext.clearPendingAttachments();
    }
  }, [maxModeContext]);

  // Persist state when it changes
  useEffect(() => {
    if (!maxModeContext) return;

    maxModeContext.updateMaxModeState({
      chatMessages,
      attachedItems,
      currentPosition,
      currentMode,
      conversationId: currentConversationId,
      contextDocuments,
    });
  }, [chatMessages, attachedItems, currentPosition, currentMode, currentConversationId, contextDocuments, maxModeContext]);

  // Load most recent unlocked conversation on open (if no messages)
  const hasLoadedRecentConversation = useRef(false);
  useEffect(() => {
    if (!isOpen || hasLoadedRecentConversation.current) return;
    // Only load if we don't have existing messages
    if (chatMessages.length > 0) {
      hasLoadedRecentConversation.current = true;
      return;
    }

    const loadRecentConversation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/chat/conversations?ownerId=demo-user`);
        if (!response.ok) return;
        const convList: Conversation[] = await response.json();

        if (convList.length === 0) return;

        // Sort by lastInteractionAt or createdAt to get most recent
        const sorted = [...convList].sort((a, b) => {
          const dateA = new Date(a.lastInteractionAt || a.createdAt).getTime();
          const dateB = new Date(b.lastInteractionAt || b.createdAt).getTime();
          return dateB - dateA;
        });

        // Find the most recent unlocked conversation
        const recentUnlocked = sorted.find(c => c.status !== "LOCKED" && c.status !== "CLOSED");

        if (recentUnlocked) {
          // Load the conversation
          const convResponse = await fetch(`${API_BASE_URL}/chat/conversations/${recentUnlocked.id}?ownerId=demo-user`);
          if (!convResponse.ok) return;
          const data: ConversationDetail = await convResponse.json();

          // Convert turns to chat messages
          const messages: ChatMessage[] = [];
          data.turns.forEach((turn, idx) => {
            messages.push({
              id: `${recentUnlocked.id}-user-${idx}`,
              type: "user",
              content: turn.userQuery,
              timestamp: turn.timestamp,
            });
            messages.push({
              id: `${recentUnlocked.id}-ai-${idx}`,
              type: "ai",
              content: turn.aiResponse,
              timestamp: turn.timestamp,
            });
          });

          setChatMessages(messages);
          setCurrentConversationId(recentUnlocked.id);
          setIsViewingOldConversation(false);
          setOldConversationLocked(false);
        }
      } catch (error) {
        console.error("Failed to load recent conversation:", error);
      } finally {
        hasLoadedRecentConversation.current = true;
      }
    };

    loadRecentConversation();
  }, [isOpen, chatMessages.length]);

  // Re-attach an item from a previous message
  const handleReattachItem = useCallback((item: { type: string; data: any }) => {
    setAttachedItems(prev => {
      // Check if already attached
      const exists = prev.some(existing =>
        existing.type === item.type &&
        (existing.data.id === item.data.id || existing.data.sku === item.data.sku)
      );
      if (exists) return prev;
      return [...prev, item];
    });
  }, []);

  // Quick action tools - aligned with available backend actions
  // Position: "catalog" for browsing/discovery, "checkout" for cart/order actions
  const quickActions = [
    { icon: Search, label: "Search Products", query: "Search for wireless headphones with good ratings and show me the prices, features, and availability", color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/30", position: "catalog" as const, mode: "navigator" as const },
    { icon: List, label: "Browse Products", query: "List all available products with their SKU, name, price, category, stock quantity, and ratings", color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/30", position: "catalog" as const, mode: "navigator" as const },
    { icon: ShoppingCart, label: "My Cart", query: "View my cart", color: "text-green-600", bg: "bg-green-500/10", border: "border-green-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: ShoppingBag, label: "Checkout", query: "Checkout my cart", color: "text-orange-600", bg: "bg-orange-500/10", border: "border-orange-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: Receipt, label: "My Orders", query: "List my orders", color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: Clock, label: "Active Orders", query: "Show my active orders", color: "text-cyan-600", bg: "bg-cyan-500/10", border: "border-cyan-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: Truck, label: "Track Order", query: "Track my order shipment", color: "text-teal-600", bg: "bg-teal-500/10", border: "border-teal-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: RotateCcw, label: "Returns", query: "Create a return request", color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: Tag, label: "Coupons", query: "Show available coupons", color: "text-pink-600", bg: "bg-pink-500/10", border: "border-pink-500/30", position: "catalog" as const, mode: "navigator" as const },
    { icon: Star, label: "Reviews", query: "Add a product review", color: "text-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/30", position: "catalog" as const, mode: "navigator" as const },
    { icon: User, label: "My Account", query: "Show my account details", color: "text-slate-600", bg: "bg-slate-500/10", border: "border-slate-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: MapPin, label: "Addresses", query: "List my saved addresses", color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: MessageSquare, label: "Support", query: "Create a support ticket", color: "text-violet-600", bg: "bg-violet-500/10", border: "border-violet-500/30", position: "checkout" as const, mode: "copilot" as const },
    { icon: TrendingUp, label: "Trending", query: "What's trending?", color: "text-rose-600", bg: "bg-rose-500/10", border: "border-rose-500/30", position: "catalog" as const, mode: "navigator" as const },
  ];

  // Product search categories matching our actual data
  const searchCategories = [
    { icon: Laptop, label: "Laptops", emoji: "💻", color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { icon: Smartphone, label: "Smartphones", emoji: "📱", color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
    { icon: Headphones, label: "Headphones", emoji: "🎧", color: "text-rose-600", bg: "bg-rose-500/10", border: "border-rose-500/30" },
    { icon: Camera, label: "Cameras", emoji: "📷", color: "text-green-600", bg: "bg-green-500/10", border: "border-green-500/30" },
    { icon: Monitor, label: "Monitors", emoji: "🖥️", color: "text-orange-600", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  ];

  // AI Search menu categories (includes an actual query to populate the input)
  const aiSearchCategories = searchCategories.map((c) => ({
    ...c,
    query: `request retrieval and generation for product ${c.label} and show top results with prices and stock`,
  }));

  // Browse Products categories with specific ready-to-send queries
  const browseProductCategories = [
    {
      id: "apple-laptops",
      icon: Laptop,
      label: "Apple Laptops",
      query: "Action: List product: Apple laptops",
      color: "from-blue-500 to-cyan-500",
      description: "MacBook Pro & Air",
    },
    {
      id: "sony-headphones",
      icon: Headphones,
      label: "Sony Headphones",
      query: "Action: List product: Sony headphones",
      color: "from-purple-500 to-pink-500",
      description: "Premium noise-cancelling",
    },
    {
      id: "samsung-tablets",
      icon: Tablet,
      label: "Samsung Tablets",
      query: "Action: List product: Samsung tablets",
      color: "from-green-500 to-emerald-500",
      description: "Galaxy Tab series",
    },
    {
      id: "sony-cameras",
      icon: Camera,
      label: "Sony Cameras",
      query: "Action: List product: Sony cameras",
      color: "from-orange-500 to-red-500",
      description: "Professional photography",
    },
    {
      id: "gaming-laptops",
      icon: Laptop,
      label: "Gaming Laptops",
      query: "Action: List product: gaming laptops high performance",
      color: "from-red-500 to-pink-500",
      description: "High-performance gaming",
    },
    {
      id: "wireless-headphones",
      icon: Headphones,
      label: "Wireless Headphones",
      query: "Action: List product: wireless headphones Bluetooth",
      color: "from-indigo-500 to-purple-500",
      description: "Bluetooth connectivity",
    },
  ];

  // Auto-scroll to latest message - show it at the top of viewport
  useEffect(() => {
    if (latestMessageRef.current && chatMessages.length > 0) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chatMessages]);

  // Always focus on chat input after sending message or when opening
  useEffect(() => {
    if (chatInputRef.current && isOpen) {
      chatInputRef.current.focus();
    }
  }, [chatMessages, isOpen]);

  // Collect all documents from all messages and auto-scroll to new documents
  useEffect(() => {
    const allDocs: Document[] = [];
    chatMessages.forEach(message => {
      if (message.documents && message.documents.length > 0) {
        allDocs.push(...message.documents);
      }
    });

    const prevCount = contextDocuments.length;

    // Initialize: Mark all existing documents as viewed on first load
    if (prevCount === 0 && allDocs.length > 0) {
      const existingIds = new Set(allDocs.map(doc => doc.id));
      setViewedDocumentIds(existingIds);
    }

    // Track new documents (only when new docs are added, not on initial load)
    if (allDocs.length > prevCount && prevCount > 0) {
      const newDocs = allDocs.slice(prevCount);
      // Sort new documents by score/similarity (highest first)
      const sortedNewDocs = [...newDocs].sort((a, b) => {
        const scoreA = a.score ?? a.similarity ?? 0;
        const scoreB = b.score ?? b.similarity ?? 0;
        return scoreB - scoreA;
      });
      setNewDocuments(sortedNewDocs);

      // Show preview panel on mobile for new documents
      if (window.innerWidth < 768) { // Mobile breakpoint
        setIsNewDocsPreviewOpen(true);
      }
    }

    setContextDocuments(allDocs);

    // Auto-scroll to new documents if new ones were added
    if (allDocs.length > prevCount && contextPanelEndRef.current && isPanelVisible) {
      setTimeout(() => {
        contextPanelEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [chatMessages, isPanelVisible]);

  // Intersection Observer to detect visible messages and scroll context panel to relevant documents
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Trigger when message crosses center of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the message closest to the center that has documents
      let visibleMessageWithDocs: ChatMessage | null = null;

      for (const entry of entries) {
        if (entry.isIntersecting) {
          const messageId = entry.target.getAttribute('data-message-id');
          const message = chatMessages.find(m => m.id === messageId);

          if (message && message.documents && message.documents.length > 0) {
            visibleMessageWithDocs = message;
            break;
          }
        }
      }

      // Scroll context panel to the visible message's documents
      if (visibleMessageWithDocs) {
        setFocusedMessageId(visibleMessageWithDocs.id);

        // Scroll to the first document of this message in the context panel
        const firstDocElement = document.querySelector(`[data-doc-message-id="${visibleMessageWithDocs.id}"]`);
        if (firstDocElement && contextPanelRef.current) {
          const container = contextPanelRef.current;
          const elementTop = (firstDocElement as HTMLElement).offsetTop;
          const containerTop = container.scrollTop;
          const containerHeight = container.clientHeight;

          // Scroll to center the document section
          container.scrollTo({
            top: elementTop - containerHeight / 4,
            behavior: "smooth"
          });
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all message elements
    const messageElements = document.querySelectorAll('[data-message-id]');
    messageElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [chatMessages]);

  // Welcome message
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "ai",
        content: "👋 Welcome to MAX Mode - your AI-powered shopping assistant! I can help you find products, manage orders, apply coupons, and much more. Try the quick actions above or just ask me anything!",
        timestamp: new Date().toISOString(),
        resultType: "INFORMATION_PROVIDED",
      };
      setChatMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Generate smart suggestions when items are attached
  useEffect(() => {
    if (attachedItems.length === 0) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        // Build attachments array with vector space format
        const attachments = attachedItems.map(item => {
          // Build content text
          const parts: string[] = [];
          if (item.data.name) parts.push(item.data.name);
          if (item.data.title) parts.push(item.data.title);
          if (item.data.category) parts.push(`(${item.data.category})`);
          if (item.data.price) parts.push(`$${item.data.price}`);
          if (item.data.code) parts.push(`Code: ${item.data.code}`);

          // Map item type to vectorSpace
          let vectorSpace = "product";
          if (item.type === "order") vectorSpace = "order";
          else if (item.type === "review") vectorSpace = "review";
          else if (item.type === "coupon") vectorSpace = "coupon";

          return {
            id: item.data.id || item.data.sku || Date.now().toString(),
            vectorSpace,
            contentText: parts.join(' - '),
            source: "ui-card",
          };
        });

        const activeAttachmentIds = attachments.map(a => a.id);

        // Build content description
        const contentParts = attachedItems.map(item => {
          const name = item.data.name || item.data.title || item.data.code || 'Item';
          return `${item.type}: ${name}`;
        });

        // Use /chat/suggestions endpoint with new format
        const response = await fetch(`${API_BASE_URL}/chat/suggestions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: contentParts.join('; ') || "Give me suggestions based on attached items",
            userId: "demo-user",
            maxSuggestions: 4,
            attachments: attachments.length > 0 ? attachments : undefined,
            activeAttachmentIds: activeAttachmentIds.length > 0 ? activeAttachmentIds : undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Response format: { success, message, suggestions: string[], raw }
          if (data.suggestions && Array.isArray(data.suggestions)) {
            const newSuggestions = data.suggestions.filter(
              (s: unknown): s is string => typeof s === 'string' && s.length > 0
            );
            if (newSuggestions.length > 0) {
              setSuggestions(newSuggestions.slice(0, 4));
              setShowSuggestions(true);
              setTimeout(() => setShowSuggestions(false), 5000);
            }
          }
        } else {
          // Fallback to generic suggestions on error
          const genericSuggestions = [
            "Tell me more about this",
            "What are the key details?",
            "How does this compare to alternatives?",
            "What should I know before deciding?",
          ];
          setSuggestions(genericSuggestions);
          setShowSuggestions(true);
          setTimeout(() => setShowSuggestions(false), 5000);
        }
      } catch (error) {
        console.error("Failed to load suggestions:", error);
        // Fallback to generic suggestions
        const genericSuggestions = [
          "Tell me more about this",
          "What are the key details?",
          "How does this compare to alternatives?",
          "What should I know before deciding?",
        ];
        setSuggestions(genericSuggestions);
        setShowSuggestions(true);
        setTimeout(() => setShowSuggestions(false), 5000);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 10000); // 10 second delay for better UX

    return () => clearTimeout(timeoutId);
  }, [attachedItems]);

  const handleQuickAction = (query: string, position?: "landing" | "catalog" | "checkout", mode?: "navigator" | "copilot") => {
    setChatQuery(query);
    setTimeout(() => handleChatQuery(query, position, mode), 100);
  };

  const handleScrollUp = () => {
    if (contextPanelRef.current) {
      contextPanelRef.current.scrollBy({ top: -300, behavior: "smooth" });
    }
  };

  const handleScrollDown = () => {
    if (contextPanelRef.current) {
      contextPanelRef.current.scrollBy({ top: 300, behavior: "smooth" });
    }
  };

  const isItemAttached = (itemId: string) => {
    return attachedItems.some(item =>
      (item.data.id && item.data.id === itemId) ||
      (item.data.sku && item.data.sku === itemId)
    );
  };

  const handleAttachDocument = (doc: Document) => {
    // Check if already attached
    if (attachedItems.some(item => item.type === "document" && item.data.id === doc.id)) {
      toast({
        title: "Already Attached",
        description: `"${doc.title}" is already attached to chat`,
        variant: "default",
      });
      return;
    }

    // Trigger collection animation
    setCollectingItem({ title: doc.title, type: doc.type });
    setTimeout(() => setCollectingItem(null), 1500);

    setAttachedItems(prev => [...prev, { type: "document", data: doc }]);

    // Set position to checkout when attaching items
    setCurrentPosition("checkout");
    setCurrentMode("copilot");

    toast({
      title: "💬 Added to Chat",
      description: `"${doc.title}" is now part of the conversation`,
    });

    // Focus on chat input after attachment
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  };

  const handleConfirmation = async (messageId: string, confirmed: boolean, message: ChatMessage) => {
    setConfirmationStatus(prev => ({
      ...prev,
      [messageId]: confirmed ? 'confirmed' : 'rejected'
    }));

    // Send confirmation message to continue the conversation flow
    const confirmationQuery = confirmed ? "Yes, confirm" : "No, cancel";

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: confirmationQuery,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: confirmationQuery,
          userId: "demo-user",
          sessionId: "demo-session",
          conversationId: currentConversationId || undefined,
          attachments: attachedItems,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to process confirmation");
      }

      const data = await response.json();

      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      let messageContent: unknown = "";
      let result: ChatResult | undefined;
      let resultType: ResultType | undefined;

      if (data.result && data.result.sanitizedPayload) {
        messageContent = data.result.sanitizedPayload.message || "I processed your confirmation.";
        result = data.result;
        resultType = data.result.type;
      } else {
        messageContent = data.response || data.message || "I processed your confirmation.";
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: normalizeMessageContent(messageContent),
        timestamp: new Date().toISOString(),
        result: result,
        resultType: resultType,
      };

      setChatMessages((prev) => [...prev, aiMessage]);

      if (data.documents && Array.isArray(data.documents)) {
        setContextDocuments(data.documents);
      }

      toast({
        title: confirmed ? "✅ Confirmed" : "❌ Rejected",
        description: confirmed ? "Your confirmation has been processed" : "Action cancelled",
      });
    } catch (error) {
      console.error("Error processing confirmation:", error);
      toast({
        title: "Error",
        description: "Failed to process confirmation. Please try again.",
        variant: "destructive",
      });

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I apologize, but I encountered an error processing your confirmation. Please try again.",
        timestamp: new Date().toISOString(),
        resultType: "INFORMATION_PROVIDED",
      };

      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Document, quantity: number = 1) => {
    try {
      const sku = product.metadata?.sku || product.id;

      const response = await fetch(`${API_BASE_URL}/carts/active/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          sku: sku,
          quantity: quantity
        })
      });

      if (response.ok) {
        const cart = await response.json();
        toast({
          title: "🛒 Added to Cart!",
          description: `${product.title} has been added to your cart`,
        });
        return cart;
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
      console.error('Error adding to cart:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/active?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const cart = await response.json();
        console.log('Cart data received:', cart);
        setCartData(cart);
        return cart;
      } else if (response.status === 404) {
        // Cart not found - treat as empty cart
        const emptyCart = {
          items: [],
          subtotal: 0,
          discount: 0,
          total: 0
        };
        console.log('No active cart found, using empty cart');
        setCartData(emptyCart);
        return emptyCart;
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch cart:', response.status, errorText);
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Set empty cart on error
      const emptyCart = {
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0
      };
      setCartData(emptyCart);
      toast({
        title: "⚠️ Cart Load Issue",
        description: "Could not load cart. Showing empty cart.",
        variant: "destructive"
      });
      return emptyCart;
    }
  };

  const removeFromCart = async (sku: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/active/items?userId=${userId}&sku=${sku}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const cart = await response.json();
        setCartData(cart);
        toast({
          title: "🗑️ Removed from Cart",
          description: "Item has been removed from your cart",
        });
        return cart;
      } else {
        throw new Error('Failed to remove from cart');
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
      console.error('Error removing from cart:', error);
    }
  };

  const openCart = async () => {
    setIsCartView(true);
    setSelectedProduct(null);
    await fetchCart();

    // On mobile, open bottom sheet
    if (window.innerWidth < 768) {
      setIsBottomSheetOpen(true);
    } else {
      setIsPanelVisible(true);
    }
  };

  const closeCart = () => {
    setIsCartView(false);
    setCartData(null);
  };

  const openProductDetails = (doc: Document) => {
    setSelectedProduct(doc);
    setIsCartView(false);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const handleAISearchCategory = (category: (typeof aiSearchCategories)[number]) => {
    // Create search attachment
    const searchAttachment = {
      type: "ai-search",
      data: {
        category: category.label,
        title: `AI Search: ${category.label}`
      }
    };

    // Replace existing AI search item instead of adding to the list
    setAttachedItems(prev => [...prev.filter(item => item.type !== 'ai-search'), searchAttachment]);
    setIsAISearchOpen(false);

    // Clear any existing search category tag (only one tag allowed)
    setSearchCategory(null);

    // AI Search uses catalog position (discovery/browsing)
    setCurrentPosition("catalog");
    setCurrentMode("navigator");

    toast({
      title: "🔍 AI Search Attached",
      description: `${category.label} search criteria added to chat`,
    });

    // Focus on chat input
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  };

  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);

    // Mark new documents as viewed
    const newDocIds = newDocuments.map(doc => doc.id);
    setViewedDocumentIds(prev => new Set([...prev, ...newDocIds]));

    // Scroll to first new document after bottom sheet opens
    if (newDocuments.length > 0) {
      setTimeout(() => {
        const firstNewDocId = newDocuments[0].id;
        const element = document.querySelector(`[data-doc-id="${firstNewDocId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      // Clear newDocuments after viewing
      setTimeout(() => {
        setNewDocuments([]);
      }, 500);
    }
  };

  const handleCloseNewDocsPreview = () => {
    setIsNewDocsPreviewOpen(false);

    // Mark new documents as viewed when closing preview
    const newDocIds = newDocuments.map(doc => doc.id);
    setViewedDocumentIds(prev => new Set([...prev, ...newDocIds]));

    // Clear newDocuments after a short delay
    setTimeout(() => {
      setNewDocuments([]);
    }, 300);
  };

  const showSampleDocuments = () => {
    const sampleDocs: Document[] = [
      {
        id: "1",
        title: "Return Policy",
        content: "You can return items within 30 days of purchase. Items must be in original condition with tags attached.",
        type: "policy",
        metadata: { category: "returns", updated: "2024-01-15" }
      },
      {
        id: "2",
        title: "Wireless Headphones Pro",
        content: "Premium noise-canceling headphones with 30-hour battery life and crystal-clear audio.",
        type: "product",
        metadata: { price: "$299.99", stock: "In Stock", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" }
      },
      {
        id: "3",
        title: "Shipping Information",
        content: "Free shipping on orders over $50. Standard delivery takes 3-5 business days.",
        type: "document",
        metadata: { region: "US", type: "shipping" }
      }
    ];
    setContextDocuments(sampleDocs);
    toast({
      title: "✨ Sample Documents Loaded",
      description: "Check the right panel!",
    });
  };

  // Handle selecting a search category - shows tag badge, doesn't modify input
  const handleSelectSearchCategory = (category: string) => {
    setSearchCategory(category);
    setIsSearchCategoryOpen(false);
    setIsQuickActionsOpen(false);
    // Clear any existing AI Search items (only one tag allowed)
    setAttachedItems(prev => prev.filter(item => item.type !== 'ai-search'));
    // Focus the input
    setTimeout(() => chatInputRef.current?.focus(), 100);
  };

  // Clear search category tag
  const clearSearchCategory = () => {
    setSearchCategory(null);
  };

  // Load conversations list
  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations?ownerId=demo-user`);
      if (!response.ok) throw new Error("Failed to fetch conversations");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Open a specific old conversation
  const openConversation = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}?ownerId=demo-user`);
      if (!response.ok) throw new Error("Failed to fetch conversation");
      const data: ConversationDetail = await response.json();

      // Convert turns to chat messages
      const messages: ChatMessage[] = [];
      data.turns.forEach((turn, idx) => {
        messages.push({
          id: `${conversationId}-user-${idx}`,
          type: "user",
          content: turn.userQuery,
          timestamp: turn.timestamp,
        });
        messages.push({
          id: `${conversationId}-ai-${idx}`,
          type: "ai",
          content: turn.aiResponse,
          timestamp: turn.timestamp,
        });
      });

      setChatMessages(messages);
      setCurrentConversationId(conversationId);
      setIsViewingOldConversation(true);
      // Lock input if conversation status is LOCKED or CLOSED
      const isLocked = data.status === "LOCKED" || data.status === "CLOSED";
      setOldConversationLocked(isLocked);
      setIsConversationsOpen(false);
      setAttachedItems([]);
      setSuggestions([]);

      toast({
        title: "Conversation Loaded",
        description: isLocked ? "This conversation is locked (read-only)" : "You can continue this conversation",
      });
    } catch (error) {
      console.error("Failed to open conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}?ownerId=demo-user`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete conversation");

      // Remove from local state
      setConversations(prev => prev.filter(c => c.id !== conversationId));

      // If viewing the deleted conversation, start new
      if (currentConversationId === conversationId) {
        startNewConversation();
      }

      toast({
        title: "Deleted",
        description: "Conversation removed",
      });
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setChatMessages([]);
    setCurrentConversationId(null);
    setIsViewingOldConversation(false);
    setOldConversationLocked(false);
    setAttachedItems([]);
    setSuggestions([]);
    setContextDocuments([]);
    setIsConversationsOpen(false);
  };

  // Open conversations panel and load list
  const openConversationsPanel = () => {
    loadConversations();
    setIsConversationsOpen(true);
  };

  const handleChatQuery = async (presetQuery?: string, actionPosition?: "landing" | "catalog" | "checkout", actionMode?: "navigator" | "copilot") => {
    let query = presetQuery || chatQuery;
    if (!query.trim()) return;

    // Store the current search category for this message
    const currentSearchCategory = searchCategory;

    // Check for AI Search attachment
    const aiSearchAttachment = attachedItems.find(item => item.type === 'ai-search');

    // Build the API query - prepend category if set
    let apiQuery = query;
    if (currentSearchCategory) {
      apiQuery = `request retrieval and generation for product ${currentSearchCategory}: ${query}`;
    } else if (aiSearchAttachment) {
      // Prepend AI Search category text before user query
      apiQuery = `request retrieval and generation for product ${aiSearchAttachment.data.category}: ${query}`;
    }

    // User message shows only the query text, category is stored separately as a tag
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date().toISOString(),
      attachedItems: attachedItems.length > 0 ? [...attachedItems] : undefined,
      searchCategory: currentSearchCategory || undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatQuery("");
    // Keep search category persistent - user can manually clear it
    setIsLoading(true);

    // Keep attachments for next query, only clear suggestions
    // Filter out ai-search attachments - they only prepend text, not sent to API
    const currentAttachments = attachedItems.filter(item => item.type !== 'ai-search');
    setSuggestions([]);

    // Determine position and mode
    const hasAttachments = currentAttachments.length > 0;
    const isFirstQuery = chatMessages.length === 0;

    // Priority: action-specified > attachment-based > first query > default
    let position: "landing" | "catalog" | "checkout";
    let mode: "navigator" | "copilot";

    if (actionPosition && actionMode) {
      // Use action-specified position/mode (from quick actions)
      position = actionPosition;
      mode = actionMode;
    } else if (hasAttachments) {
      // Attachments mean checkout/copilot mode
      position = "checkout";
      mode = "copilot";
    } else if (isFirstQuery) {
      // First query defaults to landing
      position = "landing";
      mode = "navigator";
    } else {
      // Default to catalog for normal queries
      position = "catalog";
      mode = "navigator";
    }

    // Update global position state
    setCurrentPosition(position);
    setCurrentMode(mode);

    try {
      // Build attachments with vector space format - include FULL data
      const attachmentsWithMetadata = currentAttachments.map(item => {
        // Build comprehensive content text with key details for RAG
        const contentParts: string[] = [];
        if (item.data.sku) contentParts.push(`SKU: ${item.data.sku}`);
        if (item.data.name) contentParts.push(item.data.name);
        if (item.data.title) contentParts.push(item.data.title);
        if (item.data.description) contentParts.push(item.data.description);
        if (item.data.content) contentParts.push(item.data.content);
        if (item.data.price) contentParts.push(`Price: ${item.data.price} ${item.data.currency || 'USD'}`);
        if (item.data.category) contentParts.push(`Category: ${item.data.category}`);
        if (item.data.status) contentParts.push(`Status: ${item.data.status}`);
        if (item.data.orderId) contentParts.push(`Order ID: ${item.data.orderId}`);
        if (item.data.orderNumber) contentParts.push(`Order #${item.data.orderNumber}`);
        const contentText = contentParts.join(' | ');

        // Map item type to correct vectorSpace
        // Products and documents about products use "product"
        // Orders use "order"
        let vectorSpace = "product"; // default
        if (item.type === "order") {
          vectorSpace = "order";
        } else if (item.type === "document") {
          const docCategory = item.data.metadata?.category?.toLowerCase();
          vectorSpace = docCategory === "order" ? "order" : "product";
        }

        // Build comprehensive metadata including all item fields
        const fullMetadata = {
          // Include existing metadata
          ...(item.data.metadata || {}),
          // Add all other relevant fields from the item data
          id: item.data.id,
          sku: item.data.sku,
          category: item.data.category || item.data.type,
          name: item.data.name,
          title: item.data.title,
          price: item.data.price,
          totalPrice: item.data.totalPrice,
          quantity: item.data.quantity,
          status: item.data.status,
          orderId: item.data.orderId,
          orderNumber: item.data.orderNumber,
          productName: item.data.productName,
          currency: item.data.currency,
          createdAt: item.data.createdAt,
          rating: item.data.rating,
          code: item.data.code,
          discountType: item.data.discountType,
          discountValue: item.data.discountValue,
          score: item.data.score,
          similarity: item.data.similarity,
        };

        // Remove undefined values from metadata
        Object.keys(fullMetadata).forEach(key => {
          if (fullMetadata[key] === undefined) {
            delete fullMetadata[key];
          }
        });

        // Clean ID - remove any markdown formatting, ensure plain string
        const rawId = item.data.id || item.data.orderId?.toString() || item.data.sku || Date.now().toString();
        const cleanId = String(rawId).replace(/[\[\]\(\)"'`]/g, '').trim();

        return {
          id: cleanId,
          vectorSpace,
          contentText, // Changed from contentSnippet to contentText
          metadata: fullMetadata,
          source: item.type,
          url: String(item.data.url || "").replace(/[\[\]\(\)"'`]/g, '').trim(),
          imageUrl: String(item.data.imageUrl || item.data.metadata?.imageUrl || "").replace(/[\[\]\(\)"'`]/g, '').trim(),
        };
      });

      // Get active attachment IDs (cleaned)
      const activeAttachmentIds = attachmentsWithMetadata.map(a => a.id);

      // Build request payload - use apiQuery which includes category prefix
      const requestPayload = {
        query: apiQuery,
        userId: "demo-user",
        sessionId: "demo-session-max",
        conversationId: currentConversationId || undefined,
        position,
        mode,
        attachments: attachmentsWithMetadata.length > 0 ? attachmentsWithMetadata : undefined,
        activeAttachmentIds: activeAttachmentIds.length > 0 ? activeAttachmentIds : undefined,
      };

      // Store request data for debug modal and clear selected message to show latest
      const requestStartTime = Date.now();
      setLastRequestData({
        endpoint: `${API_BASE_URL}/chat/query`,
        method: "POST",
        timestamp: new Date().toISOString(),
        payload: requestPayload,
      });
      setSelectedDebugMessage(null);

      const response = await fetch(`${API_BASE_URL}/chat/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) throw new Error("Failed to process query");

      const data = await response.json();
      const requestDurationMs = Date.now() - requestStartTime;

      // Store response data for debug modal
      setLastResponseData({
        timestamp: new Date().toISOString(),
        status: response.status,
        data: data,
        durationMs: requestDurationMs,
      });

      console.log("API Response:", data); // Debug log

      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

        let messageContent: unknown = "";
      let result: ChatResult | undefined;
      let resultType: ResultType | undefined;
      let messageDocs: Document[] | undefined;

      if (data.result && data.result.sanitizedPayload) {
          messageContent = data.result.sanitizedPayload.message || "I processed your query successfully.";
        result = data.result;
        resultType = data.result.type;

        console.log("Result Type:", resultType); // Debug log
        console.log("Sanitized Payload Data:", data.result.sanitizedPayload.data); // Debug log
        console.log("Result Data:", data.result.data); // Debug log

        // Extract documents if INFORMATION_PROVIDED
        if (resultType === "INFORMATION_PROVIDED") {
          // Try multiple paths where documents might be
          let rawDocs =
            data.result.data?.documents ||
            data.result.data?.ragResponse?.documents ||
            data.result.sanitizedPayload.data?.documents ||
            data.result.sanitizedPayload.data?.ragResponse?.documents ||
            [];

          // Get entity type from ragResponse if available
          const entityType =
            data.result.data?.ragResponse?.entityType ||
            data.result.sanitizedPayload.data?.ragResponse?.entityType ||
            'document';

          console.log("Documents found:", rawDocs); // Debug log
          console.log("Entity type:", entityType); // Debug log

          if (rawDocs.length > 0) {
            // Transform documents to add missing titles and types
            const transformedDocs = rawDocs.map((doc: any, idx: number) => {
              // Extract a better title from content
              let title = doc.title;
              if (!title && doc.content) {
                // Try to extract product name/description from content
                const parts = doc.content.split(' ');
                // Take meaningful words, skip SKUs
                const titleParts = parts.slice(1, 8).filter((word: string) =>
                  !word.match(/^[A-Z]+-[A-Z]+-\d+$/) &&
                  !word.match(/^\d+\.\d+$/) &&
                  word.toLowerCase() !== 'usd'
                );
                title = titleParts.join(' ') + (parts.length > 8 ? '...' : '');
              }

              // Determine document type
              let docType = doc.type || doc.metadata?.vectorSpace || doc.metadata?.classification;
              if (!docType) {
                // Use entityType from ragResponse, or try to infer from content
                if (entityType.includes(',')) {
                  // Multiple types, use first one or try to infer
                  docType = entityType.split(',')[0].trim();
                } else {
                  docType = entityType;
                }
              }

              return {
                id: doc.id || `doc-${idx}`,
                title: title || `Document ${idx + 1}`,
                content: doc.content || 'No content available',
                type: docType,
                metadata: doc.metadata || {},
                score: doc.score,
                similarity: doc.similarity
              };
            });

            console.log("Transformed documents:", transformedDocs);
            messageDocs = transformedDocs;
          } else {
            console.log("No documents found in response");
          }
        }
      } else {
          messageContent = data.response || data.message || "I processed your query successfully.";
      }

      const messageId = (Date.now() + 1).toString();

      // Tag documents with message ID
      if (messageDocs) {
        messageDocs = messageDocs.map(doc => ({
          ...doc,
          messageId: messageId
        }));
      }

      // Build debug data for this message
      const messageDebugData: DebugData = {
        request: {
          endpoint: `${API_BASE_URL}/chat/query`,
          method: "POST",
          timestamp: new Date().toISOString(),
          payload: requestPayload,
        },
        response: {
          timestamp: new Date().toISOString(),
          status: response.status,
          data: data,
          durationMs: requestDurationMs,
        },
      };

      const aiMessage: ChatMessage = {
        id: messageId,
        type: "ai",
          content: normalizeMessageContent(messageContent),
        timestamp: new Date().toISOString(),
        result: result,
        resultType: resultType,
        documents: messageDocs,
        debugData: messageDebugData,
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

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "policy":
      case "document":
      case "warranty":
      case "terms":
        return FileText;
      case "product":
        return Package;
      case "review":
        return Star;
      case "image":
        return ImageIcon;
      default:
        return FileText;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-50 via-blue-50/50 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900/90"
    >
      {/* Header - Compact on Mobile */}
      <div className="absolute top-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-between px-3 md:px-6 shadow-lg z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
          </motion.div>
          <h1 className="text-sm md:text-xl font-bold text-white">
            <span className="hidden sm:inline">MAX Mode - AI Shopping Assistant</span>
            <span className="sm:hidden">MAX Mode</span>
          </h1>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={showSampleDocuments}
            className="hidden md:flex text-white hover:bg-white/20 text-xs"
          >
            <FileText className="h-4 w-4 mr-1" />
            Test Panel
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Bar - Desktop Only */}
      <div className="hidden md:block absolute top-16 left-0 right-0 px-6 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.slice(0, 8).map((action, idx) => (
            <div key={idx}>
              {action.label === "Search Products" ? (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setIsSearchCategoryOpen(!isSearchCategoryOpen)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl ${action.bg} border ${action.border} hover:scale-105 transition-all min-w-[80px] ${isSearchCategoryOpen ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{action.label}</span>
                </motion.button>
              ) : action.label === "Browse Products" ? (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setIsBrowseProductsOpen(!isBrowseProductsOpen)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl ${action.bg} border ${action.border} hover:scale-105 transition-all min-w-[80px] ${isBrowseProductsOpen ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{action.label}</span>
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleQuickAction(action.query, action.position, action.mode)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl ${action.bg} border ${action.border} hover:scale-105 transition-all min-w-[80px]`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{action.label}</span>
                </motion.button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Search Category Menu - Desktop Only */}
      <AnimatePresence>
        {isSearchCategoryOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:block fixed inset-0 z-40"
              onClick={() => setIsSearchCategoryOpen(false)}
            />
            {/* Floating Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="hidden md:block fixed top-[140px] left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-700 p-4 z-50 min-w-[320px]"
            >
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3 px-1">Select Category to Search</div>
              <div className="flex flex-wrap gap-2">
                {searchCategories.map((cat, catIdx) => (
                  <motion.button
                    key={catIdx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: catIdx * 0.03 }}
                    onClick={() => handleSelectSearchCategory(cat.label)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${cat.bg} border-2 ${cat.border} hover:scale-105 transition-all text-left shadow-sm`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span className={`text-sm font-semibold ${cat.color}`}>{cat.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Browse Products Menu - Desktop Only */}
      <AnimatePresence>
        {isBrowseProductsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:block fixed inset-0 z-40"
              onClick={() => setIsBrowseProductsOpen(false)}
            />
            {/* Floating Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="hidden md:block fixed top-[140px] left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-700 p-6 z-50 max-w-[600px]"
            >
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Browse Products</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {browseProductCategories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        handleQuickAction(category.query, "catalog", "navigator");
                        setIsBrowseProductsOpen(false);
                      }}
                      className="cursor-pointer group"
                    >
                      <div className="overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg">
                        <div className={`h-20 bg-gradient-to-br ${category.color} flex items-center justify-center relative overflow-hidden`}>
                          <Icon className="h-10 w-10 text-white/90 group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-800">
                          <h3 className="font-semibold text-sm mb-0.5">{category.label}</h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Mobile Quick Actions Bottom Sheet */}
      <AnimatePresence>
        {isQuickActionsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickActionsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-[70] max-h-[70vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsQuickActionsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Actions Grid or Category Selection */}
              <div className="p-6 overflow-y-auto max-h-[calc(70vh-120px)]">
                {isSearchCategoryOpen ? (
                  // Search Category Selection View
                  <div>
                    <button
                      onClick={() => setIsSearchCategoryOpen(false)}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 text-sm font-medium"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90" />
                      Back to Actions
                    </button>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Search by Category</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {searchCategories.map((cat, catIdx) => (
                        <motion.button
                          key={catIdx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: catIdx * 0.05 }}
                          onClick={() => handleSelectSearchCategory(cat.label)}
                          className={`flex items-center gap-3 p-4 rounded-2xl ${cat.bg} border-2 ${cat.border} active:scale-95 transition-all`}
                        >
                          <span className="text-2xl">{cat.emoji}</span>
                          <span className={`text-sm font-bold ${cat.color}`}>{cat.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : isBrowseProductsOpen ? (
                  // Browse Products Selection View
                  <div>
                    <button
                      onClick={() => setIsBrowseProductsOpen(false)}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 text-sm font-medium"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90" />
                      Back to Actions
                    </button>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Browse Products</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {browseProductCategories.map((category, idx) => {
                        const Icon = category.icon;
                        return (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              handleQuickAction(category.query, "catalog", "navigator");
                              setIsBrowseProductsOpen(false);
                              setIsQuickActionsOpen(false);
                            }}
                            className="cursor-pointer group"
                          >
                            <div className="overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 active:scale-95 transition-all">
                              <div className={`h-16 bg-gradient-to-br ${category.color} flex items-center justify-center relative overflow-hidden`}>
                                <Icon className="h-8 w-8 text-white/90 group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                              </div>
                              <div className="p-2 bg-white dark:bg-gray-800">
                                <h3 className="font-semibold text-xs mb-0.5">{category.label}</h3>
                                <p className="text-[10px] text-muted-foreground">{category.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Normal Actions Grid
                  <div className="grid grid-cols-3 gap-3">
                    {quickActions.map((action, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => {
                          if (action.label === "Search Products") {
                            setIsSearchCategoryOpen(true);
                          } else if (action.label === "Browse Products") {
                            setIsBrowseProductsOpen(true);
                          } else {
                            handleQuickAction(action.query, action.position, action.mode);
                            setIsQuickActionsOpen(false);
                          }
                        }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${action.bg} border-2 ${action.border} active:scale-95 transition-all`}
                      >
                        <action.icon className={`h-7 w-7 ${action.color}`} />
                        <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Split Content */}
      <div className="h-full relative">
        {/* Chat Messages - Full Width */}
        <div className={`absolute top-12 md:top-[165px] left-0 right-0 bottom-0 overflow-y-auto px-3 md:px-6 py-4 md:py-6 pb-[180px] md:pb-[240px] transition-all ${isPanelVisible && contextDocuments.length > 0 ? (selectedProduct || isCartView ? 'md:pr-[730px]' : 'md:pr-[450px]') : 'md:pr-4'} ${isDebugModalOpen ? 'xl:pl-[420px]' : ''}`}>
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {chatMessages.map((message, index) => {
                const styles = message.type === "ai" ? getResultStyles(message.resultType) : null;
                const Icon = styles?.icon;
                const isLatest = index === chatMessages.length - 1;

                return (
                  <motion.div
                    key={message.id}
                    ref={isLatest ? latestMessageRef : null}
                    data-message-id={message.id}
                    initial={{ opacity: 0, x: message.type === "user" ? 20 : -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[92%] md:max-w-[85%] rounded-2xl md:rounded-3xl overflow-hidden ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl"
                          : `${styles?.bg} shadow-xl relative`
                      }`}
                    >
                      {message.type === "ai" && Icon && !styles?.hideBadge && (
                        <div className="relative">
                          <div className={`px-4 md:px-5 py-2.5 md:py-3 flex items-center justify-between bg-gradient-to-r ${styles?.bg} backdrop-blur-sm`}>
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded-xl ${styles?.iconColor} bg-white/20 backdrop-blur-sm`}>
                                <Icon className="h-4 w-4 md:h-4.5 md:w-4.5 text-white" />
                              </div>
                              <span className="text-xs md:text-sm font-bold text-white drop-shadow-sm">
                                {styles?.label}
                              </span>
                            </div>
                            {message.debugData && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDebugMessage(message);
                                  setIsDebugModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                                title="View API Debug Data"
                              >
                                <Info className="h-4 w-4 text-white/80 hover:text-white" />
                              </button>
                            )}
                          </div>
                          {/* Gradient separator */}
                          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        </div>
                      )}
                      <div className={`p-4 md:p-5 ${message.type === "ai" ? "bg-white dark:bg-gray-900" : ""}`}>
                        {/* Search Category Tag for user messages */}
                        {message.type === "user" && message.searchCategory && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/20 border border-white/30 rounded-full text-[10px] sm:text-xs font-semibold">
                              <Search className="h-3 w-3" />
                              {message.searchCategory}
                            </span>
                          </div>
                        )}
                        {message.attachedItems && message.attachedItems.length > 0 && (
                          <div className="mb-3 space-y-2">
                            {message.attachedItems.map((item, idx) => {
                              const isAISearch = item.type === 'ai-search';
                              const isAlreadyAttached = attachedItems.some(attached =>
                                attached.type === item.type &&
                                (attached.data.id === item.data.id || attached.data.sku === item.data.sku)
                              );
                              return (
                                <div key={idx} className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                                  isAISearch
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50'
                                    : 'bg-white/20 border-white/30'
                                }`}>
                                  {isAISearch ? (
                                    <Search className="h-3 w-3 text-cyan-600" />
                                  ) : (
                                    <Paperclip className="h-3 w-3" />
                                  )}
                                  <span className="flex-1 font-semibold">{item.data.title || `${item.data.type || item.type}: ${item.data.name || ''}`}</span>
                                  {!isAISearch && (
                                    <button
                                      onClick={() => {
                                        if (isAlreadyAttached) {
                                          toast({
                                            title: "Already Attached",
                                            description: `This item is already attached to chat`,
                                            variant: "default",
                                          });
                                          return;
                                        }
                                        handleReattachItem(item);
                                        toast({
                                          title: "💬 Re-attached to Chat",
                                          description: `Item is now part of the conversation`,
                                        });
                                      }}
                                      className={`p-1 rounded transition-colors ${
                                        isAlreadyAttached
                                          ? 'text-green-500 cursor-default'
                                          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100/20'
                                      }`}
                                      title={isAlreadyAttached ? "Already attached" : "Re-attach to chat"}
                                    >
                                      {isAlreadyAttached ? (
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                      ) : (
                                        <Plus className="h-3.5 w-3.5" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {(() => {
                          const content = normalizeMessageContent(message.content);
                          const parsedAction = parseActionMessage(content);

                          if (message.type === "user" && parsedAction.isAction) {
                            const ActionIcon = getActionIcon(parsedAction.actionType);
                            return (
                              <div className="relative">
                                {/* Resend Button - Floating Outside Top-Left */}
                                <Button
                                  onClick={() => {
                                    setChatQuery(parsedAction.fullMessage);
                                    handleChatQuery(parsedAction.fullMessage);
                                  }}
                                  size="icon"
                                  variant="ghost"
                                  className="absolute -left-3 -top-3 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-110 shadow-xl z-10 border-2 border-white dark:border-gray-900"
                                  title="Resend action"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>

                                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-[2px] shadow-lg">
                                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                                        <ActionIcon className="h-5 w-5 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                          {parsedAction.actionType}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                                      {parsedAction.query}
                                    </p>

                                    {/* Decorative shine effect */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-2xl -z-10" />
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <p className={`text-base md:text-lg whitespace-pre-wrap leading-relaxed font-medium ${message.type === "ai" ? "text-gray-800 dark:text-gray-100" : ""}`} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                              {content}
                            </p>
                          );
                        })()}
                        {message.resultType === "CONFIRMATION_REQUIRED" && confirmationStatus[message.id] !== 'confirmed' && confirmationStatus[message.id] !== 'rejected' && (
                          <div className="mt-4 flex gap-2">
                            <Button
                              onClick={() => handleConfirmation(message.id, true, message)}
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1.5" />
                              Confirm
                            </Button>
                            <Button
                              onClick={() => handleConfirmation(message.id, false, message)}
                              size="sm"
                              variant="outline"
                              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                            >
                              <XCircle className="h-4 w-4 mr-1.5" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {message.resultType === "CONFIRMATION_REQUIRED" && confirmationStatus[message.id] === 'confirmed' && (
                          <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-semibold flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Confirmed
                            </p>
                          </div>
                        )}
                        {message.resultType === "CONFIRMATION_REQUIRED" && confirmationStatus[message.id] === 'rejected' && (
                          <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-semibold flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Rejected
                            </p>
                          </div>
                        )}
                        {message.resultType === "INFORMATION_PROVIDED" && message.documents && message.documents.length > 0 && (
                          <Button
                            onClick={() => {
                              setIsBottomSheetOpen(true);
                              setFocusedMessageId(message.id);
                            }}
                            size="sm"
                            className="mt-3 md:hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg text-xs rounded-full px-4 py-2 flex items-center gap-2"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="font-semibold">Sources Used</span>
                            <span className="px-1.5 py-0.5 bg-white/25 rounded-full text-[10px] font-bold">
                              {message.documents.length}
                            </span>
                          </Button>
                        )}
                        {message.resultType === "INFORMATION_PROVIDED" && message.documents && message.documents.length > 0 && !isPanelVisible && (
                          <Button
                            onClick={() => {
                              setIsPanelVisible(true);
                              setFocusedMessageId(message.id);
                            }}
                            size="sm"
                            className="mt-3 hidden md:inline-flex bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg rounded-full px-5 py-2.5 items-center gap-2.5"
                          >
                            <Sparkles className="h-4 w-4" />
                            <span className="font-semibold">View Sources Used</span>
                            <span className="px-2 py-0.5 bg-white/25 rounded-full text-xs font-bold">
                              {message.documents.length}
                            </span>
                          </Button>
                        )}
                        {message.result?.sanitizedPayload?.type === "ACTION_EXECUTED" &&
                         message.result?.sanitizedPayload?.data?.actionResult?.data && (
                          <ActionResultRenderer
                            data={message.result.sanitizedPayload.data.actionResult.data}
                            messageId={message.id}
                            expandedCount={expandedActions[message.id] || 4}
                            onExpand={(count) => {
                              setExpandedActions(prev => ({
                                ...prev,
                                [message.id]: count
                              }));
                            }}
                            isAttached={isItemAttached}
                            onAttach={(item) => {
                              // Normalize field names (handle different casing from API)
                              const normalizedItem: any = {};

                              // Detect item type based on fields
                              const hasProductFields = item.sku || item.Sku || item.price !== undefined || item.Price !== undefined;
                              const hasOrderFields = item.orderId || item.OrderId || item.orderNumber || item.OrderNumber;
                              const hasReviewFields = item.rating !== undefined && (item.comment || item.Comment);
                              const hasCouponFields = item.code || item.Code || item.discountType || item.DiscountType;

                              let itemType = 'item';
                              if (hasProductFields && !hasOrderFields) {
                                itemType = 'product';
                              } else if (hasOrderFields) {
                                itemType = 'order';
                              } else if (hasReviewFields) {
                                itemType = 'review';
                              } else if (hasCouponFields) {
                                itemType = 'coupon';
                              }

                              // Normalize all fields to lowercase keys and include everything
                              if (itemType === 'product') {
                                normalizedItem.id = item.id || item.Id || item.ID;
                                normalizedItem.sku = item.sku || item.Sku || item.SKU;
                                normalizedItem.name = item.name || item.Name || item.title || item.Title;
                                normalizedItem.description = item.description || item.Description || '';
                                normalizedItem.price = item.price ?? item.Price;
                                normalizedItem.category = item.category || item.Category;
                                normalizedItem.brand = item.brand || item.Brand;
                                normalizedItem.inStockQty = item.inStockQty ?? item.InStockQty ?? item.stockQuantity ?? item.StockQuantity;
                                normalizedItem.imageUrl = item.imageUrl || item.ImageUrl || item.image || item.Image;
                                normalizedItem.rating = item.rating ?? item.Rating;
                                normalizedItem.reviewCount = item.reviewCount ?? item.ReviewCount;
                                // Include any other fields from original item
                                Object.keys(item).forEach(key => {
                                  const lowerKey = key.toLowerCase();
                                  if (normalizedItem[lowerKey] === undefined && item[key] !== undefined) {
                                    normalizedItem[lowerKey] = item[key];
                                  }
                                });
                              } else {
                                // For non-products, copy all fields with lowercase keys
                                Object.keys(item).forEach(key => {
                                  const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
                                  normalizedItem[lowerKey] = item[key];
                                });
                              }

                              // Create a title from the item data
                              const title = normalizedItem.name || normalizedItem.productName || normalizedItem.title || `Item ${normalizedItem.id || ''}`;

                              // Check if already attached
                              if (attachedItems.some(attached =>
                                attached.type === itemType &&
                                (attached.data.id === normalizedItem.id || attached.data.sku === normalizedItem.sku)
                              )) {
                                toast({
                                  title: "Already Attached",
                                  description: `"${title}" is already attached to chat`,
                                  variant: "default",
                                });
                                return;
                              }

                              setAttachedItems(prev => [...prev, { type: itemType, data: normalizedItem }]);

                              // Set position to checkout when attaching items
                              setCurrentPosition("checkout");
                              setCurrentMode("copilot");

                              toast({
                                title: "💬 Added to Chat",
                                description: `"${title}" is now part of the conversation`,
                              });

                              // Focus on chat input after attachment
                              setTimeout(() => {
                                chatInputRef.current?.focus();
                              }, 100);
                            }}
                          />
                        )}
                        {/* Debug button for messages without header badge */}
                        {message.type === "ai" && message.debugData && styles?.hideBadge && (
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDebugMessage(message);
                                setIsDebugModalOpen(true);
                              }}
                              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-600 transition-colors"
                              title="View API Debug Data"
                            >
                              <Info className="h-3 w-3" />
                              <span>Debug</span>
                            </button>
                          </div>
                        )}
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
                      className="w-2 h-2 bg-blue-600 rounded-full"
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

        {/* Desktop: Side Panel (Documents) - Hidden on Mobile */}
        <AnimatePresence>
          {contextDocuments.length > 0 && isPanelVisible && (
            <motion.div
              initial={{ opacity: 0, x: 420 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 420 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`hidden md:flex absolute top-[165px] right-0 bottom-0 mr-2 ${selectedProduct || isCartView ? 'w-[700px] max-w-[700px]' : 'w-[420px] max-w-[420px]'} border-l-2 border-blue-500/30 bg-gradient-to-b from-blue-50/95 to-white/95 dark:from-gray-900/95 dark:via-blue-900/20 dark:to-gray-900/95 backdrop-blur-xl p-6 shadow-2xl z-10 flex-col transition-all duration-300`}
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 backdrop-blur-md p-5 rounded-2xl mb-6 shadow-2xl border-2 border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                    >
                      <Sparkles className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="font-bold text-lg text-white">
                        {isCartView ? 'Shopping Cart' : selectedProduct ? 'Product Details' : 'Context Panel'}
                      </h2>
                      <p className="text-xs text-white/80">
                        {isCartView
                          ? 'View and manage your cart'
                          : selectedProduct
                            ? 'View details and add to cart'
                            : `${contextDocuments.length} ${contextDocuments.length === 1 ? 'document' : 'documents'} • Click to view`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(selectedProduct || isCartView) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={isCartView ? closeCart : closeProductDetails}
                        className="h-8 px-3 text-xs text-white hover:bg-white/20 border border-white/30"
                      >
                        <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                        Back
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPanelVisible(false)}
                      className="h-8 px-3 text-xs text-white hover:bg-white/20 border border-white/30"
                    >
                      <EyeOff className="h-3 w-3 mr-1" />
                      Hide
                    </Button>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-full"></div>
              </div>

              {/* Cart View, Product Details or Documents List */}
              {isCartView ? (
                /* Cart View */
                <div className="flex-1 overflow-y-auto space-y-4" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(168, 85, 247, 0.5) rgba(243, 232, 255, 0.2)'
                }}>
                  {cartData && cartData.items && cartData.items.length > 0 ? (
                    <>
                      {/* Cart Items */}
                      <div className="space-y-3">
                        {cartData.items.map((item: any, idx: number) => (
                          <Card key={idx} className="border-2 border-blue-200 bg-white/60">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{item.productName || item.sku}</h4>
                                  <p className="text-sm text-gray-600 mb-2">SKU: {item.sku}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">${item.price}</span>
                                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                  </div>
                                  <div className="mt-2 text-sm font-semibold text-gray-900">
                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.sku)}
                                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Cart Summary */}
                      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold">${cartData.subtotal?.toFixed(2) || '0.00'}</span>
                          </div>
                          {cartData.discount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Discount:</span>
                              <span className="font-semibold text-green-600">-${cartData.discount?.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-blue-200 pt-2 flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total:</span>
                            <span className="text-lg font-bold text-gray-900">${cartData.total?.toFixed(2) || '0.00'}</span>
                          </div>
                          {cartData.couponCode && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              Coupon: {cartData.couponCode}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            setChatQuery("Checkout my cart");
                            handleChatQuery("Checkout my cart");
                            closeCart();
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                          size="lg"
                        >
                          <ShoppingBag className="h-5 w-5 mr-2" />
                          Proceed to Checkout
                        </Button>
                        <Button
                          onClick={() => {
                            const cartAttachment = {
                              type: "cart",
                              data: {
                                title: `Cart (${cartData.items.length} items - $${cartData.total?.toFixed(2)})`,
                                items: cartData.items,
                                subtotal: cartData.subtotal,
                                discount: cartData.discount,
                                total: cartData.total,
                                couponCode: cartData.couponCode
                              }
                            };
                            setAttachedItems(prev => [...prev, cartAttachment]);

                            // Cart attachments use checkout position
                            setCurrentPosition("checkout");
                            setCurrentMode("copilot");

                            toast({
                              title: "💬 Cart Added to Chat",
                              description: "Your cart details are now part of the conversation",
                            });
                          }}
                          variant="outline"
                          className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                          size="lg"
                        >
                          <BrainCircuit className="h-5 w-5 mr-2" />
                          Attach Cart to Chat
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                      <p className="text-sm text-gray-500 mb-4">Add some products to get started!</p>
                      <Button
                        onClick={() => {
                          closeCart();
                          setChatQuery("Show me available products");
                          handleChatQuery("Show me available products");
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                      >
                        Browse Products
                      </Button>
                    </div>
                  )}
                </div>
              ) : selectedProduct ? (
                /* Product Details View */
                <div className="flex-1 overflow-y-auto space-y-6" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(168, 85, 247, 0.5) rgba(243, 232, 255, 0.2)'
                }}>
                  {selectedProduct.metadata?.imageUrl && (
                    <div className="relative h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-white">
                      <img
                        src={selectedProduct.metadata.imageUrl}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                        {selectedProduct.title}
                      </h3>
                      <Badge variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-700">
                        {selectedProduct.type}
                      </Badge>
                    </div>

                    <div className="p-4 bg-white/60 rounded-xl border-2 border-purple-200">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedProduct.content}
                      </p>
                    </div>

                    {selectedProduct.metadata && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Product Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(selectedProduct.metadata).map(([key, value]) => {
                            if (key === 'imageUrl') return null;
                            return (
                              <div key={key} className="p-3 bg-white/60 rounded-lg border border-purple-200">
                                <p className="text-xs text-gray-500 mb-1">{formatFieldName(key)}</p>
                                <p className="text-sm font-semibold text-gray-900">{formatFieldValue(value)}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="sticky bottom-0 bg-gradient-to-t from-blue-50 via-blue-50/50 to-transparent pt-6 pb-2 space-y-3">
                      <Button
                        onClick={() => addToCart(selectedProduct)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                        size="lg"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => {
                          handleAttachDocument(selectedProduct);
                          closeProductDetails();
                        }}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                        size="lg"
                      >
                        <BrainCircuit className="h-5 w-5 mr-2" />
                        Attach to Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Documents List - Scrollable with Floating Buttons */
                <div className="flex-1 relative min-h-0">
                {/* Floating Scroll Up Button - Hidden on Mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleScrollUp}
                  className="hidden lg:flex absolute top-4 left-1/2 -translate-x-1/2 z-20 h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl border-2 border-white/30 hover:scale-110 transition-all"
                  title="Scroll Up"
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>

                {/* Scrollable Documents Container */}
                <div
                  ref={contextPanelRef}
                  className="absolute inset-0 overflow-y-auto px-2 py-2 space-y-4"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(168, 85, 247, 0.5) rgba(243, 232, 255, 0.2)'
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {contextDocuments.map((doc, idx) => {
                      const DocIcon = getDocumentIcon(doc.type);
                      const isFocused = doc.messageId === focusedMessageId;
                      const isNewDoc = !viewedDocumentIds.has(doc.id) && newDocuments.some(nd => nd.id === doc.id);
                      return (
                        <motion.div
                          key={doc.id}
                          data-doc-message-id={doc.messageId}
                          data-doc-id={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Card
                            onClick={() => openProductDetails(doc)}
                            className={`relative group hover:shadow-2xl transition-all duration-300 border-2 cursor-pointer ${
                            isNewDoc
                              ? 'border-yellow-400 shadow-lg shadow-yellow-200/50 bg-gradient-to-br from-yellow-50/90 via-blue-50/40 to-white/40'
                              : isFocused
                                ? 'border-yellow-400 shadow-lg shadow-yellow-200/50 bg-gradient-to-br from-yellow-50 via-blue-50/50 to-white/50'
                                : 'border-blue-300 hover:border-blue-500 bg-gradient-to-br from-white via-blue-50/50 to-white'
                          } dark:from-gray-800 dark:to-blue-900/20 overflow-hidden`}>
                            {doc.metadata?.imageUrl && (
                              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-white">
                                <img
                                  src={doc.metadata.imageUrl}
                                  alt={doc.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {isNewDoc && (
                                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                    NEW
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Attach Button - Always Visible - Outside CardHeader for better access */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`absolute top-2 right-2 h-10 w-10 ${
                                isItemAttached(doc.id)
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                  : 'bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                              } text-white shadow-xl border-2 border-white/50 hover:scale-110 hover:border-white/50 transition-all z-50 pointer-events-auto cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                console.log('Attaching document:', doc.title, doc.id);
                                handleAttachDocument(doc);
                              }}
                              title={isItemAttached(doc.id) ? "Already in Chat" : "Attach to Chat"}
                            >
                              {isItemAttached(doc.id) ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <BrainCircuit className="h-5 w-5" />
                              )}
                            </Button>

                            <CardHeader className="pb-3 relative pt-2">
                              <div className="flex items-start justify-between gap-2 pr-12">
                                <div className="flex items-start gap-3 flex-1">
                                  {!doc.metadata?.imageUrl && (
                                    <motion.div
                                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                      transition={{ duration: 0.5 }}
                                      className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg"
                                    >
                                      <DocIcon className="h-5 w-5 text-white" />
                                    </motion.div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base font-bold line-clamp-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                      {doc.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <Badge variant="outline" className="text-[10px] bg-blue-100 border-blue-300 text-blue-700">
                                        {doc.type}
                                      </Badge>
                                      {isNewDoc && (
                                        <Badge className="text-[10px] bg-yellow-400 text-yellow-900 border-yellow-500">
                                          NEW
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                                {doc.content}
                              </p>
                              {(doc.similarity || doc.score) && (
                                <div className="mt-3">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <Badge variant="outline" className="text-[10px] bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 text-yellow-800 font-semibold">
                                      {((doc.similarity || doc.score) * 100).toFixed(1)}% Match
                                    </Badge>
                                  </div>
                                </div>
                              )}
                              {doc.metadata && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                  <div className="flex flex-wrap gap-1.5">
                                    {Object.entries(doc.metadata)
                                      .filter(([key]) => !key.startsWith('_') && !key.includes('indexedCreatedAt') && key !== 'imageUrl' && key !== 'vectorSpace')
                                      .slice(0, 4)
                                      .map(([key, value], badgeIdx) => {
                                        const colors = [
                                          'bg-blue-100 text-blue-700 border-blue-300',
                                          'bg-green-100 text-green-700 border-green-300',
                                          'bg-pink-100 text-pink-700 border-pink-300',
                                          'bg-indigo-100 text-indigo-700 border-indigo-300',
                                        ];
                                        return (
                                          <Badge key={key} variant="outline" className={`text-[10px] ${colors[badgeIdx % colors.length]} font-medium`}>
                                            {formatFieldName(key)}: {String(value).slice(0, 25)}
                                          </Badge>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={contextPanelEndRef} />
                </div>

                {/* Floating Scroll Down Button - Hidden on Mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleScrollDown}
                  className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20 h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl border-2 border-white/30 hover:scale-110 transition-all"
                  title="Scroll Down"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Show Panel Button - Desktop only */}
        <AnimatePresence>
          {contextDocuments.length > 0 && !isPanelVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 100 }}
              transition={{ type: "spring", damping: 20 }}
              className="hidden md:block absolute top-20 right-4 z-20"
            >
              <Button
                onClick={() => setIsPanelVisible(true)}
                size="lg"
                className="bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-2xl border-2 border-white/30 rounded-full px-6"
              >
                <Eye className="h-5 w-5 mr-2" />
                Show Panel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: AI Search Categories - Horizontal Row at Same Level */}
      <AnimatePresence>
        {isAISearchOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 20 }}
            className="md:hidden fixed bottom-24 left-3 right-20 z-20 flex items-center gap-2 overflow-x-auto scrollbar-hide px-2 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full"
          >
            {aiSearchCategories.map((category, idx) => (
              <motion.button
                key={category.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  handleAISearchCategory(category);
                  setIsAISearchOpen(false);
                }}
                className="flex-shrink-0 flex flex-col items-center gap-1"
              >
                <div className={`h-12 w-12 rounded-full bg-white dark:bg-gray-800 border-2 ${category.border} shadow-lg flex items-center justify-center transition-all active:scale-95 hover:scale-105`}>
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <span className={`text-[8px] font-semibold ${category.color} leading-tight text-center max-w-[48px]`}>
                  {category.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: All Floating Action Buttons - Single Column */}
        <div className="md:hidden fixed bottom-24 right-1 z-20 flex flex-col-reverse items-center gap-3">
          {/* AI Search Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <Button
              onClick={() => setIsAISearchOpen(!isAISearchOpen)}
              size="lg"
              className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl border-2 border-white/30"
            >
              <Search className="h-5 w-5" />
            </Button>
            <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              AI Search
            </span>
          </motion.div>

          {/* Browse Products Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <Button
              onClick={() => setIsBrowseProductsOpen(!isBrowseProductsOpen)}
              size="lg"
              className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-2xl border-2 border-white/30"
            >
              <List className="h-5 w-5" />
            </Button>
            <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              Products
            </span>
          </motion.div>

          {/* Documents Button - Conditional */}
          <AnimatePresence>
            {contextDocuments.length > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <Button
                  onClick={handleOpenBottomSheet}
                  size="lg"
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-2xl border-2 border-white/30 relative"
                >
                  <FileText className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center p-0">
                    {contextDocuments.length}
                  </Badge>
                </Button>
                <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  Docs
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <Button
              onClick={openCart}
              size="lg"
              className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-2xl border-2 border-white/30"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded-full shadow-sm">
              Cart
            </span>
          </motion.div>

          {/* Quick Actions Button */}
          <AnimatePresence>
            {!isQuickActionsOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-1"
              >
                <Button
                  onClick={() => setIsQuickActionsOpen(true)}
                  size="lg"
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-2xl border-2 border-white/30"
                >
                  <BrainCircuit className="h-5 w-5" />
                </Button>
                <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  Actions
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile: Browse Products Bottom Sheet */}
        <AnimatePresence>
          {isBrowseProductsOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                onClick={() => setIsBrowseProductsOpen(false)}
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-40 max-h-[65vh] overflow-hidden"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-5 py-4 border-b border-blue-200/50 dark:border-blue-800/50 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-blue-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Browse Products</h3>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">Quick category search</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsBrowseProductsOpen(false)}
                    className="h-9 w-9 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </Button>
                </div>

                {/* Products List in Rows */}
                <div className="p-4 overflow-y-auto max-h-[calc(65vh-120px)]">
                  <div className="space-y-2.5">
                    {browseProductCategories.map((category, idx) => {
                      const Icon = category.icon;
                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => {
                            handleQuickAction(category.query, "catalog", "navigator");
                            setIsBrowseProductsOpen(false);
                          }}
                          className="cursor-pointer group"
                        >
                          <div className={`relative overflow-hidden flex items-center gap-3.5 p-4 rounded-2xl border border-transparent bg-gradient-to-br ${category.color} hover:shadow-xl active:scale-[0.98] transition-all shadow-md`}>
                            {/* Icon Circle */}
                            <div className="relative z-10 p-3 bg-white/25 backdrop-blur-sm rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                              <Icon className="h-6 w-6 text-white drop-shadow-md" />
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 flex-1 min-w-0">
                              <h3 className="font-bold text-base text-white mb-0.5 drop-shadow-sm">{category.label}</h3>
                              <p className="text-xs text-white/90 font-medium">{category.description}</p>
                            </div>

                            {/* Arrow Icon */}
                            <div className="relative z-10 flex-shrink-0">
                              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg group-hover:bg-white/30 transition-all">
                                <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>

                            {/* Shine Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>


        {/* Mobile: New Documents Preview Panel */}
        <AnimatePresence>
          {isNewDocsPreviewOpen && newDocuments.length > 0 && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/30 z-[35]"
                onClick={handleCloseNewDocsPreview}
              />

              {/* Small Right Panel */}
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed top-20 bottom-20 right-0 w-[280px] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 shadow-2xl z-[40] flex flex-col rounded-l-3xl border-l-2 border-blue-300"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        New Products
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        {newDocuments.length} {newDocuments.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseNewDocsPreview}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* New Documents List - Scrollable */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                  {newDocuments.map((doc, idx) => {
                    const DocIcon = getDocumentIcon(doc.type);
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card
                          onClick={() => {
                            openProductDetails(doc);
                            handleCloseNewDocsPreview();
                            setIsBottomSheetOpen(true);
                          }}
                          className="relative group active:scale-98 transition-all border-2 border-yellow-300 bg-gradient-to-br from-yellow-50/80 via-blue-50/30 to-white/30 cursor-pointer shadow-lg"
                        >
                          {doc.metadata?.imageUrl && (
                            <div className="relative h-24 overflow-hidden bg-gradient-to-br from-blue-100 to-white rounded-t-lg">
                              <img
                                src={doc.metadata.imageUrl}
                                alt={doc.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                NEW
                              </div>
                            </div>
                          )}
                          <CardHeader className="pb-2 pt-2 px-2">
                            <div className="flex items-start gap-2">
                              {!doc.metadata?.imageUrl && (
                                <>
                                  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex-shrink-0">
                                    <DocIcon className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                    NEW
                                  </div>
                                </>
                              )}
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-xs font-bold line-clamp-2 text-gray-900">
                                  {doc.title}
                                </CardTitle>
                                {doc.metadata?.price && (
                                  <p className="text-xs font-semibold text-gray-900 mt-1">
                                    {doc.metadata.price}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* View All Button */}
                <div className="p-3 border-t border-blue-200">
                  <Button
                    onClick={() => {
                      handleCloseNewDocsPreview();
                      handleOpenBottomSheet();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
                    size="sm"
                  >
                    View All Documents
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>


        {/* Mobile: Documents Bottom Sheet */}
        <AnimatePresence>
          {isBottomSheetOpen && contextDocuments.length > 0 && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBottomSheetOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.y > 100 || velocity.y > 500) {
                    setIsBottomSheetOpen(false);
                  }
                }}
                className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 rounded-t-3xl shadow-2xl z-[70] max-h-[80vh] flex flex-col"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-4 py-3 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedProduct && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeProductDetails}
                        className="h-8 w-8 -ml-2"
                      >
                        <ArrowRight className="h-5 w-5 rotate-180" />
                      </Button>
                    )}
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        {isCartView ? 'Shopping Cart' : selectedProduct ? 'Product Details' : 'Context Documents'}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        {isCartView
                          ? 'View and manage your cart'
                          : selectedProduct
                            ? 'View details and add to cart'
                            : `${contextDocuments.length} ${contextDocuments.length === 1 ? 'item' : 'items'} • Tap to view`
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsBottomSheetOpen(false);
                      setSelectedProduct(null);
                      if (isCartView) closeCart();
                    }}
                    className="h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Cart View, Product Details or Documents List - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {isCartView ? (
                    /* Mobile Cart View */
                    <div className="space-y-3">
                      {cartData && cartData.items && cartData.items.length > 0 ? (
                        <>
                          {/* Cart Items */}
                          {cartData.items.map((item: any, idx: number) => (
                            <Card key={idx} className="border-2 border-purple-200 bg-white/80">
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.productName || item.sku}</h4>
                                    <p className="text-xs text-gray-600 mb-1">SKU: {item.sku}</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-base font-bold text-purple-600">${item.price}</span>
                                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                    </div>
                                    <div className="mt-1 text-xs font-semibold text-gray-900">
                                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeFromCart(item.sku)}
                                    className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          {/* Cart Summary */}
                          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                            <CardContent className="p-3 space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold">${cartData.subtotal?.toFixed(2) || '0.00'}</span>
                              </div>
                              {cartData.discount > 0 && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-600">Discount:</span>
                                  <span className="font-semibold text-green-600">-${cartData.discount?.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="border-t border-blue-200 pt-2 flex justify-between">
                                <span className="text-base font-bold text-gray-900">Total:</span>
                                <span className="text-base font-bold text-gray-900">${cartData.total?.toFixed(2) || '0.00'}</span>
                              </div>
                              {cartData.couponCode && (
                                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  Coupon: {cartData.couponCode}
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button
                              onClick={() => {
                                setChatQuery("Checkout my cart");
                                handleChatQuery("Checkout my cart");
                                setIsBottomSheetOpen(false);
                                closeCart();
                              }}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                              size="lg"
                            >
                              <ShoppingBag className="h-5 w-5 mr-2" />
                              Proceed to Checkout
                            </Button>
                            <Button
                              onClick={() => {
                                const cartAttachment = {
                                  type: "cart",
                                  data: {
                                    title: `Cart (${cartData.items.length} items - $${cartData.total?.toFixed(2)})`,
                                    items: cartData.items,
                                    subtotal: cartData.subtotal,
                                    discount: cartData.discount,
                                    total: cartData.total,
                                    couponCode: cartData.couponCode
                                  }
                                };
                                setAttachedItems(prev => [...prev, cartAttachment]);

                                // Cart attachments use checkout position
                                setCurrentPosition("checkout");
                                setCurrentMode("copilot");

                                toast({
                                  title: "💬 Cart Added to Chat",
                                  description: "Your cart details are now part of the conversation",
                                });
                              }}
                              variant="outline"
                              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <BrainCircuit className="h-5 w-5 mr-2" />
                              Attach Cart to Chat
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-12">
                          <ShoppingCart className="h-12 w-12 text-gray-300 mb-3" />
                          <h3 className="text-base font-semibold text-gray-900 mb-1">Your cart is empty</h3>
                          <p className="text-xs text-gray-500 mb-3">Add some products to get started!</p>
                          <Button
                            onClick={() => {
                              setIsBottomSheetOpen(false);
                              closeCart();
                              setChatQuery("Show me available products");
                              handleChatQuery("Show me available products");
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                            size="sm"
                          >
                            Browse Products
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : selectedProduct ? (
                    /* Mobile Product Details */
                    <div className="space-y-4">
                      {selectedProduct.metadata?.imageUrl && (
                        <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-white -mx-4">
                          <img
                            src={selectedProduct.metadata.imageUrl}
                            alt={selectedProduct.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                          {selectedProduct.title}
                        </h3>
                        <Badge variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-700">
                          {selectedProduct.type}
                        </Badge>
                      </div>

                      <div className="p-3 bg-white/80 rounded-lg border-2 border-blue-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedProduct.content}
                        </p>
                      </div>

                      {selectedProduct.metadata && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 text-sm">Product Details</h4>
                          <div className="space-y-2">
                            {Object.entries(selectedProduct.metadata).map(([key, value]) => {
                              if (key === 'imageUrl') return null;
                              return (
                                <div key={key} className="p-3 bg-white/80 rounded-lg border border-blue-200">
                                  <p className="text-xs text-gray-500 mb-0.5">{formatFieldName(key)}</p>
                                  <p className="text-sm font-semibold text-gray-900">{formatFieldValue(value)}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-2 space-y-2 -mx-4 px-4">
                        <Button
                          onClick={() => {
                            addToCart(selectedProduct);
                            setIsBottomSheetOpen(false);
                            setSelectedProduct(null);
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                          size="lg"
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => {
                            handleAttachDocument(selectedProduct);
                            setIsBottomSheetOpen(false);
                            setSelectedProduct(null);
                          }}
                          variant="outline"
                          className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <BrainCircuit className="h-5 w-5 mr-2" />
                          Attach to Chat
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Documents List - Newer first on mobile */
                    <AnimatePresence mode="popLayout">
                    {[...contextDocuments].reverse().map((doc, idx) => {
                      const DocIcon = getDocumentIcon(doc.type);
                      const isNewDoc = !viewedDocumentIds.has(doc.id) && newDocuments.some(nd => nd.id === doc.id);
                      return (
                        <motion.div
                          key={doc.id}
                          data-doc-id={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Card
                            onClick={() => openProductDetails(doc)}
                            className={`relative group active:scale-98 transition-all border-2 cursor-pointer ${
                              isNewDoc
                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50/90 via-blue-50/40 to-white/40 shadow-lg'
                                : 'border-blue-200 hover:border-blue-400 bg-gradient-to-br from-white via-blue-50/30 to-white'
                            }`}>
                            {doc.metadata?.imageUrl && (
                              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-100 to-white">
                                <img
                                  src={doc.metadata.imageUrl}
                                  alt={doc.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {isNewDoc && (
                                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">
                                    NEW
                                  </div>
                                )}
                              </div>
                            )}
                            <CardHeader className="pb-2 pt-3 px-3">
                              <div className="flex items-start gap-2">
                                {!doc.metadata?.imageUrl && (
                                  <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex-shrink-0">
                                    <DocIcon className="h-4 w-4 text-white" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-sm font-bold line-clamp-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    {doc.title}
                                  </CardTitle>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Badge variant="outline" className="text-[9px] bg-blue-100 border-blue-300 text-blue-700">
                                      {doc.type}
                                    </Badge>
                                    {isNewDoc && (
                                      <Badge className="text-[9px] bg-yellow-400 text-yellow-900 border-yellow-500">
                                        NEW
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={`h-9 w-9 flex-shrink-0 ${
                                    isItemAttached(doc.id)
                                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                      : 'bg-gradient-to-br from-blue-600 to-blue-500'
                                  } text-white shadow-lg border border-white/30 hover:scale-110 transition-all z-50 pointer-events-auto cursor-pointer`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log('Mobile - Attaching document:', doc.title, doc.id);
                                    handleAttachDocument(doc);
                                  }}
                                  title={isItemAttached(doc.id) ? "Already in Chat" : "Attach to Chat"}
                                >
                                  {isItemAttached(doc.id) ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <BrainCircuit className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="px-3 pb-3">
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {doc.content}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Collection Animation - Rises from bottom when item is attached */}
      <AnimatePresence>
        {collectingItem && (
          <motion.div
            initial={{ y: 200, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 200, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="fixed bottom-28 md:bottom-32 left-0 right-0 z-[110] pointer-events-none px-4 flex justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, -2, 2, -2, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="relative w-full max-w-[350px]"
            >
              {/* Main Card */}
              <Card className="border-4 border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-2xl w-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Animated AI Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ delay: 0.2, type: "spring", damping: 10 }}
                      className="relative"
                    >
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                        <BrainCircuit className="h-6 w-6 text-white" />
                      </div>
                      {/* Success Checkmark Animation */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", damping: 10 }}
                        className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs font-bold text-purple-800 mb-1 flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        Added to Context!
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight"
                      >
                        {collectingItem.title}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[10px] text-purple-700 mt-1 flex items-center gap-1"
                      >
                        <Badge variant="outline" className="text-[9px] bg-purple-100 border-purple-300 text-purple-800 px-1.5 py-0">
                          {collectingItem.type}
                        </Badge>
                        AI will use this in chat
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sparkle effects */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-yellow-400">
                  <Sparkles className="h-12 w-12" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t-2 border-purple-500/30 p-3 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Attached Items - Beautiful Cards (exclude AI Search - shown in input tag) */}
          {attachedItems.filter(item => item.type !== 'ai-search').length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 md:mb-3 flex flex-wrap gap-1.5 md:gap-2 max-h-[120px] md:max-h-[200px] overflow-y-auto"
            >
              <AnimatePresence mode="popLayout">
                {attachedItems.filter(item => item.type !== 'ai-search').map((item, idx) => {
                  const isAISearch = item.type === 'ai-search';
                  return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <Card className={`border-2 shadow-lg hover:shadow-xl transition-all ${
                      isAISearch
                        ? 'border-indigo-400/50 bg-gradient-to-br from-indigo-500/20 to-purple-500/20'
                        : 'border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-blue-400/20'
                    }`}>
                      <CardContent className="p-2 md:p-3 flex items-center gap-2 md:gap-3">
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                          className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                            isAISearch
                              ? 'bg-gradient-to-br from-indigo-600 to-purple-600'
                              : 'bg-gradient-to-br from-blue-600 to-blue-500'
                          }`}
                        >
                          {isAISearch ? (
                            <Search className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          ) : (
                            <MessageSquarePlus className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] md:text-xs font-bold truncate ${
                            isAISearch ? 'text-cyan-900 dark:text-cyan-100' : 'text-purple-900 dark:text-purple-100'
                          }`}>
                            {item.data.title || item.data.productName || item.data.name || `Item ${item.data.id || ''}`}
                          </p>
                          <p className={`hidden md:flex text-[10px] items-center gap-1 ${
                            isAISearch ? 'text-cyan-700 dark:text-cyan-300' : 'text-purple-700 dark:text-purple-300'
                          }`}>
                            <Sparkles className="h-2.5 w-2.5" />
                            <span className="capitalize">{isAISearch ? 'AI Search' : (item.data.type || item.type)}</span> • Added
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setAttachedItems(prev => prev.filter((_, i) => i !== idx))}
                          className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0 hover:bg-red-500/20 text-purple-700 hover:text-red-600"
                        >
                          <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Smart Suggestions */}
          {suggestions.length > 0 && showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3"
            >
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-400/10 rounded-xl border-2 border-blue-300/50 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      setShowSuggestions(false);
                      // Mark all current suggestions as shown
                      setShownSuggestions(prev => new Set([...prev, ...suggestions]));
                    }}
                    aria-label="Dismiss suggestions"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    AI Suggestions
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-sm h-auto py-2 px-3 whitespace-normal text-left bg-white/80 hover:bg-purple-100 border-purple-300 hover:border-purple-500 transition-all group leading-relaxed"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                        onClick={() => {
                          // Mark this suggestion as shown
                          setShownSuggestions(prev => new Set([...prev, suggestion]));
                          // AI suggestions use catalog position
                          handleChatQuery(suggestion, "catalog", "navigator");
                        }}
                      >
                        <span className="flex items-center gap-1.5">
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          {suggestion}
                        </span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Show AI Suggestions Button */}
          {suggestions.length > 0 && !showSuggestions && !isLoadingSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3"
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSuggestions(true)}
                className="w-full bg-white/80 hover:bg-purple-50 border-purple-300 hover:border-purple-500 text-purple-700 shadow-sm"
              >
                <Wand2 className="h-3.5 w-3.5 mr-2" />
                Show AI Suggestions ({suggestions.length})
              </Button>
            </motion.div>
          )}

          {/* Loading Suggestions */}
          {isLoadingSuggestions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3"
            >
              <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border-2 border-purple-300/50">
                <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </motion.div>
                  Generating smart suggestions...
                </p>
              </div>
            </motion.div>
          )}

          {/* Locked conversation banner */}
          {oldConversationLocked && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 p-2 bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">This conversation is locked (read-only)</span>
              <Button
                size="sm"
                variant="outline"
                onClick={startNewConversation}
                className="ml-auto text-xs h-7 bg-white dark:bg-gray-800"
              >
                <Plus className="h-3 w-3 mr-1" />
                New Chat
              </Button>
            </motion.div>
          )}

          <div className="flex items-center gap-2 md:gap-3">
            {/* History button */}
            <Button
              size="icon"
              variant="outline"
              onClick={openConversationsPanel}
              className="h-12 w-12 md:h-14 md:w-14 rounded-2xl border-2 border-purple-400/50 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 shadow-lg flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all hover:scale-105"
              title="Chat History"
            >
              <History className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            </Button>

            {/* Input container */}
            <div className="relative flex-1">
              {/* Search Category Tag inside input - Compact & Creative */}
              {searchCategory && !attachedItems.find(item => item.type === 'ai-search') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-2 left-2 z-10"
                >
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg shadow-lg border border-white/30">
                    <Search className="h-2.5 w-2.5 text-white flex-shrink-0" />
                    <span className="text-[10px] font-bold text-white max-w-[120px] truncate">
                      {searchCategory}
                    </span>
                    <button
                      onClick={clearSearchCategory}
                      className="h-4 w-4 rounded-md bg-white/20 hover:bg-white/35 flex items-center justify-center transition-all hover:scale-105 ml-0.5"
                      title="Clear"
                    >
                      <X className="h-2.5 w-2.5 text-white stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* AI Search Tag inside input - Beautiful Component */}
              {attachedItems.find(item => item.type === 'ai-search') && (
                <AISearchDisplay
                  category={attachedItems.find(item => item.type === 'ai-search')?.data.category || 'All Categories'}
                  onRemove={() => setAttachedItems(prev => prev.filter(item => item.type !== 'ai-search'))}
                />
              )}

              <Textarea
                ref={chatInputRef}
                placeholder={
                  oldConversationLocked
                    ? "This conversation is locked..."
                    : searchCategory || attachedItems.find(item => item.type === 'ai-search')
                    ? "Type your search query..."
                    : attachedItems.filter(item => item.type !== 'ai-search').length > 0
                    ? `Ask about ${attachedItems.filter(item => item.type !== 'ai-search').length} item${attachedItems.filter(item => item.type !== 'ai-search').length === 1 ? '' : 's'}...`
                    : "Ask me anything..."
                }
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !oldConversationLocked) {
                    e.preventDefault();
                    handleChatQuery();
                  }
                }}
                disabled={oldConversationLocked}
                className={`${
                  isInputFocused ? 'min-h-[80px] sm:min-h-[100px] md:min-h-[80px]' : 'min-h-[56px] sm:min-h-[60px] md:min-h-[80px]'
                } ${searchCategory || attachedItems.find(item => item.type === 'ai-search') ? 'pt-9 sm:pt-10' : 'pt-4'} pb-4 pr-14 pl-4 text-sm sm:text-base resize-none border-0 rounded-2xl shadow-lg focus:shadow-xl leading-relaxed transition-all bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm ${
                  oldConversationLocked ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' : ''
                }`}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '16px' }}
              />
              {/* Position indicator and Debug button - Desktop (above send button) */}
              <div className="hidden md:flex absolute right-3 bottom-16 items-center gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                  currentPosition === "checkout"
                    ? "bg-orange-500 text-white"
                    : currentPosition === "catalog"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}>
                  {currentPosition}
                </span>
                <button
                  onClick={() => setIsDebugModalOpen(true)}
                  className="h-5 w-5 rounded-full bg-gray-800/80 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                  title="View API Debug Info"
                >
                  <Info className="h-3 w-3" />
                </button>
              </div>
              <Button
                size="icon"
                onClick={() => handleChatQuery()}
                disabled={isLoading || !chatQuery.trim() || oldConversationLocked}
                className="absolute right-2 bottom-2 h-10 w-10 md:h-11 md:w-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 border border-white/20"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 md:h-5.5 md:w-5.5 animate-spin text-white" />
                ) : (
                  <Send className="h-5 w-5 md:h-5.5 md:w-5.5 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Fixed Side Panel on XL, Modal on smaller screens */}
      <AnimatePresence>
        {isDebugModalOpen && (
          <>
            {/* Backdrop - Only on smaller screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDebugModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] xl:hidden"
            />

            {/* Panel/Modal Container */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-2 md:inset-4 xl:inset-y-2 xl:left-2 xl:right-auto xl:w-[400px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">API Debug Inspector</h2>
                    <p className="text-[10px] text-white/70">Request & Response</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsDebugModalOpen(false);
                    setSelectedDebugMessage(null);
                  }}
                  className="h-7 w-7 rounded-lg text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Panel Content - Vertical Layout (Request then Response) */}
              <div className="flex-1 overflow-auto p-3">
                {(() => {
                  // Use selected message debug data or fall back to last request/response
                  const debugRequest = selectedDebugMessage?.debugData?.request || lastRequestData;
                  const debugResponse = selectedDebugMessage?.debugData?.response || lastResponseData;

                  if (!debugRequest && !debugResponse) {
                    return (
                      <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <Info className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">No API Calls Yet</h3>
                        <p className="text-xs text-gray-500 mt-1">Send a message to see details here.</p>
                      </div>
                    );
                  }

                  return (
                  <div className="space-y-4">
                    {/* Request Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Request</h3>
                        {debugRequest?.timestamp && (
                          <span className="text-[10px] text-gray-500 ml-auto">{new Date(debugRequest.timestamp).toLocaleTimeString()}</span>
                        )}
                      </div>

                      {debugRequest && (
                        <div className="space-y-2">
                          {/* Endpoint */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded">POST</span>
                              <span className="text-[10px] text-gray-500 truncate">{debugRequest.endpoint}</span>
                            </div>
                          </div>

                          {/* Query */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                            <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Query</h4>
                            <p className="text-xs text-gray-800 dark:text-gray-200">{debugRequest.payload?.query}</p>
                          </div>

                          {/* Position & Mode */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[9px] font-semibold text-gray-500 uppercase mb-0.5">Position</h4>
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                debugRequest.payload?.position === "checkout"
                                  ? "bg-orange-500 text-white"
                                  : debugRequest.payload?.position === "catalog"
                                  ? "bg-blue-500 text-white"
                                  : "bg-green-500 text-white"
                              }`}>
                                {debugRequest.payload?.position || "landing"}
                              </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[9px] font-semibold text-gray-500 uppercase mb-0.5">Mode</h4>
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                debugRequest.payload?.mode === "copilot"
                                  ? "bg-purple-500 text-white"
                                  : "bg-indigo-500 text-white"
                              }`}>
                                {debugRequest.payload?.mode || "navigator"}
                              </span>
                            </div>
                          </div>

                          {/* Attachments */}
                          {debugRequest.payload?.attachments && debugRequest.payload.attachments.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
                                Attachments ({debugRequest.payload.attachments.length})
                              </h4>
                              <div className="space-y-0.5 max-h-20 overflow-auto">
                                {debugRequest.payload.attachments.map((att: any, idx: number) => (
                                  <div key={idx} className="text-[10px] bg-white dark:bg-gray-700 rounded px-1.5 py-1">
                                    <div className="flex items-center gap-1">
                                      <span className="px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded text-[8px] font-medium">
                                        {att.vectorSpace}
                                      </span>
                                      <span className="text-gray-600 dark:text-gray-300 truncate text-[9px]">{att.id}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Full Payload - Collapsed by default */}
                          <details className="bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <summary className="px-2 py-1.5 cursor-pointer text-[10px] font-semibold text-gray-500 uppercase hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              Full Request Payload
                            </summary>
                            <pre className="px-2 pb-2 text-[8px] overflow-auto max-h-32 text-gray-700 dark:text-gray-300 font-mono">
                              {JSON.stringify(debugRequest.payload, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>

                    {/* Response Section */}
                    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Response</h3>
                        <div className="flex items-center gap-2 ml-auto">
                          {debugResponse?.durationMs != null && (
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                              debugResponse.durationMs < 1000 ? "bg-green-500/20 text-green-700 dark:text-green-300" :
                              debugResponse.durationMs < 3000 ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" :
                              "bg-red-500/20 text-red-700 dark:text-red-300"
                            }`}>
                              {debugResponse.durationMs < 1000
                                ? `${debugResponse.durationMs}ms`
                                : `${(debugResponse.durationMs / 1000).toFixed(2)}s`}
                            </span>
                          )}
                          {debugResponse?.timestamp && (
                            <span className="text-[10px] text-gray-500">{new Date(debugResponse.timestamp).toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>

                      {debugResponse && (() => {
                        const result = debugResponse.data?.result;
                        const resultData = result?.data;
                        const metadata = result?.metadata;

                        // RAG execution detection
                        const requiresRetrieval = resultData?.requiresRetrieval === true;
                        const retrievalSkipped = resultData?.metadata?.retrievalSkipped === true;
                        const retrievalSkipReason = resultData?.metadata?.retrievalSkipReason;
                        const hasRagResponse = resultData?.ragResponse != null;
                        const hasDocuments = resultData?.documents && resultData.documents.length > 0;
                        const ragExecuted = hasRagResponse || hasDocuments;

                        return (
                        <div className="space-y-2">
                          {/* Core Status Row */}
                          <div className="grid grid-cols-4 gap-1.5">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                result?.success ? "bg-green-500 text-white" : "bg-red-500 text-white"
                              }`}>
                                {result?.success ? "OK" : "ERR"}
                              </span>
                              <div className="text-[9px] text-gray-500 mt-0.5">Status</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                result?.type === "ACTION_EXECUTED" ? "bg-green-500 text-white" :
                                result?.type === "CONFIRMATION_REQUIRED" ? "bg-yellow-500 text-white" :
                                result?.type === "INFORMATION_PROVIDED" ? "bg-blue-500 text-white" :
                                result?.type === "ACTION_DENIED" ? "bg-red-500 text-white" :
                                "bg-gray-500 text-white"
                              }`}>
                                {result?.type?.replace(/_/g, ' ').substring(0, 12) || "N/A"}
                              </span>
                              <div className="text-[9px] text-gray-500 mt-0.5">Type</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{result?.errorCode || "—"}</span>
                              <div className="text-[9px] text-gray-500 mt-0.5">Error</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate block">{metadata?.requestId?.substring(0, 8) || "—"}</span>
                              <div className="text-[9px] text-gray-500 mt-0.5">ReqID</div>
                            </div>
                          </div>

                          {/* RAG Execution Status - Highlighted */}
                          <div className={`rounded-lg p-2 border ${
                            ragExecuted ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300 dark:border-emerald-700" :
                            retrievalSkipped ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700" :
                            requiresRetrieval ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-700" :
                            "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase ${
                                  ragExecuted ? "text-emerald-700 dark:text-emerald-300" :
                                  retrievalSkipped ? "text-amber-700 dark:text-amber-300" :
                                  "text-gray-600 dark:text-gray-400"
                                }`}>
                                  🔍 RAG Status
                                </span>
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                                  ragExecuted ? "bg-emerald-500 text-white" :
                                  retrievalSkipped ? "bg-amber-500 text-white" :
                                  requiresRetrieval ? "bg-blue-500 text-white" :
                                  "bg-gray-400 text-white"
                                }`}>
                                  {ragExecuted ? "EXECUTED" : retrievalSkipped ? "SKIPPED" : requiresRetrieval ? "INTENDED" : "NOT REQUIRED"}
                                </span>
                              </div>
                              <div className="flex gap-2 text-[9px]">
                                {requiresRetrieval && <span className="text-blue-600">retrieval:✓</span>}
                                {resultData?.requiresGeneration && <span className="text-purple-600">generation:✓</span>}
                                {retrievalSkipped && <span className="text-amber-600">skip:{retrievalSkipReason}</span>}
                              </div>
                            </div>
                            {hasRagResponse && (
                              <div className="mt-1.5 grid grid-cols-4 gap-1 text-[9px]">
                                <div><span className="text-gray-500">Query:</span> <span className="font-medium truncate block">{resultData.ragResponse.query?.substring(0, 20)}...</span></div>
                                <div><span className="text-gray-500">Entity:</span> <span className="font-medium">{resultData.ragResponse.entityType}</span></div>
                                <div><span className="text-gray-500">Docs:</span> <span className="font-medium">{resultData.ragResponse.usedDocuments || resultData.documents?.length || 0}</span></div>
                                <div><span className="text-gray-500">Time:</span> <span className="font-medium">{resultData.ragResponse.processingTimeMs}ms</span></div>
                              </div>
                            )}
                          </div>

                          {/* Orchestration Policy */}
                          {metadata?.orchestrationPolicy && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-indigo-200 dark:border-indigo-800">
                              <h4 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase mb-1 flex items-center gap-1">
                                <Sparkles className="h-2.5 w-2.5" /> Orchestration
                              </h4>
                              <div className="grid grid-cols-3 gap-1 text-[9px]">
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Profile</span>
                                  <span className="font-bold text-indigo-600">{metadata.orchestrationPolicy.profile}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Mode</span>
                                  <span className="font-bold text-purple-600">{metadata.orchestrationPolicy.mode}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Position</span>
                                  <span className="font-bold text-cyan-600">{metadata.orchestrationPolicy.position}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">InfoMode</span>
                                  <span className="font-bold text-teal-600">{metadata.orchestrationPolicy.informationModeEffective}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Source</span>
                                  <span className="font-bold text-gray-600">{metadata.orchestrationPolicy.modeSource}</span>
                                </div>
                                {metadata.orchestrationPolicy.advancedRagOverride && (
                                  <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                    <span className="text-gray-500">RAG Override</span>
                                    <span className="font-bold text-orange-600">✓</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Extraction Diagnostics with Strategy */}
                          {metadata?.extractionDiagnostics && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Extraction</h4>
                              <div className="grid grid-cols-4 gap-1 text-[9px] mb-1">
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.extractionPath}</div>
                                  <div className="text-gray-500">Path</div>
                                </div>
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.extractionAttempts}</div>
                                  <div className="text-gray-500">Attempts</div>
                                </div>
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.llmCalls}</div>
                                  <div className="text-gray-500">LLM</div>
                                </div>
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.attempts?.length || 0}</div>
                                  <div className="text-gray-500">Logged</div>
                                </div>
                              </div>
                              {metadata.extractionDiagnostics.attempts && metadata.extractionDiagnostics.attempts.length > 0 && (
                                <div className="space-y-0.5 max-h-16 overflow-auto">
                                  {metadata.extractionDiagnostics.attempts.map((attempt: any, idx: number) => (
                                    <div key={idx} className={`flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded ${
                                      attempt.success ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                                    }`}>
                                      <span className={`font-bold ${attempt.success ? "text-green-700" : "text-red-700"}`}>
                                        {attempt.success ? "✓" : "✗"}
                                      </span>
                                      <span className="font-medium text-indigo-600">{attempt.strategy}</span>
                                      <span className="text-gray-500">llm:{attempt.llmCalls}</span>
                                      {attempt.errorCategory && <span className="text-red-600">{attempt.errorCategory}</span>}
                                      {attempt.issueCodes && <span className="text-orange-600">[{attempt.issueCodes.join(',')}]</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Intent & Chat Metadata Row */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {/* Intent Metadata */}
                            {metadata?.intentMetadata && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Intent</h4>
                                <div className="text-[9px] space-y-0.5">
                                  {metadata.intentMetadata.fallback && (
                                    <div className="flex justify-between text-amber-600">
                                      <span>Fallback:</span>
                                      <span className="font-bold">✓</span>
                                    </div>
                                  )}
                                  {metadata.intentMetadata.confidence && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Confidence:</span>
                                      <span className="font-medium">{(metadata.intentMetadata.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Chat Metadata */}
                            {metadata?.chat && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Chat</h4>
                                <div className="grid grid-cols-2 gap-0.5 text-[9px]">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">History:</span>
                                    <span className="font-medium">{metadata.chat.historyChars || 0}ch</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Window:</span>
                                    <span className="font-medium">{metadata.chat.windowSize || 0}</span>
                                  </div>
                                  <div className="flex justify-between col-span-2">
                                    <span className="text-gray-500">Memory:</span>
                                    <span className="font-medium">{metadata.chat.memoryStrategy || "—"}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Attachments & Target Resolution Row */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {metadata?.attachments && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Attachments</h4>
                                <div className="grid grid-cols-2 gap-0.5 text-[9px]">
                                  <div className="flex justify-between"><span className="text-gray-500">Prov:</span><span className="font-medium">{metadata.attachments.providedCount}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Acc:</span><span className="font-medium">{metadata.attachments.acceptedCount}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Active:</span><span className="font-medium">{metadata.attachments.activeResolvedCount}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Invalid:</span><span className="font-medium">{metadata.attachments.invalidVectorSpacesCount || 0}</span></div>
                                </div>
                                {metadata.attachmentsPrompt && (
                                  <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700 text-[9px]">
                                    <span className="text-gray-500">Prompt: </span>
                                    <span className={`font-medium ${metadata.attachmentsPrompt.injected ? "text-green-600" : "text-gray-400"}`}>
                                      {metadata.attachmentsPrompt.injected ? `✓ ${metadata.attachmentsPrompt.attachmentsCount} att` : "—"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            {metadata?.targetResolution && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Target Resolution</h4>
                                <div className="text-[9px] space-y-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Source:</span>
                                    <span className="font-medium">{metadata.targetResolution.source}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Count:</span>
                                    <span className="font-medium">{metadata.targetResolution.count}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Vector Space Routing */}
                          {metadata?.vectorSpaceRouting && metadata.vectorSpaceRouting.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Vector Space Routing ({metadata.vectorSpaceRouting.length})</h4>
                              <div className="space-y-0.5 max-h-20 overflow-auto">
                                {metadata.vectorSpaceRouting.map((evt: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-1 text-[8px] bg-white dark:bg-gray-700 rounded px-1.5 py-0.5">
                                    <span className="text-purple-600 font-medium">{evt.strategy}</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="text-blue-600 font-bold">{evt.vectorSpace}</span>
                                    {evt.candidateSpaces && <span className="text-gray-500">[{evt.candidateSpaces.join(',')}]</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Execution (for ACTION types) */}
                          {(result?.type === "ACTION_EXECUTED" || result?.type === "CONFIRMATION_REQUIRED" || result?.type === "ACTION_DENIED") && (
                            <div className={`rounded-lg p-2 border ${
                              result?.type === "ACTION_EXECUTED" ? "bg-green-50 dark:bg-green-900/20 border-green-200" :
                              result?.type === "CONFIRMATION_REQUIRED" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200" :
                              "bg-red-50 dark:bg-red-900/20 border-red-200"
                            }`}>
                              <h4 className="text-[10px] font-bold uppercase mb-1">Action</h4>
                              <div className="grid grid-cols-3 gap-1 text-[9px]">
                                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{resultData?.action || "—"}</span></div>
                                <div><span className="text-gray-500">Confirm:</span> <span className="font-medium">{resultData?.confirmationRequired ? "Yes" : "No"}</span></div>
                                {resultData?.actionResult && (
                                  <div><span className="text-gray-500">Result:</span> <span className={`font-medium ${resultData.actionResult.success ? "text-green-600" : "text-red-600"}`}>{resultData.actionResult.success ? "OK" : resultData.actionResult.errorCode}</span></div>
                                )}
                              </div>
                              {resultData?.confirmationMessage && (
                                <div className="mt-1 text-[9px] text-gray-600 italic truncate">{resultData.confirmationMessage}</div>
                              )}
                            </div>
                          )}

                          {/* Compact Full Response with Expand */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-[10px] font-bold text-gray-500 uppercase">Raw Result JSON</span>
                              <button
                                onClick={() => setIsJsonPanelExpanded(true)}
                                className="flex items-center gap-1 text-[9px] text-purple-600 hover:text-purple-700 font-medium"
                              >
                                <Maximize2 className="h-3 w-3" />
                                Expand
                              </button>
                            </div>
                            <pre className="px-2 py-1.5 text-[8px] overflow-auto max-h-24 text-gray-600 dark:text-gray-400 font-mono">
                              {JSON.stringify(result, null, 2)}
                            </pre>
                          </div>
                        </div>
                        );
                      })()}
                    </div>
                  </div>
                  );
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Expanded JSON Panel Modal */}
      <AnimatePresence>
        {isJsonPanelExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJsonPanelExpanded(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-8 lg:inset-12 bg-gray-900 rounded-xl shadow-2xl z-[111] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-bold text-white">Raw Result JSON</span>
                  <span className="text-xs text-gray-400">Full Response Data</span>
                </div>
                <button
                  onClick={() => setIsJsonPanelExpanded(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
              {/* JSON Content */}
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                  {(() => {
                    const debugResponse = selectedDebugMessage?.debugData?.response || lastResponseData;
                    return JSON.stringify(debugResponse?.data?.result, null, 2);
                  })()}
                </pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Conversations History Panel */}
      <AnimatePresence>
        {isConversationsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConversationsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-2 left-2 w-[320px] md:w-[380px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-500">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <History className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Chat History</h2>
                    <p className="text-[10px] text-white/70">{conversations.length} conversations</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={startNewConversation}
                    className="h-8 text-white hover:bg-white/20 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsConversationsOpen(false)}
                    className="h-7 w-7 rounded-lg text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-auto p-3">
                {isLoadingConversations ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
                    <p className="text-sm text-gray-500">Loading conversations...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No conversations yet</p>
                    <p className="text-xs text-gray-500 mt-1">Start chatting to create your first conversation</p>
                    <Button
                      size="sm"
                      onClick={startNewConversation}
                      className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Start New Chat
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conv) => {
                      const isActive = currentConversationId === conv.id;
                      const isLocked = conv.status === "LOCKED" || conv.status === "CLOSED";
                      const date = new Date(conv.lastInteractionAt || conv.createdAt);
                      const formattedDate = date.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => openConversation(conv.id)}
                          className={`group relative p-3 rounded-xl cursor-pointer transition-all border-2 ${
                            isActive
                              ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400'
                              : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isActive ? 'bg-purple-500 text-white' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600'
                            }`}>
                              {isLocked ? (
                                <Lock className="h-4 w-4" />
                              ) : (
                                <MessageSquare className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {conv.title || `Conversation ${conv.id.slice(0, 8)}...`}
                                </p>
                                {isLocked && (
                                  <Badge variant="outline" className="text-[9px] bg-amber-100 border-amber-300 text-amber-700 px-1.5 py-0">
                                    Locked
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {formattedDate}
                                </span>
                                {conv.turnsCount && (
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                    • {conv.turnsCount} messages
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Delete button */}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => handleDeleteConversation(conv.id, e)}
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                              title="Delete conversation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-[10px] text-gray-500 text-center">
                  User: demo-user • Session: demo-session
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MaxMode;
