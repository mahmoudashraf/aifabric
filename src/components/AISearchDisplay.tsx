import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface AISearchDisplayProps {
  category: string;
  onRemove: () => void;
}

export const AISearchDisplay = ({ category, onRemove }: AISearchDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-0 left-2 -translate-y-1/2 z-10"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full shadow-xl backdrop-blur-sm border border-white/20">
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/20">
          <Search className="h-3 w-3 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/80 font-medium uppercase tracking-wider">
            AI Search
          </span>
          <span className="text-[10px] text-white font-bold">
            {category}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="h-5 w-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
          title="Clear AI Search"
        >
          <X className="h-3 w-3 text-white stroke-[3]" />
        </button>
      </div>
    </motion.div>
  );
};
