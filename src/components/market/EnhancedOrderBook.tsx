
import { useState, useEffect } from "react";
import { useTrading } from "@/contexts/TradingContext";
import { useMarketData } from "@/hooks/useMarketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, TrendingDown, TrendingUp, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface EnhancedOrderBookProps {
  creatorId: string;
  symbol?: string;
}

export function EnhancedOrderBook({ creatorId, symbol = "Token" }: EnhancedOrderBookProps) {
  const { orderBook, fetchOrderBook, isLoading } = useTrading();
  const { isConnected } = useMarketData(creatorId);
  const [activeTab, setActiveTab] = useState<"all" | "bids" | "asks">("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch order book on mount and when creator changes
  useEffect(() => {
    if (creatorId) {
      fetchOrderBook(creatorId);
      setLastUpdated(new Date());
    }
  }, [creatorId, fetchOrderBook]);

  const handleRefresh = () => {
    fetchOrderBook(creatorId);
    setLastUpdated(new Date());
    toast.success("Order book refreshed");
  };

  // Format price with 2 decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Format quantity with comma separators
  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString();
  };

  const renderOrderTable = (orders: any[], isBid: boolean) => (
    <table className="w-full">
      <thead>
        <tr className="text-xs text-muted-foreground">
          <th className="text-left pl-2 py-2">Price (USD)</th>
          <th className="text-right py-2">Quantity</th>
          <th className="text-right pr-2 py-2">Total (USD)</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order, index) => {
            const total = order.price * order.quantity;
            return (
              <tr 
                key={`${isBid ? 'bid' : 'ask'}-${index}`} 
                className={`text-sm ${index % 2 === 0 ? 'bg-muted/20' : ''}`}
              >
                <td className={`text-left pl-2 py-1.5 ${isBid ? 'text-axium-positive' : 'text-axium-negative'}`}>
                  ${formatPrice(order.price)}
                </td>
                <td className="text-right py-1.5">
                  {formatQuantity(order.quantity)}
                </td>
                <td className="text-right pr-2 py-1.5">
                  ${formatQuantity(Math.round(total))}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={3} className="text-center py-4 text-muted-foreground">
              No {isBid ? "buy" : "sell"} orders
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(7)].map((_, index) => (
        <div key={index} className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Order Book
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground">
              {isConnected ? (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Live
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  Offline
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bids" className="text-axium-positive">
              <TrendingUp className="mr-2 h-4 w-4" />
              Bids
            </TabsTrigger>
            <TabsTrigger value="asks" className="text-axium-negative">
              <TrendingDown className="mr-2 h-4 w-4" />
              Asks
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          renderLoadingSkeleton()
        ) : orderBook ? (
          <div className="space-y-4">
            {(activeTab === "all" || activeTab === "asks") && (
              <div>
                {activeTab === "all" && (
                  <div className="mb-2 text-sm font-medium text-axium-negative flex items-center">
                    <TrendingDown className="mr-2 h-4 w-4" /> Sell Orders
                  </div>
                )}
                {renderOrderTable(orderBook.asks || [], false)}
              </div>
            )}
            
            {activeTab === "all" && orderBook.bids && orderBook.asks && orderBook.bids.length > 0 && orderBook.asks.length > 0 && (
              <div className="flex justify-between text-sm py-2 px-2 bg-muted/30 rounded-md">
                <span>Spread</span>
                <span className="font-medium">
                  ${(Math.min(...orderBook.asks.map(a => a.price)) - Math.max(...orderBook.bids.map(b => b.price))).toFixed(2)}
                </span>
              </div>
            )}
            
            {(activeTab === "all" || activeTab === "bids") && (
              <div>
                {activeTab === "all" && (
                  <div className="mb-2 text-sm font-medium text-axium-positive flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" /> Buy Orders
                  </div>
                )}
                {renderOrderTable(orderBook.bids || [], true)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No order book data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
