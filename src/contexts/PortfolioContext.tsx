
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockPortfolioAPI, Portfolio } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { mockWebSocket, WSEvents } from '@/utils/mockWebSocket';

interface PortfolioContextType {
  portfolio: Portfolio | null;
  isLoading: boolean;
  fetchPortfolio: () => Promise<void>;
  isConnected: boolean;
  portfolioHistory: {
    date: string;
    value: number;
  }[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [portfolioHistory, setPortfolioHistory] = useState<{date: string; value: number}[]>([]);

  const fetchPortfolio = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const userPortfolio = await mockPortfolioAPI.getUserPortfolio();
      setPortfolio(userPortfolio);
      setPortfolioHistory(userPortfolio.history);
    } catch (error) {
      toast.error('Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to the mock WebSocket when the context is initialized
  useEffect(() => {
    mockWebSocket.connect();
    
    // Handle connection status
    const connectionHandler = (data: { status: string }) => {
      setIsConnected(data.status === 'connected');
    };

    // Handle price updates that affect the portfolio value
    const priceUpdateHandler = (data: { ipoId: string, newPrice: number }) => {
      if (!portfolio) return;
      
      // Check if this IPO is in the user's portfolio
      const holdingIndex = portfolio.holdings.findIndex(h => h.ipoId === data.ipoId);
      
      if (holdingIndex >= 0) {
        // Update the portfolio with the new price
        const updatedPortfolio = { ...portfolio };
        
        // Update the current price of the holding
        updatedPortfolio.holdings[holdingIndex].currentPrice = data.newPrice;
        
        // Recalculate total value
        updatedPortfolio.totalValue = updatedPortfolio.cash + updatedPortfolio.holdings.reduce(
          (sum, holding) => sum + holding.quantity * holding.currentPrice, 0
        );
        
        // Add a new history point if the value has changed significantly
        const lastHistory = updatedPortfolio.history[updatedPortfolio.history.length - 1];
        const valueDifference = Math.abs(lastHistory.value - updatedPortfolio.totalValue);
        const percentChange = valueDifference / lastHistory.value;
        
        if (percentChange > 0.005) { // Only add history if value changed by more than 0.5%
          updatedPortfolio.history.push({
            date: new Date().toISOString(),
            value: updatedPortfolio.totalValue
          });
          
          setPortfolioHistory(updatedPortfolio.history);
        }
        
        setPortfolio(updatedPortfolio);
      }
    };

    // Handle trades that affect the portfolio
    const tradeHandler = (data: { 
      buyerId: string, 
      sellerId: string, 
      ipoId: string,
      creatorSymbol: string,
      price: number,
      quantity: number
    }) => {
      if (!user || !portfolio) return;
      
      // Check if this trade involves the current user
      const isUserInvolved = data.buyerId === user.id || data.sellerId === user.id;
      
      if (isUserInvolved) {
        // Portfolio should be updated after trade, so refetch
        fetchPortfolio();
      }
    };

    // Subscribe to WebSocket events
    mockWebSocket.on(WSEvents.CONNECTION, connectionHandler);
    mockWebSocket.on(WSEvents.PRICE_UPDATE, priceUpdateHandler);
    mockWebSocket.on(WSEvents.TRADE_EXECUTED, tradeHandler);
    mockWebSocket.on(WSEvents.PORTFOLIO_UPDATED, fetchPortfolio);

    // Cleanup function
    return () => {
      mockWebSocket.off(WSEvents.CONNECTION, connectionHandler);
      mockWebSocket.off(WSEvents.PRICE_UPDATE, priceUpdateHandler);
      mockWebSocket.off(WSEvents.TRADE_EXECUTED, tradeHandler);
      mockWebSocket.off(WSEvents.PORTFOLIO_UPDATED, fetchPortfolio);
    };
  }, [isAuthenticated, user, portfolio]);

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
        fetchPortfolio,
        isConnected,
        portfolioHistory
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
