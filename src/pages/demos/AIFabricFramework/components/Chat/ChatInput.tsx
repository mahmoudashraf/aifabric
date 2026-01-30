import { RefObject, KeyboardEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Zap, Loader2, Sparkles, Bot, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { QuickTools } from "./QuickTools";
import { BrowseProductsDialog } from "./BrowseProductsDialog";
import type { Product, Review, Coupon, ActionTag } from "../../types";

interface ChatInputProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  attachedProducts: Product[];
  attachedReviews: Review[];
  attachedCoupons: Coupon[];
  onRemoveProduct: (id: string) => void;
  onRemoveReview: (id: string) => void;
  onRemoveCoupon: (id: string) => void;
  suggestions: string[];
  isLoadingSuggestions: boolean;
  inputRef: RefObject<HTMLTextAreaElement>;
  onFocus?: () => void;
  activeTag?: ActionTag | null;
  onTagChange?: (tag: ActionTag | null) => void;
  onTagSubmit?: (tag: ActionTag) => void;
}

export function ChatInput({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  attachedProducts,
  attachedReviews,
  attachedCoupons,
  onRemoveProduct,
  onRemoveReview,
  onRemoveCoupon,
  suggestions,
  isLoadingSuggestions,
  inputRef,
  onFocus,
  activeTag,
  onTagChange,
  onTagSubmit,
}: ChatInputProps) {
  const navigate = useNavigate();
  const [isBrowseDialogOpen, setIsBrowseDialogOpen] = useState(false);

  const hasAttachments =
    attachedProducts.length > 0 || attachedReviews.length > 0 || attachedCoupons.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleToolClick = (tag: ActionTag) => {
    // Replace current tool with new one
    if (tag.type === "browse") {
      setIsBrowseDialogOpen(true);
      return;
    }

    if (tag.type === "cart") {
      // Directly submit the cart action
      if (onTagSubmit) {
        onTagSubmit(tag);
      }
      return;
    }

    // For search tool, just set it as active
    if (onTagChange) {
      onTagChange(activeTag?.type === tag.type ? null : tag);
    }
  };

  const handleBrowseSelect = (query: string, label: string) => {
    const browseTag: ActionTag = {
      id: Date.now().toString(),
      type: "browse",
      label: label,
      query: query,
      timestamp: new Date().toISOString(),
    };

    if (onTagSubmit) {
      onTagSubmit(browseTag);
    }
  };

  return (
    <>
      <BrowseProductsDialog
        isOpen={isBrowseDialogOpen}
        onClose={() => setIsBrowseDialogOpen(false)}
        onSelect={handleBrowseSelect}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 sm:pt-12 pb-4 sm:pb-6 px-3 sm:px-4 z-40">
        <div className="max-w-4xl mx-auto">
          {/* Quick Tools */}
          <QuickTools activeTag={activeTag || null} onToolClick={handleToolClick} />

          {/* Attachments display */}
        <AnimatePresence>
          {hasAttachments && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3 flex flex-wrap gap-2"
            >
              {attachedProducts.map((product) => (
                <Badge
                  key={product.id}
                  variant="secondary"
                  className="pr-1 flex items-center gap-1"
                >
                  <span className="truncate max-w-[150px]">{product.name}</span>
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {attachedReviews.map((review) => (
                <Badge
                  key={review.id}
                  variant="outline"
                  className="pr-1 flex items-center gap-1 bg-yellow-500/10"
                >
                  <span className="truncate max-w-[150px]">{review.title}</span>
                  <button
                    onClick={() => onRemoveReview(review.id!)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {attachedCoupons.map((coupon) => (
                <Badge
                  key={coupon.id}
                  variant="outline"
                  className="pr-1 flex items-center gap-1 bg-green-500/10"
                >
                  <span className="truncate max-w-[150px]">{coupon.code}</span>
                  <button
                    onClick={() => onRemoveCoupon(coupon.id!)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions */}
        <AnimatePresence>
          {(suggestions.length > 0 || isLoadingSuggestions) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">Suggestions</span>
                {isLoadingSuggestions && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => onQueryChange(suggestion)}
                    className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className="flex gap-2 sm:gap-3 items-end bg-background/95 backdrop-blur-md rounded-2xl border-2 border-primary/20 shadow-xl shadow-primary/5 p-2 sm:p-3 relative">
          <div className="hidden sm:flex items-center text-primary/60 pl-1">
            <Bot className="h-5 w-5" />
          </div>

          {/* Search Tag inside input - only for search type */}
          {activeTag && activeTag.type === "search" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 left-2 sm:left-14 z-10"
            >
              <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-gradient-to-r from-blue-500/90 to-purple-500/90 border border-blue-400/50 rounded-full shadow-md backdrop-blur-sm">
                <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                <button
                  onClick={() => onTagChange && onTagChange(null)}
                  className="h-4 w-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  title="Clear search mode"
                >
                  <X className="h-2.5 w-2.5 text-white" />
                </button>
              </div>
            </motion.div>
          )}

          <Textarea
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder={
              activeTag?.type === "search"
                ? "Type your search query..."
                : hasAttachments
                ? "Ask about attached items..."
                : "Ask about products, orders, or get help..."
            }
            className={`flex-1 min-h-[44px] sm:min-h-[52px] max-h-[120px] sm:max-h-[140px] resize-none border-0 focus-visible:ring-0 bg-transparent text-sm sm:text-base ${
              activeTag?.type === "search" ? "pt-8 sm:pt-8" : ""
            }`}
            rows={1}
          />
          <div className="flex gap-1.5 sm:gap-2 items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/maxAI")}
              className="h-9 sm:h-10 px-2 sm:px-3 gap-1 sm:gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/20"
              title="Open MAX AI Mode"
            >
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MAX
              </span>
            </Button>
            <Button
              size="icon"
              onClick={onSubmit}
              disabled={isLoading || !query.trim()}
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
