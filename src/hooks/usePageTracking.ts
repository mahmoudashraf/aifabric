import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/page-views`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              page_path: location.pathname,
              user_agent: navigator.userAgent,
              referrer: document.referrer || null,
            }),
          }
        );

        if (!response.ok) {
          console.error('Failed to track page view:', await response.text());
        }
      } catch (error) {
        // Silently fail - don't break the app for tracking
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
};
