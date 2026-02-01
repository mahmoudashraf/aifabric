import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, FileText, Search, ShoppingCart, Package, Clock, Paperclip } from "lucide-react";
import { useState, useEffect } from "react";
import type { ChatMessage } from "../../types";

interface AIThinkingAnimationProps {
  messages: ChatMessage[];
  attachedItems?: Array<{ type: string; data: any }>;
}

// Generate contextual thinking steps based on user's request and available data
function generateThinkingSteps(
  messages: ChatMessage[],
  attachedItems: Array<{ type: string; data: any }>
): string[] {
  const steps: string[] = [];

  // Get the last user message
  const lastUserMessage = [...messages].reverse().find((m) => m.type === "user");
  const userQuery = lastUserMessage?.content || "";
  const queryLower = userQuery.toLowerCase();
  const searchCategory = lastUserMessage?.searchCategory;

  // Step 1: Always analyze the request first - be specific about what
  if (searchCategory) {
    steps.push(`Analyzing request for "${searchCategory}"`);
  } else if (queryLower.includes("list") || queryLower.includes("show") || queryLower.includes("browse")) {
    // Extract what they're searching for
    const searchTerm = queryLower.includes("laptop") ? "laptops" :
                       queryLower.includes("phone") ? "phones" :
                       queryLower.includes("headphone") ? "headphones" :
                       queryLower.includes("apple") ? "Apple products" : "products";
    steps.push(`Understanding search for ${searchTerm}`);
  } else if (queryLower.includes("order") || queryLower.includes("buy") || queryLower.includes("purchase")) {
    steps.push("Processing order request");
  } else if (queryLower.includes("track") || queryLower.includes("status")) {
    steps.push("Analyzing tracking request");
  } else {
    steps.push("Understanding your request");
  }

  // Step 2: Show actual attached items being reviewed
  if (attachedItems.length > 0) {
    attachedItems.forEach((item, index) => {
      const itemName = item.data?.name || item.data?.title || item.data?.sku || `Item ${index + 1}`;
      const itemType = item.type.includes("product") ? "product" :
                      item.type.includes("document") ? "document" : "item";

      if (attachedItems.length === 1) {
        steps.push(`Reviewing ${itemType}: "${itemName}"`);
      } else if (index === 0) {
        steps.push(`Analyzing ${attachedItems.length} attached items`);
        steps.push(`Reviewing "${itemName}"`);
      }
    });
  }

  // Step 3: Reference previous conversation context
  const previousAIMessages = messages.filter((m) => m.type === "ai" && m.result?.sanitizedPayload?.data);
  const previousUserMessages = messages.filter((m) => m.type === "user").slice(-3, -1); // Get last 2 user messages before current

  if (previousAIMessages.length > 0) {
    const lastAIMessage = previousAIMessages[previousAIMessages.length - 1];
    const data = lastAIMessage.result?.sanitizedPayload?.data;

    // Check if there's product data in previous results
    if (data && typeof data === "object") {
      const productArrays = Object.entries(data).filter(([key, val]) =>
        Array.isArray(val) && val.length > 0 && val[0]?.sku
      );

      if (productArrays.length > 0) {
        const [key, products] = productArrays[0];
        const productCount = (products as any[]).length;
        steps.push(`Comparing with ${productCount} previous results`);
      }
    }
  }

  // Show previous user requests for context
  if (previousUserMessages.length > 0 && attachedItems.length > 0) {
    steps.push("Considering conversation history");
  }

  // Step 4: Action-specific processing steps - be very specific
  if (queryLower.includes("laptop") || queryLower.includes("computer")) {
    steps.push("Searching product database");
    steps.push("Filtering laptops by specifications");
    steps.push("Checking stock levels and pricing");
  } else if (queryLower.includes("phone") || queryLower.includes("smartphone")) {
    steps.push("Querying phone inventory");
    steps.push("Checking availability and prices");
  } else if (queryLower.includes("headphone") || queryLower.includes("audio")) {
    steps.push("Searching audio products");
    steps.push("Checking inventory status");
  } else if (queryLower.includes("order") && attachedItems.length > 0) {
    const totalItems = attachedItems.length;
    steps.push(`Verifying ${totalItems} product${totalItems > 1 ? 's' : ''} availability`);
    steps.push("Calculating order total");
    steps.push("Processing order details");
  } else if (queryLower.includes("track")) {
    steps.push("Accessing order database");
    steps.push("Retrieving shipment details");
  } else if (queryLower.includes("compare")) {
    steps.push("Gathering product specifications");
    steps.push("Analyzing features and pricing");
  } else {
    // Generic processing step for other queries
    steps.push("Processing database query");
  }

  // Final step: Always prepare response
  steps.push("Generating response");

  return steps;
}

