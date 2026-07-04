import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import * as api from "../utils/api";
import type { DemoHealth, DemoReadiness } from "../types";

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
  const [readiness, setReadiness] = useState<DemoReadiness | null>(null);
  const [health, setHealth] = useState<DemoHealth | null>(null);
  const [lastStageResult, setLastStageResult] = useState<any>(null);

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

  const loadReadiness = useCallback(async () => {
    try {
      const data = await api.fetchDemoReadiness();
      setReadiness(data);
      setPolicyCount(data.counts?.policies || 0);
      setReviewCount(data.counts?.reviews || 0);
      setCouponCount(data.counts?.coupons || 0);
      return data;
    } catch (error) {
      console.error("Failed to load demo readiness:", error);
      return null;
    }
  }, []);

  const loadHealth = useCallback(async () => {
    try {
      const data = await api.fetchDemoHealth();
      setHealth(data);
      if (data.readiness) {
        setReadiness(data.readiness);
      }
      return data;
    } catch (error) {
      console.error("Failed to load demo health:", error);
      return null;
    }
  }, []);

  const refreshReadiness = useCallback(async (onComplete?: () => void) => {
    await Promise.all([loadReadiness(), loadHealth()]);
    onComplete?.();
  }, [loadHealth, loadReadiness]);

  // Fill stock with sample products
  const handleFillStock = useCallback(async (onComplete?: () => void) => {
    setStockFill({ isRunning: true, progress: 20, currentItem: "Seeding product catalog evidence..." });
    try {
      const result = await api.seedDemoStage("products");
      setLastStageResult(result);
      setMigratedProductIds([]);
      setStockFill({ isRunning: false, progress: 100, currentItem: "" });
      toast({ title: "Product Evidence Ready", description: "Product catalog stage is seeded from the backend." });
      await refreshReadiness(onComplete);
    } catch (error) {
      setStockFill({ isRunning: false, progress: 0, currentItem: "" });
      toast({ title: "Product Seed Failed", description: "Could not seed product evidence.", variant: "destructive" });
    }
  }, [refreshReadiness, toast]);

  // Migrate policies
  const handleMigratePolicies = useCallback(async (onComplete?: () => void) => {
    setPolicyMigration({ isRunning: true, progress: 35, currentItem: "Seeding commerce policies..." });
    try {
      const result = await api.seedDemoStage("policies");
      setLastStageResult(result);
      setPolicyMigration({ isRunning: false, progress: 100, currentItem: "" });
      toast({ title: "Policy Evidence Ready", description: "Shopping policies are available for RAG answers." });
      await refreshReadiness(onComplete);
    } catch (error) {
      setPolicyMigration({ isRunning: false, progress: 0, currentItem: "" });
      toast({ title: "Policy Seed Failed", description: "Could not seed policies.", variant: "destructive" });
    }
  }, [refreshReadiness, toast]);

  // Migrate reviews
  const handleMigrateReviews = useCallback(async (onComplete?: () => void) => {
    setReviewMigration({ isRunning: true, progress: 35, currentItem: "Seeding product review evidence..." });
    try {
      const result = await api.seedDemoStage("reviews");
      setLastStageResult(result);
      setReviewMigration({ isRunning: false, progress: 100, currentItem: "" });
      toast({ title: "Review Evidence Ready", description: "Product review evidence is available for comparisons." });
      await refreshReadiness(onComplete);
    } catch (error) {
      setReviewMigration({ isRunning: false, progress: 0, currentItem: "" });
      toast({ title: "Review Seed Failed", description: "Could not seed product reviews.", variant: "destructive" });
    }
  }, [refreshReadiness, toast]);

  // Migrate coupons
  const handleMigrateCoupons = useCallback(async (onComplete?: () => void) => {
    setCouponMigration({ isRunning: true, progress: 35, currentItem: "Seeding coupon scenarios..." });
    try {
      const result = await api.seedDemoStage("coupons");
      setLastStageResult(result);
      setCouponMigration({ isRunning: false, progress: 100, currentItem: "" });
      toast({ title: "Coupon Evidence Ready", description: "Coupon scenarios are available." });
      await refreshReadiness(onComplete);
    } catch (error) {
      setCouponMigration({ isRunning: false, progress: 0, currentItem: "" });
      toast({ title: "Coupon Seed Failed", description: "Could not seed coupons.", variant: "destructive" });
    }
  }, [refreshReadiness, toast]);

  // Migrate tickets
  const handleMigrateTickets = useCallback(async (onComplete?: () => void) => {
    setTicketMigration({ isRunning: true, progress: 35, currentItem: "Seeding support ticket scenarios..." });
    try {
      const result = await api.seedDemoStage("tickets");
      setLastStageResult(result);
      setTicketMigration({ isRunning: false, progress: 100, currentItem: "" });
      toast({ title: "Support Scenarios Ready", description: "Support ticket fixtures are available." });
      await refreshReadiness(onComplete);
    } catch (error) {
      setTicketMigration({ isRunning: false, progress: 0, currentItem: "" });
      toast({ title: "Ticket Seed Failed", description: "Could not seed support tickets.", variant: "destructive" });
    }
  }, [refreshReadiness, toast]);

  const handleSeedFull = useCallback(async (onComplete?: () => void) => {
    setStockFill({ isRunning: true, progress: 20, currentItem: "Seeding full demo dataset..." });
    try {
      const result = await api.seedDemoStage("full");
      setLastStageResult(result);
      setStockFill({ isRunning: false, progress: 100, currentItem: "" });
      toast({ title: "Full Demo Ready", description: "Products, reviews, policies, coupons, and tickets are seeded." });
      await refreshReadiness(onComplete);
    } catch (error) {
      setStockFill({ isRunning: false, progress: 0, currentItem: "" });
      toast({ title: "Full Seed Failed", description: "Could not seed the full demo dataset.", variant: "destructive" });
    }
  }, [refreshReadiness, toast]);

  // Clear all data
  const handleClearData = useCallback(async (onComplete?: () => void) => {
    if (!confirm("Are you sure you want to clear ALL data? This cannot be undone!")) {
      return;
    }

    setIsClearing(true);

    try {
      const result = await api.resetDemoData();
      setLastStageResult(result);
      setMigratedProductIds([]);
      setPolicyCount(0);
      setReviewCount(0);
      setCouponCount(0);
      setReadiness(null);

      toast({
        title: "Data Cleared",
        description: "All data has been cleared successfully.",
      });

      await refreshReadiness(onComplete);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  }, [refreshReadiness, toast]);

  // Load counts
  const loadPolicyCount = useCallback(async () => {
    try {
      const data = await loadReadiness();
      if (data) setPolicyCount(data.counts?.policies || 0);
    } catch (error) {
      console.error("Failed to load policy count:", error);
    }
  }, [loadReadiness]);

  const loadReviewCount = useCallback(async () => {
    try {
      const data = await loadReadiness();
      if (data) setReviewCount(data.counts?.reviews || 0);
    } catch (error) {
      // Fallback: fetch reviews and count
      try {
        const reviews = await api.fetchReviews(1000);
        setReviewCount(reviews.length);
      } catch {
        console.error("Failed to load review count");
      }
    }
  }, [loadReadiness]);

  const loadCouponCount = useCallback(async () => {
    try {
      const data = await loadReadiness();
      if (data) setCouponCount(data.counts?.coupons || 0);
    } catch (error) {
      console.error("Failed to load coupon count:", error);
    }
  }, [loadReadiness]);

  return {
    // State
    stockFill,
    policyMigration,
    reviewMigration,
    couponMigration,
    ticketMigration,
    readiness,
    health,
    lastStageResult,
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
    handleSeedFull,
    handleClearData,
    loadReadiness,
    loadHealth,
    refreshReadiness,
    loadPolicyCount,
    loadReviewCount,
    loadCouponCount,
  };
}
