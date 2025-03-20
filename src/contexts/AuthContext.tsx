
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockAuthAPI, User } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Define user roles
export type UserRole = 'guest' | 'user' | 'admin';

// Enhanced user with roles
export interface AuthenticatedUser extends User {
  role: UserRole;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeKYC: (kycData: any) => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing user session on mount
    const checkAuthStatus = () => {
      try {
        setIsLoading(true);
        const currentUser = mockAuthAPI.getCurrentUser();
        if (currentUser) {
          // Ensure user has a role property
          const userWithRole = {
            ...currentUser,
            role: (currentUser as any).role || 'user' as UserRole
          };
          setUser(userWithRole);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user } = await mockAuthAPI.login(email, password);
      // Ensure user has a role property
      const userWithRole = {
        ...user,
        role: (user as any).role || 'user' as UserRole
      };
      setUser(userWithRole);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      const { user } = await mockAuthAPI.register(userData, password);
      // Ensure user has a role property, default to 'user'
      const userWithRole = {
        ...user,
        role: 'user' as UserRole
      };
      setUser(userWithRole);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await mockAuthAPI.logout();
      setUser(null);
      toast.success('You have been logged out');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const completeKYC = async (kycData: any) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      setIsLoading(true);
      const updatedUser = await mockAuthAPI.completeKYC(user.id, kycData);
      // Maintain the role when updating user data
      const updatedUserWithRole = {
        ...updatedUser,
        role: user.role
      };
      setUser(updatedUserWithRole);
      toast.success('KYC verification completed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'KYC verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check if the current user has the required role
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    // User has access to user-level and below
    if (user.role === 'user') {
      return requiredRole !== 'admin';
    }
    
    // Guest only has access to guest level
    return requiredRole === 'guest';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        completeKYC,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
