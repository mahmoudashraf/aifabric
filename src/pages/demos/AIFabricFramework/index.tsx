import { useEffect } from "react";
import { Package, Receipt, FileText, Star, Tag, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hooks
import { useChat, useProducts, useMigration, useDataEntities } from "./hooks";

// Components
import {
  Header,
  ChatPanel,
  ChatInput,
  ProductsTab,
  OrdersTab,
  PoliciesTab,
  ReviewsTab,
  CouponsTab,
  ApiTab,
} from "./components";

export default function AIFabricFramework() {
  // Initialize hooks
  const chat = useChat();
  const products = useProducts();
  const migration = useMigration();
  const entities = useDataEntities();

  // Load initial data
  useEffect(() => {
    products.loadProducts();
    products.loadProductCount();
    entities.loadOrders();
    entities.loadPolicies();
    entities.loadReviews();
    entities.loadCoupons();
    migration.loadPolicyCount();
    migration.loadReviewCount();
    migration.loadCouponCount();
  }, []);

  // Fetch suggestions when attached products change
  // fetchSuggestions is memoized with attachedProducts as dependency, so it changes when products change
  useEffect(() => {
    chat.fetchSuggestions();
  }, [chat.fetchSuggestions]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chat.scrollToBottom();
  }, [chat.chatMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Header with migration controls */}
        <Header
          stockFill={migration.stockFill}
          policyMigration={migration.policyMigration}
          reviewMigration={migration.reviewMigration}
          couponMigration={migration.couponMigration}
          ticketMigration={migration.ticketMigration}
          isClearing={migration.isClearing}
          onFillStock={() =>
            migration.handleFillStock(() => {
              products.loadProducts();
              products.loadProductCount();
            })
          }
          onMigratePolicies={() =>
            migration.handleMigratePolicies(() => {
              entities.loadPolicies();
              migration.loadPolicyCount();
            })
          }
          onMigrateReviews={() =>
            migration.handleMigrateReviews(() => {
              entities.loadReviews();
              migration.loadReviewCount();
            })
          }
          onMigrateCoupons={() =>
            migration.handleMigrateCoupons(() => {
              entities.loadCoupons();
              migration.loadCouponCount();
            })
          }
          onMigrateTickets={() => migration.handleMigrateTickets()}
          onClearData={() =>
            migration.handleClearData(() => {
              products.loadProducts();
              products.loadProductCount();
              entities.loadPolicies();
              entities.loadReviews();
              entities.loadCoupons();
            })
          }
        />

        {/* Main content tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Policies</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Coupons</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab
              products={products.products}
              productCount={products.productCount}
              isLoading={products.isLoadingProducts}
              searchQuery={products.searchQuery}
              onSearchQueryChange={products.setSearchQuery}
              onSearch={products.handleProductSearch}
              onAttachProduct={chat.handleAttachProduct}
              isAddDialogOpen={products.isAddDialogOpen}
              isEditDialogOpen={products.isEditDialogOpen}
              formData={products.formData}
              onFormDataChange={products.setFormData}
              onOpenAddDialog={products.openAddDialog}
              onCloseAddDialog={() => products.setIsAddDialogOpen(false)}
              onOpenEditDialog={products.openEditDialog}
              onCloseEditDialog={() => products.setIsEditDialogOpen(false)}
              onAddProduct={products.handleAddProduct}
              onEditProduct={products.handleEditProduct}
              onDeleteProduct={products.handleDeleteProduct}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab
              orders={entities.orders}
              isLoading={entities.isLoadingOrders}
              expandedOrders={entities.expandedOrders}
              onToggleExpansion={entities.toggleOrderExpansion}
            />
          </TabsContent>

          <TabsContent value="policies">
            <PoliciesTab
              policies={entities.policies}
              policyCount={migration.policyCount}
              isLoading={entities.isLoadingPolicies}
              onDeletePolicy={entities.handleDeletePolicy}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab
              reviews={entities.reviews}
              reviewCount={migration.reviewCount}
              isLoading={entities.isLoadingReviews}
              onAttachReview={chat.handleAttachReview}
            />
          </TabsContent>

          <TabsContent value="coupons">
            <CouponsTab
              coupons={entities.coupons}
              couponCount={migration.couponCount}
              isLoading={entities.isLoadingCoupons}
              onAttachCoupon={chat.handleAttachCoupon}
            />
          </TabsContent>

          <TabsContent value="api">
            <ApiTab
              productCount={products.productCount}
              policyCount={migration.policyCount}
              reviewCount={migration.reviewCount}
              couponCount={migration.couponCount}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat panel */}
      <ChatPanel
        isExpanded={chat.isChatExpanded}
        onClose={() => chat.setIsChatExpanded(false)}
        messages={chat.chatMessages}
        isLoading={chat.isLoading}
        onConfirmation={chat.handleConfirmationAction}
        messagesEndRef={chat.messagesEndRef}
      />

      {/* Chat input */}
      <ChatInput
        query={chat.chatQuery}
        onQueryChange={chat.setChatQuery}
        onSubmit={() => chat.handleChatQuery()}
        isLoading={chat.isLoading}
        attachedProducts={chat.attachedProducts}
        attachedReviews={chat.attachedReviews}
        attachedCoupons={chat.attachedCoupons}
        onRemoveProduct={chat.handleRemoveAttachment}
        onRemoveReview={chat.handleRemoveAttachedReview}
        onRemoveCoupon={chat.handleRemoveAttachedCoupon}
        suggestions={chat.suggestions}
        isLoadingSuggestions={chat.isLoadingSuggestions}
        inputRef={chat.chatInputRef}
        onFocus={() => chat.setIsChatExpanded(true)}
      />
    </div>
  );
}
