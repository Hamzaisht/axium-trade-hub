
import { useState, useEffect } from 'react';
import { useMarketData, TradeUpdate } from '@/hooks/useMarketData';

export function useLastTradePrice(creatorId?: string) {
  const [lastTradePrice, setLastTradePrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | 'none'>('none');
  const { recentTrades } = useMarketData(creatorId);

  useEffect(() => {
    if (recentTrades && recentTrades.length > 0) {
      const mostRecentTrade = recentTrades[0];
      
      setLastTradePrice(prevPrice => {
        if (prevPrice === null) {
          return mostRecentTrade.price;
        }
        
        // Determine if price went up or down
        if (mostRecentTrade.price > prevPrice) {
          setPriceChange('up');
        } else if (mostRecentTrade.price < prevPrice) {
          setPriceChange('down');
        } else {
          setPriceChange('none');
        }
        
        return mostRecentTrade.price;
      });
      
      // Reset the price change indicator after 2 seconds
      const timer = setTimeout(() => {
        setPriceChange('none');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [recentTrades]);

  return { lastTradePrice, priceChange };
}
