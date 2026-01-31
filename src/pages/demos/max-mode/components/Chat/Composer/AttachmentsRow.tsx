import { AnimatePresence, motion } from "framer-motion";
import { MessageSquarePlus, Search, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { AttachedItem } from "../types";

export function AttachmentsRow({
  items,
  onRemoveAttachment,
}: {
  items: AttachedItem[];
  onRemoveAttachment: (filteredIndex: number) => void;
}) {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-2 md:mb-3 flex flex-wrap gap-1.5 md:gap-2 max-h-[120px] md:max-h-[200px] overflow-y-auto"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, idx) => {
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
                    aria-label="Remove attachment"
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
  );
}
