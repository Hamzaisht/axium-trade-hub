
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { mockPortfolioAPI, Portfolio } from '@/utils/mockPortfolioAPI';
import { toast } from 'sonner';

// Context type
interface PortfolioContextType {
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: Error | null;
  refreshPortfolio: () => Promise<void>;
}

// Create context
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Provider component
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user portfolio
  const fetchPortfolio = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await mockPortfolioAPI.getUserPortfolio(user.id);
      setPortfolio(data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio'));
      toast.error('Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on auth change
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPortfolio();
    } else {
      setPortfolio(null);
    }
  }, [isAuthenticated, user]);

  // Refresh portfolio data
  const refreshPortfolio = async () => {
    await fetchPortfolio();
  };

  // Context value
  const value = {
    portfolio,
    isLoading,
    error,
    refreshPortfolio
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Hook for using the portfolio context
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  
  return context;
}
