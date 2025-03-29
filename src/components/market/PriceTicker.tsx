
import { useState, useEffect } from 'react';
import { useLastTradePrice } from '@/hooks/useLastTradePrice';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceTickerProps {
  creatorId: string;
  symbol?: string;
  className?: string;
}

export function PriceTicker({ creatorId, symbol = "Token", className }: PriceTickerProps) {
  const { lastTradePrice, priceChange } = useLastTradePrice(creatorId);
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    if (priceChange !== 'none') {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [priceChange, lastTradePrice]);
  
  if (!lastTradePrice) {
    return (
      <div className={cn("flex items-center text-muted-foreground", className)}>
        <Minus className="h-4 w-4 mr-1" />
        No trades yet
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center font-medium", className)}>
      <div className={cn(
        "transition-all duration-1000",
        priceChange === 'up' && animating ? "text-green-500 transform translate-y-[-2px]" : "",
        priceChange === 'down' && animating ? "text-red-500 transform translate-y-[2px]" : "",
        priceChange === 'none' ? "text-foreground" : ""
      )}>
        {priceChange === 'up' && <TrendingUp className="h-4 w-4 inline mr-1" />}
        {priceChange === 'down' && <TrendingDown className="h-4 w-4 inline mr-1" />}
        ${lastTradePrice.toFixed(2)} {symbol}
      </div>
    </div>
  );
}
