import { useState } from "react";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  FileText,
  Lightbulb,
  Paperclip,
  RotateCw,
  Search,
  ShoppingCart,
  Package,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getResultTypeStyles } from "../../utils/resultTypeStyles";
import { ActionResultRenderer } from "./ActionResultRenderer";
import type { ChatMessage as ChatMessageType } from "../../types";

const normalizeContent = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
  onConfirmation?: (action: "confirm" | "deny", data?: any) => void;
  onResendAction?: (query: string) => void;
  onNextStepClick?: (query: string) => void;
}

export function ChatMessage({ message, onConfirmation, onResendAction, onNextStepClick }: ChatMessageProps) {
  const styles = getResultTypeStyles(message.resultType);
  const Icon = styles.icon;
  const [isSuggestionExpanded, setIsSuggestionExpanded] = useState(false);

  const getActionIcon = (type: string) => {
    switch (type) {
      case "cart": return ShoppingCart;
      case "browse": return Package;
      case "search": return Search;
      default: return Package;
    }
  };

  // User message
  if (message.type === "user") {
    const ActionIcon = message.actionTag ? getActionIcon(message.actionTag.type) : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[80%]">
          {message.actionTag && ActionIcon && (
            <div className="mb-1 flex items-center justify-end gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5">
                <ActionIcon className="h-3 w-3" />
                <span className="text-[10px]">{message.actionTag.label}</span>
              </Badge>
              {onResendAction && (
                <button
                  onClick={() => onResendAction(message.actionTag!.query)}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>Resend</span>
                </button>
              )}
            </div>
          )}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg">
            <p className="text-sm leading-relaxed">{normalizeContent(message.content)}</p>
            {message.attachedProducts && message.attachedProducts.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/20">
                <div className="flex items-center gap-1 mb-1">
                  <Paperclip className="h-3 w-3 text-white/60" />
                  <span className="text-[10px] text-white/60">Attached</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {message.attachedProducts.map((p) => (
                    <span key={p.id} className="text-[10px] px-2 py-0.5 bg-white/15 rounded-full">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // AI message
  const content = normalizeContent(message.content);
  const smartSuggestion = message.result?.smartSuggestion;
  const nextSteps = (message.result as any)?.nextSteps;
  const hasSmartSuggestion = smartSuggestion && (smartSuggestion.response || smartSuggestion.query || (smartSuggestion.documents && smartSuggestion.documents.length > 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] w-full">
        <div className={`rounded-2xl rounded-bl-sm border overflow-hidden ${styles.bgColor} ${styles.borderColor}`}>
          {/* Header with icon and badge */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <div className={`p-1.5 rounded-lg ${styles.badgeBg}`}>
              <Icon className={`h-3.5 w-3.5 ${styles.iconColor}`} />
            </div>
            {!styles.hideBadge && (
              <Badge className={`text-[10px] ${styles.badgeBg} ${styles.badgeText} border-0`}>
                {styles.label}
              </Badge>
            )}
          </div>

          {/* Message content - rendered as markdown */}
          <div className="px-4 pb-3">
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>

            {/* Action result data */}
            {message.result?.sanitizedPayload?.data && (
              <div className="mt-2">
                <ActionResultRenderer
                  data={message.result.sanitizedPayload.data}
                  messageId={message.id}
                />
              </div>
            )}

            {/* Confirmation buttons */}
            {message.resultType === "CONFIRMATION_REQUIRED" && onConfirmation && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onConfirmation("confirm", message.result?.sanitizedPayload?.data)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm"
                >
                  Yes, Proceed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onConfirmation("deny")}
                  className="rounded-xl"
                >
                  No, Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Smart Suggestion Card */}
        {hasSmartSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2"
          >
            <div className="rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 overflow-hidden">
              <div className="px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-800/30 dark:to-yellow-800/30 flex items-center gap-2">
                <div className="p-1 rounded-md bg-amber-500/20">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-200">Smart Suggestion</span>
                {smartSuggestion.confidence != null && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    {Math.round(smartSuggestion.confidence * 100)}% confidence
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                {smartSuggestion.query && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-700">
                    <Search className="h-3 w-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                      {smartSuggestion.query}
                    </span>
                  </div>
                )}
                {smartSuggestion.response && (() => {
                  const response = smartSuggestion.response;
                  const isLong = response.length > 200;
                  return (
                    <div>
                      <div className={`prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed ${isLong && !isSuggestionExpanded ? "max-h-[100px] overflow-hidden relative" : ""}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
                        {isLong && !isSuggestionExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-amber-50 dark:from-amber-900/20 to-transparent pointer-events-none" />
                        )}
                      </div>
                      {isLong && (
                        <button
                          onClick={() => setIsSuggestionExpanded(!isSuggestionExpanded)}
                          className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                        >
                          <ChevronDown className={`h-3 w-3 transition-transform ${isSuggestionExpanded ? "rotate-180" : ""}`} />
                          {isSuggestionExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  );
                })()}
                {!smartSuggestion.response && smartSuggestion.rationale && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{smartSuggestion.rationale}</p>
                )}
                {smartSuggestion.documents && smartSuggestion.documents.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 border-t border-amber-200/50 dark:border-amber-700/50">
                    <FileText className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      {smartSuggestion.documents.length} document{smartSuggestion.documents.length !== 1 ? "s" : ""} available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {nextSteps && nextSteps.length > 0 && onNextStepClick && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 space-y-1.5"
          >
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider px-1">
              Next Steps
            </span>
            {nextSteps.map((step: any, idx: number) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                onClick={() => onNextStepClick(step.query)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 transition-all group text-left"
              >
                <ArrowRight className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-blue-800 dark:text-blue-200 block truncate">
                    {step.query}
                  </span>
                  {step.rationale && (
                    <span className="text-[9px] text-blue-500/70 block truncate">{step.rationale}</span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Loading message component
export function LoadingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
