import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
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

export function MobileContextSheet({
  isOpen,
  setIsOpen,
  contextDocuments,
  selectedProduct,
  isCartView,
  cartData,
  viewedDocumentIds,
  newDocuments,
  isItemAttached,
  onCloseAll,
  onCloseCart,
  onCloseProductDetails,
  onOpenProductDetails,
  onRemoveFromCart,
  onProceedToCheckout,
  onAttachCartToChat,
  onBrowseProducts,
  onAddToCart,
  onAttachProductToChat,
  onAttachDocument,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contextDocuments: Document[];
  selectedProduct: Document | null;
  isCartView: boolean;
  cartData: any;
  viewedDocumentIds: Set<string>;
  newDocuments: Document[];
  isItemAttached: (itemId: string) => boolean;
  onCloseAll: () => void;
  onCloseCart: () => void;
  onCloseProductDetails: () => void;
  onOpenProductDetails: (doc: Document) => void;
  onRemoveFromCart: (sku: string) => void;
  onProceedToCheckout: () => void;
  onAttachCartToChat: () => void;
  onBrowseProducts: () => void;
  onAddToCart: (product: Document) => void;
  onAttachProductToChat: (product: Document) => void;
  onAttachDocument: (doc: Document) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && contextDocuments.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                setIsOpen(false);
              }
            }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 rounded-t-3xl shadow-2xl z-[70] max-h-[80vh] flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            <div className="px-4 py-3 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedProduct && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCloseProductDetails}
                    className="h-8 w-8 -ml-2"
                    aria-label="Back"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </Button>
                )}
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    {isCartView ? "Shopping Cart" : selectedProduct ? "Product Details" : "Context Documents"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    {isCartView
                      ? "View and manage your cart"
                      : selectedProduct
                        ? "View details and add to cart"
                        : `${contextDocuments.length} ${contextDocuments.length === 1 ? "item" : "items"} • Tap to view`}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onCloseAll} className="h-8 w-8" aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {isCartView ? (
                <div className="space-y-3">
                  {cartData && cartData.items && cartData.items.length > 0 ? (
                    <>
                      {cartData.items.map((item: any, idx: number) => (
                        <Card key={idx} className="border-2 border-purple-200 bg-white/80">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.productName || item.sku}</h4>
                                <p className="text-xs text-gray-600 mb-1">SKU: {item.sku}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-base font-bold text-purple-600">${item.price}</span>
                                  <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                </div>
                                <div className="mt-1 text-xs font-semibold text-gray-900">
                                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onRemoveFromCart(item.sku)}
                                className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                                aria-label="Remove from cart"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold">${cartData.subtotal?.toFixed(2) || "0.00"}</span>
                          </div>
                          {cartData.discount > 0 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Discount:</span>
                              <span className="font-semibold text-green-600">
                                -${cartData.discount?.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="border-t border-blue-200 pt-2 flex justify-between">
                            <span className="text-base font-bold text-gray-900">Total:</span>
                            <span className="text-base font-bold text-gray-900">${cartData.total?.toFixed(2) || "0.00"}</span>
                          </div>
                          {cartData.couponCode && (
                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              Coupon: {cartData.couponCode}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            onProceedToCheckout();
                            setIsOpen(false);
                            onCloseCart();
                          }}
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
                        >
                          <BrainCircuit className="h-5 w-5 mr-2" />
                          Attach Cart to Chat
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <ShoppingCart className="h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-base font-semibold text-gray-900 mb-1">Your cart is empty</h3>
                      <p className="text-xs text-gray-500 mb-3">Add some products to get started!</p>
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          onBrowseProducts();
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                        size="sm"
                      >
                        Browse Products
                      </Button>
                    </div>
                  )}
                </div>
              ) : selectedProduct ? (
                <div className="space-y-4">
                  {selectedProduct.metadata?.imageUrl && (
                    <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-white -mx-4">
                      <img
                        src={selectedProduct.metadata.imageUrl}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                      {selectedProduct.title}
                    </h3>
                    <Badge variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-700">
                      {selectedProduct.type}
                    </Badge>
                  </div>

                  <div className="p-3 bg-white/80 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedProduct.content}</p>
                  </div>

                  {selectedProduct.metadata && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Product Details</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedProduct.metadata).map(([key, value]) => {
                          if (key === "imageUrl") return null;
                          return (
                            <div key={key} className="p-3 bg-white/80 rounded-lg border border-blue-200">
                              <p className="text-xs text-gray-500 mb-0.5">{formatFieldName(key)}</p>
                              <p className="text-sm font-semibold text-gray-900">{formatFieldValue(value)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-2 space-y-2 -mx-4 px-4">
                    <Button
                      onClick={() => {
                        onAddToCart(selectedProduct);
                        setIsOpen(false);
                        onCloseProductDetails();
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => {
                        onAttachProductToChat(selectedProduct);
                        setIsOpen(false);
                        onCloseProductDetails();
                      }}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <BrainCircuit className="h-5 w-5 mr-2" />
                      Attach to Chat
                    </Button>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {[...contextDocuments].reverse().map((doc, idx) => {
                    const DocIcon = getDocumentIcon(doc.type);
                    const isNewDoc =
                      !viewedDocumentIds.has(doc.id) && newDocuments.some((nd) => nd.id === doc.id);

                    return (
                      <motion.div
                        key={doc.id}
                        data-doc-id={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <Card
                          onClick={() => onOpenProductDetails(doc)}
                          className={`relative group active:scale-98 transition-all border-2 cursor-pointer ${
                            isNewDoc
                              ? "border-yellow-400 bg-gradient-to-br from-yellow-50/90 via-blue-50/40 to-white/40 shadow-lg"
                              : "border-blue-200 hover:border-blue-400 bg-gradient-to-br from-white via-blue-50/30 to-white"
                          }`}
                        >
                          {doc.metadata?.imageUrl && (
                            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-100 to-white">
                              <img src={doc.metadata.imageUrl} alt={doc.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              {isNewDoc && (
                                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">
                                  NEW
                                </div>
                              )}
                            </div>
                          )}
                          <CardHeader className="pb-2 pt-3 px-3">
                            <div className="flex items-start gap-2">
                              {!doc.metadata?.imageUrl && (
                                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex-shrink-0">
                                  <DocIcon className="h-4 w-4 text-white" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-bold line-clamp-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                  {doc.title}
                                </CardTitle>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge variant="outline" className="text-[9px] bg-blue-100 border-blue-300 text-blue-700">
                                    {doc.type}
                                  </Badge>
                                  {isNewDoc && (
                                    <Badge className="text-[9px] bg-yellow-400 text-yellow-900 border-yellow-500">
                                      NEW
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className={`h-9 w-9 flex-shrink-0 ${
                                  isItemAttached(doc.id)
                                    ? "bg-gradient-to-br from-green-500 to-emerald-500"
                                    : "bg-gradient-to-br from-blue-600 to-blue-500"
                                } text-white shadow-lg border border-white/30 hover:scale-110 transition-all z-50 pointer-events-auto cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  onAttachDocument(doc);
                                }}
                                title={isItemAttached(doc.id) ? "Already in Chat" : "Attach to Chat"}
                                aria-label={isItemAttached(doc.id) ? "Already attached" : "Attach to chat"}
                              >
                                {isItemAttached(doc.id) ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <BrainCircuit className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="px-3 pb-3">
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{doc.content}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

