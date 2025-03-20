
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockTradingAPI, mockIPOAPI, Order, Trade, IPO } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

interface TradingContextType {
  isLoading: boolean;
  orders: Order[];
  trades: Trade[];
  orderBook: OrderBookData | null;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchUserTrades: () => Promise<void>;
  fetchOrderBook: (ipoId: string) => Promise<void>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      throw new Error('Not authenticated');
    }

    try {
      setIsLoading(true);
      const newOrder = await mockTradingAPI.placeOrder(orderData);
      
      // Refresh orders after placing a new one
      await fetchUserOrders();
      
      return newOrder;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
      throw error;
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
      await mockTradingAPI.cancelOrder(orderId);
      
      // Refresh orders after cancellation
      await fetchUserOrders();
      
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserOrders = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const userOrders = await mockTradingAPI.getUserOrders();
      setOrders(userOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTrades = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const userTrades = await mockTradingAPI.getUserTrades();
      setTrades(userTrades);
    } catch (error) {
      toast.error('Failed to fetch trades');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderBook = async (ipoId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const book = await mockTradingAPI.getOrderBook(ipoId);
      setOrderBook(book);
    } catch (error) {
      toast.error('Failed to fetch order book');
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
        placeOrder,
        cancelOrder,
        fetchUserOrders,
        fetchUserTrades,
        fetchOrderBook
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
