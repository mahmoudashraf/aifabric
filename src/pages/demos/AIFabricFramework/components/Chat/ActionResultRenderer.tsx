import { useState } from "react";

import { AlertTriangle, CheckCircle2, ChevronDown, CreditCard, MapPin, Paperclip, ReceiptText, Search, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { formatFieldName, formatFieldValue } from "../../utils/formatters";
import type { DemoActionProjection } from "../../types";

export const ActionResultRenderer = ({
  data,
  messageId,
  expandedCount: expandedCountProp,
  onExpand,
  projections,
}: {
  data: any;
  messageId: string;
  expandedCount?: number;
  onExpand?: (count: number) => void;
  projections?: DemoActionProjection[];
}) => {
  const [localExpandedCount, setLocalExpandedCount] = useState(6);
  const expandedCount = expandedCountProp ?? localExpandedCount;
  const handleExpand = onExpand ?? ((count: number) => setLocalExpandedCount(count));

  if (!data) return null;

  const projection = projections?.find((candidate) => candidate.canRender({ data, messageId }));
  if (projection) {
    return <>{projection.render({ data, messageId })}</>;
  }

  const isRecord = (value: any): value is Record<string, any> => typeof value === "object" && value !== null && !Array.isArray(value);
  const firstRecord = (...values: any[]) => values.find(isRecord) || {};
  const resultData = isRecord(data) ? data : {};
  const readiness = firstRecord(resultData.readiness);
  const accountProfile = firstRecord(resultData.accountProfile);
  const blockers = Array.isArray(readiness.blockers) ? readiness.blockers : [];
  const canContinue = typeof readiness.canContinue === "boolean" ? readiness.canContinue : undefined;

  const compactActionName = (action: string) =>
    action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

  const hasKey = (key: string) => Object.prototype.hasOwnProperty.call(resultData, key);

  const inferResolverActionName = () => {
    if (Object.keys(accountProfile).length > 0) return "get_account_profile";
    if (hasKey("refundRequestId") || hasKey("resolutionType") || hasKey("policyDecision")) return "request_refund";
    if (hasKey("paymentType") || hasKey("last4") || hasKey("verified")) return "update_payment_method";
    if (hasKey("addressType") || hasKey("isValidated")) return "update_address";
    if (hasKey("planName") && hasKey("status")) return "subscribe";
    return "";
  };

  const resolverActionName = isRecord(data) ? inferResolverActionName() : "";

  const renderStatusPill = (label: string, positive: boolean) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        positive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      }`}
    >
      {positive ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </span>
  );

  const renderSummaryRow = (label: string, value: any) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
        <div className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{formatFieldValue(value)}</div>
      </div>
    );
  };

  const renderResolverActionSummary = () => {
    const Icon =
      resolverActionName === "update_payment_method"
        ? CreditCard
        : resolverActionName === "update_address"
          ? MapPin
          : resolverActionName === "request_refund"
            ? ReceiptText
            : Search;

    const last4 = resultData.last4;
    const paymentVerified = typeof resultData.verified === "boolean" ? resultData.verified : undefined;
    const addressValidated =
      typeof resultData.isValidated === "boolean"
        ? resultData.isValidated
        : typeof resultData.isValidated === "string"
          ? resultData.isValidated.toLowerCase() === "true"
          : undefined;
    const subscription = firstRecord(accountProfile.subscription);
    const paymentMethod = firstRecord(accountProfile.paymentMethod);
    const billingAddress = firstRecord(accountProfile.billingAddress);

    return (
      <div className="mt-3">
        <Card
          className="overflow-hidden border-2 border-emerald-200 bg-white/80 shadow-sm dark:border-emerald-800 dark:bg-slate-900/80"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <CardContent className="p-0">
            <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/25">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    {compactActionName(resolverActionName)}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
                    {resolverActionName === "get_account_profile"
                      ? "Current account facts loaded for policy reasoning."
                      : "The account action completed successfully."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                {renderStatusPill("Completed", true)}
                {canContinue !== undefined && renderStatusPill(canContinue ? "Account ready" : "Still blocked", canContinue)}
                {paymentVerified !== undefined && renderStatusPill(paymentVerified ? "Payment verified" : "Payment unverified", paymentVerified)}
                {addressValidated !== undefined && renderStatusPill(addressValidated ? "Address validated" : "Address unvalidated", addressValidated)}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {resolverActionName === "update_payment_method" &&
                  renderSummaryRow("Payment method", last4 ? `Card ending in ${last4}` : "Stored card updated")}
                {resolverActionName === "update_address" && renderSummaryRow("Address type", resultData.addressType || "Billing")}
                {resolverActionName === "request_refund" &&
                  renderSummaryRow("Resolution", resultData.resolutionType ? compactActionName(String(resultData.resolutionType)) : undefined)}
                {resolverActionName === "request_refund" && renderSummaryRow("Status", resultData.status)}
                {resolverActionName === "request_refund" && renderSummaryRow("Amount", resultData.amount)}
                {resolverActionName === "request_refund" && renderSummaryRow("Reason", resultData.reason)}
                {resolverActionName === "get_account_profile" && renderSummaryRow("Subscription", subscription.status)}
                {resolverActionName === "get_account_profile" &&
                  renderSummaryRow("Plan", [subscription.plan?.name, subscription.plan?.tier].filter(Boolean).join(" / "))}
                {resolverActionName === "get_account_profile" &&
                  renderSummaryRow(
                    "Payment method",
                    paymentMethod.present ? (paymentMethod.verified ? "Verified" : "Unverified") : "Missing"
                  )}
                {resolverActionName === "get_account_profile" &&
                  renderSummaryRow(
                    "Billing address",
                    billingAddress.present ? (billingAddress.validated ? "Validated" : "Unvalidated") : "Missing"
                  )}
                {resolverActionName === "subscribe" && renderSummaryRow("Plan", resultData.planName)}
                {resolverActionName === "subscribe" && renderSummaryRow("Status", resultData.status)}
              </div>

              {blockers.length > 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/25 dark:text-amber-100">
                  <div className="mb-1 flex items-center gap-2 font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    Remaining blockers
                  </div>
                  <ul className="space-y-1 pl-1">
                    {blockers.slice(0, 3).map((blocker: any, index: number) => (
                      <li key={blocker.code || index}>{blocker.message || blocker.code || "Account blocker remains."}</li>
                    ))}
                  </ul>
                </div>
              ) : canContinue ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/25 dark:text-emerald-100">
                  No remaining blockers. The account can continue.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (resolverActionName) {
    return renderResolverActionSummary();
  }

  // Check if item looks like a product (has name/title and price or imageUrl)
  const isProductLike = (item: any) => {
    if (typeof item !== "object" || item === null) return false;
    const hasName = item.name || item.Name || item.title || item.Title;
    const hasPrice = item.price !== undefined || item.Price !== undefined;
    const hasImage = item.imageUrl || item.ImageUrl || item.image || item.Image;
    const hasSku = item.sku || item.Sku;
    return hasName && (hasPrice || hasImage || hasSku);
  };

  // Render a product card with image
  const renderProductCard = (item: any, idx: number) => {
    const name = item.name || item.Name || item.title || item.Title || "Product";
    const price = item.price ?? item.Price;
    const imageUrl = item.imageUrl || item.ImageUrl || item.image || item.Image;
    const category = item.category || item.Category;
    const sku = item.sku || item.Sku;
    const stockQty = item.inStockQty ?? item.InStockQty ?? item.stockQuantity ?? item.StockQuantity;
    const rating = item.rating ?? item.Rating;
    const brand = item.brand || item.Brand;
    const itemId = item.id || item.Id || sku;

    return (
      <div
        key={itemId || idx}
        className="relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-xl overflow-hidden"
      >
        {imageUrl && (
          <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className="p-2.5">
          <div className="flex items-center gap-1.5 mb-0.5">
            {brand && (
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                {brand}
              </span>
            )}
            {category && <span className="text-[9px] text-gray-500 dark:text-gray-400">{category}</span>}
          </div>

          <h4 className="font-bold text-xs text-gray-800 dark:text-gray-100 line-clamp-2 mb-1.5">{name}</h4>

          <div className="flex items-center justify-between">
            {price !== undefined && (
              <span className="text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ${typeof price === "number" ? price.toLocaleString() : price}
              </span>
            )}
            {stockQty !== undefined && (
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                  stockQty > 50
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : stockQty > 0
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {stockQty > 0 ? `${stockQty}` : "Out"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700">
            {rating !== undefined && (
              <div className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{rating}</span>
              </div>
            )}
            {sku && <span className="text-[9px] text-gray-400 dark:text-gray-500 font-mono truncate max-w-[80px]">{sku}</span>}
          </div>
        </div>
      </div>
    );
  };

  // Render generic item card (non-product)
  const renderGenericCard = (item: any, idx: number) => {
    const itemId = item.id || item.Id || item.sku || item.Sku;

    return (
      <Card
        key={itemId || idx}
        className="text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-colors relative group"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <CardContent className="p-3">
          {typeof item === "object" && item !== null ? (
            <div className="space-y-2">
              {Object.entries(item)
                .filter(([key]) => !["imageUrl", "image", "images"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-2">
                    <span className="text-muted-foreground font-semibold min-w-[100px]">{formatFieldName(key)}:</span>
                    <span className="text-foreground text-right flex-1 font-medium">
                      {typeof value === "object" && value !== null && !Array.isArray(value) ? (
                        <div className="space-y-1">
                          {Object.entries(value).map(([nestedKey, nestedValue]) => (
                            <div key={nestedKey} className="text-[10px]">
                              <span className="text-muted-foreground">{formatFieldName(nestedKey)}: </span>
                              <span>{formatFieldValue(nestedValue)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        formatFieldValue(value)
                      )}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-foreground">{formatFieldValue(item)}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // Handle arrays
  if (Array.isArray(data)) {
    const visibleItems = data.slice(0, expandedCount);
    const remaining = data.length - visibleItems.length;
    const hasProducts = visibleItems.some(isProductLike);

    return (
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-300/50 dark:border-blue-700/50">
            <Search className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Items</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">{data.length} results found</span>
          </div>
        </div>
        {hasProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {visibleItems.map((item: any, idx: number) =>
              isProductLike(item) ? renderProductCard(item, idx) : renderGenericCard(item, idx)
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {visibleItems.map((item: any, idx: number) => renderGenericCard(item, idx))}
          </div>
        )}
        {remaining > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-3 text-xs bg-gradient-to-r from-blue-500/10 to-blue-400/10 hover:from-blue-500/20 hover:to-blue-400/20 border border-blue-300"
            onClick={() => handleExpand(expandedCount + 6)}
          >
            Show {Math.min(6, remaining)} more
          </Button>
        )}
      </div>
    );
  }

  // Handle objects
  if (typeof data === "object" && data !== null) {
    // Check if object has array-like properties
    const arrayKeys = Object.keys(data).filter((key) => Array.isArray(data[key]));

    if (arrayKeys.length > 0) {
      return (
        <div className="mt-3 space-y-3">
          {arrayKeys.map((arrayKey) => {
            const arrayData = data[arrayKey];
            const visibleItems = arrayData.slice(0, expandedCount);
            const remaining = arrayData.length - visibleItems.length;
            const hasProducts = visibleItems.some(isProductLike);

            return (
              <div key={arrayKey}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-300/50 dark:border-blue-700/50">
                    <Search className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{formatFieldName(arrayKey)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <Sparkles className="h-3 w-3" />
                    <span className="font-medium">{arrayData.length} results found</span>
                  </div>
                </div>
                {hasProducts ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {visibleItems.map((item: any, idx: number) =>
                      isProductLike(item) ? renderProductCard(item, idx) : renderGenericCard(item, idx)
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visibleItems.map((item: any, idx: number) => renderGenericCard(item, idx))}
                  </div>
                )}
                {remaining > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-3 text-xs bg-gradient-to-r from-blue-500/10 to-blue-400/10 hover:from-blue-500/20 hover:to-blue-400/20 border border-blue-300"
                    onClick={() => handleExpand(expandedCount + 6)}
                  >
                    Show {Math.min(6, remaining)} more
                  </Button>
                )}
              </div>
            );
          })}
          {Object.entries(data)
            .filter(([key]) => !Array.isArray(data[key]))
            .map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-muted-foreground font-semibold">{formatFieldName(key)}: </span>
                <span className="text-foreground font-medium">{formatFieldValue(value)}</span>
              </div>
            ))}
        </div>
      );
    }

    // Simple object - render as card
    return (
      <div className="mt-3">
        <Card
          className="text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-blue-200"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <CardContent className="p-3">
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground font-semibold min-w-[120px]">{formatFieldName(key)}:</span>
                  <span className="text-foreground text-right flex-1 font-medium">{formatFieldValue(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <p className="mt-3 text-xs text-muted-foreground">{formatFieldValue(data)}</p>;
};
