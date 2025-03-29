
import { useState } from "react";
import { OrderType, OrderFormValues, OrderSubmitData } from "./types";
import { toast } from "@/components/ui/use-toast";

interface UseOrderFormProps {
  symbol: string;
  currentPrice: number;
  onOrderSubmit?: (orderData: OrderSubmitData) => void;
}

export const useOrderForm = ({ 
  symbol, 
  currentPrice, 
  onOrderSubmit 
}: UseOrderFormProps) => {
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
  
  const validateOrder = () => {
    if (orderType === 'limit' && !limitPrice) {
      toast({
        title: "Validation Error",
        description: "Limit price is required for limit orders",
        variant: "destructive"
      });
      return false;
    }
    
    if ((orderType === 'stop' || orderType === 'stop-limit') && !stopPrice) {
      toast({
        title: "Validation Error",
        description: "Stop price is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (orderType === 'oco' && (!stopPrice || !takeProfitPrice)) {
      toast({
        title: "Validation Error",
        description: "Both stop price and take profit price are required for OCO orders",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handleOrderSubmit = (side: 'buy' | 'sell') => {
    if (!validateOrder()) return;
    
    // Construct order based on type
    const order: OrderSubmitData = {
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

  return {
    formValues: {
      orderType,
      quantity,
      limitPrice,
      stopPrice,
      takeProfitPrice,
      timeInForce,
      displaySize,
      darkPoolEnabled,
      intervalMinutes,
      duration
    },
    handlers: {
      setOrderType,
      handleQuantityChange,
      handleLimitPriceChange,
      handleStopPriceChange,
      handleTakeProfitPriceChange,
      handleDisplaySizeChange,
      handleIntervalChange,
      handleDurationChange,
      setTimeInForce,
      setDarkPoolEnabled,
      handleOrderSubmit
    }
  };
};
