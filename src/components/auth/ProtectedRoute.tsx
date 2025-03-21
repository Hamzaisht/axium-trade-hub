
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ requiredRole = 'user' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
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

  // Check if user is authenticated and has sufficient permissions
  if (!isAuthenticated || !hasPermission(requiredRole)) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated and has permissions, render the routes
  return <Outlet />;
};

export default ProtectedRoute;
