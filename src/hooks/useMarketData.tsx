
import { useState, useEffect } from 'react';
import { mockWebSocket, WSEvents } from '@/utils/mockWebSocket';
import { IPO, Order } from '@/utils/mockApi';

export interface PriceUpdate {
  ipoId: string;
  symbol: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
}

export interface OrderBookUpdate {
  ipoId: string;
  symbol: string;
  bids: Order[];
  asks: Order[];
  timestamp: string;
}

export interface TradeUpdate {
  id: string;
  buyerId: string;
  sellerId: string;
  ipoId: string;
  creatorSymbol: string;
  price: number;
  quantity: number;
  timestamp: string;
  side: 'buy' | 'sell'; // Added the side property
}

export const useMarketData = (ipoId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [latestPrices, setLatestPrices] = useState<Record<string, number>>({});
  const [orderBook, setOrderBook] = useState<OrderBookUpdate | null>(null);
  const [recentTrades, setRecentTrades] = useState<TradeUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state

  useEffect(() => {
    // Connect to the mock WebSocket
    mockWebSocket.connect();
    
    // Set initial loading state
    setIsLoading(true);

    // Handle connection status
    const connectionHandler = (data: { status: string }) => {
      setIsConnected(data.status === 'connected');
      if (data.status === 'connected') {
        // Once connected, we're no longer loading
        setTimeout(() => setIsLoading(false), 1000); // Simulate a small delay for loading state
      }
    };

    // Handle price updates every 2-5 seconds
    const priceUpdateHandler = (data: PriceUpdate) => {
      if (ipoId && data.ipoId !== ipoId) return;
      
      setPriceUpdates(prev => {
        const newUpdates = [data, ...prev];
        return newUpdates.slice(0, 100); // Keep last 100 updates for chart data
      });
      
      setLatestPrices(prev => ({
        ...prev,
        [data.ipoId]: data.newPrice
      }));
    };

    // Handle order book updates
    const orderBookHandler = (data: OrderBookUpdate) => {
      if (ipoId && data.ipoId !== ipoId) return;
      setOrderBook(data);
    };

    // Handle trade executions
    const tradeHandler = (data: TradeUpdate) => {
      if (ipoId && data.ipoId !== ipoId) return;
      
      setRecentTrades(prev => {
        const newTrades = [data, ...prev];
        return newTrades.slice(0, 20); // Keep last 20 trades
      });
    };

    // Subscribe to events
    mockWebSocket.on(WSEvents.CONNECTION, connectionHandler);
    mockWebSocket.on(WSEvents.PRICE_UPDATE, priceUpdateHandler);
    mockWebSocket.on(WSEvents.ORDERBOOK_UPDATE, orderBookHandler);
    mockWebSocket.on(WSEvents.TRADE_EXECUTED, tradeHandler);

    // Cleanup function
    return () => {
      mockWebSocket.off(WSEvents.CONNECTION, connectionHandler);
      mockWebSocket.off(WSEvents.PRICE_UPDATE, priceUpdateHandler);
      mockWebSocket.off(WSEvents.ORDERBOOK_UPDATE, orderBookHandler);
      mockWebSocket.off(WSEvents.TRADE_EXECUTED, tradeHandler);
    };
  }, [ipoId]);

  return {
    isConnected,
    priceUpdates,
    latestPrices,
    orderBook,
    recentTrades,
    isLoading, // Added isLoading to the return object
    connect: () => mockWebSocket.connect(),
    disconnect: () => mockWebSocket.disconnect()
  };
};
