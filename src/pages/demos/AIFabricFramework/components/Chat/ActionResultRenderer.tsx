import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { formatFieldName, formatFieldValue } from "../../utils/formatters";

interface ActionResultRendererProps {
  data: any;
  messageId: string;
  depth?: number;
}

// Recursive component to render nested objects
function NestedObjectRenderer({
  data,
  depth = 0,
  maxDepth = 3
}: {
  data: any;
  depth?: number;
  maxDepth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  if (data === null || data === undefined) {
    return <span className="text-muted-foreground">N/A</span>;
  }

  if (typeof data !== "object") {
    return <span className="break-all">{formatFieldValue(data)}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-muted-foreground">Empty array</span>;
    }
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {data.length} item(s)
        </button>
        {isExpanded && depth < maxDepth && (
          <div className="pl-3 border-l-2 border-border/50 space-y-1">
            {data.slice(0, 5).map((item, idx) => (
              <div key={idx} className="text-sm">
                <NestedObjectRenderer data={item} depth={depth + 1} maxDepth={maxDepth} />
              </div>
            ))}
            {data.length > 5 && (
              <span className="text-xs text-muted-foreground">+{data.length - 5} more</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Object
  const entries = Object.entries(data).filter(([key]) => !key.startsWith("_"));
  if (entries.length === 0) {
    return <span className="text-muted-foreground">Empty object</span>;
  }

  return (
    <div className="space-y-1">
      {depth > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {entries.length} fields
        </button>
      )}
      {(isExpanded || depth === 0) && depth < maxDepth && (
        <div className={depth > 0 ? "pl-3 border-l-2 border-border/50 space-y-1" : "space-y-1.5"}>
          {entries.slice(0, depth === 0 ? 10 : 6).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2 text-sm">
              <span className="font-medium text-muted-foreground min-w-[80px] shrink-0">
                {formatFieldName(key)}:
              </span>
              <div className="text-foreground min-w-0 flex-1">
                <NestedObjectRenderer data={value} depth={depth + 1} maxDepth={maxDepth} />
              </div>
            </div>
          ))}
          {entries.length > (depth === 0 ? 10 : 6) && (
            <span className="text-xs text-muted-foreground">
              +{entries.length - (depth === 0 ? 10 : 6)} more fields
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function ActionResultRenderer({ data, messageId, depth = 0 }: ActionResultRendererProps) {
  const [expandedCount, setExpandedCount] = useState(3);

  if (!data) return null;

  // Handle arrays at top level
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
            {typeof item === "object" && item !== null ? (
              <NestedObjectRenderer data={item} depth={0} />
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

  // Handle objects at top level
  if (typeof data === "object") {
    return (
      <div className="mt-3 bg-background/50 rounded-lg p-3 border border-border/50">
        <NestedObjectRenderer data={data} depth={0} />
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
