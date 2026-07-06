import { Link } from "react-router-dom";
import {
  ArrowLeft,
  PackagePlus,
  FileText,
  Star,
  Tag,
  RefreshCw,
  Trash2,
  Loader2,
  Zap,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MigrationProgress } from "./MigrationProgress";
import type { MigrationProgress as MigrationProgressType } from "../hooks/useMigration";
import { AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE } from "../routes";

interface HeaderProps {
  // Migration states
  stockFill: MigrationProgressType;
  policyMigration: MigrationProgressType;
  reviewMigration: MigrationProgressType;
  couponMigration: MigrationProgressType;
  ticketMigration: MigrationProgressType;
  isClearing: boolean;
  // Actions
  onFillStock: () => void;
  onMigratePolicies: () => void;
  onMigrateReviews: () => void;
  onMigrateCoupons: () => void;
  onMigrateTickets: () => void;
  onSeedFull: () => void;
  onClearData: () => void;
}

export function Header({
  stockFill,
  policyMigration,
  reviewMigration,
  couponMigration,
  ticketMigration,
  isClearing,
  onFillStock,
  onMigratePolicies,
  onMigrateReviews,
  onMigrateCoupons,
  onMigrateTickets,
  onSeedFull,
  onClearData,
}: HeaderProps) {
  const isAnyMigrationRunning =
    stockFill.isRunning ||
    policyMigration.isRunning ||
    reviewMigration.isRunning ||
    couponMigration.isRunning ||
    ticketMigration.isRunning ||
    isClearing;

  return (
    <div className="mb-6 sm:mb-8">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Link to={AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE}>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              About this demo
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onFillStock}
            disabled={isAnyMigrationRunning}
            className="text-xs sm:text-sm"
          >
            {stockFill.isRunning ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <PackagePlus className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Fill Stock</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigratePolicies}
            disabled={isAnyMigrationRunning}
            className="text-xs sm:text-sm"
          >
            {policyMigration.isRunning ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Policies</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigrateReviews}
            disabled={isAnyMigrationRunning}
            className="text-xs sm:text-sm"
          >
            {reviewMigration.isRunning ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Star className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Reviews</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigrateCoupons}
            disabled={isAnyMigrationRunning}
            className="text-xs sm:text-sm"
          >
            {couponMigration.isRunning ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Tag className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Coupons</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigrateTickets}
            disabled={isAnyMigrationRunning}
            className="text-xs sm:text-sm"
          >
            {ticketMigration.isRunning ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Tickets</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSeedFull}
            disabled={isAnyMigrationRunning}
            className="text-xs sm:text-sm"
          >
            {stockFill.isRunning ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Full</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearData}
            disabled={isAnyMigrationRunning}
            className="text-xs sm:text-sm"
          >
            {isClearing ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>

      {/* Progress bars */}
      {stockFill.isRunning && (
        <MigrationProgress
          label="Filling Stock"
          progress={stockFill.progress}
          currentItem={stockFill.currentItem}
        />
      )}
      {policyMigration.isRunning && (
        <MigrationProgress
          label="Migrating Policies"
          progress={policyMigration.progress}
          currentItem={policyMigration.currentItem}
        />
      )}
      {reviewMigration.isRunning && (
        <MigrationProgress
          label="Migrating Reviews"
          progress={reviewMigration.progress}
          currentItem={reviewMigration.currentItem}
        />
      )}
      {couponMigration.isRunning && (
        <MigrationProgress
          label="Migrating Coupons"
          progress={couponMigration.progress}
          currentItem={couponMigration.currentItem}
        />
      )}
      {ticketMigration.isRunning && (
        <MigrationProgress
          label="Migrating Tickets"
          progress={ticketMigration.progress}
          currentItem={ticketMigration.currentItem}
        />
      )}

      {/* Title */}
      <div className="text-center mb-6 sm:mb-8 px-4 sm:px-0">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20">
          <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
          <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Live AI Fabric Commerce
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight px-2">
          AI Shopping Experience
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
          Stage product, policy, review, coupon, and ticket evidence, then test AI Fabric shopping flows
          through chat, RAG, and confirmed actions.
        </p>
      </div>
    </div>
  );
}
