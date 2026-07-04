import { useCallback, useState } from "react";

import { useToast } from "@/hooks/use-toast";

import type { Cart } from "../types";
import * as api from "../utils/api";

export function useCart(userId: string) {
  const { toast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  const loadCart = useCallback(async () => {
    if (!userId) return null;
    setIsLoadingCart(true);
    try {
      const data = await api.fetchActiveCart(userId);
      setCart(data);
      return data;
    } catch (error) {
      console.error("Failed to load active cart:", error);
      toast({
        title: "Cart Unavailable",
        description: "Could not load the active cart.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoadingCart(false);
    }
  }, [toast, userId]);

  const addItem = useCallback(async (sku: string, quantity = 1) => {
    try {
      const data = await api.addCartItem(userId, sku, quantity);
      setCart(data);
      return data;
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Could not add the item to cart.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast, userId]);

  const removeItem = useCallback(async (sku: string) => {
    try {
      const data = await api.removeCartItem(userId, sku);
      setCart(data);
      return data;
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "Could not remove the item from cart.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast, userId]);

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const data = await api.applyCartCoupon(userId, code);
      setCart(data);
      return data;
    } catch (error) {
      toast({
        title: "Coupon Failed",
        description: "Could not apply the coupon.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast, userId]);

  return {
    cart,
    isLoadingCart,
    loadCart,
    addItem,
    removeItem,
    applyCoupon,
  };
}
