
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { showNotification } from '@/components/notifications/ToastContainer';

export const TokenRefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Set up token refresh mechanism
    const setupTokenRefresh = async () => {
      try {
        // Check token expiry and refresh if needed
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        // Get token expiry time (default token expiry is 1 hour in Supabase)
        const expiresAt = session.expires_at || 0;
        const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
        
        // If token is about to expire in the next 5 minutes (300 seconds), refresh it
        if (expiresIn < 300) {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error("Token refresh failed:", error);
            showNotification.error("Authentication expired. Please log in again.");
          } else if (data.session) {
            console.log("Token refreshed successfully");
          }
        }
      } catch (error) {
        console.error("Error in token refresh:", error);
      }
    };
    
    // Initial check
    setupTokenRefresh();
    
    // Set interval to check token expiry every 4 minutes
    const refreshInterval = setInterval(setupTokenRefresh, 4 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);
  
  return <>{children}</>;
};

export default TokenRefreshProvider;
