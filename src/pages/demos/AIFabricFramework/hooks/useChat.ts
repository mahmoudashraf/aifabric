import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import * as api from "../utils/api";
import { DEFAULT_USER_ID, DEFAULT_SESSION_ID } from "../constants";
import type { ChatMessage, Product, Review, Coupon, Conversation } from "../types";

export function useChat() {
  const { toast } = useToast();

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatQuery, setChatQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // Attachments
  const [attachedProducts, setAttachedProducts] = useState<Product[]>([]);
  const [attachedReviews, setAttachedReviews] = useState<Review[]>([]);
  const [attachedCoupons, setAttachedCoupons] = useState<Coupon[]>([]);

  // Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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

  // Fetch suggestions based on attached products
  const fetchSuggestions = useCallback(async (products?: Product[]) => {
    const productsToUse = products || attachedProducts;
    if (productsToUse.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const data = await api.fetchSuggestions(productsToUse);
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [attachedProducts]);

  // Handle chat query
  const handleChatQuery = useCallback(async (queryOverride?: string) => {
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

    // Remove attachments and suggestions after sending
    setAttachedProducts([]);
    setAttachedReviews([]);
    setAttachedCoupons([]);
    setSuggestions([]);

    try {
      // Build attachments with only metadata
      const attachmentsWithMetadata = [
        ...currentAttachedProducts.map((p) => ({
          type: "product",
          metadata: {
            id: p.id,
            sku: p.sku,
            category: p.category,
            imageUrl: p.imageUrl,
          },
        })),
        ...currentAttachedReviews.map((r) => ({
          type: "review",
          metadata: {
            id: r.id,
            productId: r.productId,
            rating: r.rating,
          },
        })),
        ...currentAttachedCoupons.map((c) => ({
          type: "coupon",
          metadata: {
            id: c.id,
            code: c.code,
            discountType: c.discountType,
            discountValue: c.discountValue,
          },
        })),
      ];

      // Build query with context instruction if attachments exist
      const queryWithContext =
        attachmentsWithMetadata.length > 0
          ? `[Consider this context as the main context. Use its metadata for action params and for building optimized query.]\n\n${queryToUse}`
          : queryToUse;

      const data = await api.sendChatQuery(
        queryWithContext,
        DEFAULT_USER_ID,
        DEFAULT_SESSION_ID,
        currentConversationId || undefined,
        attachmentsWithMetadata.length > 0 ? attachmentsWithMetadata : undefined
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

  // Fetch suggestions for specific products
  const fetchSuggestionsForProducts = useCallback(async (products: Product[]) => {
    if (products.length === 0) {
      setSuggestions([]);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const data = await api.fetchSuggestions(products);
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Attachment handlers
  const handleAttachProduct = useCallback((product: Product) => {
    // Check if already attached and compute new list
    const isAlreadyAttached = attachedProducts.find((p) => p.id === product.id);
    if (isAlreadyAttached) return;

    const newProducts = [...attachedProducts, product];
    setAttachedProducts(newProducts);
    setIsChatExpanded(true);

    // Fetch suggestions for the new products list
    fetchSuggestionsForProducts(newProducts);
  }, [attachedProducts, fetchSuggestionsForProducts]);

  const handleRemoveAttachment = useCallback((productId: string) => {
    const newProducts = attachedProducts.filter((p) => p.id !== productId);
    setAttachedProducts(newProducts);
    // Update suggestions for remaining products
    fetchSuggestionsForProducts(newProducts);
  }, [attachedProducts, fetchSuggestionsForProducts]);

  const handleAttachReview = useCallback((review: Review) => {
    setAttachedReviews((prev) => {
      if (prev.find((r) => r.id === review.id)) return prev;
      return [...prev, review];
    });
    setIsChatExpanded(true);
  }, []);

  const handleRemoveAttachedReview = useCallback((reviewId: string) => {
    setAttachedReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, []);

  const handleAttachCoupon = useCallback((coupon: Coupon) => {
    setAttachedCoupons((prev) => {
      if (prev.find((c) => c.id === coupon.id)) return prev;
      return [...prev, coupon];
    });
    setIsChatExpanded(true);
  }, []);

  const handleRemoveAttachedCoupon = useCallback((couponId: string) => {
    setAttachedCoupons((prev) => prev.filter((c) => c.id !== couponId));
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    // Refs
    messagesEndRef,
    chatInputRef,
    isUserFocusRef,

    // Setters
    setChatQuery,
    setIsChatExpanded,

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
