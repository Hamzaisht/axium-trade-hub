
import { useEffect, useState } from "react";
import { Activity, AlertCircle, BarChart4, MessageSquare, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketData, TradeUpdate } from "@/hooks/useMarketData";
import { mockInsights, AIInsight } from "@/mock/insights";
import { formatDistanceToNow } from "date-fns";

type FeedItem = {
  id: string;
  type: 'trade' | 'insight' | 'event';
  content: string;
  timestamp: string;
  impact?: 'positive' | 'negative' | 'neutral';
};

export function MarketFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { recentTrades, isConnected } = useMarketData();
  
  // Process trades into feed items
  useEffect(() => {
    if (recentTrades.length === 0) return;
    
    const tradeFeedItems: FeedItem[] = recentTrades.slice(0, 5).map(trade => ({
      id: `trade-${trade.id}`,
      type: 'trade',
      content: `${trade.side === 'buy' ? 'Buy' : 'Sell'} order executed: ${trade.quantity} $${trade.creatorSymbol} at $${trade.price.toFixed(2)}`,
      timestamp: trade.timestamp,
      impact: trade.side === 'buy' ? 'positive' : 'negative'
    }));
    
    setFeed(prevFeed => {
      // Only add trades that don't already exist in the feed
      const newTrades = tradeFeedItems.filter(
        item => !prevFeed.some(feedItem => feedItem.id === item.id)
      );
      
      if (newTrades.length === 0) return prevFeed;
      
      // Combine with existing feed and sort by timestamp
      const updatedFeed = [...newTrades, ...prevFeed]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 12); // Limit feed size
        
      return updatedFeed;
    });
    
    if (isLoading) setIsLoading(false);
  }, [recentTrades, isLoading]);
  
  // Add AI insights to feed
  useEffect(() => {
    // Initial loading of AI insights
    const insightFeedItems: FeedItem[] = mockInsights.map(insight => ({
      id: `insight-${insight.id}`,
      type: 'insight',
      content: insight.message,
      timestamp: insight.timestamp,
      impact: insight.impact
    }));
    
    setFeed(prevFeed => {
      const combinedFeed = [...prevFeed, ...insightFeedItems]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 12);
      return combinedFeed;
    });
    
    // Periodically add new AI insights (simulate real-time updates)
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mockInsights.length);
      const insight = mockInsights[randomIndex];
      
      const newInsight: FeedItem = {
        id: `insight-${Date.now()}`,
        type: 'insight',
        content: insight.message,
        timestamp: new Date().toISOString(),
        impact: insight.impact
      };
      
      setFeed(prevFeed => {
        return [newInsight, ...prevFeed].slice(0, 12);
      });
    }, 15000); // Add new insight every 15 seconds
    
    if (isLoading) setIsLoading(false);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get appropriate icon for feed item
  const getItemIcon = (item: FeedItem) => {
    if (item.type === 'trade') {
      return item.impact === 'positive' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
    }
    
    if (item.type === 'insight') {
      switch (item.impact) {
        case 'positive':
          return <BarChart4 className="h-4 w-4 text-green-400" />;
        case 'negative':
          return <AlertCircle className="h-4 w-4 text-red-400" />;
        default:
          return <MessageSquare className="h-4 w-4 text-blue-400" />;
      }
    }
    
    return <Activity className="h-4 w-4" />;
  };
  
  // Get appropriate color class for feed item
  const getItemColorClass = (item: FeedItem) => {
    if (item.impact === 'positive') return "text-green-400";
    if (item.impact === 'negative') return "text-red-400";
    return "text-blue-400";
  };
  
  return (
    <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white space-y-3 max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-cyan-400">Market Feed</h3>
        <Badge variant="outline" className={isConnected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
          {isConnected ? "Live" : "Connecting..."}
        </Badge>
      </div>
      
      {isLoading ? (
        Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-start space-x-2 animate-pulse">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))
      ) : feed.length === 0 ? (
        <p className="text-zinc-400 text-center py-4">No market events yet</p>
      ) : (
        feed.map((item) => (
          <div key={item.id} className="flex items-start space-x-2 border-b border-zinc-700/50 pb-2 last:border-0">
            <div className="mt-1">{getItemIcon(item)}</div>
            <div className="flex-1">
              <p className={`${item.type === 'insight' ? getItemColorClass(item) : 'text-zinc-300'}`}>
                {item.content}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
