import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatFieldName, formatFieldValue } from "../../utils/formatters";

interface ActionResultRendererProps {
  data: any;
  messageId: string;
}

export function ActionResultRenderer({ data, messageId }: ActionResultRendererProps) {
  const [expandedCount, setExpandedCount] = useState(3);

  if (!data) return null;

  // Handle arrays
  if (Array.isArray(data)) {
    const visibleItems = data.slice(0, expandedCount);
    const remaining = data.length - visibleItems.length;

    return (
      <div className="mt-3 space-y-2">
        {visibleItems.map((item: any, idx: number) => (
          <div
            key={`${messageId}-item-${idx}`}
            className="bg-background/50 rounded-lg p-3 border border-border/50"
          >
            {typeof item === "object" ? (
              <div className="space-y-1.5">
                {Object.entries(item)
                  .filter(([key]) => !key.startsWith("_"))
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-sm">
                      <span className="font-medium text-muted-foreground min-w-[100px]">
                        {formatFieldName(key)}:
                      </span>
                      <span className="text-foreground break-all">
                        {formatFieldValue(value)}
                      </span>
                    </div>
                  ))}
                {Object.keys(item).filter((k) => !k.startsWith("_")).length > 6 && (
                  <span className="text-xs text-muted-foreground">
                    +{Object.keys(item).filter((k) => !k.startsWith("_")).length - 6} more fields
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm">{formatFieldValue(item)}</span>
            )}
          </div>
        ))}
        {remaining > 0 && (
          <button
            onClick={() => setExpandedCount((prev) => prev + 5)}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ChevronDown className="h-4 w-4" />
            Show {Math.min(remaining, 5)} more ({remaining} remaining)
          </button>
        )}
        {expandedCount > 3 && (
          <button
            onClick={() => setExpandedCount(3)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <ChevronRight className="h-4 w-4" />
            Show less
          </button>
        )}
      </div>
    );
  }

  // Handle objects
  if (typeof data === "object") {
    const entries = Object.entries(data).filter(([key]) => !key.startsWith("_"));

    return (
      <div className="mt-3 bg-background/50 rounded-lg p-3 border border-border/50">
        <div className="space-y-1.5">
          {entries.slice(0, 8).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2 text-sm">
              <span className="font-medium text-muted-foreground min-w-[100px]">
                {formatFieldName(key)}:
              </span>
              <span className="text-foreground break-all">
                {typeof value === "object" && value !== null
                  ? Array.isArray(value)
                    ? `${value.length} item(s)`
                    : "Object"
                  : formatFieldValue(value)}
              </span>
            </div>
          ))}
          {entries.length > 8 && (
            <span className="text-xs text-muted-foreground">
              +{entries.length - 8} more fields
            </span>
          )}
        </div>
      </div>
    );
  }

  // Handle primitives
  return (
    <div className="mt-3 bg-background/50 rounded-lg p-3 border border-border/50">
      <span className="text-sm">{formatFieldValue(data)}</span>
    </div>
  );
}
