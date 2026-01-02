import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoryLoveButtonProps {
  storySlug: string;
}

const STORAGE_KEY = "loved_stories";

const getLoveState = (storySlug: string): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const lovedStories: string[] = JSON.parse(stored);
      return lovedStories.includes(storySlug);
    }
  } catch {
    // Ignore parsing errors
  }
  return false;
};

const setLoveState = (storySlug: string, loved: boolean) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let lovedStories: string[] = stored ? JSON.parse(stored) : [];
    
    if (loved && !lovedStories.includes(storySlug)) {
      lovedStories.push(storySlug);
    } else if (!loved) {
      lovedStories = lovedStories.filter((s) => s !== storySlug);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lovedStories));
  } catch {
    // Ignore storage errors
  }
};

const StoryLoveButton = ({ storySlug }: StoryLoveButtonProps) => {
  const [loveCount, setLoveCount] = useState<number>(0);
  const [hasLoved, setHasLoved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setHasLoved(getLoveState(storySlug));
    fetchLoveCount();
  }, [storySlug]);

  const fetchLoveCount = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("story-reactions", {
        method: "GET",
        body: undefined,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // For GET requests, we need to use query params
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/story-reactions?story_slug=${encodeURIComponent(storySlug)}`,
        {
          method: "GET",
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setLoveCount(result.count || 0);
      }
    } catch (error) {
      console.error("Error fetching love count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLove = async () => {
    const wasLoved = hasLoved;
    
    setIsAnimating(true);
    
    // Optimistic update
    if (wasLoved) {
      setHasLoved(false);
      setLoveCount((prev) => Math.max(0, prev - 1));
      setLoveState(storySlug, false);
    } else {
      setHasLoved(true);
      setLoveCount((prev) => prev + 1);
      setLoveState(storySlug, true);
    }

    try {
      if (wasLoved) {
        // Remove reaction
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/story-reactions?story_slug=${encodeURIComponent(storySlug)}`,
          {
            method: "DELETE",
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove reaction");
        }

        const result = await response.json();
        
        // Update with actual count from server
        if (result.count !== undefined) {
          setLoveCount(result.count);
        }

        toast.success("Reaction removed");
      } else {
        // Add reaction
        const { data, error } = await supabase.functions.invoke("story-reactions", {
          body: { story_slug: storySlug },
        });

        if (error) {
          throw error;
        }

        // Update with actual count from server
        if (data?.count !== undefined) {
          setLoveCount(data.count);
        }

        toast.success("Thanks for the love! ❤️");
      }
    } catch (error) {
      console.error(`Error ${wasLoved ? "removing" : "adding"} love:`, error);
      // Revert on error
      setHasLoved(wasLoved);
      setLoveCount((prev) => wasLoved ? prev + 1 : Math.max(0, prev - 1));
      setLoveState(storySlug, wasLoved);
      toast.error(`Failed to ${wasLoved ? "remove" : "save"} your reaction. Please try again.`);
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <motion.button
      onClick={handleLove}
      disabled={isLoading}
      className={`
        group flex items-center gap-2 px-4 py-2 rounded-full
        border transition-all duration-300
        ${hasLoved 
          ? "bg-red-500/15 border-red-500 text-red-500" 
          : "bg-muted/50 border-border hover:border-red-400/50 hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={hasLoved ? "filled" : "empty"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: isAnimating ? [1, 1.3, 1] : 1, 
            opacity: 1 
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${hasLoved ? "fill-red-500 text-red-500" : "group-hover:text-red-500"}`} 
          />
        </motion.div>
      </AnimatePresence>
      
      <span className="font-medium text-sm">
        {isLoading ? "..." : loveCount}
      </span>
      
      <span className="text-sm hidden sm:inline">
        {hasLoved ? "Loved" : "Love this"}
      </span>
    </motion.button>
  );
};

export default StoryLoveButton;
