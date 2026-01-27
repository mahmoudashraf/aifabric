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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MigrationProgress } from "./MigrationProgress";
import type { MigrationProgress as MigrationProgressType } from "../hooks/useMigration";

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
    <div className="mb-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onFillStock}
            disabled={isAnyMigrationRunning}
          >
            {stockFill.isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PackagePlus className="h-4 w-4 mr-2" />
            )}
            Fill Stock
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigratePolicies}
            disabled={isAnyMigrationRunning}
          >
            {policyMigration.isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Migrate Policies
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigrateReviews}
            disabled={isAnyMigrationRunning}
          >
            {reviewMigration.isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Star className="h-4 w-4 mr-2" />
            )}
            Migrate Reviews
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigrateCoupons}
            disabled={isAnyMigrationRunning}
          >
            {couponMigration.isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Tag className="h-4 w-4 mr-2" />
            )}
            Migrate Coupons
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onMigrateTickets}
            disabled={isAnyMigrationRunning}
          >
            {ticketMigration.isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Migrate Tickets
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearData}
            disabled={isAnyMigrationRunning}
          >
            {isClearing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Clear Data
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20">
          <Zap className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Next Generation AI Commerce
          </span>
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-4 tracking-tight">
          AI Shopping Experience
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Welcome to the future of ecommerce. Chat with AI, discover products through natural conversations,
          and experience intelligent shopping like never before.
        </p>
      </div>
    </div>
  );
}
