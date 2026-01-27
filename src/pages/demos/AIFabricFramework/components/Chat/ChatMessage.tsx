import { motion } from "framer-motion";
import { Bot, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getResultTypeStyles } from "../../utils/resultTypeStyles";
import { ActionResultRenderer } from "./ActionResultRenderer";
import type { ChatMessage as ChatMessageType } from "../../types";

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
  onConfirmation?: (action: "confirm" | "deny", data?: any) => void;
}

export function ChatMessage({ message, isLoading, onConfirmation }: ChatMessageProps) {
  const styles = getResultTypeStyles(message.resultType);
  const Icon = styles.icon;

  if (message.type === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.attachedProducts && message.attachedProducts.length > 0 && (
            <div className="mt-2 pt-2 border-t border-primary-foreground/20">
              <p className="text-xs opacity-70 mb-1">Attached:</p>
              <div className="flex flex-wrap gap-1">
                {message.attachedProducts.map((p) => (
                  <Badge key={p.id} variant="secondary" className="text-xs bg-primary-foreground/20">
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // AI message
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div
        className={`max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 border ${styles.bgColor} ${styles.borderColor}`}
      >
        <div className="flex items-start gap-2">
          <div className={`p-1 rounded-full ${styles.badgeBg}`}>
            <Icon className={`h-4 w-4 ${styles.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            {/* Result type badge */}
            {!styles.hideBadge && (
              <Badge className={`mb-2 ${styles.badgeBg} ${styles.badgeText} border-0`}>
                {styles.label}
              </Badge>
            )}

            {/* Message content */}
            <p className={`text-sm whitespace-pre-wrap ${styles.textColor}`}>
              {message.content}
            </p>

            {/* Orchestration info */}
            {message.orchestration && (
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  Intent: {message.orchestration.intent}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Confidence: {(message.orchestration.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            )}

            {/* Action result data */}
            {message.result?.sanitizedPayload?.data && (
              <ActionResultRenderer
                data={message.result.sanitizedPayload.data}
                messageId={message.id}
              />
            )}

            {/* Confirmation buttons */}
            {message.resultType === "CONFIRMATION_REQUIRED" && onConfirmation && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onConfirmation("confirm", message.result?.sanitizedPayload?.data)}
                >
                  Yes, Proceed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onConfirmation("deny")}
                >
                  No, Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
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
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
