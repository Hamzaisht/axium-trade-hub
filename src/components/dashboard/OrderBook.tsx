
import { useEffect, useState } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { Order } from '@/utils/mockApi';
import { cn } from '@/lib/utils';

interface OrderBookProps {
  symbol?: string;
  currentPrice?: number;
  ipoId?: string;
}

const OrderBook = ({ symbol, currentPrice, ipoId }: OrderBookProps) => {
  const { orderBook, isConnected } = useMarketData(ipoId);
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
    
    const maxTotal = Math.max(...total);
    total.forEach((t, index) => {
      percent[index] = (t / maxTotal) * 100;
    });
    
    return { total, percent };
  };
  
  const bidTotals = calculateTotal(bids);
  const askTotals = calculateTotal(asks);
  
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
      
      {/* Asks (Sell orders) - reversed to show highest asks at the top */}
      <div className="mb-2 max-h-32 overflow-y-auto">
        {asks.length > 0 ? (
          asks.map((ask, index) => (
            <div 
              key={`ask-${index}`}
              className="relative grid grid-cols-3 py-0.5 text-sm"
            >
              <div 
                className="absolute inset-0 bg-red-500/10 rounded"
                style={{ width: `${askTotals.percent[index]}%`, right: 0, left: 'auto' }}
              ></div>
              <div className="z-10 text-red-500">${ask.price.toFixed(2)}</div>
              <div className="z-10 text-center">{ask.quantity}</div>
              <div className="z-10 text-right">{bidTotals.total[index]}</div>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-axium-gray-500 text-sm">No sell orders</div>
        )}
      </div>
      
      {/* Center price bar */}
      <div className="py-1 px-2 mb-2 bg-axium-gray-100 rounded font-medium text-center">
        {currentPrice ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
      </div>
      
      {/* Bids (Buy orders) */}
      <div className="max-h-32 overflow-y-auto">
        {bids.length > 0 ? (
          bids.map((bid, index) => (
            <div 
              key={`bid-${index}`}
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
          ))
        ) : (
          <div className="text-center py-2 text-axium-gray-500 text-sm">No buy orders</div>
        )}
      </div>
    </div>
  );
};

export default OrderBook;
