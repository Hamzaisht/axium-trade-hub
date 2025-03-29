import { useState, useEffect } from 'react';
import { Order, Trade } from '@/utils/mockApi';
import { mockWebSocket, WSEvents } from '@/utils/mockWebSocket';
import { OrderBookData } from '@/contexts/trading/types';
import { User } from '@supabase/supabase-js';

// Update the type of user to match what's used in AuthContext
export function useWebSocketTrading(user: User | null, orderBook: OrderBookData | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    mockWebSocket.connect();
    
    const connectionHandler = (data: { status: string }) => {
      setIsConnected(data.status === 'connected');
    };

    const orderUpdateHandler = (data: Order) => {
      if (user && data.userId === user.id) {
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

    const tradeHandler = (data: Trade & { creatorSymbol?: string }) => {
      if (user && (data.buyerId === user.id || data.sellerId === user.id)) {
        setTrades(prev => {
          if (prev.some(t => t.id === data.id)) return prev;
          return [data, ...prev];
        });
      }
    };

    const orderBookHandler = (data: { ipoId: string, bids: Order[], asks: Order[] }) => {
      if (orderBook && orderBook.bids[0]?.ipoId === data.ipoId) {
        // We don't update the orderBook state here as it's passed from the parent context
        // This is just to listen for updates
      }
    };

    mockWebSocket.on(WSEvents.CONNECTION, connectionHandler);
    mockWebSocket.on(WSEvents.ORDER_UPDATED, orderUpdateHandler);
    mockWebSocket.on(WSEvents.TRADE_EXECUTED, tradeHandler);
    mockWebSocket.on(WSEvents.ORDERBOOK_UPDATE, orderBookHandler);

    return () => {
      mockWebSocket.off(WSEvents.CONNECTION, connectionHandler);
      mockWebSocket.off(WSEvents.ORDER_UPDATED, orderUpdateHandler);
      mockWebSocket.off(WSEvents.TRADE_EXECUTED, tradeHandler);
      mockWebSocket.off(WSEvents.ORDERBOOK_UPDATE, orderBookHandler);
    };
  }, [user, orderBook]);

  return {
    isConnected,
    orders,
    trades,
    setOrders,
    setTrades
  };
}
