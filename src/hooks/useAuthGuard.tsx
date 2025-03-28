
import { useEffect, useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface UseAuthGuardOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  message?: string;
  allowCreator?: boolean;
  allowInvestor?: boolean;
  silent?: boolean;
}

/**
 * A hook to protect routes based on authentication status and user roles.
 * 
 * @param options Configuration options for the auth guard
 * @returns Object containing auth status information
 */
export const useAuthGuard = ({
  requiredRole = 'user',
  redirectTo = '/login',
  message = 'You must be logged in to access this page',
  allowCreator = true,
  allowInvestor = true,
  silent = false
}: UseAuthGuardOptions = {}) => {
  const { isAuthenticated, isLoading, hasPermission, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Don't check until loading is complete
    if (isLoading) return;

    // Check authentication first
    if (!isAuthenticated) {
      if (!silent) {
        toast.error(message);
      }
      
      // Save the current location for redirect after login
      navigate(redirectTo, { state: { from: location }, replace: true });
      setIsAuthorized(false);
      return;
    }
    
    // Then check if user has the required role
    if (!hasPermission(requiredRole)) {
      if (!silent) {
        toast.error(`You don't have permission to access this page. Required role: ${requiredRole}`);
      }
      
      navigate('/dashboard', { replace: true });
      setIsAuthorized(false);
      return;
    }
    
    // Check creator/investor specific restrictions
    if (user && user.role === 'creator' && !allowCreator) {
      if (!silent) {
        toast.error('This area is only available to investors');
      }
      
      navigate('/dashboard', { replace: true });
      setIsAuthorized(false);
      return;
    }
    
    if (user && user.role === 'investor' && !allowInvestor) {
      if (!silent) {
        toast.error('This area is only available to creators');
      }
      
      navigate('/dashboard', { replace: true });
      setIsAuthorized(false);
      return;
    }
    
    // User is authenticated and has permissions
    setIsAuthorized(true);
  }, [
    isAuthenticated, 
    isLoading, 
    hasPermission, 
    requiredRole, 
    navigate, 
    redirectTo, 
    message, 
    location, 
    user, 
    allowCreator, 
    allowInvestor,
    silent
  ]);

  return {
    isAuthenticated,
    isLoading,
    isAuthorized,
    user
  };
};

export default useAuthGuard;
