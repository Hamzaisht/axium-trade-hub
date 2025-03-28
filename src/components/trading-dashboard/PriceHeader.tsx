
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowUp, ArrowDown, Info, AlertCircle, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceHeaderProps {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChangePercent: number;
}

export const PriceHeader = ({ symbol, name, currentPrice, priceChangePercent }: PriceHeaderProps) => {
  const isPositive = priceChangePercent >= 0;
  const formattedChange = isPositive ? `+${priceChangePercent.toFixed(2)}%` : `${priceChangePercent.toFixed(2)}%`;
  
  // Generate mock additional data
  const dayRange = {
    low: (currentPrice * 0.95).toFixed(2),
    high: (currentPrice * 1.05).toFixed(2)
  };
  
  const weekRange = {
    low: (currentPrice * 0.9).toFixed(2),
    high: (currentPrice * 1.1).toFixed(2)
  };
  
  const marketCap = (currentPrice * 1000000).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  
  const volume24h = (Math.random() * 1000000 + 500000).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  
  return (
    <GlassCard className="p-4 mb-4">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 lg:col-span-3 flex flex-col">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold font-mono">{symbol}</h2>
            <div className="bg-axium-gray-100/80 dark:bg-axium-gray-800/50 text-xs px-2 py-0.5 rounded ml-2">
              Creator
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                    <Info className="h-3.5 w-3.5 text-axium-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs p-1">
                    <p>Creator Token</p>
                    <p>Launched: March 2023</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-axium-gray-600 text-sm truncate">{name}</p>
        </div>
        
        <div className="col-span-6 sm:col-span-4 lg:col-span-2 flex flex-col justify-center border-l border-axium-gray-200/50 dark:border-axium-gray-700/50 pl-4">
          <div className="flex items-end">
            <div className="text-3xl font-mono font-semibold tracking-tight">
              ${currentPrice.toFixed(2)}
            </div>
            <div className={`ml-2 text-sm font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? (
                <ArrowUp className="h-3.5 w-3.5 mr-0.5" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5 mr-0.5" />
              )}
              {formattedChange}
            </div>
          </div>
          <div className="text-xs text-axium-gray-500 mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="col-span-6 sm:col-span-4 lg:col-span-2 border-l border-axium-gray-200/50 dark:border-axium-gray-700/50 pl-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-axium-gray-500">Day Range</div>
              <div className="font-medium">${dayRange.low} - ${dayRange.high}</div>
            </div>
            <div>
              <div className="text-axium-gray-500">Week Range</div>
              <div className="font-medium">${weekRange.low} - ${weekRange.high}</div>
            </div>
          </div>
        </div>
        
        <div className="col-span-6 sm:col-span-6 lg:col-span-3 border-l border-axium-gray-200/50 dark:border-axium-gray-700/50 pl-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <div className="text-axium-gray-500">Market Cap</div>
              <div className="font-medium">{marketCap}</div>
            </div>
            <div>
              <div className="text-axium-gray-500">24h Volume</div>
              <div className="font-medium">{volume24h}</div>
            </div>
            <div>
              <div className="text-axium-gray-500">Circulating Supply</div>
              <div className="font-medium">1.5M / 10M</div>
            </div>
            <div>
              <div className="text-axium-gray-500">Engagement</div>
              <div className="font-medium text-green-500">+12.4% (High)</div>
            </div>
          </div>
        </div>
        
        <div className="col-span-6 sm:col-span-6 lg:col-span-2 border-l border-axium-gray-200/50 dark:border-axium-gray-700/50 pl-4 flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
            Set Alert
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <BarChart4 className="h-3.5 w-3.5 mr-1.5" />
            Analytics
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};
