import { RefObject, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "../../types";

interface ChatPanelProps {
  isExpanded: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onConfirmation: (action: "confirm" | "deny", data?: any) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function ChatPanel({
  isExpanded,
  onClose,
  messages,
  isLoading,
  onConfirmation,
  messagesEndRef,
}: ChatPanelProps) {
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  return (
    <AnimatePresence>
      {isExpanded && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30"
          />

          {/* Chat window */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-4 right-4 max-w-2xl mx-auto bg-background border rounded-2xl shadow-2xl z-40 max-h-[60vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Start a conversation by typing a message below
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Attach products, reviews, or coupons for context-aware responses
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onConfirmation={
                        message.resultType === "CONFIRMATION_REQUIRED"
                          ? onConfirmation
                          : undefined
                      }
                    />
                  ))}
                  {isLoading && <LoadingMessage />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
