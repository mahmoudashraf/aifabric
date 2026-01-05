import React from "react";
import { LucideIcon } from "lucide-react";

interface StoryPreviewImageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stats: string;
  category: string;
  color: string;
  className?: string;
}

const StoryPreviewImage: React.FC<StoryPreviewImageProps> = ({
  icon: Icon,
  title,
  description,
  stats,
  category,
  color,
  className = "",
}) => {
  // Extract color name for dynamic classes
  const colorName = color.replace('bg-', '');
  const colorMap: Record<string, { from: string; to: string; text: string; border: string }> = {
    'blue-500': { from: 'from-blue-500', to: 'to-blue-600', text: 'text-blue-500', border: 'border-blue-500' },
    'green-500': { from: 'from-green-500', to: 'to-green-600', text: 'text-green-500', border: 'border-green-500' },
    'purple-500': { from: 'from-purple-500', to: 'to-purple-600', text: 'text-purple-500', border: 'border-purple-500' },
    'red-500': { from: 'from-red-500', to: 'to-red-600', text: 'text-red-500', border: 'border-red-500' },
    'yellow-500': { from: 'from-yellow-500', to: 'to-yellow-600', text: 'text-yellow-500', border: 'border-yellow-500' },
    'cyan-500': { from: 'from-cyan-500', to: 'to-cyan-600', text: 'text-cyan-500', border: 'border-cyan-500' },
    'orange-500': { from: 'from-orange-500', to: 'to-orange-600', text: 'text-orange-500', border: 'border-orange-500' },
    'indigo-500': { from: 'from-indigo-500', to: 'to-indigo-600', text: 'text-indigo-500', border: 'border-indigo-500' },
  };

  const colors = colorMap[colorName] || colorMap['blue-500'];

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-background via-background to-muted border border-border/20 ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.from}/10 via-transparent to-transparent`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent`} />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className={`p-4 rounded-2xl ${color} shadow-xl ring-2 ring-white/20`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <div className={`px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border ${colors.border}/30 shadow-sm`}>
            <span className={`text-xs font-bold ${colors.text}`}>
              {category}
            </span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm text-white/90 leading-relaxed line-clamp-2 drop-shadow-md">
            {description}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className={`px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md`}>
              <span className={`text-xs font-bold ${colors.text}`}>
                {stats}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={`absolute top-0 right-0 w-40 h-40 opacity-20`}>
        <div className={`absolute top-0 right-0 w-full h-full rounded-full ${color} blur-3xl`} />
      </div>
      <div className={`absolute bottom-0 left-0 w-32 h-32 opacity-20`}>
        <div className={`absolute bottom-0 left-0 w-full h-full rounded-full ${color} blur-2xl`} />
      </div>

      {/* Corner Accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${colors.from}/5 rounded-bl-full`} />
    </div>
  );
};

export default StoryPreviewImage;

