
import { useState, useEffect } from 'react';
import { useMarketData, TradeUpdate } from '@/hooks/useMarketData';
import { FixedSizeList as List } from 'react-window';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface VirtualizedTradeHistoryProps {
  ipoId?: string;
  symbol?: string;
  limit?: number;
  maxHeight?: number;
}

export const VirtualizedTradeHistory = ({ 
  ipoId, 
  symbol = 'UNKNOWN', 
  limit = 10,
  maxHeight = 300
}: VirtualizedTradeHistoryProps) => {
  const { recentTrades, isLoading } = useMarketData(ipoId);
  const [trades, setTrades] = useState<TradeUpdate[]>([]);
  
  useEffect(() => {
    if (recentTrades && recentTrades.length > 0) {
      // Sort trades by timestamp (most recent first)
      const sortedTrades = [...recentTrades]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      
      setTrades(sortedTrades);
    }
  }, [recentTrades, limit]);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const TradeRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const trade = trades[index];
    return (
      <div 
        style={style}
        className={cn(
          "grid grid-cols-4 py-1 text-sm border-b border-axium-gray-100/10 last:border-b-0",
          index % 2 === 0 ? "bg-axium-gray-50/5" : "bg-transparent"
        )}
      >
        <div className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
          {trade.side === 'buy' ? '▲' : '▼'} {trade.side}
        </div>
        <div className="text-right">${trade.price.toFixed(2)}</div>
        <div className="text-right">{trade.quantity}</div>
        <div className="text-right text-axium-gray-500">{formatTime(trade.timestamp)}</div>
      </div>
    );
  };
  
  if (isLoading) {
    return <TradeHistorySkeleton />;
  }
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 text-xs text-axium-gray-600 mb-1 px-1">
        <div>Side</div>
        <div className="text-right">Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Time</div>
      </div>
      
      {trades.length > 0 ? (
        <List
          height={Math.min(trades.length * 32, maxHeight)}
          itemCount={trades.length}
          itemSize={32}
          width="100%"
          className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {TradeRow}
        </List>
      ) : (
        <div className="text-center py-6 text-axium-gray-500">
          <p>No recent trades</p>
        </div>
      )}
    </div>
  );
};

// Skeleton loader for the Trade History
const TradeHistorySkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 text-xs text-axium-gray-600 mb-1 px-1">
        <div>Side</div>
        <div className="text-right">Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Time</div>
      </div>
      
      {Array(5).fill(0).map((_, idx) => (
        <div 
          key={idx} 
          className={cn(
            "grid grid-cols-4 py-1 border-b border-axium-gray-100/10 last:border-b-0",
            idx % 2 === 0 ? "bg-axium-gray-50/5" : "bg-transparent"
          )}
        >
          <Skeleton className="h-4 w-10" />
          <div className="flex justify-end">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VirtualizedTradeHistory;
