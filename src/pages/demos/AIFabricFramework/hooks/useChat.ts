import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMaxModeContextOptional } from "@/contexts/MaxModeContext";
import * as api from "../utils/api";
import { getShoppingDemoIdentity } from "../utils/demoIdentity";
import type { ChatMessage, Product, Review, Coupon, Conversation, ActionTag, ChatPosition, ChatMode, Document } from "../types";

interface ChatQueryOptions {
  fromSuggestion?: boolean;
  position?: ChatPosition;
  mode?: ChatMode;
}

export function useChat() {
  const { toast } = useToast();
  const maxModeContext = useMaxModeContextOptional();

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

  // Action Tags
  const [activeTag, setActiveTag] = useState<ActionTag | null>(null);

  // Track if query came from suggestion
  const isSuggestionQueryRef = useRef(false);

  // Refs
  const identityRef = useRef(getShoppingDemoIdentity());
  const userId = identityRef.current.userId;
  const sessionId = identityRef.current.sessionId;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const isUserFocusRef = useRef(false);
  const hasLoadedFromMaxMode = useRef(false);

  // Sync attachments from MaxMode state (when returning from MaxMode to demo page)
  useEffect(() => {
    if (!maxModeContext || hasLoadedFromMaxMode.current) return;
    hasLoadedFromMaxMode.current = true;

    const maxModeAttachments = maxModeContext.maxModeState.attachedItems;
    if (maxModeAttachments && maxModeAttachments.length > 0) {
      const products: Product[] = [];
      const reviews: Review[] = [];
      const coupons: Coupon[] = [];

      maxModeAttachments.forEach(item => {
        if (item.type === 'product') {
          products.push(item.data as Product);
        } else if (item.type === 'review') {
          reviews.push(item.data as Review);
        } else if (item.type === 'coupon') {
          coupons.push(item.data as Coupon);
        }
      });

      if (products.length > 0) {
        setAttachedProducts(products);
      }
      if (reviews.length > 0) {
        setAttachedReviews(reviews);
      }
      if (coupons.length > 0) {
        setAttachedCoupons(coupons);
      }

      // Update position if we have attachments
      if (coupons.length > 0) {
        setCurrentPosition("cart");
        setCurrentMode("navigator");
      } else if (products.length > 0 || reviews.length > 0) {
        setCurrentPosition("product_detail");
        setCurrentMode("navigator");
      }
    }
  }, [maxModeContext]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await api.fetchConversations(userId);
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, [userId]);

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
        userId,
        sessionId,
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
  }, [attachedProducts, attachedReviews, attachedCoupons, sessionId, userId]);

  // Helper to extract documents from API response
  const extractDocuments = useCallback((data: any, messageId: string): Document[] => {
    const docs: Document[] = [];
    const seenIds = new Set<string>();

    const addDoc = (raw: any) => {
      if (!raw || typeof raw !== "object") return;
      const id = raw.id || raw._id || `doc-${seenIds.size}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);
      docs.push({
        id,
        title: raw.title || raw.name || `${raw.type || "document"} ${id}`,
        content: raw.content || raw.text || raw.contentSnippet || "",
        type: raw.type || raw.vectorSpace || "document",
        metadata: raw.metadata || {},
        messageId,
        similarity: raw.similarity,
        score: raw.score,
      });
    };

    const addDocs = (items: unknown, fromSuggestion = false) => {
      if (!Array.isArray(items)) return;
      items.forEach((raw: any) => addDoc(fromSuggestion ? { ...raw, _fromSuggestion: true } : raw));
    };

    addDocs(data.result?.sanitizedPayload?.data?.documents);
    addDocs(data.result?.sanitizedPayload?.data?.ragResponse?.documents);
    addDocs(data.result?.data?.documents);
    addDocs(data.result?.data?.ragResponse?.documents);
    addDocs(data.result?.smartSuggestion?.documents, true);
    addDocs(data.result?.sanitizedPayload?.data?.smartSuggestion?.documents, true);
    addDocs(data.ragResponse?.documents);
    addDocs(data.documents);

    return docs;
  }, []);

  // Handle chat query
  const handleChatQuery = useCallback(async (queryOverride?: string, optionsOrFromSuggestion?: ChatQueryOptions | boolean) => {
    const options = typeof optionsOrFromSuggestion === "object" ? optionsOrFromSuggestion : {};
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

    // Use current position/mode — position is always set, mode defaults
    const position = options.position || currentPosition;
    const mode = options.mode || currentMode;

    // Override: search tag forces navigator, deep mode overrides everything
    let resolvedPosition = position;
    let resolvedMode = mode;

    if (activeTag?.type === "search") {
      resolvedPosition = "search";
      resolvedMode = "navigator";
    }
    if (currentMode === "navigator_deep") {
      resolvedMode = "navigator_deep";
    }

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

      const data = await api.sendChatQuery(
        queryToUse,
        userId,
        sessionId,
        currentConversationId || undefined,
        attachmentsWithMetadata.length > 0 ? attachmentsWithMetadata : undefined,
        resolvedPosition,
        resolvedMode,
      );

      // Store conversation ID for future messages
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      // Extract message from sanitizedPayload if available
      let messageContent: unknown = "";
      let result = undefined;
      let resultType = undefined;

      if (data.result && data.result.sanitizedPayload) {
        messageContent = data.result.sanitizedPayload.message || "I processed your query successfully.";
        result = data.result;
        resultType = data.result.type;
      } else {
        messageContent = data.response || data.message || "I processed your query successfully.";
      }

      // Strip empty smart suggestions
      if (result?.smartSuggestion) {
        const ss = result.smartSuggestion;
        if (!ss.response && !ss.query && (!ss.documents || ss.documents.length === 0)) {
          result = { ...result, smartSuggestion: undefined };
        }
      }

      const normalizedContent =
        typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent, null, 2);

      const msgId = (Date.now() + 1).toString();
      const messageDocs = extractDocuments(data, msgId);

      const aiMessage: ChatMessage = {
        id: msgId,
        type: "ai",
        content: normalizedContent,
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
        documents: messageDocs.length > 0 ? messageDocs : undefined,
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
  }, [chatQuery, attachedProducts, attachedReviews, attachedCoupons, currentConversationId, currentPosition, currentMode, activeTag, extractDocuments, sessionId, toast, userId]);

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
          userId,
          sessionId,
          currentConversationId || undefined,
          attachedProducts.length > 0
            ? attachedProducts.map((p) => ({
                type: "product",
                metadata: { id: p.id, sku: p.sku, category: p.category, imageUrl: p.imageUrl },
              }))
            : undefined,
          currentPosition,
          currentMode,
        );

        let messageContent: unknown = "";
        let result = undefined;
        let resultType = undefined;

        if (data.result && data.result.sanitizedPayload) {
          messageContent = data.result.sanitizedPayload.message || "Action processed.";
          result = data.result;
          resultType = data.result.type;
        } else {
          messageContent = data.response || data.message || "Action processed.";
        }

        if (result?.smartSuggestion) {
          const ss = result.smartSuggestion;
          if (!ss.response && !ss.query && (!ss.documents || ss.documents.length === 0)) {
            result = { ...result, smartSuggestion: undefined };
          }
        }

        const normalizedContent =
          typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent, null, 2);

        const msgId = (Date.now() + 1).toString();
        const messageDocs = extractDocuments(data, msgId);

        const aiMessage: ChatMessage = {
          id: msgId,
          type: "ai",
          content: normalizedContent,
          timestamp: new Date().toISOString(),
          result: result,
          resultType: resultType,
          documents: messageDocs.length > 0 ? messageDocs : undefined,
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
    [attachedProducts, currentConversationId, currentMode, currentPosition, extractDocuments, sessionId, toast, userId]
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
        userId,
        sessionId,
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
  }, [attachedReviews, attachedCoupons, sessionId, userId]);

  // Helper to build combined attachments for MaxMode sync
  const buildMaxModeAttachments = useCallback((
    products: Product[],
    reviews: Review[],
    coupons: Coupon[]
  ) => {
    return [
      ...products.map(p => ({ type: 'product', data: p })),
      ...reviews.map(r => ({ type: 'review', data: r })),
      ...coupons.map(c => ({ type: 'coupon', data: c })),
    ];
  }, []);

  // Attachment handlers
  const handleAttachProduct = useCallback((product: Product) => {
    // Check if already attached and compute new list
    const isAlreadyAttached = attachedProducts.find((p) => p.id === product.id);
    if (isAlreadyAttached) return;

    const newProducts = [...attachedProducts, product];
    setAttachedProducts(newProducts);

    // Product attachments are product-detail context; cart mode is reserved for active-cart questions.
    setCurrentPosition("product_detail");
    setCurrentMode("navigator");

    // Sync with MaxMode state
    if (maxModeContext) {
      const allAttachments = buildMaxModeAttachments(newProducts, attachedReviews, attachedCoupons);
      maxModeContext.updateMaxModeState({ attachedItems: allAttachments });
    }

    // Fetch suggestions for all attachments
    fetchSuggestionsForAttachments(newProducts);
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments, maxModeContext, buildMaxModeAttachments]);

  const handleRemoveAttachment = useCallback((productId: string) => {
    const newProducts = attachedProducts.filter((p) => p.id !== productId);
    setAttachedProducts(newProducts);
    // Update suggestions for remaining attachments
    fetchSuggestionsForAttachments(newProducts);

    // Sync with MaxMode state
    if (maxModeContext) {
      const allAttachments = buildMaxModeAttachments(newProducts, attachedReviews, attachedCoupons);
      maxModeContext.updateMaxModeState({ attachedItems: allAttachments });
    }

    // Reset position to catalog if no more attachments
    if (newProducts.length === 0 && attachedReviews.length === 0 && attachedCoupons.length === 0) {
      setCurrentPosition("catalog");
      setCurrentMode("navigator");
    }
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments, maxModeContext, buildMaxModeAttachments]);

  const handleAttachReview = useCallback((review: Review) => {
    const isAlreadyAttached = attachedReviews.find((r) => r.id === review.id);
    if (isAlreadyAttached) return;

    const newReviews = [...attachedReviews, review];
    setAttachedReviews(newReviews);
    setCurrentPosition("product_detail");
    setCurrentMode("navigator");

    // Sync with MaxMode state
    if (maxModeContext) {
      const allAttachments = buildMaxModeAttachments(attachedProducts, newReviews, attachedCoupons);
      maxModeContext.updateMaxModeState({ attachedItems: allAttachments });
    }

    // Fetch suggestions with the new reviews
    fetchSuggestionsForAttachments(attachedProducts, newReviews);
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments, maxModeContext, buildMaxModeAttachments]);

  const handleRemoveAttachedReview = useCallback((reviewId: string) => {
    const newReviews = attachedReviews.filter((r) => r.id !== reviewId);
    setAttachedReviews(newReviews);
    // Update suggestions for remaining attachments
    fetchSuggestionsForAttachments(attachedProducts, newReviews);

    // Sync with MaxMode state
    if (maxModeContext) {
      const allAttachments = buildMaxModeAttachments(attachedProducts, newReviews, attachedCoupons);
      maxModeContext.updateMaxModeState({ attachedItems: allAttachments });
    }

    // Reset position if no more attachments
    if (attachedProducts.length === 0 && newReviews.length === 0 && attachedCoupons.length === 0) {
      setCurrentPosition("catalog");
      setCurrentMode("navigator");
    }
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments, maxModeContext, buildMaxModeAttachments]);

  const handleAttachCoupon = useCallback((coupon: Coupon) => {
    const isAlreadyAttached = attachedCoupons.find((c) => c.id === coupon.id);
    if (isAlreadyAttached) return;

    const newCoupons = [...attachedCoupons, coupon];
    setAttachedCoupons(newCoupons);
    // Set position to cart when coupon is attached
    setCurrentPosition("cart");
    setCurrentMode("navigator");

    // Sync with MaxMode state
    if (maxModeContext) {
      const allAttachments = buildMaxModeAttachments(attachedProducts, attachedReviews, newCoupons);
      maxModeContext.updateMaxModeState({ attachedItems: allAttachments });
    }

    // Fetch suggestions with the new coupons
    fetchSuggestionsForAttachments(attachedProducts, attachedReviews, newCoupons);
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments, maxModeContext, buildMaxModeAttachments]);

  const handleRemoveAttachedCoupon = useCallback((couponId: string) => {
    const newCoupons = attachedCoupons.filter((c) => c.id !== couponId);
    setAttachedCoupons(newCoupons);
    // Update suggestions for remaining attachments
    fetchSuggestionsForAttachments(attachedProducts, attachedReviews, newCoupons);

    // Sync with MaxMode state
    if (maxModeContext) {
      const allAttachments = buildMaxModeAttachments(attachedProducts, attachedReviews, newCoupons);
      maxModeContext.updateMaxModeState({ attachedItems: allAttachments });
    }

    // Reset position if no more attachments
    if (attachedProducts.length === 0 && attachedReviews.length === 0 && newCoupons.length === 0) {
      setCurrentPosition("catalog");
      setCurrentMode("navigator");
    }
  }, [attachedProducts, attachedReviews, attachedCoupons, fetchSuggestionsForAttachments, maxModeContext, buildMaxModeAttachments]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Set position manually (for use by UI actions)
  const setPosition = useCallback((position: ChatPosition, mode?: ChatMode) => {
    setCurrentPosition(position);
    if (mode) {
      setCurrentMode(mode);
    }
  }, []);

  // Handle resending an action
  const handleResendAction = useCallback(async (query: string) => {
    await handleChatQuery(query);
  }, [handleChatQuery]);

  // Handle clarification form submission
  const handleClarificationSubmit = useCallback(
    async (action: string, parameters: Record<string, any>) => {
      // Build a natural language query with the parameters
      const paramStr = Object.entries(parameters)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      const query = `Proceed with ${action.replace(/_/g, " ")} using: ${paramStr}`;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const data = await api.sendChatQuery(
          query,
          userId,
          sessionId,
          currentConversationId || undefined,
          attachedProducts.length > 0
            ? attachedProducts.map((p) => ({
                type: "product",
                metadata: { id: p.id, sku: p.sku, category: p.category, imageUrl: p.imageUrl },
              }))
            : undefined,
          currentPosition,
          currentMode,
        );

        if (data.conversationId && !currentConversationId) {
          setCurrentConversationId(data.conversationId);
        }

        let messageContent: unknown = "";
        let result = undefined;
        let resultType = undefined;

        if (data.result && data.result.sanitizedPayload) {
          messageContent = data.result.sanitizedPayload.message || "Action processed.";
          result = data.result;
          resultType = data.result.type;
        } else {
          messageContent = data.response || data.message || "Action processed.";
        }

        if (result?.smartSuggestion) {
          const ss = result.smartSuggestion;
          if (!ss.response && !ss.query && (!ss.documents || ss.documents.length === 0)) {
            result = { ...result, smartSuggestion: undefined };
          }
        }

        const normalizedContent =
          typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent, null, 2);

        const msgId = (Date.now() + 1).toString();
        const messageDocs = extractDocuments(data, msgId);

        const aiMessage: ChatMessage = {
          id: msgId,
          type: "ai",
          content: normalizedContent,
          timestamp: new Date().toISOString(),
          result: result,
          resultType: resultType,
          documents: messageDocs.length > 0 ? messageDocs : undefined,
        };

        setChatMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit clarification. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [attachedProducts, currentConversationId, currentPosition, currentMode, extractDocuments, sessionId, toast, userId]
  );

  // Handle tag submission (for cart and browse actions)
  const handleTagSubmit = useCallback(async (tag: ActionTag) => {
    // Create user message with action tag
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: tag.query,
      timestamp: new Date().toISOString(),
      actionTag: tag,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsChatExpanded(true);

    // Clear active tag
    setActiveTag(null);

    const tagPosition =
      tag.type === "cart" ? "cart"
      : tag.type === "checkout" ? "checkout"
      : tag.type === "support" ? "support"
      : tag.type === "browse" ? "catalog"
      : currentPosition;
    const tagMode =
      tag.type === "cart" ? "cart_assistant"
      : tag.type === "checkout" ? "executor"
      : tag.type === "support" ? "navigator"
      : currentMode;

    setCurrentPosition(tagPosition);
    setCurrentMode(tagMode);

    try {
      const data = await api.sendChatQuery(
        tag.query,
        userId,
        sessionId,
        currentConversationId || undefined,
        undefined,
        tagPosition,
        tagMode
      );

      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      let messageContent: unknown = "";
      let result = undefined;
      let resultType = undefined;

      if (data.result && data.result.sanitizedPayload) {
        messageContent = data.result.sanitizedPayload.message || "I processed your request successfully.";
        result = data.result;
        resultType = data.result.type;
      } else {
        messageContent = data.response || data.message || "I processed your request successfully.";
      }

      if (result?.smartSuggestion) {
        const ss = result.smartSuggestion;
        if (!ss.response && !ss.query && (!ss.documents || ss.documents.length === 0)) {
          result = { ...result, smartSuggestion: undefined };
        }
      }

      const normalizedContent =
        typeof messageContent === "string" ? messageContent : JSON.stringify(messageContent, null, 2);

      const msgId = (Date.now() + 1).toString();
      const messageDocs = extractDocuments(data, msgId);

      const aiMessage: ChatMessage = {
        id: msgId,
        type: "ai",
        content: normalizedContent,
        timestamp: new Date().toISOString(),
        result: result,
        resultType: resultType,
        documents: messageDocs.length > 0 ? messageDocs : undefined,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, currentPosition, currentMode, extractDocuments, sessionId, toast, userId]);

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
    activeTag,
    userId,
    sessionId,

    // Refs
    messagesEndRef,
    chatInputRef,
    isUserFocusRef,

    // Setters
    setChatQuery,
    setIsChatExpanded,
    setPosition,
    setActiveTag,
    setCurrentMode,
    setCurrentPosition,

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
    handleTagSubmit,
    handleResendAction,
    handleClarificationSubmit,
  };
}
