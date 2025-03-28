
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  allowCreator?: boolean;
  allowInvestor?: boolean;
  children: ReactNode;
}

export const ProtectedRoute = ({ 
  requiredRole = 'user',
  allowCreator = true,
  allowInvestor = true,
  children
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasPermission, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading spinner while checking auth status
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-axium-blue mx-auto mb-4" />
          <p className="text-axium-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Save the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has sufficient permissions
  if (!hasPermission(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4 mr-2" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this area. 
            {requiredRole === 'admin' && " This section requires administrator privileges."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Check for creator/investor specific restrictions
  if (user && user.role === 'creator' && !allowCreator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4 mr-2" />
          <AlertTitle>Creator Access Denied</AlertTitle>
          <AlertDescription>
            This area is only available to investors.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (user && user.role === 'investor' && !allowInvestor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4 mr-2" />
          <AlertTitle>Investor Access Denied</AlertTitle>
          <AlertDescription>
            This area is only available to creators.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // User is authenticated and has permissions, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
