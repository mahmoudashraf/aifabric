import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const PageViewCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count, error } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .eq('page_path', location.pathname);
        
        if (!error && count !== null) {
          setCount(count);
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
