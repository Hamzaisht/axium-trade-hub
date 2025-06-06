
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockTradingAPI, Order, Trade, IPO } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { mockWebSocket, WSEvents } from '@/utils/mockWebSocket';

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
  isConnected: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to the mock WebSocket when the context is initialized
  useEffect(() => {
    mockWebSocket.connect();
    
    // Handle connection status
    const connectionHandler = (data: { status: string }) => {
      setIsConnected(data.status === 'connected');
    };

    // Handle order updates that belong to the current user
    const orderUpdateHandler = (data: Order) => {
      if (user && data.userId === user.id) {
        // Update orders if this is the current user's order
        setOrders(prev => {
          const orderIndex = prev.findIndex(o => o.id === data.id);
          if (orderIndex >= 0) {
            const newOrders = [...prev];
            newOrders[orderIndex] = data;
            return newOrders;
          }
          return [...prev, data];
        });
      }
    };

    // Handle trade executions that involve the current user
    const tradeHandler = (data: Trade & { creatorSymbol?: string }) => {
      if (user && (data.buyerId === user.id || data.sellerId === user.id)) {
        setTrades(prev => {
          // Don't add duplicate trades
          if (prev.some(t => t.id === data.id)) return prev;
          return [data, ...prev];
        });
        
        // Toast notification for trade execution
        toast.success(`Trade executed: ${data.buyerId === user?.id ? 'Bought' : 'Sold'} ${data.quantity} ${data.creatorSymbol || 'tokens'} at $${data.price}`);
      }
    };

    // Handle order book updates for the currently selected IPO
    const orderBookHandler = (data: { ipoId: string, bids: Order[], asks: Order[] }) => {
      if (orderBook && orderBook.bids[0]?.ipoId === data.ipoId) {
        setOrderBook({
          bids: data.bids,
          asks: data.asks
        });
      }
    };

    // Subscribe to WebSocket events
    mockWebSocket.on(WSEvents.CONNECTION, connectionHandler);
    mockWebSocket.on(WSEvents.ORDER_UPDATED, orderUpdateHandler);
    mockWebSocket.on(WSEvents.TRADE_EXECUTED, tradeHandler);
    mockWebSocket.on(WSEvents.ORDERBOOK_UPDATE, orderBookHandler);

    // Cleanup function
    return () => {
      mockWebSocket.off(WSEvents.CONNECTION, connectionHandler);
      mockWebSocket.off(WSEvents.ORDER_UPDATED, orderUpdateHandler);
      mockWebSocket.off(WSEvents.TRADE_EXECUTED, tradeHandler);
      mockWebSocket.off(WSEvents.ORDERBOOK_UPDATE, orderBookHandler);
    };
  }, [user, orderBook]);

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to place an order');
      throw new Error('Not authenticated');
    }

    try {
      setIsLoading(true);
      // Add the userId from the authenticated user
      const orderWithUserId = {
        ...orderData,
        userId: user.id
      };
      
      const newOrder = await mockTradingAPI.placeOrder(orderWithUserId);
      
      // Emit order event via WebSocket
      mockWebSocket.emit(WSEvents.ORDER_UPDATED, newOrder);
      
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
      const cancelledOrder = await mockTradingAPI.cancelOrder(orderId);
      
      // Emit order update via WebSocket
      mockWebSocket.emit(WSEvents.ORDER_UPDATED, cancelledOrder);
      
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
