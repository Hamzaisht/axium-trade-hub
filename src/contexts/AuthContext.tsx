
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define user roles
export type UserRole = 'guest' | 'user' | 'admin' | 'creator' | 'investor';

// Enhanced user with roles
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  walletAddress?: string;
  kycVerified: boolean;
  apiRole?: string; // Add apiRole property for IPOContext
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<AuthenticatedUser>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeKYC: (kycData: any) => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map Supabase user to AuthenticatedUser
const mapSupabaseUser = (user: User | null): AuthenticatedUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.user_metadata?.name || 'User',
    email: user.email || '',
    role: (user.user_metadata?.role as UserRole) || 'user',
    profileImage: user.user_metadata?.avatar_url,
    walletAddress: user.user_metadata?.wallet_address,
    kycVerified: user.user_metadata?.kyc_verified || false,
    apiRole: user.user_metadata?.api_role
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session ? mapSupabaseUser(session.user) : null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session ? mapSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const authenticatedUser = mapSupabaseUser(data.user);
      setUser(authenticatedUser);
      toast.success(`Welcome back, ${authenticatedUser?.name || 'User'}!`);
      
      // Use the location state to redirect if available, otherwise go to dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<AuthenticatedUser>, password: string) => {
    try {
      setIsLoading(true);
      
      if (!userData.email) throw new Error('Email is required');
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          data: {
            name: userData.name,
            role: 'user',
            kyc_verified: false
          }
        }
      });
      
      if (error) throw error;
      
      const authenticatedUser = mapSupabaseUser(data.user);
      setUser(authenticatedUser);
      toast.success('Registration successful!');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      toast.success('You have been logged out');
      navigate('/', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const completeKYC = async (kycData: any) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...kycData,
          kyc_verified: true
        }
      });
      
      if (error) throw error;
      
      const updatedUser = mapSupabaseUser(data.user);
      setUser(updatedUser);
      toast.success('KYC verification completed successfully');
    } catch (error: any) {
      toast.error(error.message || 'KYC verification failed');
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
