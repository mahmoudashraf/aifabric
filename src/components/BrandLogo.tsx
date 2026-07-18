import { cn } from "@/lib/utils";

export const AI_FABRIC_LOGO_MARK_SRC = "/brand/ai-fabric-logo-mark-square.png";
export const AI_FABRIC_LOGO_LOCKUP_SRC = "/brand/ai-fabric-logo-lockup.png";

interface BrandLogoProps {
  className?: string;
  markClassName?: string;
  showText?: boolean;
  textClassName?: string;
}

const BrandLogo = ({
  className,
  markClassName,
  showText = true,
  textClassName,
}: BrandLogoProps) => {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm",
          markClassName
        )}
      >
      <img
        src={AI_FABRIC_LOGO_MARK_SRC}
        alt={showText ? "" : "AI Fabric"}
        className="h-full w-full object-cover"
      />
      </span>
      {showText && (
        <span className={cn("text-xl font-bold tracking-normal text-foreground", textClassName)}>
          AI Fabric
        </span>
      )}
    </span>
  );
};

export default BrandLogo;
