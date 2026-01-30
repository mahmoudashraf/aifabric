import { ShoppingCart, Search, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ActionTag } from "../../types";

interface QuickToolsProps {
  activeTag: ActionTag | null;
  onToolClick: (tag: ActionTag) => void;
}

export function QuickTools({ activeTag, onToolClick }: QuickToolsProps) {
  const tools = [
    {
      id: "search",
      type: "search" as const,
      label: "Search Products",
      query: "",
      icon: Search,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    },
    {
      id: "cart",
      type: "cart" as const,
      label: "My Cart",
      query: "Action: view_cart",
      icon: ShoppingCart,
      color: "bg-green-500/10 text-green-600 border-green-500/30",
    },
    {
      id: "browse",
      type: "browse" as const,
      label: "Browse Products",
      query: "",
      icon: Package,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTag?.type === tool.type;

        return (
          <Button
            key={tool.id}
            variant="outline"
            size="sm"
            onClick={() => onToolClick({
              id: tool.id,
              type: tool.type,
              label: tool.label,
              query: tool.query,
              timestamp: new Date().toISOString(),
            })}
            className={`gap-1 sm:gap-2 transition-all text-xs px-2 sm:px-3 h-8 sm:h-9 ${
              isActive
                ? "ring-2 ring-primary ring-offset-2 " + tool.color
                : "hover:" + tool.color
            }`}
          >
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-[10px] sm:text-xs font-medium">{tool.label}</span>
            {isActive && (
              <Badge className="ml-0.5 sm:ml-1 h-3.5 sm:h-4 px-1 text-[9px] sm:text-[10px] bg-primary hidden sm:inline-flex">
                Active
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
