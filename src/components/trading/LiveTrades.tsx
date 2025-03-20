
import { useState, useEffect } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveTradesProps {
  ipoId?: string;
  symbol?: string;
  limit?: number;
}

export const LiveTrades = ({ ipoId, symbol, limit = 10 }: LiveTradesProps) => {
  const { isConnected, recentTrades } = useMarketData(ipoId);
  const [visibleTrades, setVisibleTrades] = useState<any[]>([]);
  
  // Format the trades for display
  useEffect(() => {
    setVisibleTrades(recentTrades.slice(0, limit));
  }, [recentTrades, limit]);
  
  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };
  
  return (
    <GlassCard className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Live Trades {symbol && <span className="text-axium-gray-500 font-normal">({symbol})</span>}
        </h2>
        {isConnected ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            Live
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Connecting...
          </Badge>
        )}
      </div>
      
      {visibleTrades.length > 0 ? (
        <div className="space-y-2">
          {visibleTrades.map((trade, index) => (
            <div 
              key={trade.id || index}
              className={cn(
                "py-2 px-3 rounded-md flex items-center justify-between",
                "border border-transparent transition-all",
                "hover:bg-axium-gray-50 hover:border-axium-gray-200"
              )}
            >
              <div className="flex items-center">
                {trade.quantity >= 5 ? (
                  <ArrowUpRight className="h-4 w-4 text-axium-success mr-2" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-axium-error mr-2" />
                )}
                <div>
                  <div className="text-sm font-medium">
                    {trade.quantity} {trade.creatorSymbol} @ ${trade.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-axium-gray-500">
                    {formatTime(trade.timestamp)}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm">
                ${(trade.quantity * trade.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-axium-gray-500">
          <p>No trades yet</p>
          <p className="text-sm mt-1">Trades will appear here in real-time</p>
        </div>
      )}
    </GlassCard>
  );
};

export default LiveTrades;
