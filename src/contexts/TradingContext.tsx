
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, Trade } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { TradingContextType, OrderBookData } from './trading/types';
import { useWebSocketTrading } from '@/hooks/trading/useWebSocketTrading';
import { TradingService } from '@/services/TradingService';

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  
  // Use the WebSocket hook to handle real-time trading data
  const { 
    isConnected, 
    orders, 
    trades, 
    setOrders, 
    setTrades 
  } = useWebSocketTrading(user, orderBook);

  const placeOrderInContext = async (orderData: Partial<Order>): Promise<Order> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to place an order');
      throw new Error('Not authenticated');
    }

    try {
      setIsLoading(true);
      const newOrder = await TradingService.placeOrder(orderData, user.id);
      await fetchUserOrders();
      return newOrder;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('Please log in to cancel an order');
      throw new Error('Not authenticated');
    }

    try {
      setIsLoading(true);
      await TradingService.cancelOrder(orderId);
      await fetchUserOrders();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserOrders = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const userOrders = await TradingService.getUserOrders();
      setOrders(userOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTrades = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const userTrades = await TradingService.getUserTrades();
      setTrades(userTrades);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderBook = async (ipoId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const book = await TradingService.getOrderBook(ipoId);
      setOrderBook(book);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TradingContext.Provider
      value={{
        isLoading,
        orders,
        trades,
        orderBook,
        placeOrder: placeOrderInContext,
        cancelOrder,
        fetchUserOrders,
        fetchUserTrades,
        fetchOrderBook,
        isConnected
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
