import { RefObject, KeyboardEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Zap, Loader2, Sparkles, Microscope, Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { QuickTools } from "./QuickTools";
import { BrowseProductsDialog } from "./BrowseProductsDialog";
import type { Product, Review, Coupon, ActionTag, ChatPosition, ChatMode } from "../../types";

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
  currentPosition?: ChatPosition;
  currentMode?: ChatMode;
  onModeChange?: (mode: ChatMode) => void;
  onOpenMaxMode?: () => void;
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
  currentPosition = "landing",
  currentMode = "navigator",
  onModeChange,
  onOpenMaxMode,
}: ChatInputProps) {
  const navigate = useNavigate();
  const [isBrowseDialogOpen, setIsBrowseDialogOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const hasAttachments =
    attachedProducts.length > 0 || attachedReviews.length > 0 || attachedCoupons.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleToolClick = (tag: ActionTag) => {
    if (tag.type === "browse") {
      setIsBrowseDialogOpen(true);
      return;
    }

    if (tag.type === "cart") {
      if (onTagSubmit) {
        onTagSubmit(tag);
      }
      return;
    }

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

  const nonAiAttachmentsCount = attachedProducts.length + attachedReviews.length + attachedCoupons.length;

  return (
    <>
      <BrowseProductsDialog
        isOpen={isBrowseDialogOpen}
        onClose={() => setIsBrowseDialogOpen(false)}
        onSelect={handleBrowseSelect}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-8 sm:pt-12 pb-4 sm:pb-6 px-3 sm:px-4 z-40">
        <div className="max-w-4xl mx-auto space-y-1.5">
          {/* Quick Tools */}
          <QuickTools activeTag={activeTag || null} onToolClick={handleToolClick} />

          {/* Attachments display */}
          <AnimatePresence>
            {hasAttachments && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-wrap gap-2"
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

          {/* Mobile mode toggles */}
          {onModeChange && (
            <div className="flex md:hidden items-center gap-1.5 px-1">
              <button
                onClick={() => {
                  const isDeep = currentMode === "navigator_deep";
                  onModeChange(isDeep ? "navigator" : "navigator_deep");
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm transition-all active:scale-95 border ${
                  currentMode === "navigator_deep"
                    ? "bg-purple-500 text-white border-purple-400/50"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                }`}
              >
                <Microscope className="h-3 w-3" />
                <span>Deep</span>
              </button>
              <button
                onClick={() => {
                  const isAssistant = currentMode === "cart_assistant";
                  onModeChange(isAssistant ? "navigator" : "cart_assistant");
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm transition-all active:scale-95 border ${
                  currentMode === "cart_assistant"
                    ? "bg-emerald-500 text-white border-emerald-400/50"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                }`}
              >
                <ShoppingCart className="h-3 w-3" />
                <span>Assist</span>
              </button>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                  currentPosition === "cart"
                    ? "bg-orange-500 text-white"
                    : currentPosition === "search"
                      ? "bg-blue-500 text-white"
                      : currentPosition === "catalog"
                        ? "bg-indigo-500 text-white"
                        : "bg-green-500 text-white"
                }`}
              >
                {currentPosition}
              </span>
            </div>
          )}

          {/* Input area - max-mode floating style */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-1">
              {/* Search Tag inside input */}
              {activeTag && activeTag.type === "search" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 left-2 z-10"
                >
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg shadow-lg border border-white/30">
                    <Search className="h-2.5 w-2.5 text-white flex-shrink-0" />
                    <span className="text-[10px] font-bold text-white max-w-[120px] truncate">Search</span>
                    <button
                      onClick={() => onTagChange && onTagChange(null)}
                      className="h-4 w-4 rounded-md bg-white/20 hover:bg-white/35 flex items-center justify-center transition-all hover:scale-105 ml-0.5"
                      title="Clear"
                    >
                      <X className="h-2.5 w-2.5 text-white stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              )}

              <Textarea
                ref={inputRef}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsInputFocused(true);
                  onFocus?.();
                }}
                onBlur={() => setIsInputFocused(false)}
                placeholder={
                  activeTag?.type === "search"
                    ? "Type your search query..."
                    : nonAiAttachmentsCount > 0
                      ? `Ask about ${nonAiAttachmentsCount} item${nonAiAttachmentsCount === 1 ? "" : "s"}...`
                      : "Ask me anything..."
                }
                className={`${
                  isInputFocused ? "min-h-[80px] sm:min-h-[100px] md:min-h-[80px]" : "min-h-[56px] sm:min-h-[60px] md:min-h-[80px]"
                } ${activeTag?.type === "search" ? "pt-9 sm:pt-10" : "pt-4"} pb-4 pr-14 pl-4 text-sm sm:text-base resize-none border-0 rounded-2xl shadow-lg focus:shadow-xl leading-relaxed transition-all bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm`}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: "16px",
                }}
              />

              {/* Desktop mode toggles - inside input area like max-mode */}
              {onModeChange && (
                <div className="hidden md:flex absolute right-3 bottom-16 items-center gap-1.5">
                  <button
                    onClick={() => {
                      const isDeep = currentMode === "navigator_deep";
                      onModeChange(isDeep ? "navigator" : "navigator_deep");
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm transition-all hover:scale-105 border ${
                      currentMode === "navigator_deep"
                        ? "bg-purple-500 text-white border-purple-400/50"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                    }`}
                    title={currentMode === "navigator_deep" ? "Deep mode ON" : "Deep mode OFF"}
                  >
                    <Microscope className="h-3 w-3" />
                    <span>Deep</span>
                  </button>
                  <button
                    onClick={() => {
                      const isAssistant = currentMode === "cart_assistant";
                      onModeChange(isAssistant ? "navigator" : "cart_assistant");
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm transition-all hover:scale-105 border ${
                      currentMode === "cart_assistant"
                        ? "bg-emerald-500 text-white border-emerald-400/50"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                    }`}
                    title={currentMode === "cart_assistant" ? "Cart Assistant ON" : "Cart Assistant OFF"}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span>Assist</span>
                  </button>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                      currentPosition === "cart"
                        ? "bg-orange-500 text-white"
                        : currentPosition === "search"
                          ? "bg-blue-500 text-white"
                          : currentPosition === "catalog"
                            ? "bg-indigo-500 text-white"
                            : "bg-green-500 text-white"
                    }`}
                  >
                    {currentPosition}
                  </span>
                </div>
              )}

              {/* MAX button and Send button - absolute positioned inside textarea */}
              <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                <Button
                  variant="outline"
                  onClick={() => onOpenMaxMode ? onOpenMaxMode() : navigate("/maxAI")}
                  className="h-9 px-2 gap-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/20"
                  title="Open MAX AI Mode"
                >
                  <Zap className="h-3.5 w-3.5 text-purple-500" />
                  <span className="text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    MAX
                  </span>
                </Button>
                <Button
                  size="icon"
                  onClick={onSubmit}
                  disabled={isLoading || !query.trim()}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl disabled:opacity-50 transition-all hover:scale-105 border border-white/20"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <Send className="h-5 w-5 text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
