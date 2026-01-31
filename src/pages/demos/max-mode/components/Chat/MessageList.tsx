import type { RefObject } from "react";

import { AnimatePresence, motion } from "framer-motion";

import type { ChatMessage, ResultType } from "../../types";
import type { AiStyles } from "./MessageBubble";
import { MessageBubble } from "./MessageBubble";

export function MessageList({
  containerClassName,
  messages,
  latestMessageRef,
  messagesEndRef,
  isLoading,
  getAiStyles,
  isPanelVisible,
  attachedItems,
  confirmationStatus,
  expandedActions,
  onOpenDebug,
  onResendAction,
  onReattachItem,
  onOpenSourcesMobile,
  onOpenSourcesDesktop,
  onConfirm,
  onExpandActionResults,
  isItemAttached,
  onAttachActionResultItem,
}: {
  containerClassName: string;
  messages: ChatMessage[];
  latestMessageRef: RefObject<HTMLDivElement>;
  messagesEndRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  getAiStyles: (resultType?: ResultType) => AiStyles;
  isPanelVisible: boolean;
  attachedItems: Array<{ type: string; data: any }>;
  confirmationStatus: Record<string, "confirmed" | "rejected" | undefined>;
  expandedActions: Record<string, number | undefined>;
  onOpenDebug: (message: ChatMessage) => void;
  onResendAction: (fullMessage: string) => void;
  onReattachItem: (item: { type: string; data: any }, isAlreadyAttached: boolean) => void;
  onOpenSourcesMobile: (messageId: string) => void;
  onOpenSourcesDesktop: (messageId: string) => void;
  onConfirm: (messageId: string, confirmed: boolean, message: ChatMessage) => void;
  onExpandActionResults: (messageId: string, nextCount: number) => void;
  isItemAttached: (itemId: string) => boolean;
  onAttachActionResultItem: (item: any) => void;
}) {
  return (
    <div className={containerClassName}>
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => {
            const aiStyles = message.type === "ai" ? getAiStyles(message.resultType) : null;
            const isLatest = index === messages.length - 1;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={isLatest}
                latestMessageRef={latestMessageRef}
                aiStyles={aiStyles}
                isPanelVisible={isPanelVisible}
                attachedItems={attachedItems}
                confirmationStatus={confirmationStatus}
                expandedCount={expandedActions[message.id] || 4}
                onOpenDebug={onOpenDebug}
                onResendAction={onResendAction}
                onReattachItem={onReattachItem}
                onOpenSourcesMobile={onOpenSourcesMobile}
                onOpenSourcesDesktop={onOpenSourcesDesktop}
                onConfirm={onConfirm}
                onExpandActionResults={onExpandActionResults}
                isItemAttached={isItemAttached}
                onAttachActionResultItem={onAttachActionResultItem}
              />
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-muted p-4 rounded-2xl shadow-lg">
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-pink-600 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

