import { useState } from "react";
import { CreditCard, Loader2, RefreshCw, ShoppingCart, Tag, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { Cart } from "../../types";

interface CartTabProps {
  cart: Cart | null;
  isLoading: boolean;
  onRefresh: () => void;
  onRemoveItem: (sku: string) => void;
  onApplyCoupon: (code: string) => void;
  onAskAI: (query: string) => void;
}

const formatMoney = (value: unknown, currency?: string) => {
  if (value === undefined || value === null || value === "") return "-";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};

export function CartTab({
  cart,
  isLoading,
  onRefresh,
  onRemoveItem,
  onApplyCoupon,
  onAskAI,
}: CartTabProps) {
  const [couponCode, setCouponCode] = useState("");
  const items = cart?.items || [];
  const currency = cart?.currency || "USD";

  const submitCoupon = () => {
    const code = couponCode.trim();
    if (!code) return;
    onApplyCoupon(code);
    setCouponCode("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              Active Cart
            </CardTitle>
            <Button size="sm" variant="outline" onClick={onRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <RefreshCw className="h-4 w-4 sm:mr-2" />}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-12 text-center text-muted-foreground">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id || item.sku} className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{item.productName || item.sku}</div>
                    <div className="text-sm text-muted-foreground">{item.sku}</div>
                    <div className="mt-1 text-sm">
                      {item.quantity} x {formatMoney(item.unitPrice, currency)}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-bold">{formatMoney(item.totalPrice, currency)}</div>
                    <Button size="icon" variant="ghost" className="mt-1" onClick={() => onRemoveItem(item.sku)} title="Remove item">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cart Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline">{cart?.status || "ACTIVE"}</Badge>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatMoney(cart?.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-semibold">{formatMoney(cart?.discount, currency)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t pt-3 text-lg font-bold">
              <span>Total</span>
              <span>{formatMoney(cart?.total, currency)}</span>
            </div>
            {cart?.couponCode && (
              <Badge className="gap-1">
                <Tag className="h-3 w-3" />
                {cart.couponCode}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Coupon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitCoupon();
                }}
                placeholder="Coupon code"
              />
              <Button onClick={submitCoupon} disabled={!couponCode.trim()}>
                Apply
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" onClick={() => onAskAI("Review my active cart and recommend the next best shopping action.")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ask AI about cart
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => onAskAI("Can I check out this cart? If anything is missing, tell me what to provide.")}>
                <CreditCard className="mr-2 h-4 w-4" />
                Ask AI about checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
