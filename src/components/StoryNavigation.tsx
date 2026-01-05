import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Compass,
  Rocket,
  Home
} from "lucide-react";
import { getStoryNavigation, getRandomStories, Story } from "@/lib/storyNavigation";
import { useState, useEffect } from "react";

interface StoryNavigationProps {
  className?: string;
  variant?: "full" | "compact";
}

// Floating particle component for creative effect
const FloatingParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-primary/30 rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [-20, -60],
      x: [0, Math.random() * 40 - 20],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2,
    }}
  />
);

// Navigation card component for full variant
const NavCard = ({ 
  story, 
  direction,
  isHovered,
  onHover 
}: { 
  story: Story | null; 
  direction: "prev" | "next";
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) => {
  if (!story) return null;

  const Icon = story.icon;
  const isPrev = direction === "prev";

  return (
    <Link
      to={story.href}
      className="group relative block"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <motion.div
        className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-3 sm:p-5 transition-all duration-300 ${
          isHovered ? "border-primary/50 shadow-xl shadow-primary/10" : ""
        }`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-${isPrev ? "r" : "l"} from-primary/5 via-transparent to-transparent`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating particles effect - hidden on mobile for performance */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden hidden sm:block">
            {[...Array(5)].map((_, i) => (
              <FloatingParticle key={i} delay={i * 0.2} />
            ))}
          </div>
        )}

        <div className={`relative flex items-center gap-2 sm:gap-4 ${isPrev ? "" : "flex-row-reverse"}`}>
          {/* Direction indicator */}
          <div className={`flex flex-col ${isPrev ? "items-start" : "items-end"} flex-1 min-w-0`}>
            <div className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 ${isPrev ? "" : "flex-row-reverse"}`}>
              {isPrev ? (
                <>
                  <ChevronLeft className="h-3 w-3" />
                  <span>Prev</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
            </div>
            
            <h4 className={`text-xs sm:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate w-full ${isPrev ? "text-left" : "text-right"}`}>
              {story.title}
            </h4>
            
            <p className={`hidden sm:block text-xs text-muted-foreground mt-1 line-clamp-1 ${isPrev ? "text-left" : "text-right"}`}>
              {story.description}
            </p>
          </div>

          {/* Icon with animated ring */}
          <div className="relative shrink-0">
            <motion.div
              className={`absolute inset-0 rounded-lg sm:rounded-xl ${story.color} opacity-20`}
              animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            />
            <div className={`relative flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl ${story.color} text-white`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>

        {/* Category badge - hidden on mobile */}
        <div className={`absolute top-2 ${isPrev ? "right-2" : "left-2"} hidden sm:block`}>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground`}>
            {story.category}
          </span>
        </div>

        {/* Animated arrow indicator - hidden on mobile */}
        <motion.div
          className={`absolute ${isPrev ? "left-3" : "right-3"} bottom-3 text-primary hidden sm:block`}
          animate={isHovered ? { x: isPrev ? -5 : 5 } : { x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isPrev ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
};

// Compact navigation button for top of stories
const CompactNavButton = ({ 
  story, 
  direction 
}: { 
  story: Story | null; 
  direction: "prev" | "next";
}) => {
  if (!story) return null;

  const isPrev = direction === "prev";
  const Icon = story.icon;

  return (
    <Link
      to={story.href}
      className="group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all w-full"
    >
      {isPrev && <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />}
      <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg ${story.color} text-white shrink-0`}>
        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      </div>
      <div className={`flex-1 min-w-0 overflow-hidden ${isPrev ? "text-left" : "text-right"}`}>
        <p className="text-[10px] sm:text-xs text-muted-foreground">{isPrev ? "Prev" : "Next"}</p>
        <p className="text-[11px] sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {story.title}
        </p>
      </div>
      {!isPrev && <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />}
    </Link>
  );
};

// Progress indicator
const ProgressIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-3 justify-center">
    <BookOpen className="h-4 w-4 text-muted-foreground" />
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-bold text-primary">{current + 1}</span>
      <span className="text-sm text-muted-foreground">/</span>
      <span className="text-sm text-muted-foreground">{total}</span>
    </div>
    <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${((current + 1) / total) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  </div>
);

// Compact progress indicator
const CompactProgress = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-1.5 sm:gap-2">
    <div className="flex items-center gap-0.5 sm:gap-1">
      <span className="text-[10px] sm:text-xs font-bold text-primary">{current + 1}</span>
      <span className="text-[10px] sm:text-xs text-muted-foreground">/</span>
      <span className="text-[10px] sm:text-xs text-muted-foreground">{total}</span>
    </div>
    <div className="w-10 sm:w-16 h-1 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all"
        style={{ width: `${((current + 1) / total) * 100}%` }}
      />
    </div>
  </div>
);

// Random story suggestion card
const SuggestionCard = ({ story }: { story: Story }) => {
  const Icon = story.icon;
  
  return (
    <Link to={story.href} className="group">
      <motion.div
        className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${story.color} text-white shrink-0`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {story.title}
          </h5>
          <p className="text-xs text-muted-foreground truncate">
            {story.category}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </motion.div>
    </Link>
  );
};

// ============================================
// COMPACT VARIANT - For top of stories
// ============================================
const CompactNavigation = ({ className = "" }: { className?: string }) => {
  const location = useLocation();
  const { previous, next, currentIndex, totalStories } = getStoryNavigation(location.pathname);

  // Don't render if story not found
  if (currentIndex === -1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${className}`}
    >
      <div className="flex items-stretch gap-1.5 sm:gap-3 p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm">
        {/* Left: Previous or All Stories */}
        <div className="flex-1 min-w-0">
          {previous ? (
            <CompactNavButton story={previous} direction="prev" />
          ) : (
            <Link
              to="/docs/user-stories"
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 sm:py-2 h-full rounded-lg sm:rounded-xl border border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-[11px] sm:text-sm font-medium text-foreground">Stories</span>
            </Link>
          )}
        </div>

        {/* Center: Progress - visible on all screens but simplified on mobile */}
        <div className="flex items-center gap-1 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-muted/30 shrink-0">
          <Compass className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <CompactProgress current={currentIndex} total={totalStories} />
        </div>

        {/* Right: Next or All Stories */}
        <div className="flex-1 min-w-0">
          {next ? (
            <CompactNavButton story={next} direction="next" />
          ) : (
            <Link
              to="/docs/user-stories"
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 sm:py-2 h-full rounded-lg sm:rounded-xl border border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <span className="text-[11px] sm:text-sm font-medium text-foreground">Stories</span>
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// FULL VARIANT - For bottom of stories
// ============================================
const FullNavigation = ({ className = "" }: { className?: string }) => {
  const location = useLocation();
  const [hoveredCard, setHoveredCard] = useState<"prev" | "next" | null>(null);
  const [randomStories, setRandomStories] = useState<Story[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { previous, next, currentIndex, totalStories } = getStoryNavigation(location.pathname);

  useEffect(() => {
    setRandomStories(getRandomStories(location.pathname, 3));
  }, [location.pathname]);

  // Don't render if story not found
  if (currentIndex === -1) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative ${className}`}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-muted/40 rounded-3xl" />
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="relative border border-border/30 rounded-2xl sm:rounded-3xl bg-card/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/30 bg-muted/20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </motion.div>
              <span className="text-xs sm:text-sm font-semibold text-foreground">Continue Your Journey</span>
            </div>
            <div className="hidden sm:block">
              <ProgressIndicator current={currentIndex} total={totalStories} />
            </div>
            {/* Simplified progress for mobile */}
            <div className="flex sm:hidden items-center gap-1 text-xs">
              <span className="font-bold text-primary">{currentIndex + 1}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{totalStories}</span>
            </div>
          </div>
        </div>

        {/* Navigation cards */}
        <div className="p-3 sm:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2">
            <AnimatePresence mode="wait">
              {previous ? (
                <motion.div
                  key="prev"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NavCard
                    story={previous}
                    direction="prev"
                    isHovered={hoveredCard === "prev"}
                    onHover={(h) => setHoveredCard(h ? "prev" : null)}
                  />
                </motion.div>
              ) : (
                <div className="flex items-center justify-center p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-dashed border-border/50 bg-muted/10">
                  <div className="text-center">
                    <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-primary/50 mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Start!</p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {next ? (
                <motion.div
                  key="next"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NavCard
                    story={next}
                    direction="next"
                    isHovered={hoveredCard === "next"}
                    onHover={(h) => setHoveredCard(h ? "next" : null)}
                  />
                </motion.div>
              ) : (
                <div className="flex items-center justify-center p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-dashed border-border/50 bg-muted/10">
                  <div className="text-center">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary/50 mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Complete!</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Explore more section - hidden on mobile for cleaner UI */}
          <motion.div className="mt-4 sm:mt-6 hidden sm:block">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore more stories</span>
              <motion.div
                animate={{ rotate: showSuggestions ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 rotate-90" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 grid gap-2 sm:grid-cols-3">
                    {randomStories.map((story, index) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <SuggestionCard story={story} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Quick navigation dots - hidden on mobile for cleaner look */}
        <div className="hidden sm:block px-6 py-3 border-t border-border/30 bg-muted/10">
          <div className="flex items-center justify-center gap-1 overflow-hidden">
            {[...Array(Math.min(totalStories, 20))].map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex 
                    ? "w-4 bg-primary" 
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
            {totalStories > 20 && (
              <span className="text-xs text-muted-foreground ml-1">+{totalStories - 20}</span>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// ============================================
// MAIN EXPORT
// ============================================
const StoryNavigation = ({ className = "", variant = "full" }: StoryNavigationProps) => {
  if (variant === "compact") {
    return <CompactNavigation className={className} />;
  }
  return <FullNavigation className={className} />;
};

export default StoryNavigation;

// Named exports for direct usage
export { CompactNavigation as StoryNavigationCompact, FullNavigation as StoryNavigationFull };
