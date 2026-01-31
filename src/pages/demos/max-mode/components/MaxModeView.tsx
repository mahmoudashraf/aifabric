import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { Composer } from "./Chat/Composer";
import { MessageList } from "./Chat/MessageList";
import { ConversationHistoryPanel } from "./Conversations/ConversationHistoryPanel";
import { DebugInspectorPanel } from "./Panels/DebugInspectorPanel";
import { DesktopContextPanel } from "./DesktopContextPanel";
import { MaxModeHeader } from "./MaxModeHeader";
import { MobileContextSheet } from "./MobileContextSheet";
import { MobileFloatingActions } from "./MobileFloatingActions";
import { MobileNewDocsPreviewPanel } from "./MobileNewDocsPreviewPanel";
import { QuickActionsDesktop } from "./QuickActionsDesktop";
import { QuickActionsMobileSheet } from "./QuickActionsMobileSheet";

import type { MaxModeController } from "../hooks/useMaxModeController";

export function MaxModeView({
  onClose,
  controller,
}: {
  onClose: () => void;
  controller: MaxModeController;
}) {
  const {
    showSampleDocuments,
    quickActions,
    searchCategories,
    browseProductCategories,
    aiSearchCategories,
    isSearchCategoryOpen,
    setIsSearchCategoryOpen,
    isBrowseProductsOpen,
    setIsBrowseProductsOpen,
    isQuickActionsOpen,
    setIsQuickActionsOpen,
    handleSelectSearchCategory,
    handleQuickAction,
    isPanelVisible,
    setIsPanelVisible,
    contextDocuments,
    selectedProduct,
    isCartView,
    chatMessages,
    latestMessageRef,
    messagesEndRef,
    isLoading,
    getResultStyles,
    attachedItems,
    confirmationStatus,
    expandedActions,
    handleConfirmation,
    isItemAttached,
    handleAttachActionResultItem,
    openDebugInspector,
    closeDebugInspector,
    resendChatQuery,
    reattachItemWithToast,
    openSourcesMobile,
    openSourcesDesktop,
    expandActionResults,
    removeNonAiAttachmentByIndex,
    removeAiSearchAttachment,
    dismissSuggestions,
    selectSuggestion,
    attachCartToChat,
    proceedToCheckoutFromCart,
    browseProductsFromCart,
    contextPanelRef,
    contextPanelEndRef,
    cartData,
    newDocuments,
    viewedDocumentIds,
    openProductDetails,
    closeCart,
    closeProductDetails,
    removeFromCart,
    addToCart,
    handleAttachDocument,
    isAISearchOpen,
    setIsAISearchOpen,
    aiSearchRowRef,
    aiSearchButtonRef,
    handleAISearchCategory,
    isFloatingMenuCollapsed,
    setIsFloatingMenuCollapsed,
    openCart,
    isNewDocsPreviewOpen,
    handleCloseNewDocsPreview,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    handleOpenBottomSheet,
    isInputFocused,
    setIsInputFocused,
    searchCategory,
    clearSearchCategory,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isLoadingSuggestions,
    oldConversationLocked,
    startNewConversation,
    openConversationsPanel,
    chatQuery,
    setChatQuery,
    chatInputRef,
    currentPosition,
    isDebugModalOpen,
    selectedDebugMessage,
    lastRequestData,
    lastResponseData,
    isConversationsOpen,
    setIsConversationsOpen,
    conversations,
    isLoadingConversations,
    currentConversationId,
    openConversation,
    handleDeleteConversation,
    collectingItem,
  } = controller;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-50 via-blue-50/50 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900/90"
    >
      <MaxModeHeader onClose={onClose} onShowSampleDocuments={showSampleDocuments} />

      <QuickActionsDesktop
        quickActions={quickActions}
        isSearchCategoryOpen={isSearchCategoryOpen}
        setIsSearchCategoryOpen={setIsSearchCategoryOpen}
        isBrowseProductsOpen={isBrowseProductsOpen}
        setIsBrowseProductsOpen={setIsBrowseProductsOpen}
        searchCategories={searchCategories}
        browseProductCategories={browseProductCategories}
        onSelectSearchCategory={handleSelectSearchCategory}
        onQuickAction={handleQuickAction}
      />

      <QuickActionsMobileSheet
        isOpen={isQuickActionsOpen}
        setIsOpen={setIsQuickActionsOpen}
        quickActions={quickActions}
        isSearchCategoryOpen={isSearchCategoryOpen}
        setIsSearchCategoryOpen={setIsSearchCategoryOpen}
        isBrowseProductsOpen={isBrowseProductsOpen}
        setIsBrowseProductsOpen={setIsBrowseProductsOpen}
        searchCategories={searchCategories}
        browseProductCategories={browseProductCategories}
        onSelectSearchCategory={handleSelectSearchCategory}
        onQuickAction={handleQuickAction}
      />

      {/* Main Split Content */}
      <div className="h-full relative">
        {/* Chat Messages - Full Width */}
        <MessageList
          containerClassName={`absolute top-0 md:top-[72px] left-0 right-0 bottom-0 overflow-y-auto px-3 md:px-6 py-4 md:py-6 pb-[180px] md:pb-[240px] transition-all ${isPanelVisible && contextDocuments.length > 0 ? (selectedProduct || isCartView ? 'md:pr-[730px]' : 'md:pr-[450px]') : 'md:pr-4'} ${isDebugModalOpen ? 'xl:pl-[420px]' : ''}`}
          messages={chatMessages}
          latestMessageRef={latestMessageRef}
          messagesEndRef={messagesEndRef}
          isLoading={isLoading}
          getAiStyles={getResultStyles}
          isPanelVisible={isPanelVisible}
          attachedItems={attachedItems}
          confirmationStatus={confirmationStatus}
          expandedActions={expandedActions}
          onOpenDebug={openDebugInspector}
          onResendAction={(fullMessage) => {
            void resendChatQuery(fullMessage);
          }}
          onReattachItem={reattachItemWithToast}
          onOpenSourcesMobile={openSourcesMobile}
          onOpenSourcesDesktop={openSourcesDesktop}
          onConfirm={(messageId, confirmed, msg) => handleConfirmation(messageId, confirmed, msg)}
          onExpandActionResults={expandActionResults}
          isItemAttached={isItemAttached}
          onAttachActionResultItem={handleAttachActionResultItem}
        />

        <DesktopContextPanel
          contextDocuments={contextDocuments}
          isPanelVisible={isPanelVisible}
          setIsPanelVisible={setIsPanelVisible}
          selectedProduct={selectedProduct}
          isCartView={isCartView}
          cartData={cartData}
          focusedMessageId={focusedMessageId}
          newDocuments={newDocuments}
          viewedDocumentIds={viewedDocumentIds}
          contextPanelRef={contextPanelRef}
          contextPanelEndRef={contextPanelEndRef}
          isItemAttached={isItemAttached}
          onOpenProductDetails={openProductDetails}
          onCloseCart={closeCart}
          onCloseProductDetails={closeProductDetails}
          onRemoveFromCart={(sku) => {
            void removeFromCart(sku);
          }}
          onProceedToCheckout={() => {
            void proceedToCheckoutFromCart({ closeCartAfter: true });
          }}
          onAttachCartToChat={attachCartToChat}
          onBrowseProducts={() => {
            void browseProductsFromCart();
          }}
          onAddToCart={(product) => {
            void addToCart(product);
          }}
          onAttachProductToChat={(product) => {
            handleAttachDocument(product);
            closeProductDetails();
          }}
          onAttachDocument={handleAttachDocument}
        />

        <MobileFloatingActions
          isAISearchOpen={isAISearchOpen}
          setIsAISearchOpen={setIsAISearchOpen}
          aiSearchCategories={aiSearchCategories}
          aiSearchRowRef={aiSearchRowRef}
          aiSearchButtonRef={aiSearchButtonRef}
          onAISearchCategory={handleAISearchCategory}
          isFloatingMenuCollapsed={isFloatingMenuCollapsed}
          setIsFloatingMenuCollapsed={setIsFloatingMenuCollapsed}
          contextDocumentsCount={contextDocuments.length}
          onOpenDocuments={handleOpenBottomSheet}
          onOpenCart={openCart}
          isQuickActionsOpen={isQuickActionsOpen}
          setIsQuickActionsOpen={setIsQuickActionsOpen}
          isBrowseProductsOpen={isBrowseProductsOpen}
          setIsBrowseProductsOpen={setIsBrowseProductsOpen}
          browseProductCategories={browseProductCategories}
          onBrowseProductCategory={(category) => {
            handleQuickAction(category.query, "catalog", "navigator");
          }}
        />

        {/* Mobile: New Documents Preview Panel */}
        <MobileNewDocsPreviewPanel
          isOpen={isNewDocsPreviewOpen}
          newDocuments={newDocuments}
          onClose={handleCloseNewDocsPreview}
          onSelectDocument={(doc) => {
            openProductDetails(doc);
            handleCloseNewDocsPreview();
            setIsBottomSheetOpen(true);
          }}
          onViewAll={() => {
            handleCloseNewDocsPreview();
            handleOpenBottomSheet();
          }}
        />


        <MobileContextSheet
          isOpen={isBottomSheetOpen}
          setIsOpen={setIsBottomSheetOpen}
          contextDocuments={contextDocuments}
          selectedProduct={selectedProduct}
          isCartView={isCartView}
          cartData={cartData}
          viewedDocumentIds={viewedDocumentIds}
          newDocuments={newDocuments}
          isItemAttached={isItemAttached}
          onCloseAll={() => {
            setIsBottomSheetOpen(false);
            closeProductDetails();
            if (isCartView) closeCart();
          }}
          onCloseCart={closeCart}
          onCloseProductDetails={closeProductDetails}
          onOpenProductDetails={openProductDetails}
          onRemoveFromCart={(sku) => {
            void removeFromCart(sku);
          }}
          onProceedToCheckout={() => {
            void proceedToCheckoutFromCart({ closeCartAfter: false });
          }}
          onAttachCartToChat={attachCartToChat}
          onBrowseProducts={() => {
            void browseProductsFromCart();
          }}
          onAddToCart={(product) => {
            void addToCart(product);
          }}
          onAttachProductToChat={handleAttachDocument}
          onAttachDocument={handleAttachDocument}
        />
      </div>

      {/* Collection Animation - Rises from bottom when item is attached */}
      <AnimatePresence>
        {collectingItem && (
          <motion.div
            initial={{ y: 200, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 200, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="fixed bottom-28 md:bottom-32 left-0 right-0 z-[110] pointer-events-none px-4 flex justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, -2, 2, -2, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="relative w-full max-w-[350px]"
            >
              {/* Main Card */}
              <Card className="border-4 border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-2xl w-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Animated AI Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ delay: 0.2, type: "spring", damping: 10 }}
                      className="relative"
                    >
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                        <BrainCircuit className="h-6 w-6 text-white" />
                      </div>
                      {/* Success Checkmark Animation */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", damping: 10 }}
                        className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs font-bold text-purple-800 mb-1 flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        Added to Context!
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight"
                      >
                        {collectingItem.title}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[10px] text-purple-700 mt-1 flex items-center gap-1"
                      >
                        <Badge variant="outline" className="text-[9px] bg-purple-100 border-purple-300 text-purple-800 px-1.5 py-0">
                          {collectingItem.type}
                        </Badge>
                        AI will use this in chat
                      </motion.p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sparkle effects */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-yellow-400">
                  <Sparkles className="h-12 w-12" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area - z-50 ensures it stays above chat messages and product cards */}
      <Composer
        attachedItems={attachedItems}
        onRemoveAttachment={removeNonAiAttachmentByIndex}
        searchCategory={searchCategory}
        onClearSearchCategory={clearSearchCategory}
        onRemoveAiSearch={removeAiSearchAttachment}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        onDismissSuggestions={dismissSuggestions}
        onShowSuggestions={() => setShowSuggestions(true)}
        onSuggestionSelect={selectSuggestion}
        oldConversationLocked={oldConversationLocked}
        onStartNewConversation={startNewConversation}
        onOpenHistory={openConversationsPanel}
        chatQuery={chatQuery}
        onChatQueryChange={(value) => setChatQuery(value)}
        isInputFocused={isInputFocused}
        onInputFocusChange={(focused) => setIsInputFocused(focused)}
        chatInputRef={chatInputRef}
        isLoading={isLoading}
        currentPosition={currentPosition}
        onOpenDebug={() => openDebugInspector()}
        onSubmit={() => handleChatQuery()}
      />

      {/* Debug Panel - Fixed Side Panel on XL, Modal on smaller screens */}
      <DebugInspectorPanel
        isOpen={isDebugModalOpen}
        onClose={closeDebugInspector}
        selectedDebugMessage={selectedDebugMessage}
        lastRequestData={lastRequestData}
        lastResponseData={lastResponseData}
      />

      {/* Conversations History Panel */}
      <ConversationHistoryPanel
        isOpen={isConversationsOpen}
        onClose={() => setIsConversationsOpen(false)}
        conversations={conversations}
        isLoadingConversations={isLoadingConversations}
        currentConversationId={currentConversationId}
        onStartNewConversation={startNewConversation}
        onOpenConversation={openConversation}
        onDeleteConversation={handleDeleteConversation}
      />
    </motion.div>  );
}
