import { useEffect, useState } from "react";
import { Package, Receipt, FileText, Star, Tag, Code, Activity, MessageCircle, ShoppingCart, Database, Headphones, FileSearch } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Widget library
import { MaxModeWidget } from "@/lib/max-mode-widget/max-mode-widget.esm.js";
import "@/lib/max-mode-widget/style.css";

// Hooks
import { useChat, useProducts, useMigration, useDataEntities, useCart } from "./hooks";

// Components
import {
  Header,
  ChatPanel,
  ChatInput,
  DemoEvidencePanel,
  RagJourneyPanel,
  ProductsTab,
  CartTab,
  OrdersTab,
  PoliciesTab,
  ReviewsTab,
  CouponsTab,
  SupportTab,
  ApiTab,
  VerificationTab,
  shoppingActionProjections,
} from "./components";
import { DemoFullPageLoader } from "../components/DemoFullPageLoader";
import { API_AUTH_HEADERS, API_BASE_URL, CRUD_API_BASE_URL } from "./constants";
import type { RagJourneySeedStage } from "./constants/ragJourney";
import type { ChatPosition } from "./types";

const AI_SHOPPING_EXPERIENCE_BUILD_MARKER = "ai-shopping-experience-rag-journey-2026-07-05";

export default function AIFabricFramework() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Initialize hooks
  const chat = useChat();
  const products = useProducts();
  const migration = useMigration();
  const entities = useDataEntities();
  const cart = useCart(chat.userId);

  // Load initial data
  useEffect(() => {
    products.loadProducts();
    products.loadProductCount();
    entities.loadOrders(chat.userId);
    entities.loadPolicies();
    entities.loadReviews();
    entities.loadCoupons();
    entities.loadTickets(chat.userId);
    cart.loadCart();
    migration.loadReadiness();
    migration.loadHealth();
    migration.loadPolicyCount();
    migration.loadReviewCount();
    migration.loadCouponCount();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    chat.scrollToBottom();
  }, [chat.chatMessages]);

  const refreshCommerceData = () => {
    products.loadProducts();
    products.loadProductCount();
    entities.loadOrders(chat.userId);
    entities.loadPolicies();
    entities.loadReviews();
    entities.loadCoupons();
    entities.loadTickets(chat.userId);
    cart.loadCart();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "products") chat.setPosition("catalog", "navigator");
    if (value === "cart") chat.setPosition("cart", "cart_assistant");
    if (value === "orders") chat.setPosition("orders", "cart_assistant");
    if (value === "policies") chat.setPosition("support", "navigator_deep");
    if (value === "reviews") chat.setPosition("product_detail", "navigator_deep");
    if (value === "coupons") chat.setPosition("cart", "cart_assistant");
    if (value === "support") chat.setPosition("support", "navigator");
    if (value === "rag-journey") chat.setPosition("search", "navigator");
    if (value === "evidence" || value === "api" || value === "verification") chat.setPosition("landing", "navigator");
  };

  const handleCartAI = (query: string) => {
    chat.setPosition("cart", "cart_assistant");
    chat.handleChatQuery(query, { position: "cart", mode: "cart_assistant" });
  };

  const handleSupportAI = (query: string) => {
    chat.setPosition("support", "navigator");
    chat.handleChatQuery(query, { position: "support", mode: "navigator" });
  };

  const isMigrationRunning =
    migration.stockFill.isRunning ||
    migration.policyMigration.isRunning ||
    migration.reviewMigration.isRunning ||
    migration.couponMigration.isRunning ||
    migration.ticketMigration.isRunning ||
    migration.isClearing;

  const migrationRunningLabel =
    migration.stockFill.currentItem ||
    migration.policyMigration.currentItem ||
    migration.reviewMigration.currentItem ||
    migration.couponMigration.currentItem ||
    migration.ticketMigration.currentItem ||
    (migration.isClearing ? "Resetting demo data..." : "");

  const handleRagJourneySeedStage = async (stage: RagJourneySeedStage) => {
    const onComplete = () => {
      refreshCommerceData();
    };
    if (stage === "products") return migration.handleFillStock(onComplete);
    if (stage === "reviews") return migration.handleMigrateReviews(onComplete);
    if (stage === "policies") return migration.handleMigratePolicies(onComplete);
    if (stage === "coupons") return migration.handleMigrateCoupons(onComplete);
    if (stage === "tickets") return migration.handleMigrateTickets(onComplete);
    return migration.handleSeedFull(onComplete);
  };

  const handleRagJourneyPrompt = async (prompt: string, position: ChatPosition) => {
    chat.setPosition(position, "navigator");
    return chat.handleChatQuery(prompt, { position, mode: "navigator", silent: true });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-muted/20"
      data-demo-build={AI_SHOPPING_EXPERIENCE_BUILD_MARKER}
    >
      {migration.isClearing ? (
        <DemoFullPageLoader
          title="Resetting AI Shopping demo evidence"
          description="Clearing the staged RAG evidence and refreshing the product, policy, review, coupon, ticket, cart, and readiness views before the page becomes interactive."
          steps={[
            "Clear staged demo data",
            "Refresh commerce tabs and cart state",
            "Reload RAG readiness proof",
          ]}
        />
      ) : null}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-[300px] sm:pb-56">
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
          onSeedFull={() =>
            migration.handleSeedFull(() => {
              refreshCommerceData();
            })
          }
          onClearData={() =>
            migration.handleClearData(() => {
              refreshCommerceData();
            })
          }
        />

        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 mb-4 sm:mb-6 h-auto sm:h-10">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="cart" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
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
            <TabsTrigger value="support" className="gap-2">
              <Headphones className="h-4 w-4" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
            <TabsTrigger value="rag-journey" className="gap-2">
              <FileSearch className="h-4 w-4" />
              <span className="hidden sm:inline">RAG Journey</span>
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Evidence</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Verify</span>
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

          <TabsContent value="cart">
            <CartTab
              cart={cart.cart}
              isLoading={cart.isLoadingCart}
              onRefresh={cart.loadCart}
              onRemoveItem={(sku) => {
                cart.removeItem(sku).then(() => {
                  entities.loadOrders(chat.userId);
                });
              }}
              onApplyCoupon={(code) => cart.applyCoupon(code)}
              onAskAI={handleCartAI}
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

          <TabsContent value="support">
            <SupportTab
              tickets={entities.tickets}
              isLoading={entities.isLoadingTickets}
              onRefresh={() => entities.loadTickets(chat.userId)}
              onAskAI={handleSupportAI}
            />
          </TabsContent>

          <TabsContent value="rag-journey">
            <RagJourneyPanel
              readiness={migration.readiness}
              health={migration.health}
              isRunning={isMigrationRunning || chat.isLoading}
              runningLabel={migrationRunningLabel}
              onRefresh={() => migration.refreshReadiness(refreshCommerceData)}
              onReset={() =>
                migration.handleClearData(() => {
                  refreshCommerceData();
                })
              }
              onSeedStage={handleRagJourneySeedStage}
              onRunPrompt={handleRagJourneyPrompt}
            />
          </TabsContent>

          <TabsContent value="evidence">
            <DemoEvidencePanel
              readiness={migration.readiness}
              health={migration.health}
              lastStageResult={migration.lastStageResult}
              stockFill={migration.stockFill}
              policyMigration={migration.policyMigration}
              reviewMigration={migration.reviewMigration}
              couponMigration={migration.couponMigration}
              ticketMigration={migration.ticketMigration}
              isClearing={migration.isClearing}
              onRefresh={() => {
                migration.refreshReadiness(refreshCommerceData);
              }}
              onSeedProducts={() =>
                migration.handleFillStock(() => {
                  refreshCommerceData();
                })
              }
              onSeedReviews={() =>
                migration.handleMigrateReviews(() => {
                  refreshCommerceData();
                })
              }
              onSeedPolicies={() =>
                migration.handleMigratePolicies(() => {
                  refreshCommerceData();
                })
              }
              onSeedCoupons={() =>
                migration.handleMigrateCoupons(() => {
                  refreshCommerceData();
                })
              }
              onSeedTickets={() =>
                migration.handleMigrateTickets(() => {
                  refreshCommerceData();
                })
              }
              onSeedFull={() =>
                migration.handleSeedFull(() => {
                  refreshCommerceData();
                })
              }
              onReset={() =>
                migration.handleClearData(() => {
                  refreshCommerceData();
                })
              }
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

          <TabsContent value="verification">
            <VerificationTab />
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
        onResendAction={chat.handleResendAction}
        onClarificationSubmit={chat.handleClarificationSubmit}
        actionProjections={shoppingActionProjections}
      />

      {/* Max Mode Widget floating launcher */}
      {!isWidgetOpen && (
        <button
          onClick={() => setIsWidgetOpen(true)}
          aria-label="Open AI Assistant"
          className="fixed bottom-28 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border-none shadow-[0_4px_20px_rgba(99,102,241,0.4),0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_28px_rgba(99,102,241,0.5),0_4px_12px_rgba(0,0,0,0.15)]"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)" }}
        >
          <MessageCircle className="h-7 w-7 text-white" strokeWidth={2} />
        </button>
      )}

      {/* Max Mode Widget (embeddable library) */}
      <MaxModeWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
        apiConfig={{
          chatBaseUrl: API_BASE_URL,
          crudBaseUrl: CRUD_API_BASE_URL,
          headers: API_AUTH_HEADERS,
        }}
        features={{
          cart: true,
          debug: true,
          conversations: true,
          quickActions: true,
        }}
        theme={{ primaryColor: "#6366f1" }}
        onEvent={(event) => console.log("[MaxMode Event]", event)}
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
        activeTag={chat.activeTag}
        onTagChange={chat.setActiveTag}
        onTagSubmit={chat.handleTagSubmit}
        currentPosition={chat.currentPosition}
        currentMode={chat.currentMode}
        onModeChange={chat.setCurrentMode}
        onOpenMaxMode={() => setIsWidgetOpen(true)}
      />
    </div>
  );
}
