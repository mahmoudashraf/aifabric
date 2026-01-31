import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, FileText, Info, Maximize2, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ChatMessage, DebugData } from "../../types";
import { RawResultJsonModal } from "./DebugInspector/RawResultJsonModal";

export function DebugInspectorPanel({
  isOpen,
  onClose,
  selectedDebugMessage,
  lastRequestData,
  lastResponseData,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDebugMessage: ChatMessage | null;
  lastRequestData: DebugData["request"] | null;
  lastResponseData: DebugData["response"] | null;
}) {
  const [isJsonPanelExpanded, setIsJsonPanelExpanded] = useState(false);
  const [isQueryExpanded, setIsQueryExpanded] = useState(false);

  return (
    <>
      {/* Debug Panel - Fixed Side Panel on XL, Modal on smaller screens */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Only on smaller screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] xl:hidden"
            />

            {/* Panel/Modal Container */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-2 md:inset-4 xl:inset-y-2 xl:left-2 xl:right-auto xl:w-[400px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">API Debug Inspector</h2>
                    <p className="text-[10px] text-white/70">Request & Response</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="h-7 w-7 rounded-lg text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Panel Content - Vertical Layout (Request then Response) */}
              <div className="flex-1 overflow-auto p-3">
                {(() => {
                  // Use selected message debug data or fall back to last request/response
                  const debugRequest = selectedDebugMessage?.debugData?.request || lastRequestData;
                  const debugResponse = selectedDebugMessage?.debugData?.response || lastResponseData;

                  if (!debugRequest && !debugResponse) {
                    return (
                      <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <Info className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">No API Calls Yet</h3>
                        <p className="text-xs text-gray-500 mt-1">Send a message to see details here.</p>
                      </div>
                    );
                  }

                  return (
                  <div className="space-y-4">
                    {/* Request Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Request</h3>
                        {debugRequest?.timestamp && (
                          <span className="text-[10px] text-gray-500 ml-auto">{new Date(debugRequest.timestamp).toLocaleTimeString()}</span>
                        )}
                      </div>

                      {debugRequest && (
                        <div className="space-y-2">
                          {/* Endpoint */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded">POST</span>
                              <span className="text-[10px] text-gray-500 truncate">{debugRequest.endpoint}</span>
                            </div>
                          </div>

                          {/* Query */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                            <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Query</h4>
                            <p className="text-xs text-gray-800 dark:text-gray-200">{debugRequest.payload?.query}</p>
                          </div>

                          {/* Position & Mode */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[9px] font-semibold text-gray-500 uppercase mb-0.5">Position</h4>
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                debugRequest.payload?.position === "checkout"
                                  ? "bg-orange-500 text-white"
                                  : debugRequest.payload?.position === "catalog"
                                  ? "bg-blue-500 text-white"
                                  : "bg-green-500 text-white"
                              }`}>
                                {debugRequest.payload?.position || "landing"}
                              </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[9px] font-semibold text-gray-500 uppercase mb-0.5">Mode</h4>
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                debugRequest.payload?.mode === "copilot"
                                  ? "bg-purple-500 text-white"
                                  : "bg-indigo-500 text-white"
                              }`}>
                                {debugRequest.payload?.mode || "navigator"}
                              </span>
                            </div>
                          </div>

                          {/* Attachments */}
                          {debugRequest.payload?.attachments && debugRequest.payload.attachments.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
                                Attachments ({debugRequest.payload.attachments.length})
                              </h4>
                              <div className="space-y-0.5 max-h-20 overflow-auto">
                                {debugRequest.payload.attachments.map((att: any, idx: number) => (
                                  <div key={idx} className="text-[10px] bg-white dark:bg-gray-700 rounded px-1.5 py-1">
                                    <div className="flex items-center gap-1">
                                      <span className="px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded text-[8px] font-medium">
                                        {att.vectorSpace}
                                      </span>
                                      <span className="text-gray-600 dark:text-gray-300 truncate text-[9px]">{att.id}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Full Payload - Collapsed by default */}
                          <details className="bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <summary className="px-2 py-1.5 cursor-pointer text-[10px] font-semibold text-gray-500 uppercase hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              Full Request Payload
                            </summary>
                            <pre className="px-2 pb-2 text-[8px] overflow-auto max-h-32 text-gray-700 dark:text-gray-300 font-mono">
                              {JSON.stringify(debugRequest.payload, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>

                    {/* Response Section */}
                    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Response</h3>
                        <div className="flex items-center gap-2 ml-auto">
                          {debugResponse?.durationMs != null && (
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                              debugResponse.durationMs < 1000 ? "bg-green-500/20 text-green-700 dark:text-green-300" :
                              debugResponse.durationMs < 3000 ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" :
                              "bg-red-500/20 text-red-700 dark:text-red-300"
                            }`}>
                              {debugResponse.durationMs < 1000
                                ? `${debugResponse.durationMs}ms`
                                : `${(debugResponse.durationMs / 1000).toFixed(2)}s`}
                            </span>
                          )}
                          {debugResponse?.timestamp && (
                            <span className="text-[10px] text-gray-500">{new Date(debugResponse.timestamp).toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>

                      {debugResponse && (() => {
                        const result = debugResponse.data?.result;
                        const resultData = result?.data;
                        const metadata = result?.metadata;

                        // RAG execution detection
                        const requiresRetrieval = resultData?.requiresRetrieval === true;
                        const retrievalSkipped = resultData?.metadata?.retrievalSkipped === true;
                        const retrievalSkipReason = resultData?.metadata?.retrievalSkipReason;
                        const hasRagResponse = resultData?.ragResponse != null;
                        const hasDocuments = resultData?.documents && resultData.documents.length > 0;
                        const ragExecuted = hasRagResponse || hasDocuments;

                        return (
                        <div className="space-y-2">
                          {/* Core Status Row */}
                          <div className="grid grid-cols-4 gap-1.5">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                result?.success ? "bg-green-500 text-white" : "bg-red-500 text-white"
                              }`}>
                                {result?.success ? "OK" : "ERR"}
                              </span>
                              <div className="text-[9px] text-gray-500 mt-0.5">Status</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                result?.type === "ACTION_EXECUTED" ? "bg-green-500 text-white" :
                                result?.type === "CONFIRMATION_REQUIRED" ? "bg-yellow-500 text-white" :
                                result?.type === "INFORMATION_PROVIDED" ? "bg-blue-500 text-white" :
                                result?.type === "ACTION_DENIED" ? "bg-red-500 text-white" :
                                "bg-gray-500 text-white"
                              }`}>
                                {result?.type?.replace(/_/g, ' ').substring(0, 12) || "N/A"}
                              </span>
                              <div className="text-[9px] text-gray-500 mt-0.5">Type</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{result?.errorCode || "—"}</span>
                              <div className="text-[9px] text-gray-500 mt-0.5">Error</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate block">{metadata?.requestId?.substring(0, 8) || "—"}</span>
                              <div className="text-[9px] text-gray-500 mt-0.5">ReqID</div>
                            </div>
                          </div>

                          {/* RAG Execution Status - Highlighted */}
                          <div className={`rounded-lg p-2 border ${
                            ragExecuted ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300 dark:border-emerald-700" :
                            retrievalSkipped ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700" :
                            requiresRetrieval ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-700" :
                            "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          }`}>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold uppercase ${
                                    ragExecuted ? "text-emerald-700 dark:text-emerald-300" :
                                    retrievalSkipped ? "text-amber-700 dark:text-amber-300" :
                                    "text-gray-600 dark:text-gray-400"
                                  }`}>
                                    🔍 RAG Status
                                  </span>
                                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                                    ragExecuted ? "bg-emerald-500 text-white" :
                                    retrievalSkipped ? "bg-amber-500 text-white" :
                                    requiresRetrieval ? "bg-blue-500 text-white" :
                                    "bg-gray-400 text-white"
                                  }`}>
                                    {ragExecuted ? "EXECUTED" : retrievalSkipped ? "SKIPPED" : requiresRetrieval ? "INTENDED" : "NOT REQUIRED"}
                                  </span>
                                </div>
                                <div className="flex gap-2 text-[9px]">
                                  {requiresRetrieval && <span className="text-blue-600">retrieval:✓</span>}
                                  {resultData?.requiresGeneration && <span className="text-purple-600">generation:✓</span>}
                                  {retrievalSkipped && <span className="text-amber-600">skip:{retrievalSkipReason}</span>}
                                </div>
                              </div>
                              {hasRagResponse && (
                                <div className="flex items-start gap-1 text-[9px]">
                                  <span className="text-gray-500 font-medium shrink-0">Query:</span>
                                  <span className="text-gray-700 dark:text-gray-300 line-clamp-1 flex-1">
                                    {debugRequest?.payload?.query || resultData.ragResponse.query}
                                  </span>
                                </div>
                              )}
                            </div>
                            {hasRagResponse && (() => {
                              const originalQuery = debugRequest?.payload?.query || resultData.ragResponse.query;
                              const optimizedQuery = resultData.ragResponse.optimizedQuery || resultData.ragResponse.query;
                              const charLimit = 100;
                              const shouldShowExpand = originalQuery?.length > charLimit || optimizedQuery?.length > charLimit;

                              return (
                                <div className="mt-1.5 space-y-1.5">
                                  {/* Query Display Section */}
                                  <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Queries</span>
                                      {shouldShowExpand && (
                                        <button
                                          onClick={() => setIsQueryExpanded(!isQueryExpanded)}
                                          className="flex items-center gap-1 text-[9px] text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        >
                                          {isQueryExpanded ? (
                                            <>
                                              <ChevronUp className="h-3 w-3" />
                                              <span>See less</span>
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="h-3 w-3" />
                                              <span>See more</span>
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>

                                    {/* Original Query */}
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-1">
                                        <span className="text-[9px] text-gray-500 font-medium">Original:</span>
                                        <span className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[8px] font-bold">USER INPUT</span>
                                      </div>
                                      <p className={`text-[10px] text-gray-800 dark:text-gray-200 ${!isQueryExpanded && originalQuery?.length > charLimit ? 'line-clamp-2' : ''}`}>
                                        {isQueryExpanded ? originalQuery : (originalQuery?.length > charLimit ? `${originalQuery.substring(0, charLimit)}...` : originalQuery)}
                                      </p>
                                    </div>

                                    {/* Optimized Query */}
                                    {optimizedQuery && optimizedQuery !== originalQuery && (
                                      <div className="space-y-0.5 pt-1 border-t border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center gap-1">
                                          <span className="text-[9px] text-gray-500 font-medium">Optimized:</span>
                                          <span className="px-1 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[8px] font-bold">FOR EMBEDDINGS</span>
                                        </div>
                                        <p className={`text-[10px] text-gray-800 dark:text-gray-200 ${!isQueryExpanded && optimizedQuery?.length > charLimit ? 'line-clamp-2' : ''}`}>
                                          {isQueryExpanded ? optimizedQuery : (optimizedQuery?.length > charLimit ? `${optimizedQuery.substring(0, charLimit)}...` : optimizedQuery)}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Metadata Grid */}
                                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                                    <div className="text-center bg-white/50 dark:bg-gray-700/50 rounded px-1.5 py-1">
                                      <div className="text-gray-500 text-[8px]">Entity</div>
                                      <div className="font-bold text-gray-700 dark:text-gray-300">{resultData.ragResponse.entityType}</div>
                                    </div>
                                    <div className="text-center bg-white/50 dark:bg-gray-700/50 rounded px-1.5 py-1">
                                      <div className="text-gray-500 text-[8px]">Docs</div>
                                      <div className="font-bold text-gray-700 dark:text-gray-300">{resultData.ragResponse.usedDocuments || resultData.documents?.length || 0}</div>
                                    </div>
                                    <div className="text-center bg-white/50 dark:bg-gray-700/50 rounded px-1.5 py-1">
                                      <div className="text-gray-500 text-[8px]">Time</div>
                                      <div className="font-bold text-gray-700 dark:text-gray-300">{resultData.ragResponse.processingTimeMs}ms</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Orchestration Policy */}
                          {metadata?.orchestrationPolicy && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-indigo-200 dark:border-indigo-800">
                              <h4 className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase mb-1 flex items-center gap-1">
                                <Sparkles className="h-2.5 w-2.5" /> Orchestration
                              </h4>
                              <div className="grid grid-cols-3 gap-1 text-[9px]">
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Profile</span>
                                  <span className="font-bold text-indigo-600">{metadata.orchestrationPolicy.profile}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Mode</span>
                                  <span className="font-bold text-purple-600">{metadata.orchestrationPolicy.mode}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Position</span>
                                  <span className="font-bold text-cyan-600">{metadata.orchestrationPolicy.position}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">InfoMode</span>
                                  <span className="font-bold text-teal-600">{metadata.orchestrationPolicy.informationModeEffective}</span>
                                </div>
                                <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                  <span className="text-gray-500">Source</span>
                                  <span className="font-bold text-gray-600">{metadata.orchestrationPolicy.modeSource}</span>
                                </div>
                                {metadata.orchestrationPolicy.advancedRagOverride && (
                                  <div className="flex justify-between bg-white/50 dark:bg-gray-800/50 rounded px-1.5 py-1">
                                    <span className="text-gray-500">RAG Override</span>
                                    <span className="font-bold text-orange-600">✓</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Extraction Diagnostics with Strategy */}
                          {metadata?.extractionDiagnostics && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Extraction</h4>
                              <div className="grid grid-cols-4 gap-1 text-[9px] mb-1">
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.extractionPath}</div>
                                  <div className="text-gray-500">Path</div>
                                </div>
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.extractionAttempts}</div>
                                  <div className="text-gray-500">Attempts</div>
                                </div>
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.llmCalls}</div>
                                  <div className="text-gray-500">LLM</div>
                                </div>
                                <div className="text-center bg-white dark:bg-gray-700 rounded p-1">
                                  <div className="font-bold text-gray-700 dark:text-gray-300">{metadata.extractionDiagnostics.attempts?.length || 0}</div>
                                  <div className="text-gray-500">Logged</div>
                                </div>
                              </div>
                              {metadata.extractionDiagnostics.attempts && metadata.extractionDiagnostics.attempts.length > 0 && (
                                <div className="space-y-0.5 max-h-16 overflow-auto">
                                  {metadata.extractionDiagnostics.attempts.map((attempt: any, idx: number) => (
                                    <div key={idx} className={`flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded ${
                                      attempt.success ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                                    }`}>
                                      <span className={`font-bold ${attempt.success ? "text-green-700" : "text-red-700"}`}>
                                        {attempt.success ? "✓" : "✗"}
                                      </span>
                                      <span className="font-medium text-indigo-600">{attempt.strategy}</span>
                                      <span className="text-gray-500">llm:{attempt.llmCalls}</span>
                                      {attempt.errorCategory && <span className="text-red-600">{attempt.errorCategory}</span>}
                                      {attempt.issueCodes && <span className="text-orange-600">[{attempt.issueCodes.join(',')}]</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Intent & Chat Metadata Row */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {/* Intent Metadata */}
                            {metadata?.intentMetadata && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Intent</h4>
                                <div className="text-[9px] space-y-0.5">
                                  {metadata.intentMetadata.fallback && (
                                    <div className="flex justify-between text-amber-600">
                                      <span>Fallback:</span>
                                      <span className="font-bold">✓</span>
                                    </div>
                                  )}
                                  {metadata.intentMetadata.confidence && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Confidence:</span>
                                      <span className="font-medium">{(metadata.intentMetadata.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Chat Metadata */}
                            {metadata?.chat && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Chat</h4>
                                <div className="grid grid-cols-2 gap-0.5 text-[9px]">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">History:</span>
                                    <span className="font-medium">{metadata.chat.historyChars || 0}ch</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Window:</span>
                                    <span className="font-medium">{metadata.chat.windowSize || 0}</span>
                                  </div>
                                  <div className="flex justify-between col-span-2">
                                    <span className="text-gray-500">Memory:</span>
                                    <span className="font-medium">{metadata.chat.memoryStrategy || "—"}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Attachments & Target Resolution Row */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {metadata?.attachments && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Attachments</h4>
                                <div className="grid grid-cols-2 gap-0.5 text-[9px]">
                                  <div className="flex justify-between"><span className="text-gray-500">Prov:</span><span className="font-medium">{metadata.attachments.providedCount}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Acc:</span><span className="font-medium">{metadata.attachments.acceptedCount}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Active:</span><span className="font-medium">{metadata.attachments.activeResolvedCount}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Invalid:</span><span className="font-medium">{metadata.attachments.invalidVectorSpacesCount || 0}</span></div>
                                </div>
                                {metadata.attachmentsPrompt && (
                                  <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700 text-[9px]">
                                    <span className="text-gray-500">Prompt: </span>
                                    <span className={`font-medium ${metadata.attachmentsPrompt.injected ? "text-green-600" : "text-gray-400"}`}>
                                      {metadata.attachmentsPrompt.injected ? `✓ ${metadata.attachmentsPrompt.attachmentsCount} att` : "—"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            {metadata?.targetResolution && (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Target Resolution</h4>
                                <div className="text-[9px] space-y-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Source:</span>
                                    <span className="font-medium">{metadata.targetResolution.source}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Count:</span>
                                    <span className="font-medium">{metadata.targetResolution.count}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Vector Space Routing */}
                          {metadata?.vectorSpaceRouting && metadata.vectorSpaceRouting.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                              <h4 className="text-[10px] font-bold text-gray-600 uppercase mb-1">Vector Space Routing ({metadata.vectorSpaceRouting.length})</h4>
                              <div className="space-y-0.5 max-h-20 overflow-auto">
                                {metadata.vectorSpaceRouting.map((evt: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-1 text-[8px] bg-white dark:bg-gray-700 rounded px-1.5 py-0.5">
                                    <span className="text-purple-600 font-medium">{evt.strategy}</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="text-blue-600 font-bold">{evt.vectorSpace}</span>
                                    {evt.candidateSpaces && <span className="text-gray-500">[{evt.candidateSpaces.join(',')}]</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Execution (for ACTION types) */}
                          {(result?.type === "ACTION_EXECUTED" || result?.type === "CONFIRMATION_REQUIRED" || result?.type === "ACTION_DENIED") && (
                            <div className={`rounded-lg p-2 border ${
                              result?.type === "ACTION_EXECUTED" ? "bg-green-50 dark:bg-green-900/20 border-green-200" :
                              result?.type === "CONFIRMATION_REQUIRED" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200" :
                              "bg-red-50 dark:bg-red-900/20 border-red-200"
                            }`}>
                              <h4 className="text-[10px] font-bold uppercase mb-1">Action</h4>
                              <div className="grid grid-cols-3 gap-1 text-[9px]">
                                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{resultData?.action || "—"}</span></div>
                                <div><span className="text-gray-500">Confirm:</span> <span className="font-medium">{resultData?.confirmationRequired ? "Yes" : "No"}</span></div>
                                {resultData?.actionResult && (
                                  <div><span className="text-gray-500">Result:</span> <span className={`font-medium ${resultData.actionResult.success ? "text-green-600" : "text-red-600"}`}>{resultData.actionResult.success ? "OK" : resultData.actionResult.errorCode}</span></div>
                                )}
                              </div>
                              {resultData?.confirmationMessage && (
                                <div className="mt-1 text-[9px] text-gray-600 italic truncate">{resultData.confirmationMessage}</div>
                              )}
                            </div>
                          )}

                          {/* Compact Full Response with Expand */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-[10px] font-bold text-gray-500 uppercase">Raw Result JSON</span>
                              <button
                                onClick={() => setIsJsonPanelExpanded(true)}
                                className="flex items-center gap-1 text-[9px] text-purple-600 hover:text-purple-700 font-medium"
                              >
                                <Maximize2 className="h-3 w-3" />
                                Expand
                              </button>
                            </div>
                            <pre className="px-2 py-1.5 text-[8px] overflow-auto max-h-24 text-gray-600 dark:text-gray-400 font-mono">
                              {JSON.stringify(result, null, 2)}
                            </pre>
                          </div>
                        </div>
                        );
                      })()}
                    </div>
                  </div>
                  );
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <RawResultJsonModal
        isOpen={isJsonPanelExpanded}
        onClose={() => setIsJsonPanelExpanded(false)}
        selectedDebugMessage={selectedDebugMessage}
        lastResponseData={lastResponseData}
      />

    </>
  );
}
