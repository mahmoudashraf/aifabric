import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import * as api from "../utils/api";
import { DEFAULT_USER_ID } from "../constants";
import type { Policy, Review, Coupon, Order } from "../types";

export function useDataEntities() {
  const { toast } = useToast();

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Policies state
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  // Load orders
  const loadOrders = useCallback(async (userId = DEFAULT_USER_ID) => {
    setIsLoadingOrders(true);
    try {
      const data = await api.fetchOrders(userId);
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Toggle order expansion
  const toggleOrderExpansion = useCallback((orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  // Load policies
  const loadPolicies = useCallback(async (limit = 50) => {
    setIsLoadingPolicies(true);
    try {
      const data = await api.fetchPolicies(limit);
      setPolicies(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load policies.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPolicies(false);
    }
  }, [toast]);

  // Delete policy
  const handleDeletePolicy = useCallback(async (id: string) => {
    try {
      await api.deletePolicy(id);
      await loadPolicies();

      toast({
        title: "Policy Deleted",
        description: "The policy has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete policy.",
        variant: "destructive",
      });
    }
  }, [loadPolicies, toast]);

  // Load reviews
  const loadReviews = useCallback(async (limit = 50) => {
    setIsLoadingReviews(true);
    try {
      const data = await api.fetchReviews(limit);
      setReviews(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReviews(false);
    }
  }, [toast]);

  // Load coupons
  const loadCoupons = useCallback(async (limit = 50) => {
    setIsLoadingCoupons(true);
    try {
      const data = await api.fetchCoupons(limit);
      setCoupons(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load coupons.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCoupons(false);
    }
  }, [toast]);

  return {
    // Orders
    orders,
    isLoadingOrders,
    expandedOrders,
    loadOrders,
    toggleOrderExpansion,

    // Policies
    policies,
    isLoadingPolicies,
    loadPolicies,
    handleDeletePolicy,

    // Reviews
    reviews,
    isLoadingReviews,
    loadReviews,

    // Coupons
    coupons,
    isLoadingCoupons,
    loadCoupons,
  };
}
