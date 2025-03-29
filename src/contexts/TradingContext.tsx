
import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockTradingAPI, Order, Trade } from "../utils/mockApi";
import { useAuth } from "./AuthContext";
import { OrderBookData } from "./trading/types";
import { toast } from "sonner";

interface Trade {
  id: string;
  traderId: string;
  ipoId: string;
  amount: number;
  price: number;
  type: "buy" | "sell";
  status: "completed" | "pending" | "failed";
  timestamp: Date;
}

interface TradingContextType {
  trades: Trade[];
  orders: Order[];
  orderBook: OrderBookData | null;
  isLoading: boolean;
  error: Error | null;
  fetchTradeHistory: (ipoId: string) => void;
  placeTrade: (ipoId: string, amount: number, price: number, type: "buy" | "sell") => Promise<Trade>;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchUserTrades: () => Promise<void>;
  fetchOrderBook: (ipoId: string) => Promise<void>;
  isConnected: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await mockTradingAPI.getUserTrades();
      setTrades(response as unknown as Trade[]);
      return response;
    },
    enabled: !!user?.id,
  });
  
  const fetchTradeHistory = async (ipoId: string) => {
    try {
      if (!user?.id) return;
      const trades = await mockTradingAPI.getTradesForIPO(ipoId);
      setTrades(trades as unknown as Trade[]);
    } catch (error) {
      console.error("Error fetching trade history:", error);
    }
  };
  
  const placeTrade = async (
    ipoId: string, 
    amount: number, 
    price: number, 
    type: "buy" | "sell"
  ): Promise<Trade> => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    
    try {
      const newTrade = await mockTradingAPI.createTrade({
        ipoId,
        traderId: user.id,
        amount,
        price,
        type,
      });
      
      setTrades(prev => [newTrade as unknown as Trade, ...prev]);
      return newTrade as unknown as Trade;
    } catch (error) {
      console.error("Error placing trade:", error);
      throw error;
    }
  };

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    
    try {
      const newOrder = await mockTradingAPI.placeOrder({
        ...orderData,
        userId: user.id
      });
      
      setOrders(prev => [newOrder, ...prev]);
      toast.success(`${orderData.type === 'buy' ? 'Buy' : 'Sell'} order placed successfully`);
      return newOrder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      toast.error(errorMessage);
      throw error;
    }
  };

  const cancelOrder = async (orderId: string): Promise<void> => {
    try {
      await mockTradingAPI.cancelOrder(orderId);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
      throw error;
    }
  };

  const fetchUserOrders = async (): Promise<void> => {
    if (!user?.id) return;
    
    try {
      const userOrders = await mockTradingAPI.getUserOrders();
      setOrders(userOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const fetchUserTrades = async (): Promise<void> => {
    if (!user?.id) return;
    
    try {
      const userTrades = await mockTradingAPI.getUserTrades();
      setTrades(userTrades as unknown as Trade[]);
    } catch (error) {
      toast.error('Failed to fetch trade history');
    }
  };

  const fetchOrderBook = async (ipoId: string): Promise<void> => {
    try {
      const data = await mockTradingAPI.getOrderBook(ipoId);
      setOrderBook(data);
      setIsConnected(true);
    } catch (error) {
      toast.error('Failed to fetch order book');
      setIsConnected(false);
    }
  };
  
  return (
    <TradingContext.Provider
      value={{
        trades,
        orders,
        orderBook,
        isLoading,
        error: error as Error | null,
        fetchTradeHistory,
        placeTrade,
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
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error("useTrading must be used within a TradingProvider");
  }
  return context;
}
