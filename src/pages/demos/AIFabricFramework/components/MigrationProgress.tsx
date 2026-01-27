import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface MigrationProgressProps {
  label: string;
  progress: number;
  currentItem: string;
  color?: string;
}

export function MigrationProgress({
  label,
  progress,
  currentItem,
  color = "bg-primary",
}: MigrationProgressProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {label}
        </span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      {currentItem && (
        <p className="text-xs text-muted-foreground mt-2 truncate">{currentItem}</p>
      )}
    </div>
  );
}
