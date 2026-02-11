import { RefObject, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, MessageSquare, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import type { ChatMessage as ChatMessageType, Document } from "../../types";

interface ChatPanelProps {
  isExpanded: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  isLoading: boolean;
  onConfirmation: (action: "confirm" | "deny", data?: any) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
  onResendAction?: (query: string) => void;
  onClarificationSubmit?: (action: string, parameters: Record<string, any>) => void;
}

export function ChatPanel({
  isExpanded,
  onClose,
  messages,
  isLoading,
  onConfirmation,
  messagesEndRef,
  onResendAction,
  onClarificationSubmit,
}: ChatPanelProps) {
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Extract all documents from messages, deduped, newest first
  const allDocuments = useMemo(() => {
    const docs: Document[] = [];
    const seenIds = new Set<string>();
    // Iterate in reverse so newest messages come first
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.documents) {
        for (const doc of msg.documents) {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);
            docs.push(doc);
          }
        }
      }
    }
    return docs;
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  const typeColors: Record<string, string> = {
    review: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    product: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    order: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  };

  // Document detail modal
  const documentDetailModal = selectedDocument && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedDocument(null)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-4 md:inset-x-[15%] md:inset-y-[10%] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
      >
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {selectedDocument.title || `Document ${selectedDocument.id}`}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[selectedDocument.type] || "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"}`}>
                  {selectedDocument.type}
                </span>
                <span className="text-[10px] text-gray-400">ID: {selectedDocument.id}</span>
                {selectedDocument.score != null && (
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    {(selectedDocument.score * 100).toFixed(1)}% relevance
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => setSelectedDocument(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Content</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedDocument.content}</p>
            </div>
          </div>
          {selectedDocument.metadata && Object.keys(selectedDocument.metadata).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Metadata</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedDocument.metadata)
                  .filter(([, v]) => v != null && v !== "")
                  .map(([key, value]) => (
                    <div key={key} className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase">{key}</div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 break-all">{String(value)}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {(selectedDocument.score != null || selectedDocument.similarity != null) && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Relevance Scores</h3>
              <div className="flex gap-3">
                {selectedDocument.score != null && (
                  <div className="flex-1 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{(selectedDocument.score * 100).toFixed(1)}%</div>
                    <div className="text-[10px] text-purple-500 font-medium mt-0.5">Score</div>
                  </div>
                )}
                {selectedDocument.similarity != null && (
                  <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(selectedDocument.similarity * 100).toFixed(1)}%</div>
                    <div className="text-[10px] text-blue-500 font-medium mt-0.5">Similarity</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );

  return (
    <>
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

            {/* Chat window - wider to accommodate documents panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 sm:bottom-24 left-0 sm:left-4 right-0 sm:right-4 max-w-full sm:max-w-4xl mx-auto bg-background border-0 sm:border rounded-none sm:rounded-2xl shadow-2xl z-40 max-h-[calc(100vh-80px)] sm:max-h-[70vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">AI Assistant</span>
                  {allDocuments.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                      {allDocuments.length} doc{allDocuments.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Show All Documents View */}
              {showAllDocs ? (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setShowAllDocs(false)}
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to chat
                    </button>
                    <span className="text-sm text-gray-500">
                      {allDocuments.length} document{allDocuments.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {allDocuments.map((doc) => {
                      const typeColor = typeColors[doc.type] || "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300";
                      const TypeIcon = doc.type === "review" ? Star : FileText;

                      return (
                        <motion.button
                          key={doc.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setSelectedDocument(doc)}
                          className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all p-3"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`p-1.5 rounded-lg ${typeColor} flex-shrink-0 mt-0.5`}>
                              <TypeIcon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${typeColor}`}>{doc.type}</span>
                                <span className="text-[9px] text-gray-400 dark:text-gray-500">id: {doc.id}</span>
                                {doc.score != null && (
                                  <span className="ml-auto text-[9px] font-bold text-purple-600 dark:text-purple-400">
                                    {(doc.score * 100).toFixed(1)}% match
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">{doc.content}</p>
                              {doc.metadata && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {Object.entries(doc.metadata)
                                    .filter(([, v]) => v != null && v !== "")
                                    .slice(0, 4)
                                    .map(([key, value]) => (
                                      <span key={key} className="text-[9px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                                        {key}: {String(value).substring(0, 30)}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Chat + Documents side panel layout */
                <div className="flex-1 flex overflow-hidden">
                  {/* Messages area */}
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
                            onResendAction={onResendAction}
                            onNextStepClick={onResendAction}
                            onClarificationSubmit={
                              message.resultType === "CLARIFICATION_REQUIRED"
                                ? onClarificationSubmit
                                : undefined
                            }
                          />
                        ))}
                        {isLoading && <LoadingMessage />}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Right documents panel - desktop only */}
                  {allDocuments.length > 0 && (
                    <div className="hidden sm:flex w-48 flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3 w-3 text-purple-500" />
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                              Documents
                            </span>
                          </div>
                          <button
                            onClick={() => setShowAllDocs(true)}
                            className="text-[9px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                          >
                            See all
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                        {allDocuments.slice(0, 10).map((doc) => {
                          const typeColor = typeColors[doc.type] || "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300";

                          return (
                            <button
                              key={doc.id}
                              onClick={() => setSelectedDocument(doc)}
                              className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-400 hover:shadow-sm transition-all p-1.5"
                            >
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${typeColor}`}>{doc.type}</span>
                                {doc.score != null && (
                                  <span className="ml-auto text-[8px] font-bold text-purple-600 dark:text-purple-400">
                                    {(doc.score * 100).toFixed(0)}%
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {doc.title || doc.content.substring(0, 60)}
                              </p>
                            </button>
                          );
                        })}
                        {allDocuments.length > 10 && (
                          <button
                            onClick={() => setShowAllDocs(true)}
                            className="w-full text-center text-[9px] font-bold text-blue-600 dark:text-blue-400 py-1.5 hover:text-blue-700 transition-colors"
                          >
                            +{allDocuments.length - 10} more
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {documentDetailModal}
      </AnimatePresence>
    </>
  );
}
