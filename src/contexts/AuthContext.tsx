
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockAuthAPI, User } from '@/utils/mockApi';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeKYC: (kycData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const currentUser = mockAuthAPI.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user } = await mockAuthAPI.login(email, password);
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
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
      setUser(user);
      toast.success('Registration successful!');
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
      setUser(updatedUser);
      toast.success('KYC verification completed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'KYC verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
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
        completeKYC
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
