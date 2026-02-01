import { motion } from "framer-motion";
import { Bot, Sparkles, FileText, Search } from "lucide-react";
import type { ChatMessage } from "../../types";

interface AIThinkingAnimationProps {
  messages: ChatMessage[];
  attachedItems?: Array<{ type: string; data: any }>;
}

export function AIThinkingAnimation({ messages, attachedItems = [] }: AIThinkingAnimationProps) {
  // Get the last user message
  const lastUserMessage = [...messages].reverse().find((m) => m.type === "user");
  const userQuery = lastUserMessage?.content || "your request";

  // Truncate query if too long
  const displayQuery = userQuery.length > 60 ? userQuery.substring(0, 60) + "..." : userQuery;

  const thinkingSteps = [
    "Analyzing your request",
    "Processing data",
    "Generating response",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="max-w-2xl">
        {/* Main AI thinking card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-800">
          {/* Header with AI icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="p-2.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-md"
              >
                <Bot className="h-5 w-5 text-white" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-bold text-blue-700 dark:text-blue-300"
              >
                AI is thinking...
              </motion.div>
            </div>
          </div>

          {/* User request context */}
          <div className="mb-3 p-3 bg-white/60 dark:bg-gray-900/40 rounded-xl border border-blue-100 dark:border-blue-900">
            <div className="flex items-start gap-2">
              <Search className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                  Processing
                </div>
                <div className="text-sm text-gray-800 dark:text-gray-200 font-medium line-clamp-2">
                  "{displayQuery}"
                </div>
              </div>
            </div>
          </div>

          {/* Attached items indicator */}
          {attachedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-3 p-3 bg-white/60 dark:bg-gray-900/40 rounded-xl border border-purple-100 dark:border-purple-900"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  Analyzing {attachedItems.length} attached item{attachedItems.length > 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>
          )}

          {/* Animated thinking steps */}
          <div className="space-y-2">
            {thinkingSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: index * 0.2,
                  }}
                  className="w-1.5 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{step}</span>
              </motion.div>
            ))}
          </div>

          {/* Animated pulse bar */}
          <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="h-full w-1/3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
