import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import * as api from "../utils/api";
import type { ChatPosition, ChatMode } from "../utils/api";
import { DEFAULT_USER_ID, DEFAULT_SESSION_ID } from "../constants";
import type { ChatMessage, Product, Review, Coupon, Conversation } from "../types";

// Helper to determine position based on context
function determinePosition(
  hasAttachments: boolean,
  isFirstQuery: boolean,
  isSuggestionQuery: boolean
): { position: ChatPosition; mode: ChatMode } {
  // If user has attached products, they're in checkout/action mode
  if (hasAttachments) {
    return { position: "checkout", mode: "copilot" };
  }

  // If using AI suggestions, they're browsing catalog
  if (isSuggestionQuery) {
    return { position: "catalog", mode: "navigator" };
  }

  // First query defaults to landing
  if (isFirstQuery) {
    return { position: "landing", mode: "navigator" };
  }

  // Default to catalog for normal text queries
  return { position: "catalog", mode: "navigator" };
}

export function useChat() {
  const { toast } = useToast();

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatQuery, setChatQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // Position state for routing
  const [currentPosition, setCurrentPosition] = useState<ChatPosition>("landing");
  const [currentMode, setCurrentMode] = useState<ChatMode>("navigator");

  // Attachments
  const [attachedProducts, setAttachedProducts] = useState<Product[]>([]);
  const [attachedReviews, setAttachedReviews] = useState<Review[]>([]);
  const [attachedCoupons, setAttachedCoupons] = useState<Coupon[]>([]);

  // Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Track if query came from suggestion
  const isSuggestionQueryRef = useRef(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const isUserFocusRef = useRef(false);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await api.fetchConversations(DEFAULT_USER_ID);
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, []);

  // Fetch suggestions based on all attachments (products, reviews, coupons)
  const fetchSuggestions = useCallback(async (
    products?: Product[],
    reviews?: Review[],
    coupons?: Coupon[]
  ) => {
    const productsToUse = products || attachedProducts;
    const reviewsToUse = reviews || attachedReviews;
    const couponsToUse = coupons || attachedCoupons;

    // Need at least one attachment to fetch suggestions
    if (productsToUse.length === 0 && reviewsToUse.length === 0 && couponsToUse.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const data = await api.fetchSuggestions(
        DEFAULT_USER_ID,
        DEFAULT_SESSION_ID,
        productsToUse,
        reviewsToUse,
        couponsToUse
      );
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [attachedProducts, attachedReviews, attachedCoupons]);

  // Handle chat query
  const handleChatQuery = useCallback(async (queryOverride?: string, fromSuggestion?: boolean) => {
    const queryToUse = queryOverride || chatQuery;
    if (!queryToUse.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: queryToUse,
      timestamp: new Date().toISOString(),
      attachedProduct: attachedProducts.length > 0 ? attachedProducts[0] : undefined,
      attachedProducts: attachedProducts.length > 0 ? [...attachedProducts] : undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentAttachedProducts = attachedProducts;
    const currentAttachedReviews = attachedReviews;
    const currentAttachedCoupons = attachedCoupons;
    setChatQuery("");
    setIsLoading(true);
    setIsChatExpanded(true);

    // Determine position and mode based on context
    const hasAttachments = currentAttachedProducts.length > 0 || currentAttachedReviews.length > 0 || currentAttachedCoupons.length > 0;
    const isFirstQuery = chatMessages.length === 0;
    const isSuggestionQuery = fromSuggestion || false;

    const { position, mode } = determinePosition(hasAttachments, isFirstQuery, isSuggestionQuery);
    setCurrentPosition(position);
    setCurrentMode(mode);

    // Remove attachments and suggestions after sending
    setAttachedProducts([]);
    setAttachedReviews([]);
    setAttachedCoupons([]);
    setSuggestions([]);

    try {
      // Build attachments with vector space format - include FULL data
      const attachmentsWithMetadata = [
        ...currentAttachedProducts.map((p) => ({
          id: p.id,
          vectorSpace: "product",
          contentSnippet: p.description || p.name || "",
          metadata: {
            // Include all product fields
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
        ...currentAttachedReviews.map((r) => ({
          id: r.id,
          vectorSpace: "review",
          contentSnippet: r.comment || "",
          metadata: {
            // Include all review fields
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
        ...currentAttachedCoupons.map((c) => ({
          id: c.id,
          vectorSpace: "coupon",
          contentSnippet: c.description || c.code || "",
          metadata: {
            // Include all coupon fields
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

      // Get active attachment IDs
      const activeAttachmentIds = attachmentsWithMetadata.map(a => a.id);

      const data = await api.sendChatQuery(
        queryToUse,
        DEFAULT_USER_ID,
        DEFAULT_SESSION_ID,
        currentConversationId || undefined,
        attachmentsWithMetadata.length > 0 ? attachmentsWithMetadata : undefined,
        position,
        mode,
        activeAttachmentIds.length > 0 ? activeAttachmentIds : undefined
      );

      // Store conversation ID for future messages
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      // Extract message from sanitizedPayload if available
      let messageContent = "";
      let result = undefined;
      let resultType = undefined;

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
        orchestration: data.orchestration
          ? {
              intent: data.orchestration.intent || "general_query",
              confidence: data.orchestration.confidence || 0.9,
              actions: data.orchestration.actions || ["process_query"],
            }
          : undefined,
        result: result,
        resultType: resultType,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [chatQuery, attachedProducts, attachedReviews, attachedCoupons, currentConversationId, toast]);

  // Handle confirmation action
  const handleConfirmationAction = useCallback(
    async (action: "confirm" | "deny", messageData?: any) => {
      const confirmationQuery =
        action === "confirm"
          ? "Yes, please proceed with the action."
          : "No, I do not want to proceed.";

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: confirmationQuery,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const data = await api.sendChatQuery(
          confirmationQuery,
          DEFAULT_USER_ID,
          DEFAULT_SESSION_ID,
          currentConversationId || undefined,
          attachedProducts.length > 0
            ? attachedProducts.map((p) => ({
                type: "product",
                metadata: { id: p.id, sku: p.sku, category: p.category, imageUrl: p.imageUrl },
              }))
            : undefined
        );

        let messageContent = "";
        let result = undefined;
        let resultType = undefined;

        if (data.result && data.result.sanitizedPayload) {
          messageContent = data.result.sanitizedPayload.message || "Action processed.";
          result = data.result;
          resultType = data.result.type;
        } else {
          messageContent = data.response || data.message || "Action processed.";
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
        toast({
          title: "Error",
          description: "Failed to process confirmation.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [attachedProducts, currentConversationId, toast]
  );

  // Fetch suggestions for specific attachments (products, reviews, coupons)
  const fetchSuggestionsForAttachments = useCallback(async (
    products: Product[],
    reviews?: Review[],
    coupons?: Coupon[]
  ) => {
    const reviewsToUse = reviews || attachedReviews;
    const couponsToUse = coupons || attachedCoupons;

    // Need at least one attachment to fetch suggestions
    if (products.length === 0 && reviewsToUse.length === 0 && couponsToUse.length === 0) {
      setSuggestions([]);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const data = await api.fetchSuggestions(
        DEFAULT_USER_ID,
        DEFAULT_SESSION_ID,
        products,
        reviewsToUse,
        couponsToUse
      );
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [attachedReviews, attachedCoupons]);

  // Attachment handlers
  const handleAttachProduct = useCallback((product: Product) => {
    // Check if already attached and compute new list
    const isAlreadyAttached = attachedProducts.find((p) => p.id === product.id);
    if (isAlreadyAttached) return;

    const newProducts = [...attachedProducts, product];
    setAttachedProducts(newProducts);
    setIsChatExpanded(true);

    // Set position to checkout when product is attached
    setCurrentPosition("checkout");
    setCurrentMode("copilot");

    // Fetch suggestions for all attachments
    fetchSuggestionsForAttachments(newProducts);
  }, [attachedProducts, fetchSuggestionsForAttachments]);

  const handleRemoveAttachment = useCallback((productId: string) => {
    const newProducts = attachedProducts.filter((p) => p.id !== productId);
    setAttachedProducts(newProducts);
    // Update suggestions for remaining attachments
    fetchSuggestionsForAttachments(newProducts);

    // Reset position to catalog if no more attachments
    if (newProducts.length === 0 && attachedReviews.length === 0 && attachedCoupons.length === 0) {
      setCurrentPosition("catalog");
      setCurrentMode("navigator");
    }
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments]);

  const handleAttachReview = useCallback((review: Review) => {
    const isAlreadyAttached = attachedReviews.find((r) => r.id === review.id);
    if (isAlreadyAttached) return;

    const newReviews = [...attachedReviews, review];
    setAttachedReviews(newReviews);
    setIsChatExpanded(true);
    // Set position to checkout when review is attached
    setCurrentPosition("checkout");
    setCurrentMode("copilot");
    // Fetch suggestions with the new reviews
    fetchSuggestionsForAttachments(attachedProducts, newReviews);
  }, [attachedProducts, attachedReviews, fetchSuggestionsForAttachments]);

  const handleRemoveAttachedReview = useCallback((reviewId: string) => {
    const newReviews = attachedReviews.filter((r) => r.id !== reviewId);
    setAttachedReviews(newReviews);
    // Update suggestions for remaining attachments
    fetchSuggestionsForAttachments(attachedProducts, newReviews);
    // Reset position if no more attachments
    if (attachedProducts.length === 0 && newReviews.length === 0 && attachedCoupons.length === 0) {
      setCurrentPosition("catalog");
      setCurrentMode("navigator");
    }
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments]);

  const handleAttachCoupon = useCallback((coupon: Coupon) => {
    const isAlreadyAttached = attachedCoupons.find((c) => c.id === coupon.id);
    if (isAlreadyAttached) return;

    const newCoupons = [...attachedCoupons, coupon];
    setAttachedCoupons(newCoupons);
    setIsChatExpanded(true);
    // Set position to checkout when coupon is attached
    setCurrentPosition("checkout");
    setCurrentMode("copilot");
    // Fetch suggestions with the new coupons
    fetchSuggestionsForAttachments(attachedProducts, attachedReviews, newCoupons);
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments]);

  const handleRemoveAttachedCoupon = useCallback((couponId: string) => {
    const newCoupons = attachedCoupons.filter((c) => c.id !== couponId);
    setAttachedCoupons(newCoupons);
    // Update suggestions for remaining attachments
    fetchSuggestionsForAttachments(attachedProducts, attachedReviews, newCoupons);
    // Reset position if no more attachments
    if (attachedProducts.length === 0 && attachedReviews.length === 0 && newCoupons.length === 0) {
      setCurrentPosition("catalog");
      setCurrentMode("navigator");
    }
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Set position manually (for use by UI actions)
  const setPosition = useCallback((position: ChatPosition, mode?: ChatMode) => {
    setCurrentPosition(position);
    if (mode) {
      setCurrentMode(mode);
    } else {
      // Auto-determine mode based on position
      setCurrentMode(position === "checkout" ? "copilot" : "navigator");
    }
  }, []);

  return {
    // State
    chatMessages,
    chatQuery,
    conversations,
    currentConversationId,
    isLoading,
    isChatExpanded,
    attachedProducts,
    attachedReviews,
    attachedCoupons,
    suggestions,
    isLoadingSuggestions,
    currentPosition,
    currentMode,

    // Refs
    messagesEndRef,
    chatInputRef,
    isUserFocusRef,

    // Setters
    setChatQuery,
    setIsChatExpanded,
    setPosition,

    // Actions
    loadConversations,
    fetchSuggestions,
    handleChatQuery,
    handleConfirmationAction,
    handleAttachProduct,
    handleRemoveAttachment,
    handleAttachReview,
    handleRemoveAttachedReview,
    handleAttachCoupon,
    handleRemoveAttachedCoupon,
    scrollToBottom,
  };
}
