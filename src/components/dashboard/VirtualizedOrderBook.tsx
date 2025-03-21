
import { useEffect, useState } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { Order } from '@/utils/mockApi';
import { cn } from '@/lib/utils';
import { FixedSizeList as List } from 'react-window';
import { Skeleton } from '@/components/ui/skeleton';

interface VirtualizedOrderBookProps {
  symbol?: string;
  currentPrice?: number;
  ipoId?: string;
  maxHeight?: number;
}

export const VirtualizedOrderBook = ({ 
  symbol, 
  currentPrice, 
  ipoId,
  maxHeight = 200 
}: VirtualizedOrderBookProps) => {
  const { orderBook, isConnected, isLoading } = useMarketData(ipoId);
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  
  // Format the order book data
  useEffect(() => {
    if (orderBook) {
      setBids(orderBook.bids || []);
      setAsks(orderBook.asks || []);
    }
  }, [orderBook]);
  
  // Calculate total for cumulative volume
  const calculateTotal = (orders: Order[]): { total: number[], percent: number[] } => {
    const total: number[] = [];
    const percent: number[] = [];
    
    let sum = 0;
    orders.forEach((order, index) => {
      sum += order.quantity;
      total[index] = sum;
    });
    
    const maxTotal = Math.max(...total, 1); // Prevent division by zero
    total.forEach((t, index) => {
      percent[index] = (t / maxTotal) * 100;
    });
    
    return { total, percent };
  };
  
  const bidTotals = calculateTotal(bids);
  const askTotals = calculateTotal(asks);

  // Render a single ask order row
  const AskRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const ask = asks[index];
    return (
      <div 
        style={style}
        className="relative grid grid-cols-3 py-0.5 text-sm"
      >
        <div 
          className="absolute inset-0 bg-red-500/10 rounded"
          style={{ width: `${askTotals.percent[index]}%`, right: 0, left: 'auto' }}
        ></div>
        <div className="z-10 text-red-500">${ask.price.toFixed(2)}</div>
        <div className="z-10 text-center">{ask.quantity}</div>
        <div className="z-10 text-right">{askTotals.total[index]}</div>
      </div>
    );
  };

  // Render a single bid order row
  const BidRow = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const bid = bids[index];
    return (
      <div 
        style={style}
        className="relative grid grid-cols-3 py-0.5 text-sm"
      >
        <div 
          className="absolute inset-0 bg-green-500/10 rounded"
          style={{ width: `${bidTotals.percent[index]}%` }}
        ></div>
        <div className="z-10 text-green-500">${bid.price.toFixed(2)}</div>
        <div className="z-10 text-center">{bid.quantity}</div>
        <div className="z-10 text-right">{bidTotals.total[index]}</div>
      </div>
    );
  };
  
  if (isLoading) {
    return <OrderBookSkeleton />;
  }
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">Order Book {symbol && `(${symbol})`}</h2>
        
        {isConnected ? (
          <div className="flex items-center text-xs text-axium-gray-600">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
            Live
          </div>
        ) : (
          <div className="flex items-center text-xs text-axium-gray-600">
            <span className="h-2 w-2 rounded-full bg-axium-gray-400 mr-1.5"></span>
            Connecting...
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="grid grid-cols-3 text-xs text-axium-gray-600 mb-1 px-1">
        <div>Price ($)</div>
        <div className="text-center">Size</div>
        <div className="text-right">Total</div>
      </div>
      
      {/* Asks (Sell orders) */}
      <div className="mb-2 overflow-hidden">
        {asks.length > 0 ? (
          <List
            height={Math.min(asks.length * 24, maxHeight / 2)}
            itemCount={asks.length}
            itemSize={24}
            width="100%"
          >
            {AskRow}
          </List>
        ) : (
          <div className="text-center py-2 text-axium-gray-500 text-sm">No sell orders</div>
        )}
      </div>
      
      {/* Center price bar */}
      <div className="py-1 px-2 mb-2 bg-axium-gray-100 rounded font-medium text-center">
        {currentPrice ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
      </div>
      
      {/* Bids (Buy orders) */}
      <div className="overflow-hidden">
        {bids.length > 0 ? (
          <List
            height={Math.min(bids.length * 24, maxHeight / 2)}
            itemCount={bids.length}
            itemSize={24}
            width="100%"
          >
            {BidRow}
          </List>
        ) : (
          <div className="text-center py-2 text-axium-gray-500 text-sm">No buy orders</div>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for the OrderBook
const OrderBookSkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      <div className="grid grid-cols-3 text-xs text-axium-gray-600 mb-1 px-1">
        <div>Price ($)</div>
        <div className="text-center">Size</div>
        <div className="text-right">Total</div>
      </div>
      
      {/* Asks skeleton */}
      <div className="mb-2">
        {Array(5).fill(0).map((_, idx) => (
          <div key={`ask-${idx}`} className="grid grid-cols-3 py-0.5">
            <Skeleton className="h-5 w-16" />
            <div className="flex justify-center">
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Center price skeleton */}
      <div className="py-1 px-2 mb-2 bg-axium-gray-100 rounded text-center">
        <Skeleton className="h-6 w-20 mx-auto" />
      </div>
      
      {/* Bids skeleton */}
      <div>
        {Array(5).fill(0).map((_, idx) => (
          <div key={`bid-${idx}`} className="grid grid-cols-3 py-0.5">
            <Skeleton className="h-5 w-16" />
            <div className="flex justify-center">
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedOrderBook;
