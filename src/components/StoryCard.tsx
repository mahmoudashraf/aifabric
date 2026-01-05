import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface StoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  metrics?: string;
  status?: "available" | "coming-soon";
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  description,
  href,
  icon: Icon,
  color,
  metrics,
  status = "available",
}) => {
  const colorMap: Record<string, string> = {
    "bg-blue-500": "text-blue-600",
    "bg-green-500": "text-green-600",
    "bg-purple-500": "text-purple-600",
    "bg-red-500": "text-red-600",
    "bg-yellow-500": "text-yellow-600",
    "bg-cyan-500": "text-cyan-600",
    "bg-orange-500": "text-orange-600",
    "bg-indigo-500": "text-indigo-600",
    "bg-pink-500": "text-pink-600",
    "bg-violet-500": "text-violet-600",
    "bg-emerald-500": "text-emerald-600",
    "bg-teal-500": "text-teal-600",
    "bg-slate-500": "text-slate-600",
  };

  const iconColor = colorMap[color] || "text-blue-600";

  if (status === "coming-soon") {
    return (
      <div className="group relative rounded-xl border border-border/30 bg-card p-6 opacity-60 cursor-not-allowed">
        <div className="flex flex-col h-full">
          <div className={`mb-4 w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3 flex-1">{description}</p>
          {metrics && (
            <p className="text-xs font-semibold text-muted-foreground">{metrics}</p>
          )}
          <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={href}
      className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer h-full flex flex-col"
    >
      <div className={`mb-4 w-12 h-12 rounded-lg ${color} flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-3 flex-1 leading-relaxed">
        {description}
      </p>
      {metrics && (
        <p className={`text-xs font-semibold ${iconColor} flex items-center gap-1`}>
          <span>•</span>
          {metrics}
        </p>
      )}
    </Link>
  );
};

export default StoryCard;

