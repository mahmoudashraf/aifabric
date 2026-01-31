import { useCallback, useRef, useState } from "react";

import { Ban, Bot, CheckCircle2, HelpCircle, Info, XCircle } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { postChatQuery } from "../api/chat";
import { AI_SEARCH_CATEGORIES, BROWSE_PRODUCT_CATEGORIES, QUICK_ACTIONS, SEARCH_CATEGORIES } from "../constants";
import type { ChatMessage, ChatResult, Document, ResultType } from "../types";
import { normalizeMessageContent } from "../utils";
import { useAttachmentsController } from "./useAttachmentsController";
import { useCartController } from "./useCartController";
import { useChatFlow } from "./useChatFlow";
import { useConversationsController } from "./useConversationsController";
import { useMaxModePersistence } from "./useMaxModePersistence";
import { useMaxModeViewSync } from "./useMaxModeViewSync";
import { useSuggestionsController } from "./useSuggestionsController";

export function useMaxModeController({ isOpen }: { isOpen: boolean }) {
  const { toast } = useToast();

  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [attachedItems, setAttachedItems] = useState<Array<{ type: string; data: any }>>([]);
  const [contextDocuments, setContextDocuments] = useState<Document[]>([]);
  const [focusedMessageId, setFocusedMessageId] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [expandedActions, setExpandedActions] = useState<{ [key: string]: number }>({});
  const [collectingItem, setCollectingItem] = useState<{ title: string; type: string } | null>(null);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<{ [key: string]: 'pending' | 'confirmed' | 'rejected' }>({});
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isFloatingMenuCollapsed, setIsFloatingMenuCollapsed] = useState(false);
  const [userId] = useState<string>("demo-user-" + Math.random().toString(36).substr(2, 9));
  const [newDocuments, setNewDocuments] = useState<Document[]>([]);
  const [isNewDocsPreviewOpen, setIsNewDocsPreviewOpen] = useState(false);
  const [viewedDocumentIds, setViewedDocumentIds] = useState<Set<string>>(new Set());
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
  // Query expansion state for RAG debug
  // Search category submenu state
  const [isSearchCategoryOpen, setIsSearchCategoryOpen] = useState(false);
  const [isBrowseProductsOpen, setIsBrowseProductsOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<string | null>(null);

  const {
    suggestions,
    setSuggestions,
    isLoadingSuggestions,
    showSuggestions,
    setShowSuggestions,
    shownSuggestions,
    setShownSuggestions,
  } = useSuggestionsController({ attachedItems });

  const {
    cartData,
    isCartView,
    selectedProduct,
    addToCart,
    fetchCart,
    removeFromCart,
    openCart,
    closeCart,
    openProductDetails,
    closeProductDetails,
  } = useCartController({
    userId,
    toast,
    setIsBottomSheetOpen,
    setIsPanelVisible,
  });

  const {
    isConversationsOpen,
    setIsConversationsOpen,
    conversations,
    isLoadingConversations,
    isViewingOldConversation,
    oldConversationLocked,
    loadConversations,
    openConversation,
    handleDeleteConversation,
    startNewConversation,
    openConversationsPanel,
  } = useConversationsController({
    isOpen,
    chatMessagesLength: chatMessages.length,
    currentConversationId,
    setCurrentConversationId,
    setChatMessages,
    setIsLoading,
    setAttachedItems,
    setSuggestions,
    setContextDocuments,
    toast,
  });

  const { handleChatQuery } = useChatFlow({
    chatQuery,
    setChatQuery,
    chatMessagesLength: chatMessages.length,
    setChatMessages,
    attachedItems,
    searchCategory,
    currentConversationId,
    setCurrentConversationId,
    setIsLoading,
    setSuggestions,
    setCurrentPosition,
    setCurrentMode,
    setLastRequestData,
    setLastResponseData,
    setSelectedDebugMessage,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const contextPanelRef = useRef<HTMLDivElement>(null);
  const contextPanelEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const aiSearchRowRef = useRef<HTMLDivElement>(null);
  const aiSearchButtonRef = useRef<HTMLDivElement>(null);

  useMaxModePersistence({
    chatMessages,
    setChatMessages,
    attachedItems,
    setAttachedItems,
    currentPosition,
    setCurrentPosition,
    currentMode,
    setCurrentMode,
    currentConversationId,
    setCurrentConversationId,
    contextDocuments,
    setContextDocuments,
  });

  useMaxModeViewSync({
    isOpen,
    chatMessages,
    setChatMessages,
    latestMessageRef,
    chatInputRef,
    isAISearchOpen,
    setIsAISearchOpen,
    aiSearchRowRef,
    aiSearchButtonRef,
    isPanelVisible,
    contextPanelRef,
    contextPanelEndRef,
    setFocusedMessageId,
    setContextDocuments,
    setNewDocuments,
    setIsNewDocsPreviewOpen,
    setViewedDocumentIds,
  });

  const {
    isItemAttached,
    handleReattachItem,
    handleAttachActionResultItem,
    handleAttachDocument,
    removeNonAiAttachmentByIndex,
    removeAiSearchAttachment,
  } = useAttachmentsController({
    attachedItems,
    setAttachedItems,
    setCollectingItem,
    setCurrentPosition,
    setCurrentMode,
    chatInputRef,
    toast,
  });

  const quickActions = QUICK_ACTIONS;
  const searchCategories = SEARCH_CATEGORIES;
  const aiSearchCategories = AI_SEARCH_CATEGORIES;
  const browseProductCategories = BROWSE_PRODUCT_CATEGORIES;

  const openDebugInspector = useCallback((message?: ChatMessage) => {
    if (message) setSelectedDebugMessage(message);
    setIsDebugModalOpen(true);
  }, []);

  const closeDebugInspector = useCallback(() => {
    setIsDebugModalOpen(false);
    setSelectedDebugMessage(null);
  }, []);

  const resendChatQuery = useCallback(
    async (fullMessage: string) => {
      setChatQuery(fullMessage);
      await handleChatQuery(fullMessage);
    },
    [handleChatQuery],
  );

  const reattachItemWithToast = useCallback(
    (item: { type: string; data: any }, isAlreadyAttached: boolean) => {
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
    },
    [handleReattachItem, toast],
  );

  const openSourcesMobile = useCallback((messageId: string) => {
    setIsBottomSheetOpen(true);
    setFocusedMessageId(messageId);
  }, []);

  const openSourcesDesktop = useCallback((messageId: string) => {
    setIsPanelVisible(true);
    setFocusedMessageId(messageId);
  }, []);

  const expandActionResults = useCallback((messageId: string, nextCount: number) => {
    setExpandedActions((prev) => ({
      ...prev,
      [messageId]: nextCount,
    }));
  }, []);

  const dismissSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setShownSuggestions((prev) => new Set([...prev, ...suggestions]));
  }, [suggestions]);

  const selectSuggestion = useCallback(
    async (suggestion: string) => {
      setShownSuggestions((prev) => new Set([...prev, suggestion]));
      await handleChatQuery(suggestion, "catalog", "navigator");
    },
    [handleChatQuery],
  );

  const attachCartToChat = useCallback(() => {
    if (!cartData || !cartData.items || cartData.items.length === 0) return;
    const cartAttachment = {
      type: "cart",
      data: {
        title: `Cart (${cartData.items.length} items - $${cartData.total?.toFixed(2)})`,
        items: cartData.items,
        subtotal: cartData.subtotal,
        discount: cartData.discount,
        total: cartData.total,
        couponCode: cartData.couponCode,
      },
    };
    setAttachedItems((prev) => [...prev, cartAttachment]);
    setCurrentPosition("checkout");
    setCurrentMode("copilot");
    toast({
      title: "💬 Cart Added to Chat",
      description: "Your cart details are now part of the conversation",
    });
  }, [cartData, toast]);

  const proceedToCheckoutFromCart = useCallback(
    async ({ closeCartAfter }: { closeCartAfter: boolean }) => {
      setChatQuery("Checkout my cart");
      await handleChatQuery("Checkout my cart");
      if (closeCartAfter) closeCart();
    },
    [handleChatQuery, closeCart],
  );

  const browseProductsFromCart = useCallback(async () => {
    closeCart();
    setChatQuery("Show me available products");
    await handleChatQuery("Show me available products");
  }, [handleChatQuery, closeCart]);

  const handleQuickAction = (query: string, position?: "landing" | "catalog" | "checkout", mode?: "navigator" | "copilot") => {
    setChatQuery(query);
    setTimeout(() => handleChatQuery(query, position, mode), 100);
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
	      const { data } = await postChatQuery({
	        query: confirmationQuery,
	        userId: "demo-user",
	        sessionId: "demo-session",
	        conversationId: currentConversationId || undefined,
	        attachments: attachedItems,
	      });

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
  return {
    toast,
    // core ui/state
    chatQuery,
    setChatQuery,
    chatMessages,
    setChatMessages,
    isLoading,
    setIsLoading,
    currentConversationId,
    setCurrentConversationId,
    attachedItems,
    setAttachedItems,
    contextDocuments,
    setContextDocuments,
    focusedMessageId,
    setFocusedMessageId,
    isPanelVisible,
    setIsPanelVisible,
    expandedActions,
    setExpandedActions,
    suggestions,
    setSuggestions,
    isLoadingSuggestions,
    showSuggestions,
    setShowSuggestions,
    shownSuggestions,
    setShownSuggestions,
    collectingItem,
    setCollectingItem,
    isQuickActionsOpen,
    setIsQuickActionsOpen,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    isInputFocused,
    setIsInputFocused,
    isSearchCategoryOpen,
    setIsSearchCategoryOpen,
    searchCategory,
    setSearchCategory,
    currentPosition,
    setCurrentPosition,
    currentMode,
    setCurrentMode,
    isDebugModalOpen,
    setIsDebugModalOpen,
    selectedDebugMessage,
    setSelectedDebugMessage,
    lastRequestData,
    setLastRequestData,
    lastResponseData,
    setLastResponseData,
    isConversationsOpen,
    setIsConversationsOpen,
    conversations,
    isLoadingConversations,
    isViewingOldConversation,
    oldConversationLocked,
    confirmationStatus,
    setConfirmationStatus,
    selectedProduct,
    isCartView,
    cartData,
    viewedDocumentIds,
    setViewedDocumentIds,
    newDocuments,
    setNewDocuments,
    isNewDocsPreviewOpen,
    setIsNewDocsPreviewOpen,
    isAISearchOpen,
    setIsAISearchOpen,
    isFloatingMenuCollapsed,
    setIsFloatingMenuCollapsed,
    isBrowseProductsOpen,
    setIsBrowseProductsOpen,
    // refs
    chatInputRef,
    latestMessageRef,
    messagesEndRef,
    contextPanelRef,
    contextPanelEndRef,
    aiSearchRowRef,
    aiSearchButtonRef,
    // derived constants
    quickActions,
    searchCategories,
    aiSearchCategories,
    browseProductCategories,
    // helpers/handlers
    getResultStyles,
    isItemAttached,
    handleReattachItem,
    handleAttachActionResultItem,
    handleSelectSearchCategory,
    clearSearchCategory,
    loadConversations,
    openConversation,
    handleDeleteConversation,
    startNewConversation,
    openConversationsPanel,
    handleQuickAction,
    handleChatQuery,
    handleConfirmation,
    addToCart,
    fetchCart,
    removeFromCart,
    openCart,
    closeCart,
    openProductDetails,
    closeProductDetails,
    handleAttachDocument,
    handleAISearchCategory,
    handleOpenBottomSheet,
    handleCloseNewDocsPreview,
    showSampleDocuments,
    // view helpers (reduce UI wiring in MaxModeView)
    openDebugInspector,
    closeDebugInspector,
    resendChatQuery,
    reattachItemWithToast,
    openSourcesMobile,
    openSourcesDesktop,
    expandActionResults,
    removeNonAiAttachmentByIndex,
    removeAiSearchAttachment,
    dismissSuggestions,
    selectSuggestion,
    attachCartToChat,
    proceedToCheckoutFromCart,
    browseProductsFromCart,
  } as const;
}

export type MaxModeController = ReturnType<typeof useMaxModeController>;
