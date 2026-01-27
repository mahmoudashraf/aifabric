import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import * as api from "../utils/api";
import {
  SAMPLE_PRODUCTS,
  SAMPLE_POLICIES,
  SAMPLE_REVIEWS,
  SAMPLE_COUPONS,
  SAMPLE_TICKETS,
} from "../constants";

export interface MigrationProgress {
  isRunning: boolean;
  progress: number;
  currentItem: string;
}

export function useMigration() {
  const { toast } = useToast();

  // Stock fill state
  const [stockFill, setStockFill] = useState<MigrationProgress>({
    isRunning: false,
    progress: 0,
    currentItem: "",
  });
  const [migratedProductIds, setMigratedProductIds] = useState<string[]>([]);

  // Policy migration state
  const [policyMigration, setPolicyMigration] = useState<MigrationProgress>({
    isRunning: false,
    progress: 0,
    currentItem: "",
  });
  const [policyCount, setPolicyCount] = useState(0);

  // Review migration state
  const [reviewMigration, setReviewMigration] = useState<MigrationProgress>({
    isRunning: false,
    progress: 0,
    currentItem: "",
  });
  const [reviewCount, setReviewCount] = useState(0);

  // Coupon migration state
  const [couponMigration, setCouponMigration] = useState<MigrationProgress>({
    isRunning: false,
    progress: 0,
    currentItem: "",
  });
  const [couponCount, setCouponCount] = useState(0);

  // Ticket migration state
  const [ticketMigration, setTicketMigration] = useState<MigrationProgress>({
    isRunning: false,
    progress: 0,
    currentItem: "",
  });

  // Clearing state
  const [isClearing, setIsClearing] = useState(false);

  // Fill stock with sample products
  const handleFillStock = useCallback(async (onComplete?: () => void) => {
    setStockFill({ isRunning: true, progress: 0, currentItem: "Creating products in parallel..." });

    const results = await Promise.allSettled(
      SAMPLE_PRODUCTS.map((product) => api.createProduct(product))
    );

    let successCount = 0;
    let failCount = 0;
    const newProductIds: string[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        successCount++;
        if (result.value?.id) {
          newProductIds.push(result.value.id);
        }
      } else {
        failCount++;
        console.error("Product creation failed:", result.reason);
      }
    });

    setMigratedProductIds(newProductIds);
    setStockFill({ isRunning: false, progress: 100, currentItem: "" });

    toast({
      title: "Stock Fill Complete",
      description: `Successfully added ${successCount} products.${failCount > 0 ? ` Failed: ${failCount}` : ""}`,
    });

    onComplete?.();
  }, [toast]);

  // Migrate policies
  const handleMigratePolicies = useCallback(async (onComplete?: () => void) => {
    setPolicyMigration({ isRunning: true, progress: 0, currentItem: "Creating policies in parallel..." });

    const results = await Promise.allSettled(
      SAMPLE_POLICIES.map((policy) => api.createPolicy(policy))
    );

    let successCount = 0;
    let failCount = 0;

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        successCount++;
      } else {
        failCount++;
        console.error("Policy creation failed:", result.reason);
      }
    });

    setPolicyMigration({ isRunning: false, progress: 100, currentItem: "" });

    toast({
      title: "Policy Migration Complete",
      description: `Successfully added ${successCount} policies.${failCount > 0 ? ` Failed: ${failCount}` : ""}`,
    });

    onComplete?.();
  }, [toast]);

  // Migrate reviews
  const handleMigrateReviews = useCallback(async (onComplete?: () => void) => {
    if (migratedProductIds.length === 0) {
      // Fetch existing products to get IDs
      try {
        const products = await api.fetchProducts(100);
        if (products.length === 0) {
          toast({
            title: "Cannot Migrate Reviews",
            description: "Please fill stock first to create products for reviews.",
            variant: "destructive",
          });
          return;
        }
        setMigratedProductIds(products.map((p) => p.id));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch products for review migration.",
          variant: "destructive",
        });
        return;
      }
    }

    setReviewMigration({ isRunning: true, progress: 0, currentItem: "Creating reviews in parallel..." });

    const productIds = migratedProductIds.length > 0 ? migratedProductIds : [];
    const reviewsWithProductIds = SAMPLE_REVIEWS.map((review, index) => ({
      ...review,
      productId: productIds[index % productIds.length] || null,
    }));

    const results = await Promise.allSettled(
      reviewsWithProductIds.map((review) => api.createReview(review))
    );

    let successCount = 0;
    let failCount = 0;

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        successCount++;
      } else {
        failCount++;
        console.error("Review creation failed:", result.reason);
      }
    });

    setReviewMigration({ isRunning: false, progress: 100, currentItem: "" });

    toast({
      title: "Review Migration Complete",
      description: `Successfully added ${successCount} reviews.${failCount > 0 ? ` Failed: ${failCount}` : ""}`,
    });

    onComplete?.();
  }, [migratedProductIds, toast]);

  // Migrate coupons
  const handleMigrateCoupons = useCallback(async (onComplete?: () => void) => {
    setCouponMigration({ isRunning: true, progress: 0, currentItem: "Creating coupons in parallel..." });

    const results = await Promise.allSettled(
      SAMPLE_COUPONS.map((coupon) => api.createCoupon(coupon))
    );

    let successCount = 0;
    let failCount = 0;

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        successCount++;
      } else {
        failCount++;
        console.error("Coupon creation failed:", result.reason);
      }
    });

    setCouponMigration({ isRunning: false, progress: 100, currentItem: "" });

    toast({
      title: "Coupon Migration Complete",
      description: `Successfully added ${successCount} coupons.${failCount > 0 ? ` Failed: ${failCount}` : ""}`,
    });

    onComplete?.();
  }, [toast]);

  // Migrate tickets
  const handleMigrateTickets = useCallback(async (onComplete?: () => void) => {
    setTicketMigration({ isRunning: true, progress: 0, currentItem: "Creating tickets in parallel..." });

    const results = await Promise.allSettled(
      SAMPLE_TICKETS.map((ticket) => api.createTicket(ticket))
    );

    let successCount = 0;
    let failCount = 0;

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        successCount++;
      } else {
        failCount++;
        console.error("Ticket creation failed:", result.reason);
      }
    });

    setTicketMigration({ isRunning: false, progress: 100, currentItem: "" });

    toast({
      title: "Ticket Migration Complete",
      description: `Successfully added ${successCount} support tickets.${failCount > 0 ? ` Failed: ${failCount}` : ""}`,
    });

    onComplete?.();
  }, [toast]);

  // Clear all data
  const handleClearData = useCallback(async (onComplete?: () => void) => {
    if (!confirm("Are you sure you want to clear ALL data? This cannot be undone!")) {
      return;
    }

    setIsClearing(true);

    try {
      await api.clearAllData();
      setMigratedProductIds([]);
      setPolicyCount(0);
      setReviewCount(0);
      setCouponCount(0);

      toast({
        title: "Data Cleared",
        description: "All data has been cleared successfully.",
      });

      onComplete?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  }, [toast]);

  // Load counts
  const loadPolicyCount = useCallback(async () => {
    try {
      const count = await api.fetchPolicyCount();
      setPolicyCount(count);
    } catch (error) {
      console.error("Failed to load policy count:", error);
    }
  }, []);

  const loadReviewCount = useCallback(async () => {
    try {
      const count = await api.fetchReviewCount();
      setReviewCount(count);
    } catch (error) {
      // Fallback: fetch reviews and count
      try {
        const reviews = await api.fetchReviews(1000);
        setReviewCount(reviews.length);
      } catch {
        console.error("Failed to load review count");
      }
    }
  }, []);

  const loadCouponCount = useCallback(async () => {
    try {
      const count = await api.fetchCouponCount();
      setCouponCount(count);
    } catch (error) {
      console.error("Failed to load coupon count:", error);
    }
  }, []);

  return {
    // State
    stockFill,
    policyMigration,
    reviewMigration,
    couponMigration,
    ticketMigration,
    isClearing,
    migratedProductIds,
    policyCount,
    reviewCount,
    couponCount,

    // Actions
    handleFillStock,
    handleMigratePolicies,
    handleMigrateReviews,
    handleMigrateCoupons,
    handleMigrateTickets,
    handleClearData,
    loadPolicyCount,
    loadReviewCount,
    loadCouponCount,
  };
}
