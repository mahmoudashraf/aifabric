import { ChevronDown, ChevronRight, Package, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatPrice } from "../../utils/formatters";
import type { Order } from "../../types";

interface OrdersTabProps {
  orders: Order[];
  isLoading: boolean;
  expandedOrders: Record<string, boolean>;
  onToggleExpansion: (orderId: string) => void;
}

export function OrdersTab({
  orders,
  isLoading,
  expandedOrders,
  onToggleExpansion,
}: OrdersTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No orders found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors py-3"
            onClick={() => onToggleExpansion(order.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {expandedOrders[order.id] ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <CardTitle className="text-base">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(order.orderDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    order.status === "completed"
                      ? "default"
                      : order.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {order.status}
                </Badge>
                <span className="font-medium">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </CardHeader>
          {expandedOrders[order.id] && (
            <CardContent className="pt-0 pb-4">
              <div className="grid gap-2 text-sm border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span>{order.productName || order.productId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span>{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-xs">{order.userId}</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
