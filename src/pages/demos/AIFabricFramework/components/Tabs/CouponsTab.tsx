import { Tag, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../../utils/formatters";
import type { Coupon } from "../../types";

interface CouponsTabProps {
  coupons: Coupon[];
  couponCount: number;
  isLoading: boolean;
  onAttachCoupon: (coupon: Coupon) => void;
}

export function CouponsTab({
  coupons,
  couponCount,
  isLoading,
  onAttachCoupon,
}: CouponsTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Calculate stats
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const inactiveCoupons = coupons.length - activeCoupons;

  return (
    <div className="space-y-4">
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{inactiveCoupons}</div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons list */}
      {coupons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No coupons found</p>
            <p className="text-sm text-muted-foreground/70">
              Use "Migrate Coupons" to add sample coupons
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className={`group ${!coupon.isActive ? "opacity-60" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-mono">{coupon.code}</CardTitle>
                    <Badge
                      variant={coupon.isActive ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onAttachCoupon(coupon)}
                    title="Attach to chat"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {coupon.description}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </span>
                  </div>
                  {coupon.minPurchaseAmount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Purchase</span>
                      <span>${coupon.minPurchaseAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Until</span>
                    <span>{formatDate(coupon.validUntil)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
