import type { RefObject } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, History, Info, Loader2, Lock, MessageSquarePlus, Plus, Search, Send, Sparkles, Wand2, X } from "lucide-react";

import { AISearchDisplay } from "@/components/AISearchDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export type AttachedItem = { type: string; data: any };

export function Composer({
  attachedItems,
  onRemoveAttachment,
  searchCategory,
  onClearSearchCategory,
  onRemoveAiSearch,
  suggestions,
  showSuggestions,
  isLoadingSuggestions,
  onDismissSuggestions,
  onShowSuggestions,
  onSuggestionSelect,
  oldConversationLocked,
  onStartNewConversation,
  onOpenHistory,
  chatQuery,
  onChatQueryChange,
  isInputFocused,
  onInputFocusChange,
  chatInputRef,
  isLoading,
  currentPosition,
  onOpenDebug,
  onSubmit,
}: {
  attachedItems: AttachedItem[];
  onRemoveAttachment: (filteredIndex: number) => void;
  searchCategory: string | null;
  onClearSearchCategory: () => void;
  onRemoveAiSearch: () => void;
  suggestions: string[];
  showSuggestions: boolean;
  isLoadingSuggestions: boolean;
  onDismissSuggestions: () => void;
  onShowSuggestions: () => void;
  onSuggestionSelect: (suggestion: string) => void;
  oldConversationLocked: boolean;
  onStartNewConversation: () => void;
  onOpenHistory: () => void;
  chatQuery: string;
  onChatQueryChange: (value: string) => void;
  isInputFocused: boolean;
  onInputFocusChange: (focused: boolean) => void;
  chatInputRef: RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
  currentPosition: "landing" | "catalog" | "checkout";
  onOpenDebug: () => void;
  onSubmit: () => void;
}) {
  const hasAiSearch = Boolean(attachedItems.find((item) => item.type === "ai-search"));
  const nonAiAttachments = attachedItems.filter((item) => item.type !== "ai-search");

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t-2 border-purple-500/30 p-3 md:p-6">
      <div className="max-w-4xl mx-auto">
        {nonAiAttachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 md:mb-3 flex flex-wrap gap-1.5 md:gap-2 max-h-[120px] md:max-h-[200px] overflow-y-auto"
          >
            <AnimatePresence mode="popLayout">
              {nonAiAttachments.map((item, idx) => {
                const isAISearch = item.type === "ai-search";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <Card
                      className={`border-2 shadow-lg hover:shadow-xl transition-all ${
                        isAISearch
                          ? "border-indigo-400/50 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                          : "border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-blue-400/20"
                      }`}
                    >
                      <CardContent className="p-2 md:p-3 flex items-center gap-2 md:gap-3">
                        <motion.div
                          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                          className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                            isAISearch
                              ? "bg-gradient-to-br from-indigo-600 to-purple-600"
                              : "bg-gradient-to-br from-blue-600 to-blue-500"
                          }`}
                        >
                          {isAISearch ? (
                            <Search className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          ) : (
                            <MessageSquarePlus className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-[11px] md:text-xs font-bold truncate ${
                              isAISearch ? "text-cyan-900 dark:text-cyan-100" : "text-purple-900 dark:text-purple-100"
                            }`}
                          >
                            {item.data.title || item.data.productName || item.data.name || `Item ${item.data.id || ""}`}
                          </p>
                          <p
                            className={`hidden md:flex text-[10px] items-center gap-1 ${
                              isAISearch ? "text-cyan-700 dark:text-cyan-300" : "text-purple-700 dark:text-purple-300"
                            }`}
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            <span className="capitalize">{isAISearch ? "AI Search" : item.data.type || item.type}</span> • Added
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onRemoveAttachment(idx)}
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
                  onClick={onDismissSuggestions}
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
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
                      }}
                      onClick={() => onSuggestionSelect(suggestion)}
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

        {suggestions.length > 0 && !showSuggestions && !isLoadingSuggestions && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onShowSuggestions}
              className="w-full bg-white/80 hover:bg-purple-50 border-purple-300 hover:border-purple-500 text-purple-700 shadow-sm"
            >
              <Wand2 className="h-3.5 w-3.5 mr-2" />
              Show AI Suggestions ({suggestions.length})
            </Button>
          </motion.div>
        )}

        {isLoadingSuggestions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3">
            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border-2 border-purple-300/50">
              <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.div>
                Generating smart suggestions...
              </p>
            </div>
          </motion.div>
        )}

        {oldConversationLocked && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 p-2 bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl flex items-center gap-2"
          >
            <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">This conversation is locked (read-only)</span>
            <Button size="sm" variant="outline" onClick={onStartNewConversation} className="ml-auto text-xs h-7 bg-white dark:bg-gray-800">
              <Plus className="h-3 w-3 mr-1" />
              New Chat
            </Button>
          </motion.div>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            size="icon"
            variant="outline"
            onClick={onOpenHistory}
            className="h-12 w-12 md:h-14 md:w-14 rounded-2xl border-2 border-purple-400/50 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 shadow-lg flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all hover:scale-105"
            title="Chat History"
          >
            <History className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
          </Button>

          <div className="relative flex-1">
            {searchCategory && !hasAiSearch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-2 left-2 z-10"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg shadow-lg border border-white/30">
                  <Search className="h-2.5 w-2.5 text-white flex-shrink-0" />
                  <span className="text-[10px] font-bold text-white max-w-[120px] truncate">{searchCategory}</span>
                  <button
                    onClick={onClearSearchCategory}
                    className="h-4 w-4 rounded-md bg-white/20 hover:bg-white/35 flex items-center justify-center transition-all hover:scale-105 ml-0.5"
                    title="Clear"
                  >
                    <X className="h-2.5 w-2.5 text-white stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            )}

            {hasAiSearch && (
              <AISearchDisplay
                category={attachedItems.find((item) => item.type === "ai-search")?.data.category || "All Categories"}
                onRemove={onRemoveAiSearch}
              />
            )}

            <Textarea
              ref={chatInputRef}
              placeholder={
                oldConversationLocked
                  ? "This conversation is locked..."
                  : searchCategory || hasAiSearch
                    ? "Type your search query..."
                    : nonAiAttachments.length > 0
                      ? `Ask about ${nonAiAttachments.length} item${nonAiAttachments.length === 1 ? "" : "s"}...`
                      : "Ask me anything..."
              }
              value={chatQuery}
              onChange={(e) => onChatQueryChange(e.target.value)}
              onFocus={() => onInputFocusChange(true)}
              onBlur={() => onInputFocusChange(false)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !oldConversationLocked) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              disabled={oldConversationLocked}
              className={`${
                isInputFocused ? "min-h-[80px] sm:min-h-[100px] md:min-h-[80px]" : "min-h-[56px] sm:min-h-[60px] md:min-h-[80px]"
              } ${searchCategory || hasAiSearch ? "pt-9 sm:pt-10" : "pt-4"} pb-4 pr-14 pl-4 text-sm sm:text-base resize-none border-0 rounded-2xl shadow-lg focus:shadow-xl leading-relaxed transition-all bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm ${
                oldConversationLocked ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60" : ""
              }`}
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
                fontSize: "16px",
              }}
            />

            <div className="hidden md:flex absolute right-3 bottom-16 items-center gap-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                  currentPosition === "checkout"
                    ? "bg-orange-500 text-white"
                    : currentPosition === "catalog"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                }`}
              >
                {currentPosition}
              </span>
              <button
                onClick={onOpenDebug}
                className="h-5 w-5 rounded-full bg-gray-800/80 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="View API Debug Info"
              >
                <Info className="h-3 w-3" />
              </button>
            </div>

            <Button
              size="icon"
              onClick={onSubmit}
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
  );
}
