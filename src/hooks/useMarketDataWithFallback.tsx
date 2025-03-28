
import { useState, useEffect, useCallback } from 'react';
import { useMarketData, PriceUpdate, OrderBookUpdate, TradeUpdate } from '@/hooks/useMarketData';
import { toast } from 'sonner';

// Enhanced market data hook with fallbacks and resilience
export const useMarketDataWithFallback = (ipoId?: string) => {
  const {
    isConnected,
    priceUpdates,
    latestPrices,
    orderBook,
    recentTrades,
    isLoading,
    connect,
    disconnect
  } = useMarketData(ipoId);
  
  const [reconnecting, setReconnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastDataTimestamp, setLastDataTimestamp] = useState<Date | null>(null);
  const [dataStale, setDataStale] = useState(false);
  
  // Track when we last received data
  useEffect(() => {
    if (priceUpdates.length > 0 || recentTrades.length > 0 || orderBook) {
      setLastDataTimestamp(new Date());
      setDataStale(false);
    }
  }, [priceUpdates, recentTrades, orderBook]);
  
  // Monitor data staleness
  useEffect(() => {
    if (!lastDataTimestamp) return;
    
    const staleCheckInterval = setInterval(() => {
      const now = new Date();
      const timeSinceLastUpdate = now.getTime() - lastDataTimestamp.getTime();
      
      // If no updates for 45 seconds, consider data stale
      if (timeSinceLastUpdate > 45000) {
        setDataStale(true);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(staleCheckInterval);
  }, [lastDataTimestamp]);
  
  // Auto-reconnect logic
  useEffect(() => {
    if (!isConnected && !reconnecting && connectionAttempts < 5 && !isLoading) {
      setReconnecting(true);
      
      // Exponential backoff for reconnection attempts
      const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (attempt ${connectionAttempts + 1})...`);
        connect();
        setConnectionAttempts(prev => prev + 1);
        setReconnecting(false);
      }, delay);
    }
  }, [isConnected, reconnecting, connectionAttempts, isLoading, connect]);
  
  // Reset connection attempts when successfully connected
  useEffect(() => {
    if (isConnected) {
      setConnectionAttempts(0);
    }
  }, [isConnected]);
  
  // Monitor data staleness and attempt reconnection
  useEffect(() => {
    if (dataStale && isConnected) {
      console.log("Data is stale, attempting to refresh connection...");
      disconnect();
      // Connection will be reestablished by the reconnection logic
    }
  }, [dataStale, isConnected, disconnect]);
  
  // Force a manual reconnection
  const forceReconnect = useCallback(() => {
    disconnect();
    setConnectionAttempts(0); // Reset attempts
    setTimeout(() => {
      connect();
    }, 500);
    toast.info("Reconnecting to market data...");
  }, [disconnect, connect]);
  
  // Generate fallback data if needed
  const generateFallbackPrice = useCallback((): PriceUpdate | null => {
    if (!ipoId) return null;
    
    // Use the latest price if available, otherwise a default
    const basePrice = latestPrices[ipoId] || 25;
    
    return {
      ipoId,
      symbol: ipoId.slice(0, 4).toUpperCase(),
      oldPrice: basePrice,
      newPrice: basePrice * (1 + (Math.random() * 0.02 - 0.01)),
      timestamp: new Date().toISOString()
    };
  }, [ipoId, latestPrices]);
  
  // Generate fallback trades if needed
  const fallbackTrades = useRecentTrades(ipoId, recentTrades);
  
  // Use fallback price if connection is down
  const enhancedPriceUpdates = priceUpdates.length > 0 || isLoading
    ? priceUpdates
    : generateFallbackPrice() 
      ? [generateFallbackPrice() as PriceUpdate] 
      : [];
  
  return {
    isConnected,
    reconnecting,
    connectionAttempts,
    dataStale,
    priceUpdates: enhancedPriceUpdates,
    latestPrices,
    orderBook,
    recentTrades: recentTrades.length > 0 ? recentTrades : fallbackTrades,
    isLoading,
    connect,
    disconnect,
    forceReconnect
  };
};

// Helper hook to generate fallback trades
const useRecentTrades = (ipoId?: string, realTrades: TradeUpdate[] = []): TradeUpdate[] => {
  const [fallbackTrades, setFallbackTrades] = useState<TradeUpdate[]>([]);
  
  useEffect(() => {
    if (!ipoId || realTrades.length > 0) return;
    
    // Generate some placeholder trades
    const trades: TradeUpdate[] = Array(5).fill(0).map((_, i) => {
      const basePrice = 25 + (Math.random() * 5 - 2.5);
      const quantity = Math.floor(Math.random() * 100) + 1;
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      
      return {
        id: `fallback-${i}`,
        buyerId: 'buyer-123',
        sellerId: 'seller-456',
        ipoId,
        creatorSymbol: ipoId.slice(0, 4).toUpperCase(),
        price: parseFloat(basePrice.toFixed(2)),
        quantity,
        timestamp: new Date(Date.now() - (i * 60000)).toISOString(),
        side
      };
    });
    
    setFallbackTrades(trades);
  }, [ipoId, realTrades.length]);
  
  return fallbackTrades;
};

export default useMarketDataWithFallback;
