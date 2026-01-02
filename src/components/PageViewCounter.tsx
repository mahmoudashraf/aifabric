import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const PageViewCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/page-views?page_path=${encodeURIComponent(location.pathname)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setCount(result.count ?? 0);
        }
      } catch (error) {
        console.error('Failed to fetch page view count:', error);
      }
    };

    fetchCount();
  }, [location.pathname]);

  if (count === null) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground"
    >
      <Eye className="h-3.5 w-3.5" />
      <span>{count.toLocaleString()} views</span>
    </motion.div>
  );
};

export default PageViewCounter;
