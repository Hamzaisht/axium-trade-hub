
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRightLeft,
  Timer,
  ShieldAlert,
  XCircle,
  Check,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type OrderType = 
  | 'limit' 
  | 'market' 
  | 'stop' 
  | 'stop-limit' 
  | 'oco' 
  | 'iceberg' 
  | 'twap' 
  | 'vwap' 
  | 'bracket';

interface AdvancedOrderTypesProps {
  symbol: string;
  currentPrice: number;
  onOrderSubmit?: (orderData: any) => void;
  className?: string;
}

export const AdvancedOrderTypes = ({
  symbol = "$AXM",
  currentPrice = 25.74,
  onOrderSubmit,
  className
}: AdvancedOrderTypesProps) => {
  const { user } = useAuth();
  const isInstitutional = user?.role === 'admin' || user?.role === 'investor';
  
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [quantity, setQuantity] = useState("1");
  const [limitPrice, setLimitPrice] = useState(currentPrice.toString());
  const [stopPrice, setStopPrice] = useState((currentPrice * 0.95).toFixed(2));
  const [takeProfitPrice, setTakeProfitPrice] = useState((currentPrice * 1.05).toFixed(2));
  const [timeInForce, setTimeInForce] = useState("day");
  const [displaySize, setDisplaySize] = useState("0.5");
  const [darkPoolEnabled, setDarkPoolEnabled] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState("5");
  const [duration, setDuration] = useState("60");
  
  const isNumeric = (value: string) => {
    return /^\d*\.?\d*$/.test(value);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric(e.target.value)) {
      setQuantity(e.target.value);
    }
  };
  
  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric(e.target.value)) {
      setLimitPrice(e.target.value);
    }
  };
  
  const handleStopPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric(e.target.value)) {
      setStopPrice(e.target.value);
    }
  };
  
  const handleTakeProfitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric(e.target.value)) {
      setTakeProfitPrice(e.target.value);
    }
  };
  
  const handleDisplaySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric(e.target.value)) {
      setDisplaySize(e.target.value);
    }
  };
  
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric(e.target.value)) {
      setIntervalMinutes(e.target.value);
    }
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric(e.target.value)) {
      setDuration(e.target.value);
    }
  };
  
  const handleOrderSubmit = (side: 'buy' | 'sell') => {
    // Validate order based on type
    if (orderType === 'limit' && !limitPrice) {
      toast({
        title: "Validation Error",
        description: "Limit price is required for limit orders",
        variant: "destructive"
      });
      return;
    }
    
    if ((orderType === 'stop' || orderType === 'stop-limit') && !stopPrice) {
      toast({
        title: "Validation Error",
        description: "Stop price is required",
        variant: "destructive"
      });
      return;
    }
    
    if (orderType === 'oco' && (!stopPrice || !takeProfitPrice)) {
      toast({
        title: "Validation Error",
        description: "Both stop price and take profit price are required for OCO orders",
        variant: "destructive"
      });
      return;
    }
    
    // Construct order based on type
    const order = {
      type: orderType,
      side,
      symbol,
      quantity: parseFloat(quantity),
      limitPrice: orderType === 'market' ? undefined : parseFloat(limitPrice),
      stopPrice: ['stop', 'stop-limit', 'oco', 'bracket'].includes(orderType) ? parseFloat(stopPrice) : undefined,
      takeProfitPrice: ['oco', 'bracket'].includes(orderType) ? parseFloat(takeProfitPrice) : undefined,
      timeInForce,
      darkPool: darkPoolEnabled,
      // Advanced parameters for institutional orders
      ...(orderType === 'iceberg' && {
        displaySize: parseFloat(displaySize),
        totalSize: parseFloat(quantity)
      }),
      ...(orderType === 'twap' && {
        intervalMinutes: parseInt(intervalMinutes),
        durationMinutes: parseInt(duration)
      }),
      ...(orderType === 'vwap' && {
        durationMinutes: parseInt(duration)
      })
    };
    
    if (onOrderSubmit) {
      onOrderSubmit(order);
    }
    
    // Show toast notification
    toast({
      title: `${side === 'buy' ? 'Buy' : 'Sell'} Order Placed`,
      description: `${side === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${symbol} with ${orderType} order${
        orderType !== 'market' ? ` at $${orderType === 'stop' ? stopPrice : limitPrice}` : ''
      }`,
      variant: "default"
    });
  };
  
  return (
    <GlassCard className={className}>
      <h2 className="text-lg font-semibold mb-4">Advanced Order Entry</h2>
      
      <div className="mb-6">
        <Label htmlFor="order-type" className="mb-2 block">Order Type</Label>
        <Select
          value={orderType}
          onValueChange={(value) => setOrderType(value as OrderType)}
        >
          <SelectTrigger id="order-type" className="w-full">
            <SelectValue placeholder="Select order type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">Market</SelectItem>
            <SelectItem value="limit">Limit</SelectItem>
            <SelectItem value="stop">Stop</SelectItem>
            <SelectItem value="stop-limit">Stop-Limit</SelectItem>
            <SelectItem value="oco">OCO (One-Cancels-Other)</SelectItem>
            {isInstitutional && (
              <>
                <SelectItem value="iceberg">Iceberg</SelectItem>
                <SelectItem value="bracket">Bracket</SelectItem>
                <SelectItem value="twap">TWAP</SelectItem>
                <SelectItem value="vwap">VWAP</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        
        {/* Help text for the selected order type */}
        <div className="mt-2 text-xs text-axium-gray-500 flex items-start">
          <div className="mr-2 mt-0.5">
            {orderType === 'market' && <Clock className="h-4 w-4" />}
            {orderType === 'limit' && <Check className="h-4 w-4" />}
            {orderType === 'stop' && <ShieldAlert className="h-4 w-4" />}
            {orderType === 'stop-limit' && <XCircle className="h-4 w-4" />}
            {orderType === 'oco' && <ArrowRightLeft className="h-4 w-4" />}
            {orderType === 'iceberg' && <BarChart3 className="h-4 w-4" />}
            {orderType === 'bracket' && <ArrowRightLeft className="h-4 w-4" />}
            {orderType === 'twap' && <Timer className="h-4 w-4" />}
            {orderType === 'vwap' && <BarChart3 className="h-4 w-4" />}
          </div>
          <p>
            {orderType === 'market' && "Executes immediately at the best available price."}
            {orderType === 'limit' && "Execute at the specified price or better."}
            {orderType === 'stop' && "Triggers a market order when the stop price is reached."}
            {orderType === 'stop-limit' && "Triggers a limit order when the stop price is reached."}
            {orderType === 'oco' && "One-Cancels-Other: Place stop loss and take profit simultaneously."}
            {orderType === 'iceberg' && "Large orders divided into smaller visible portions."}
            {orderType === 'bracket' && "Entry order with stop loss and take profit attached."}
            {orderType === 'twap' && "Time-Weighted Average Price: Executes over time intervals."}
            {orderType === 'vwap' && "Volume-Weighted Average Price: Executes based on volume profile."}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="quantity" className="mb-2 block">Quantity</Label>
          <Input
            id="quantity"
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full"
          />
        </div>
        
        {orderType !== 'market' && (
          <div>
            <Label htmlFor="limit-price" className="mb-2 block">Limit Price</Label>
            <Input
              id="limit-price"
              type="text"
              value={limitPrice}
              onChange={handleLimitPriceChange}
              className="w-full"
            />
          </div>
        )}
        
        {['stop', 'stop-limit', 'oco', 'bracket'].includes(orderType) && (
          <div>
            <Label htmlFor="stop-price" className="mb-2 block">Stop Price</Label>
            <Input
              id="stop-price"
              type="text"
              value={stopPrice}
              onChange={handleStopPriceChange}
              className="w-full"
            />
          </div>
        )}
        
        {['oco', 'bracket'].includes(orderType) && (
          <div>
            <Label htmlFor="take-profit" className="mb-2 block">Take Profit Price</Label>
            <Input
              id="take-profit"
              type="text"
              value={takeProfitPrice}
              onChange={handleTakeProfitPriceChange}
              className="w-full"
            />
          </div>
        )}
        
        {/* Time in Force selector */}
        <div>
          <Label htmlFor="time-in-force" className="mb-2 block">Time in Force</Label>
          <Select
            value={timeInForce}
            onValueChange={setTimeInForce}
          >
            <SelectTrigger id="time-in-force" className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day Only</SelectItem>
              <SelectItem value="gtc">Good Till Canceled (GTC)</SelectItem>
              <SelectItem value="ioc">Immediate or Cancel (IOC)</SelectItem>
              <SelectItem value="fok">Fill or Kill (FOK)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Special parameters for institutional order types */}
        {orderType === 'iceberg' && (
          <div>
            <Label htmlFor="display-size" className="mb-2 block">Display Size</Label>
            <Input
              id="display-size"
              type="text"
              value={displaySize}
              onChange={handleDisplaySizeChange}
              className="w-full"
              placeholder="Visible quantity"
            />
            <p className="text-xs text-axium-gray-500 mt-1">
              Only {displaySize} out of {quantity} will be visible to the market
            </p>
          </div>
        )}
        
        {['twap', 'vwap'].includes(orderType) && (
          <>
            <div>
              <Label htmlFor="duration" className="mb-2 block">Duration (minutes)</Label>
              <Input
                id="duration"
                type="text"
                value={duration}
                onChange={handleDurationChange}
                className="w-full"
              />
            </div>
            
            {orderType === 'twap' && (
              <div>
                <Label htmlFor="interval" className="mb-2 block">Interval (minutes)</Label>
                <Input
                  id="interval"
                  type="text"
                  value={intervalMinutes}
                  onChange={handleIntervalChange}
                  className="w-full"
                />
              </div>
            )}
          </>
        )}
        
        {/* Dark pool option for institutional clients */}
        {isInstitutional && (
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-pool" className="mb-0 flex items-center">
                Dark Pool Execution
              </Label>
              <p className="text-xs text-axium-gray-500">Hide your order from the public order book</p>
            </div>
            <Switch
              id="dark-pool"
              checked={darkPoolEnabled}
              onCheckedChange={setDarkPoolEnabled}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button 
          onClick={() => handleOrderSubmit('buy')}
          className="w-full bg-axium-success hover:bg-axium-success/90"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Buy {symbol}
        </Button>
        <Button 
          onClick={() => handleOrderSubmit('sell')}
          className="w-full bg-axium-error hover:bg-axium-error/90"
        >
          <TrendingDown className="h-4 w-4 mr-2" />
          Sell {symbol}
        </Button>
      </div>
    </GlassCard>
  );
};

export default AdvancedOrderTypes;