export function AIThinkingAnimation({ messages, attachedItems = [] }: AIThinkingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);

  useEffect(() => {
    // Generate steps when component mounts
    const steps = generateThinkingSteps(messages, attachedItems);
    setThinkingSteps(steps);
    setCurrentStep(0);

    // Cycle through steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [messages, attachedItems]);

  // Get the last user message for display
  const lastUserMessage = [...messages].reverse().find((m) => m.type === "user");
  const userQuery = lastUserMessage?.content || "your request";
  const displayQuery = userQuery.length > 70 ? userQuery.substring(0, 70) + "..." : userQuery;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-800">
          {/* Header with AI icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md"
              >
                <Bot className="h-5 w-5 text-white" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div className="text-sm font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                AI is thinking...
              </motion.div>
            </div>
          </div>

          {/* User request context */}
          <div className="mb-3 p-3 bg-white/70 dark:bg-gray-900/50 rounded-xl border border-blue-100 dark:border-blue-900 backdrop-blur-sm">
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

          {/* Attached items indicator - show actual items */}
          {attachedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-3 space-y-2"
            >
              <div className="flex items-center gap-2 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                <Package className="h-3.5 w-3.5" />
                <span>Analyzing {attachedItems.length} attached item{attachedItems.length > 1 ? "s" : ""}</span>
              </div>
              {attachedItems.slice(0, 3).map((item, index) => {
                const itemName = item.data?.name || item.data?.title || item.data?.sku || `Item ${index + 1}`;
                const itemPrice = item.data?.price;
                const itemType = item.type.includes("product") ? "Product" : item.type.includes("document") ? "Document" : "Item";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2.5 bg-white/70 dark:bg-gray-900/50 rounded-lg border border-indigo-100 dark:border-indigo-900 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2">
                      <Paperclip className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5">
                          {itemType}
                        </div>
                        <div className="text-xs text-gray-800 dark:text-gray-200 font-medium line-clamp-1">
                          {itemName}
                        </div>
                        {itemPrice && (
                          <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold mt-0.5">
                            ${typeof itemPrice === "number" ? itemPrice.toLocaleString() : itemPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {attachedItems.length > 3 && (
                <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                  +{attachedItems.length - 3} more item{attachedItems.length - 3 > 1 ? "s" : ""}
                </div>
              )}
            </motion.div>
          )}

          {/* Current thinking step - larger and more prominent */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-3 p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-xl border-2 border-blue-300/50 dark:border-blue-700/50"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                  }}
                  className="flex-shrink-0"
                >
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                  {thinkingSteps[currentStep] || "Processing..."}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* All thinking steps with progress indicator */}
          <div className="space-y-1.5">
            {thinkingSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{
                    scale: index === currentStep ? [1, 1.4, 1] : 1,
                    opacity: index <= currentStep ? 1 : 0.3,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index <= currentStep
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
                <span
                  className={`text-xs transition-all duration-300 ${
                    index === currentStep
                      ? "font-semibold text-blue-700 dark:text-blue-300"
                      : index < currentStep
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Animated progress bar */}
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
              className="h-full w-1/3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full shadow-lg"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
