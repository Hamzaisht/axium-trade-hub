
import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockTradesAPI } from "../utils/mockApi";
import { useAuth } from "./AuthContext";

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
  fetchTradeHistory: (ipoId: string) => void;
  placeTrade: (ipoId: string, amount: number, price: number, type: "buy" | "sell") => Promise<Trade>;
  isLoading: boolean;
  error: Error | null;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const { user } = useAuth();
  
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const response = await mockTradesAPI.getUserTrades(user?.id || '');
      setTrades(response);
      return response;
    },
    enabled: !!user?.id,
  });
  
  const fetchTradeHistory = async (ipoId: string) => {
    try {
      if (!user?.id) return;
      const trades = await mockTradesAPI.getTradesByIpo(ipoId);
      setTrades(trades);
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
      const newTrade = await mockTradesAPI.createTrade({
        ipoId,
        traderId: user.id,
        amount,
        price,
        type,
      });
      
      setTrades(prev => [newTrade, ...prev]);
      return newTrade;
    } catch (error) {
      console.error("Error placing trade:", error);
      throw error;
    }
  };
  
  return (
    <TradingContext.Provider
      value={{
        trades,
        fetchTradeHistory,
        placeTrade,
        isLoading,
        error: error as Error | null,
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
