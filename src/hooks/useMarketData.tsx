
import { useState, useEffect } from 'react';
import { mockWebSocket, WSEvents } from '@/utils/mockWebSocket';
import { IPO, Order } from '@/utils/mockApi';

interface PriceUpdate {
  ipoId: string;
  symbol: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
}

interface OrderBookUpdate {
  ipoId: string;
  symbol: string;
  bids: Order[];
  asks: Order[];
  timestamp: string;
}

interface TradeUpdate {
  id: string;
  buyerId: string;
  sellerId: string;
  ipoId: string;
  creatorSymbol: string;
  price: number;
  quantity: number;
  timestamp: string;
}

export const useMarketData = (ipoId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [latestPrices, setLatestPrices] = useState<Record<string, number>>({});
  const [orderBook, setOrderBook] = useState<OrderBookUpdate | null>(null);
  const [recentTrades, setRecentTrades] = useState<TradeUpdate[]>([]);

  useEffect(() => {
    // Connect to the mock WebSocket
    mockWebSocket.connect();

    // Handle connection status
    const connectionHandler = (data: { status: string }) => {
      setIsConnected(data.status === 'connected');
    };

    // Handle price updates
    const priceUpdateHandler = (data: PriceUpdate) => {
      if (ipoId && data.ipoId !== ipoId) return;
      
      setPriceUpdates(prev => {
        const newUpdates = [data, ...prev];
        return newUpdates.slice(0, 50); // Keep last 50 updates
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
    connect: () => mockWebSocket.connect(),
    disconnect: () => mockWebSocket.disconnect()
  };
};
