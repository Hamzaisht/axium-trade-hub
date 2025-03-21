
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketData } from "@/hooks/useMarketData";

// Mock data for buy and sell orders
const generateMockOrders = (type: 'buy' | 'sell', basePrice: number) => {
  const orders = [];
  const multiplier = type === 'buy' ? -1 : 1;
  
  for (let i = 1; i <= 7; i++) {
    const priceDiff = (Math.random() * 0.5 + 0.1) * i * multiplier;
    const price = basePrice + priceDiff;
    const amount = Math.round(Math.random() * 100 + 10) / 10;
    
    orders.push({
      price: parseFloat(price.toFixed(2)),
      amount,
      total: parseFloat((price * amount).toFixed(2))
    });
  }
  
  return type === 'buy' 
    ? orders.sort((a, b) => b.price - a.price) // Sort buy orders by descending price
    : orders.sort((a, b) => a.price - b.price); // Sort sell orders by ascending price
};

interface OrderBookProps {
  symbol?: string;
  currentPrice?: number;
  ipoId?: string;
}

export const OrderBook = ({ 
  symbol = "$EMW", 
  currentPrice = 24.82,
  ipoId
}: OrderBookProps) => {
  const [buyOrders, setBuyOrders] = useState(generateMockOrders('buy', currentPrice));
  const [sellOrders, setSellOrders] = useState(generateMockOrders('sell', currentPrice));
  const [activeTab, setActiveTab] = useState('buy');
  const [orderAmount, setOrderAmount] = useState('1');
  const [orderPrice, setOrderPrice] = useState(currentPrice.toFixed(2));
  
  // Use our WebSocket hook for real-time market data if ipoId is provided
  const { orderBook } = useMarketData(ipoId);

  // Update orders when orderBook changes
  useEffect(() => {
    if (orderBook && orderBook.ipoId === ipoId) {
      if (orderBook.bids && orderBook.bids.length > 0) {
        setBuyOrders(orderBook.bids.map(bid => ({
          price: bid.price,
          amount: bid.quantity, // Changed from bid.amount to bid.quantity
          total: bid.price * bid.quantity // Changed from bid.amount to bid.quantity
        })));
      }
      if (orderBook.asks && orderBook.asks.length > 0) {
        setSellOrders(orderBook.asks.map(ask => ({
          price: ask.price,
          amount: ask.quantity, // Changed from ask.amount to ask.quantity
          total: ask.price * ask.quantity // Changed from ask.amount to ask.quantity
        })));
      }
    }
  }, [orderBook, ipoId]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setOrderAmount(value);
    }
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setOrderPrice(value);
    }
  };
  
  const totalOrderValue = parseFloat(orderAmount) * parseFloat(orderPrice || '0');
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Order Book <span className="text-axium-gray-500 font-normal">{symbol}</span></h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-3 text-axium-gray-700">Market Orders</h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 text-sm text-axium-gray-600">
              <span>Price (USD)</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
            
            <div className="space-y-1 mb-3">
              {sellOrders.map((order, index) => (
                <div 
                  key={`sell-${index}`} 
                  className="flex items-center justify-between text-sm p-1.5 hover:bg-axium-error/5 rounded"
                >
                  <span className="font-medium text-axium-error">${order.price}</span>
                  <span>{order.amount.toFixed(1)}</span>
                  <span>${order.total}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center py-2 bg-axium-gray-100 rounded-md mb-3">
              <span className="font-semibold text-axium-gray-900">${currentPrice.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1">
              {buyOrders.map((order, index) => (
                <div 
                  key={`buy-${index}`} 
                  className="flex items-center justify-between text-sm p-1.5 hover:bg-axium-success/5 rounded"
                >
                  <span className="font-medium text-axium-success">${order.price}</span>
                  <span>{order.amount.toFixed(1)}</span>
                  <span>${order.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <Tabs 
            defaultValue="buy" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-axium-gray-100">
              <TabsTrigger 
                value="buy" 
                className={cn(
                  "flex-1 data-[state=active]:bg-axium-success data-[state=active]:text-white"
                )}
              >
                Buy
              </TabsTrigger>
              <TabsTrigger 
                value="sell" 
                className={cn(
                  "flex-1 data-[state=active]:bg-axium-error data-[state=active]:text-white"
                )}
              >
                Sell
              </TabsTrigger>
              <TabsTrigger value="convert" className="flex-1">
                <ArrowDownUp className="h-4 w-4 mr-1" />
                Convert
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="buy" className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-axium-gray-700 mb-1.5 block">
                  Amount
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={orderAmount}
                    onChange={handleAmountChange}
                    className="pr-16 bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-axium-gray-500">{symbol}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-axium-gray-700 mb-1.5 block">
                  Price per token
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={orderPrice}
                    onChange={handlePriceChange}
                    className="pr-16 bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-axium-gray-500">USD</span>
                  </div>
                </div>
              </div>
              
              <div className="py-3 px-4 bg-axium-gray-100 rounded-md">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-axium-gray-600">Total</span>
                  <span className="font-medium">${totalOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-axium-gray-600">Fee (1%)</span>
                  <span className="font-medium">${(totalOrderValue * 0.01).toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-axium-success hover:bg-axium-success/90 text-white">
                Buy {symbol}
              </Button>
            </TabsContent>
            
            <TabsContent value="sell" className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-axium-gray-700 mb-1.5 block">
                  Amount
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={orderAmount}
                    onChange={handleAmountChange}
                    className="pr-16 bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-axium-gray-500">{symbol}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-axium-gray-700 mb-1.5 block">
                  Price per token
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={orderPrice}
                    onChange={handlePriceChange}
                    className="pr-16 bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-axium-gray-500">USD</span>
                  </div>
                </div>
              </div>
              
              <div className="py-3 px-4 bg-axium-gray-100 rounded-md">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-axium-gray-600">Total</span>
                  <span className="font-medium">${totalOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-axium-gray-600">Fee (1%)</span>
                  <span className="font-medium">${(totalOrderValue * 0.01).toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-axium-error hover:bg-axium-error/90 text-white">
                Sell {symbol}
              </Button>
            </TabsContent>
            
            <TabsContent value="convert" className="space-y-4 pt-4">
              <p className="text-sm text-axium-gray-600">
                Convert between creator tokens or to USD with minimal fees.
              </p>
              
              <div className="py-6 text-center text-axium-gray-500">
                <p>Coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </GlassCard>
  );
};

export default OrderBook;
