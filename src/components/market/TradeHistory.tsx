
import { useState, useEffect } from "react";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { getMockTradeHistory, Trade } from "@/mock/tradeHistory";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/card";

interface TradeHistoryProps {
  creatorId: string;
  symbol?: string;
  limit?: number;
}

export function TradeHistory({ creatorId, symbol, limit = 10 }: TradeHistoryProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTrades(getMockTradeHistory(creatorId));
      setIsLoading(false);
    }, 800);
    
    // Simulate new trades coming in
    const interval = setInterval(() => {
      setTrades(prev => {
        const newTrade = getMockTradeHistory(creatorId, 1)[0];
        return [newTrade, ...prev.slice(0, limit - 1)];
      });
    }, 15000);
    
    return () => clearInterval(interval);
  }, [creatorId, limit]);

  // Format time relative to now
  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Format price with 2 decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(limit)].map((_, index) => (
        <div key={index} className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <GlassCard>
      <div className="p-4 border-b border-[#2D3748]">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#1EAEDB]" />
          <h3 className="font-semibold">Recent Trades</h3>
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          renderLoadingSkeleton()
        ) : trades.length > 0 ? (
          <div className="space-y-1">
            {trades.slice(0, limit).map((trade, index) => (
              <div 
                key={trade.id}
                className={`flex justify-between items-center py-2 px-1 border-b border-[#2D3748]/50 last:border-0 animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`flex items-center ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.side === 'buy' 
                    ? <TrendingUp className="mr-1 h-4 w-4" /> 
                    : <TrendingDown className="mr-1 h-4 w-4" />
                  }
                  <span>${formatPrice(trade.price)}</span>
                </div>
                <div className="text-sm">{trade.quantity.toLocaleString()}</div>
                <div className="text-xs text-gray-400">{formatTime(trade.timestamp)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            No trade history available
          </div>
        )}
      </div>
    </GlassCard>
  );
}
