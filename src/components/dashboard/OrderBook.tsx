
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Droplets, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarketData } from "@/hooks/useMarketData";
import { Progress } from "@/components/ui/progress";
import { Tooltip as TooltipComponent } from "@/components/ui/tooltip";
import { TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

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
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [lastExecutedTrades, setLastExecutedTrades] = useState<any[]>([]);
  const [spreadInfo, setSpreadInfo] = useState({
    value: 0.05,
    percentage: 0.2,
    volatility: 'Low'
  });
  
  // Use our WebSocket hook for real-time market data if ipoId is provided
  const { orderBook, recentTrades } = useMarketData(ipoId);

  // Track the last execution timestamp for tick animation
  const [lastExecutionTimestamp, setLastExecutionTimestamp] = useState<number | null>(null);

  // Update orders when orderBook changes
  useEffect(() => {
    if (orderBook && orderBook.ipoId === ipoId) {
      if (orderBook.bids && orderBook.bids.length > 0) {
        setBuyOrders(orderBook.bids.map(bid => ({
          price: bid.price,
          amount: bid.quantity, 
          total: bid.price * bid.quantity
        })));
      }
      if (orderBook.asks && orderBook.asks.length > 0) {
        setSellOrders(orderBook.asks.map(ask => ({
          price: ask.price,
          amount: ask.quantity,
          total: ask.price * ask.quantity
        })));
      }

      // Calculate and update spread information
      if (orderBook.bids.length > 0 && orderBook.asks.length > 0) {
        const highestBid = Math.max(...orderBook.bids.map(b => b.price));
        const lowestAsk = Math.min(...orderBook.asks.map(a => a.price));
        const spreadValue = lowestAsk - highestBid;
        const spreadPercentage = (spreadValue / highestBid) * 100;
        
        // Simple volatility calculation based on spread percentage
        let volatility = 'Low';
        if (spreadPercentage > 1.0) volatility = 'High';
        else if (spreadPercentage > 0.5) volatility = 'Medium';
        
        setSpreadInfo({
          value: parseFloat(spreadValue.toFixed(2)),
          percentage: parseFloat(spreadPercentage.toFixed(2)),
          volatility
        });
      }
    }
  }, [orderBook, ipoId]);
  
  // Track recent trades for tick animation
  useEffect(() => {
    if (recentTrades && recentTrades.length > 0) {
      // Only take the last 10 trades
      setLastExecutedTrades(recentTrades.slice(0, 10));
      
      // Set the last execution timestamp for tick animation
      setLastExecutionTimestamp(Date.now());
      
      // Reset the animation after 1 second
      const timer = setTimeout(() => {
        setLastExecutionTimestamp(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [recentTrades]);
  
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

  // Calculate the maximum volume for heatmap scale
  const maxBuyVolume = Math.max(...buyOrders.map(order => order.amount));
  const maxSellVolume = Math.max(...sellOrders.map(order => order.amount));
  const maxVolume = Math.max(maxBuyVolume, maxSellVolume);
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Order Book <span className="text-axium-gray-500 font-normal">{symbol}</span></h2>
        <div className="flex space-x-2">
          <TooltipProvider>
            <TooltipComponent>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(showHeatmap ? "bg-axium-blue/10" : "bg-transparent")}
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  <Droplets className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Liquidity Heatmap</p>
              </TooltipContent>
            </TooltipComponent>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-axium-gray-700">Market Orders</h3>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs font-medium px-2 py-1 rounded bg-axium-gray-100">
                      <span>Spread: ${spreadInfo.value} ({spreadInfo.percentage}%)</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="space-y-1">
                      <p>Current market spread</p>
                      <p className="text-xs text-axium-gray-500">Volatility: {spreadInfo.volatility}</p>
                    </div>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>
              
              {spreadInfo.volatility === 'High' && (
                <span className="text-axium-error flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span className="text-xs">High Slippage</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 text-sm text-axium-gray-600">
              <span>Price (USD)</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
            
            <div className="space-y-1 mb-3 relative">
              {sellOrders.map((order, index) => (
                <div 
                  key={`sell-${index}`} 
                  className="flex items-center justify-between text-sm p-1.5 hover:bg-axium-error/5 rounded relative"
                >
                  {showHeatmap && (
                    <div 
                      className="absolute inset-y-0 right-0 bg-axium-error/10" 
                      style={{ 
                        width: `${Math.min(100, (order.amount / maxVolume) * 100)}%`,
                        opacity: 0.6 
                      }}
                    />
                  )}
                  <span className="font-medium text-axium-error z-10">${order.price}</span>
                  <span className="z-10">{order.amount.toFixed(1)}</span>
                  <span className="z-10">${order.total}</span>
                </div>
              ))}
            </div>
            
            <div className={cn(
              "text-center py-2 bg-axium-gray-100 rounded-md mb-3",
              lastExecutionTimestamp && "animate-pulse bg-axium-blue/20"
            )}>
              <span className="font-semibold text-axium-gray-900">${currentPrice.toFixed(2)}</span>
              {lastExecutionTimestamp && (
                <span className="ml-2 text-xs text-axium-blue animate-pulse">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  Trade executed
                </span>
              )}
            </div>
            
            <div className="space-y-1 relative">
              {buyOrders.map((order, index) => (
                <div 
                  key={`buy-${index}`} 
                  className="flex items-center justify-between text-sm p-1.5 hover:bg-axium-success/5 rounded relative"
                >
                  {showHeatmap && (
                    <div 
                      className="absolute inset-y-0 right-0 bg-axium-success/10" 
                      style={{ 
                        width: `${Math.min(100, (order.amount / maxVolume) * 100)}%`,
                        opacity: 0.6 
                      }}
                    />
                  )}
                  <span className="font-medium text-axium-success z-10">${order.price}</span>
                  <span className="z-10">{order.amount.toFixed(1)}</span>
                  <span className="z-10">${order.total}</span>
                </div>
              ))}
            </div>
          </div>
          
          {lastExecutedTrades.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-axium-gray-700 mb-2">Recent Executions</h4>
              <div className="max-h-24 overflow-y-auto text-xs space-y-1">
                {lastExecutedTrades.map((trade, index) => (
                  <div 
                    key={`trade-${index}`} 
                    className={cn(
                      "flex justify-between p-1 rounded",
                      trade.buyerId ? "text-axium-success bg-axium-success/5" : "text-axium-error bg-axium-error/5",
                      index === 0 && lastExecutionTimestamp && "animate-pulse font-medium"
                    )}
                  >
                    <span>${trade.price}</span>
                    <span>{trade.quantity} {symbol}</span>
                    <span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-axium-gray-600">Potential slippage</span>
                    <span className={cn(
                      spreadInfo.volatility === 'Low' ? "text-axium-success" :
                      spreadInfo.volatility === 'Medium' ? "text-amber-500" :
                      "text-axium-error"
                    )}>{spreadInfo.percentage}%</span>
                  </div>
                  <Progress value={
                    spreadInfo.volatility === 'Low' ? 25 :
                    spreadInfo.volatility === 'Medium' ? 50 :
                    85
                  } className="h-1" />
                </div>
              </div>
              
              <div className="space-x-2">
                <Button className="w-full bg-axium-success hover:bg-axium-success/90 text-white">
                  Buy {symbol}
                </Button>
              </div>
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
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-axium-gray-600">Potential slippage</span>
                    <span className={cn(
                      spreadInfo.volatility === 'Low' ? "text-axium-success" :
                      spreadInfo.volatility === 'Medium' ? "text-amber-500" :
                      "text-axium-error"
                    )}>{spreadInfo.percentage}%</span>
                  </div>
                  <Progress value={
                    spreadInfo.volatility === 'Low' ? 25 :
                    spreadInfo.volatility === 'Medium' ? 50 :
                    85
                  } className="h-1" />
                </div>
              </div>
              
              <div className="space-x-2">
                <Button className="w-full bg-axium-error hover:bg-axium-error/90 text-white">
                  Sell {symbol}
                </Button>
              </div>
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
