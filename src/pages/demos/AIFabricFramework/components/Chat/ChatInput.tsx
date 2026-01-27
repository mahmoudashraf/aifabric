import { RefObject, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Maximize2, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Product, Review, Coupon } from "../../types";

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
}: ChatInputProps) {
  const navigate = useNavigate();

  const hasAttachments =
    attachedProducts.length > 0 || attachedReviews.length > 0 || attachedCoupons.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-8 pb-4 px-4 z-40">
      <div className="max-w-4xl mx-auto">
        {/* Attachments display */}
        <AnimatePresence>
          {hasAttachments && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 flex flex-wrap gap-2"
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
        <div className="flex gap-2 items-end bg-background/80 backdrop-blur-sm rounded-2xl border shadow-lg p-2">
          <Textarea
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder={
              hasAttachments
                ? "Ask about attached items..."
                : "Ask about products, orders, or get help..."
            }
            className="flex-1 min-h-[44px] max-h-[120px] resize-none border-0 focus-visible:ring-0 bg-transparent"
            rows={1}
          />
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/max-mode")}
              className="h-9 w-9"
              title="Open MAX Mode"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={onSubmit}
              disabled={isLoading || !query.trim()}
              className="h-9 w-9"
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
  );
}
