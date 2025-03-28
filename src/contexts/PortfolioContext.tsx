import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockPortfolioAPI } from '@/utils/mockApi';
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
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const userPortfolio = await mockPortfolioAPI.getPortfolio(user.id);
      setPortfolio(userPortfolio);
      if (userPortfolio.history) {
        setPortfolioHistory(userPortfolio.history);
      }
    } catch (error) {
      toast.error('Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mockWebSocket.connect();
    
    const connectionHandler = (data: { status: string }) => {
      setIsConnected(data.status === 'connected');
    };

    const priceUpdateHandler = (data: { ipoId: string, newPrice: number }) => {
      if (!portfolio) return;
      
      const holdingIndex = portfolio.holdings.findIndex(h => h.ipoId === data.ipoId);
      
      if (holdingIndex >= 0) {
        const updatedPortfolio = { ...portfolio };
        
        const updatedHolding = { ...updatedPortfolio.holdings[holdingIndex], currentPrice: data.newPrice };
        updatedPortfolio.holdings[holdingIndex] = updatedHolding;
        
        updatedPortfolio.totalValue = updatedPortfolio.cash + updatedPortfolio.holdings.reduce(
          (sum, holding) => sum + holding.quantity * (holding.currentPrice || holding.averagePurchasePrice), 0
        );
        
        if (updatedPortfolio.history && updatedPortfolio.history.length > 0) {
          const lastHistory = updatedPortfolio.history[updatedPortfolio.history.length - 1];
          const valueDifference = Math.abs(lastHistory.value - updatedPortfolio.totalValue);
          const percentChange = valueDifference / lastHistory.value;
          
          if (percentChange > 0.005) {
            const newHistory = [...updatedPortfolio.history, {
              date: new Date().toISOString(),
              value: updatedPortfolio.totalValue
            }];
            
            updatedPortfolio.history = newHistory;
            setPortfolioHistory(newHistory);
          }
        }
        
        setPortfolio(updatedPortfolio);
      }
    };

    const tradeHandler = (data: { 
      buyerId: string, 
      sellerId: string, 
      ipoId: string,
      creatorSymbol: string,
      price: number,
      quantity: number
    }) => {
      if (!user || !portfolio) return;
      
      const isUserInvolved = data.buyerId === user.id || data.sellerId === user.id;
      
      if (isUserInvolved) {
        fetchPortfolio();
      }
    };

    mockWebSocket.on(WSEvents.CONNECTION, connectionHandler);
    mockWebSocket.on(WSEvents.PRICE_UPDATE, priceUpdateHandler);
    mockWebSocket.on(WSEvents.TRADE_EXECUTED, tradeHandler);
    mockWebSocket.on(WSEvents.PORTFOLIO_UPDATED, fetchPortfolio);

    return () => {
      mockWebSocket.off(WSEvents.CONNECTION, connectionHandler);
      mockWebSocket.off(WSEvents.PRICE_UPDATE, priceUpdateHandler);
      mockWebSocket.off(WSEvents.TRADE_EXECUTED, tradeHandler);
      mockWebSocket.off(WSEvents.PORTFOLIO_UPDATED, fetchPortfolio);
    };
  }, [isAuthenticated, user, portfolio]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPortfolio();
    }
  }, [isAuthenticated, user]);

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
