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
  Database,
  Search,
  Bot,
  Receipt,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          AI Fabric Framework
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          A comprehensive demo showcasing intelligent product management, natural language search,
          conversational AI, and smart orchestration capabilities.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Database className="h-3 w-3" />
            Database
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Search className="h-3 w-3" />
            Semantic Search
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Bot className="h-3 w-3" />
            Conversational AI
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Receipt className="h-3 w-3" />
            Orders
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Zap className="h-3 w-3" />
            Orchestration
          </Badge>
        </div>
      </div>
    </div>
  );
}
