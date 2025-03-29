
import { useState } from "react";
import { useTradeEvents } from "@/hooks/useCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface CreatorTradeHistoryProps {
  creatorId: string;
  symbol?: string;
}

export function CreatorTradeHistory({ creatorId, symbol = "Token" }: CreatorTradeHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const { data: tradeEvents, isLoading } = useTradeEvents(creatorId);
  
  const filteredEvents = tradeEvents?.filter(event => {
    if (filter === 'all') return true;
    return event.event_type === filter;
  }) || [];

  // Format time relative to now
  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Format price with 2 decimal places
  const formatPrice = (price: number | undefined) => {
    return price ? price.toFixed(2) : "0.00";
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Trade History
          </CardTitle>
          <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="buy" className="text-xs">Buy</TabsTrigger>
              <TabsTrigger value="sell" className="text-xs">Sell</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderLoadingSkeleton()
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-1">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id}
                className={`flex justify-between items-center py-2 px-1 border-b border-muted/50 last:border-0 animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`flex items-center ${event.event_type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {event.event_type === 'buy' 
                    ? <TrendingUp className="mr-1 h-4 w-4" /> 
                    : <TrendingDown className="mr-1 h-4 w-4" />
                  }
                  <span>${formatPrice(event.price)}</span>
                </div>
                <div className="text-sm">{event.quantity?.toLocaleString() || '-'}</div>
                <div className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No trade history available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
