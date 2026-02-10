import type { RefObject } from "react";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  CheckCircle2,
  HelpCircle,
  Info,
  Lightbulb,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";

import { getActionIcon, parseActionMessage } from "../../actionMessage";
import type { ChatMessage } from "../../types";
import { normalizeMessageContent } from "../../utils";
import { ActionResultRenderer } from "../ActionResultRenderer";

export type AiStyles = {
  icon: LucideIcon;
  bg: string;
  border: string;
  text: string;
  iconColor: string;
  label: string;
  hideBadge?: boolean;
};

export function MessageBubble({
  message,
  isLatest,
  latestMessageRef,
  aiStyles,
  isPanelVisible,
  attachedItems,
  confirmationStatus,
  expandedCount,
  onOpenDebug,
  onResendAction,
  onReattachItem,
  onOpenSourcesMobile,
  onOpenSourcesDesktop,
  onConfirm,
  onExpandActionResults,
  isItemAttached,
  onAttachActionResultItem,
  onNextStepClick,
}: {
  message: ChatMessage;
  isLatest: boolean;
  latestMessageRef: RefObject<HTMLDivElement>;
  aiStyles?: AiStyles | null;
  isPanelVisible: boolean;
  attachedItems: Array<{ type: string; data: any }>;
  confirmationStatus: Record<string, "confirmed" | "rejected" | undefined>;
  expandedCount: number;
  onOpenDebug: (message: ChatMessage) => void;
  onResendAction: (fullMessage: string) => void;
  onReattachItem: (item: { type: string; data: any }, isAlreadyAttached: boolean) => void;
  onOpenSourcesMobile: (messageId: string) => void;
  onOpenSourcesDesktop: (messageId: string) => void;
  onConfirm: (messageId: string, confirmed: boolean, message: ChatMessage) => void;
  onExpandActionResults: (messageId: string, nextCount: number) => void;
  isItemAttached: (itemId: string) => boolean;
  onAttachActionResultItem: (item: any) => void;
  onNextStepClick: (query: string) => void;
}) {
  const Icon = message.type === "ai" ? aiStyles?.icon : undefined;

  return (
    <motion.div
      ref={isLatest ? latestMessageRef : null}
      data-message-id={message.id}
      initial={{ opacity: 0, x: message.type === "user" ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[90%] rounded-3xl overflow-hidden ${
          message.type === "user"
            ? "bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg mr-16 md:mr-0"
            : `${aiStyles?.bg} shadow-xl relative`
        }`}
      >
        {message.type === "ai" && Icon && !aiStyles?.hideBadge && (
          <div className="relative">
            <div className={`px-4 md:px-5 py-2 md:py-2.5 flex items-center justify-between bg-gradient-to-r ${aiStyles?.bg}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${aiStyles?.iconColor} bg-white/20`}>
                  <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                </div>
                <span className="text-[11px] md:text-xs font-bold text-white drop-shadow-sm">{aiStyles?.label}</span>
              </div>
              {message.debugData && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDebug(message);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="View API Debug Data"
                >
                  <Info className="h-4 w-4 text-white/80 hover:text-white" />
                </button>
              )}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        )}

        <div className={`p-4 md:p-5 ${message.type === "ai" ? "bg-white dark:bg-gray-900" : ""}`}>
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
                const isAISearch = item.type === "ai-search";
                const isAlreadyAttached = attachedItems.some(
                  (attached) =>
                    attached.type === item.type && (attached.data.id === item.data.id || attached.data.sku === item.data.sku),
                );
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                      isAISearch
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/50"
                        : "bg-white/20 border-white/30"
                    }`}
                  >
                    {isAISearch ? <Search className="h-3 w-3 text-cyan-600" /> : <Paperclip className="h-3 w-3" />}
                    <span className="flex-1 font-semibold">
                      {item.data.title || `${item.data.type || item.type}: ${item.data.name || ""}`}
                    </span>
                    {!isAISearch && (
                      <button
                        onClick={() => onReattachItem(item, isAlreadyAttached)}
                        className={`p-1 rounded transition-colors ${
                          isAlreadyAttached
                            ? "text-green-500 cursor-default"
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-100/20"
                        }`}
                        title={isAlreadyAttached ? "Already attached" : "Re-attach to chat"}
                      >
                        {isAlreadyAttached ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
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
                <div className="relative inline-block max-w-full">
                  <Button
                    onClick={() => onResendAction(parsedAction.fullMessage)}
                    size="icon"
                    variant="ghost"
                    className="absolute -left-2 md:-left-3 -top-2 md:-top-3 h-8 w-8 md:h-9 md:w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-110 shadow-xl z-10 border-2 border-white dark:border-gray-900"
                    title="Resend action"
                  >
                    <RotateCcw className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>

                  <div className="inline-flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg max-w-full">
                    <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0">
                      <ActionIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                    </div>
                    <span className="text-sm md:text-base font-bold text-white pr-1 md:pr-2 truncate">
                      {parsedAction.query}
                    </span>
                  </div>
                </div>
              );
            }

            return message.type === "ai" ? (
              <div
                className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-blue-600 dark:prose-li:marker:text-blue-400"
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            ) : (
              <p
                className="text-base md:text-lg whitespace-pre-wrap leading-relaxed font-medium"
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {content}
              </p>
            );
          })()}

          {message.resultType === "CONFIRMATION_REQUIRED" &&
            confirmationStatus[message.id] !== "confirmed" &&
            confirmationStatus[message.id] !== "rejected" && (
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => onConfirm(message.id, true, message)}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Confirm
                </Button>
                <Button
                  onClick={() => onConfirm(message.id, false, message)}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Reject
                </Button>
              </div>
            )}

          {message.resultType === "CONFIRMATION_REQUIRED" && confirmationStatus[message.id] === "confirmed" && (
            <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Confirmed
              </p>
            </div>
          )}

          {message.resultType === "CONFIRMATION_REQUIRED" && confirmationStatus[message.id] === "rejected" && (
            <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-semibold flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected
              </p>
            </div>
          )}

          {message.resultType === "INFORMATION_PROVIDED" && message.documents && message.documents.length > 0 && (
            <Button
              onClick={() => onOpenSourcesMobile(message.id)}
              size="sm"
              className="mt-3 md:hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg text-xs rounded-full px-4 py-2 flex items-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-semibold">Sources Used</span>
              <span className="px-1.5 py-0.5 bg-white/25 rounded-full text-[10px] font-bold">{message.documents.length}</span>
            </Button>
          )}

          {message.resultType === "INFORMATION_PROVIDED" &&
            message.documents &&
            message.documents.length > 0 &&
            !isPanelVisible && (
              <Button
                onClick={() => onOpenSourcesDesktop(message.id)}
                size="sm"
                className="mt-3 hidden md:inline-flex bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg rounded-full px-5 py-2.5 items-center gap-2.5"
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">View Sources Used</span>
                <span className="px-2 py-0.5 bg-white/25 rounded-full text-xs font-bold">{message.documents.length}</span>
              </Button>
            )}

          {message.result?.sanitizedPayload?.type === "ACTION_EXECUTED" &&
            message.result?.sanitizedPayload?.data?.actionResult?.data && (
              <ActionResultRenderer
                data={message.result.sanitizedPayload.data.actionResult.data}
                messageId={message.id}
                expandedCount={expandedCount}
                onExpand={(count) => onExpandActionResults(message.id, count)}
                isAttached={isItemAttached}
                onAttach={(item) => onAttachActionResultItem(item)}
              />
            )}

          {message.resultType === "CLARIFICATION_REQUIRED" && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-700 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200 font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Clarification Needed
              </p>
              {message.result?.sanitizedPayload?.data?.options && (
                <ul className="mt-2 space-y-1">
                  {(message.result.sanitizedPayload.data.options as string[]).map((option: string, idx: number) => (
                    <li key={idx} className="text-xs text-orange-700 dark:text-orange-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {message.result?.sanitizedPayload?.type === "COMPOUND_HANDLED" &&
            message.result?.sanitizedPayload?.data?.results &&
            Array.isArray(message.result.sanitizedPayload.data.results) && (
              <div className="mt-4 space-y-2">
                {(message.result.sanitizedPayload.data.results as any[]).map((subResult: any, idx: number) => {
                  const subType = subResult.type;
                  const subIcon =
                    subType === "ACTION_EXECUTED" ? CheckCircle2
                    : subType === "ACTION_DENIED" ? Ban
                    : subType === "CONFIRMATION_REQUIRED" ? HelpCircle
                    : subType === "CLARIFICATION_REQUIRED" ? AlertCircle
                    : subType === "INFORMATION_PROVIDED" ? Info
                    : Zap;
                  const SubIcon = subIcon;
                  const colorMap: Record<string, string> = {
                    ACTION_EXECUTED: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200",
                    ACTION_DENIED: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200",
                    CONFIRMATION_REQUIRED: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200",
                    CLARIFICATION_REQUIRED: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-200",
                    INFORMATION_PROVIDED: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200",
                  };
                  const colors = colorMap[subType] || "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200";

                  return (
                    <div key={idx} className={`p-2.5 rounded-lg border ${colors}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <SubIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs font-bold">{subType?.replace(/_/g, " ") || "Result"}</span>
                        {subResult.success !== undefined && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${subResult.success ? "bg-green-500/20 text-green-700 dark:text-green-300" : "bg-red-500/20 text-red-700 dark:text-red-300"}`}>
                            {subResult.success ? "OK" : "FAILED"}
                          </span>
                        )}
                      </div>
                      {subResult.message && (
                        <p className="text-[11px] opacity-80">{subResult.message}</p>
                      )}
                      {subResult.data?.actionResult?.data && (
                        <ActionResultRenderer
                          data={subResult.data.actionResult.data}
                          messageId={`${message.id}-sub-${idx}`}
                          expandedCount={expandedCount}
                          onExpand={(count) => onExpandActionResults(message.id, count)}
                          isAttached={isItemAttached}
                          onAttach={(item) => onAttachActionResultItem(item)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          {message.type === "ai" && message.result?.smartSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <div className="rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 overflow-hidden">
                <div className="px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-800/30 dark:to-yellow-800/30 flex items-center gap-2">
                  <div className="p-1 rounded-md bg-amber-500/20">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-200">
                    Smart Suggestion
                  </span>
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    {Math.round((message.result.smartSuggestion.confidence ?? 0) * 100)}% confidence
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {message.result.smartSuggestion.title}
                      </p>
                      {message.result.smartSuggestion.rationale && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {message.result.smartSuggestion.rationale}
                        </p>
                      )}
                    </div>
                  </div>
                  {message.result.smartSuggestion.query && (
                    <button
                      onClick={() => onNextStepClick(message.result!.smartSuggestion!.query)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 dark:border-amber-600 transition-all group text-left"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="text-[11px] font-medium text-amber-800 dark:text-amber-200 truncate">
                        {message.result.smartSuggestion.query}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {message.type === "ai" && message.result?.nextSteps && message.result.nextSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Next Steps
                </span>
              </div>
              <div className="space-y-1.5">
                {message.result.nextSteps.map((step: any, idx: number) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + idx * 0.08 }}
                    onClick={() => onNextStepClick(step.query)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group text-left"
                  >
                    <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <ArrowRight className="h-3 w-3 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {step.query}
                      </p>
                      {step.rationale && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                          {step.rationale}
                        </p>
                      )}
                    </div>
                    {step.confidence && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-300 flex-shrink-0">
                        {Math.round(step.confidence * 100)}%
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {message.type === "ai" && message.debugData && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDebug(message);
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
}
