import type { RefObject } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Package,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Document } from "../types";
import { formatFieldName, formatFieldValue } from "../utils";

const getDocumentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "policy":
    case "document":
    case "warranty":
    case "terms":
      return FileText;
    case "product":
      return Package;
    case "review":
      return Star;
    case "image":
      return ImageIcon;
    default:
      return FileText;
  }
};

export function DesktopContextPanel({
  contextDocuments,
  isPanelVisible,
  setIsPanelVisible,
  selectedProduct,
  isCartView,
  cartData,
  focusedMessageId,
  newDocuments,
  viewedDocumentIds,
  contextPanelRef,
  contextPanelEndRef,
  isItemAttached,
  onOpenProductDetails,
  onCloseCart,
  onCloseProductDetails,
  onRemoveFromCart,
  onProceedToCheckout,
  onAttachCartToChat,
  onBrowseProducts,
  onAddToCart,
  onAttachProductToChat,
  onAttachDocument,
}: {
  contextDocuments: Document[];
  isPanelVisible: boolean;
  setIsPanelVisible: (visible: boolean) => void;
  selectedProduct: Document | null;
  isCartView: boolean;
  cartData: any;
  focusedMessageId: string | null;
  newDocuments: Document[];
  viewedDocumentIds: Set<string>;
  contextPanelRef: RefObject<HTMLDivElement>;
  contextPanelEndRef: RefObject<HTMLDivElement>;
  isItemAttached: (itemId: string) => boolean;
  onOpenProductDetails: (doc: Document) => void;
  onCloseCart: () => void;
  onCloseProductDetails: () => void;
  onRemoveFromCart: (sku: string) => void;
  onProceedToCheckout: () => void;
  onAttachCartToChat: () => void;
  onBrowseProducts: () => void;
  onAddToCart: (product: Document) => void;
  onAttachProductToChat: (product: Document) => void;
  onAttachDocument: (doc: Document) => void;
}) {
  const handleScrollUp = () => {
    contextPanelRef.current?.scrollBy({ top: -300, behavior: "smooth" });
  };

  const handleScrollDown = () => {
    contextPanelRef.current?.scrollBy({ top: 300, behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {contextDocuments.length > 0 && isPanelVisible && (
          <motion.div
            initial={{ opacity: 0, x: 420 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 420 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`hidden md:flex absolute top-[165px] right-0 bottom-0 mr-2 ${
              selectedProduct || isCartView ? "w-[700px] max-w-[700px]" : "w-[420px] max-w-[420px]"
            } border-l-2 border-blue-500/30 bg-gradient-to-b from-blue-50/95 to-white/95 dark:from-gray-900/95 dark:via-blue-900/20 dark:to-gray-900/95 backdrop-blur-xl p-6 shadow-2xl z-10 flex-col transition-all duration-300`}
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 backdrop-blur-md p-5 rounded-2xl mb-6 shadow-2xl border-2 border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="font-bold text-lg text-white">
                      {isCartView ? "Shopping Cart" : selectedProduct ? "Product Details" : "Context Panel"}
                    </h2>
                    <p className="text-xs text-white/80">
                      {isCartView
                        ? "View and manage your cart"
                        : selectedProduct
                          ? "View details and add to cart"
                          : `${contextDocuments.length} ${
                              contextDocuments.length === 1 ? "document" : "documents"
                            } • Click to view`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(selectedProduct || isCartView) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isCartView ? onCloseCart : onCloseProductDetails}
                      className="h-8 px-3 text-xs text-white hover:bg-white/20 border border-white/30"
                    >
                      <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                      Back
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPanelVisible(false)}
                    className="h-8 px-3 text-xs text-white hover:bg-white/20 border border-white/30"
                  >
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hide
                  </Button>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-full" />
            </div>

            {isCartView ? (
              <div
                className="flex-1 overflow-y-auto space-y-4"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(168, 85, 247, 0.5) rgba(243, 232, 255, 0.2)",
                }}
              >
                {cartData && cartData.items && cartData.items.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {cartData.items.map((item: any, idx: number) => (
                        <Card key={idx} className="border-2 border-blue-200 bg-white/60">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{item.productName || item.sku}</h4>
                                <p className="text-sm text-gray-600 mb-2">SKU: {item.sku}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-gray-900">${item.price}</span>
                                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                </div>
                                <div className="mt-2 text-sm font-semibold text-gray-900">
                                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onRemoveFromCart(item.sku)}
                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">${cartData.subtotal?.toFixed(2) || "0.00"}</span>
                        </div>
                        {cartData.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-semibold text-green-600">
                              -${cartData.discount?.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-blue-200 pt-2 flex justify-between">
                          <span className="text-lg font-bold text-gray-900">Total:</span>
                          <span className="text-lg font-bold text-gray-900">${cartData.total?.toFixed(2) || "0.00"}</span>
                        </div>
                        {cartData.couponCode && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Coupon: {cartData.couponCode}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Button
                        onClick={onProceedToCheckout}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                        size="lg"
                      >
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                      <Button
                        onClick={onAttachCartToChat}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                        size="lg"
                      >
                        <BrainCircuit className="h-5 w-5 mr-2" />
                        Attach Cart to Chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-sm text-gray-500 mb-4">Add some products to get started!</p>
                    <Button
                      onClick={onBrowseProducts}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </div>
            ) : selectedProduct ? (
              <div
                className="flex-1 overflow-y-auto space-y-6"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(168, 85, 247, 0.5) rgba(243, 232, 255, 0.2)",
                }}
              >
                {selectedProduct.metadata?.imageUrl && (
                  <div className="relative h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-white">
                    <img
                      src={selectedProduct.metadata.imageUrl}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                      {selectedProduct.title}
                    </h3>
                    <Badge variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-700">
                      {selectedProduct.type}
                    </Badge>
                  </div>

                  <div className="p-4 bg-white/60 rounded-xl border-2 border-purple-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedProduct.content}</p>
                  </div>

                  {selectedProduct.metadata && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Product Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedProduct.metadata).map(([key, value]) => {
                          if (key === "imageUrl") return null;
                          return (
                            <div key={key} className="p-3 bg-white/60 rounded-lg border border-purple-200">
                              <p className="text-xs text-gray-500 mb-1">{formatFieldName(key)}</p>
                              <p className="text-sm font-semibold text-gray-900">{formatFieldValue(value)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-gradient-to-t from-blue-50 via-blue-50/50 to-transparent pt-6 pb-2 space-y-3">
                    <Button
                      onClick={() => onAddToCart(selectedProduct)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => onAttachProductToChat(selectedProduct)}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                      size="lg"
                    >
                      <BrainCircuit className="h-5 w-5 mr-2" />
                      Attach to Chat
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative min-h-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleScrollUp}
                  className="hidden lg:flex absolute top-4 left-1/2 -translate-x-1/2 z-20 h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl border-2 border-white/30 hover:scale-110 transition-all"
                  title="Scroll Up"
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>

                <div
                  ref={contextPanelRef}
                  className="absolute inset-0 overflow-y-auto px-2 py-2 space-y-4"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(168, 85, 247, 0.5) rgba(243, 232, 255, 0.2)",
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {contextDocuments.map((doc, idx) => {
                      const DocIcon = getDocumentIcon(doc.type);
                      const isFocused = doc.messageId === focusedMessageId;
                      const isNewDoc = !viewedDocumentIds.has(doc.id) && newDocuments.some((nd) => nd.id === doc.id);

                      return (
                        <motion.div
                          key={doc.id}
                          data-doc-message-id={doc.messageId}
                          data-doc-id={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Card
                            onClick={() => onOpenProductDetails(doc)}
                            className={`relative group hover:shadow-2xl transition-all duration-300 border-2 cursor-pointer ${
                              isNewDoc
                                ? "border-yellow-400 shadow-lg shadow-yellow-200/50 bg-gradient-to-br from-yellow-50/90 via-blue-50/40 to-white/40"
                                : isFocused
                                  ? "border-yellow-400 shadow-lg shadow-yellow-200/50 bg-gradient-to-br from-yellow-50 via-blue-50/50 to-white/50"
                                  : "border-blue-300 hover:border-blue-500 bg-gradient-to-br from-white via-blue-50/50 to-white"
                            } dark:from-gray-800 dark:to-blue-900/20 overflow-hidden`}
                          >
                            {doc.metadata?.imageUrl && (
                              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-white">
                                <img
                                  src={doc.metadata.imageUrl}
                                  alt={doc.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {isNewDoc && (
                                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                    NEW
                                  </div>
                                )}
                              </div>
                            )}

                            <Button
                              size="icon"
                              variant="ghost"
                              className={`absolute top-2 right-2 h-10 w-10 ${
                                isItemAttached(doc.id)
                                  ? "bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                  : "bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                              } text-white shadow-xl border-2 border-white/50 hover:scale-110 hover:border-white/50 transition-all z-50 pointer-events-auto cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onAttachDocument(doc);
                              }}
                              title={isItemAttached(doc.id) ? "Already in Chat" : "Attach to Chat"}
                            >
                              {isItemAttached(doc.id) ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <BrainCircuit className="h-5 w-5" />
                              )}
                            </Button>

                            <CardHeader className="pb-3 relative pt-2">
                              <div className="flex items-start justify-between gap-2 pr-12">
                                <div className="flex items-start gap-3 flex-1">
                                  {!doc.metadata?.imageUrl && (
                                    <motion.div
                                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                      transition={{ duration: 0.5 }}
                                      className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg"
                                    >
                                      <DocIcon className="h-5 w-5 text-white" />
                                    </motion.div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base font-bold line-clamp-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                      {doc.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] bg-blue-100 border-blue-300 text-blue-700"
                                      >
                                        {doc.type}
                                      </Badge>
                                      {isNewDoc && (
                                        <Badge className="text-[10px] bg-yellow-400 text-yellow-900 border-yellow-500">
                                          NEW
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p
                                className="text-sm text-muted-foreground leading-relaxed"
                                style={{
                                  fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                }}
                              >
                                {doc.content}
                              </p>
                              {(doc.similarity || doc.score) && (
                                <div className="mt-3">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 text-yellow-800 font-semibold"
                                    >
                                      {((doc.similarity || doc.score) * 100).toFixed(1)}% Match
                                    </Badge>
                                  </div>
                                </div>
                              )}
                              {doc.metadata && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                  <div className="flex flex-wrap gap-1.5">
                                    {Object.entries(doc.metadata)
                                      .filter(
                                        ([key]) =>
                                          !key.startsWith("_") &&
                                          !key.includes("indexedCreatedAt") &&
                                          key !== "imageUrl" &&
                                          key !== "vectorSpace"
                                      )
                                      .slice(0, 4)
                                      .map(([key, value], badgeIdx) => {
                                        const colors = [
                                          "bg-blue-100 text-blue-700 border-blue-300",
                                          "bg-green-100 text-green-700 border-green-300",
                                          "bg-pink-100 text-pink-700 border-pink-300",
                                          "bg-indigo-100 text-indigo-700 border-indigo-300",
                                        ];
                                        return (
                                          <Badge
                                            key={key}
                                            variant="outline"
                                            className={`text-[10px] ${colors[badgeIdx % colors.length]} font-medium`}
                                          >
                                            {formatFieldName(key)}: {String(value).slice(0, 25)}
                                          </Badge>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={contextPanelEndRef} />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleScrollDown}
                  className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20 h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl border-2 border-white/30 hover:scale-110 transition-all"
                  title="Scroll Down"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextDocuments.length > 0 && !isPanelVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{ type: "spring", damping: 20 }}
            className="hidden md:block absolute top-16 right-4 z-20"
          >
            <Button
              onClick={() => setIsPanelVisible(true)}
              size="lg"
              className="bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-2xl border-2 border-white/30 rounded-full px-6"
            >
              <Eye className="h-5 w-5 mr-2" />
              Show Panel
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

