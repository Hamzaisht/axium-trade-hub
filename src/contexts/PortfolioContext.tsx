
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockPortfolioAPI, Portfolio } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface PortfolioContextType {
  portfolio: Portfolio | null;
  isLoading: boolean;
  fetchPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPortfolio = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const userPortfolio = await mockPortfolioAPI.getUserPortfolio();
      setPortfolio(userPortfolio);
    } catch (error) {
      toast.error('Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch portfolio on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolio();
    }
  }, [isAuthenticated]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        isLoading,
        fetchPortfolio
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
