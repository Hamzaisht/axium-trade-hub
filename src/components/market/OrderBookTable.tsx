
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, TrendingDown, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMockOrderBook, OrderBook, Order } from "@/mock/orderBook";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderBookTableProps {
  creatorId: string;
  symbol?: string;
}

export function OrderBookTable({ creatorId, symbol }: OrderBookTableProps) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "bids" | "asks">("all");

  useEffect(() => {
    if (!creatorId) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrderBook(getMockOrderBook(creatorId));
      setIsLoading(false);
    }, 1000);
    
    // Refresh order book every 10 seconds
    const interval = setInterval(() => {
      setOrderBook(getMockOrderBook(creatorId));
    }, 10000);
    
    return () => clearInterval(interval);
  }, [creatorId]);

  // Format price with 2 decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Format quantity with comma separators
  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString();
  };

  const renderOrderTable = (orders: Order[], isBid: boolean) => (
    <table className="w-full">
      <thead>
        <tr className="text-xs text-muted-foreground">
          <th className="text-left pl-2 py-2">Price (USD)</th>
          <th className="text-right py-2">Quantity</th>
          <th className="text-right pr-2 py-2">Total (USD)</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
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
              ${formatQuantity(Math.round(order.total))}
            </td>
          </tr>
        ))}
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
          {orderBook && (
            <div className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(new Date(orderBook.lastUpdated), { addSuffix: true })}
            </div>
          )}
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
                {renderOrderTable(orderBook.asks.slice(0, 5), false)}
              </div>
            )}
            
            {activeTab === "all" && (
              <div className="flex justify-between text-sm py-2 px-2 bg-muted/30 rounded-md">
                <span>Spread</span>
                <span className="font-medium">${orderBook.spread.toFixed(2)}</span>
              </div>
            )}
            
            {(activeTab === "all" || activeTab === "bids") && (
              <div>
                {activeTab === "all" && (
                  <div className="mb-2 text-sm font-medium text-axium-positive flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" /> Buy Orders
                  </div>
                )}
                {renderOrderTable(orderBook.bids.slice(0, 5), true)}
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
