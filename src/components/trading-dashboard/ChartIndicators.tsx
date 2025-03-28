
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ShowIndicators {
  volume: boolean;
  sma7: boolean;
  sma30: boolean;
  bollingerBands: boolean;
  vwap: boolean;
}

interface ChartIndicatorsProps {
  showIndicators: ShowIndicators;
  onToggleIndicator: (indicator: keyof ShowIndicators) => void;
}

export const ChartIndicators = ({ showIndicators, onToggleIndicator }: ChartIndicatorsProps) => {
  // Define indicator information with descriptions and colors
  const indicators = [
    { 
      key: 'volume' as keyof ShowIndicators, 
      label: 'Volume', 
      color: 'bg-purple-500',
      description: 'Volume shows the number of shares traded during a given time period'
    },
    { 
      key: 'sma7' as keyof ShowIndicators, 
      label: 'SMA (7)', 
      color: 'bg-blue-500',
      description: '7-day Simple Moving Average smooths price data to form a trend indicator'
    },
    { 
      key: 'sma30' as keyof ShowIndicators, 
      label: 'SMA (30)', 
      color: 'bg-green-500',
      description: '30-day Simple Moving Average shows longer-term price trends'
    },
    { 
      key: 'bollingerBands' as keyof ShowIndicators, 
      label: 'Bollinger Bands', 
      color: 'bg-orange-500',
      description: 'Bollinger Bands show volatility using standard deviations from a moving average'
    },
    { 
      key: 'vwap' as keyof ShowIndicators, 
      label: 'VWAP', 
      color: 'bg-pink-500',
      description: 'Volume Weighted Average Price shows the average price weighted by volume'
    }
  ];

  return (
    <div className="bg-axium-gray-100/70 dark:bg-axium-gray-800/50 rounded-md p-2 mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <h4 className="text-xs font-medium text-axium-gray-600 dark:text-axium-gray-400">Active Indicators</h4>
        <Badge variant="outline" className="text-[10px] font-normal px-1.5">
          {Object.values(showIndicators).filter(Boolean).length}/{indicators.length}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {indicators.map(indicator => (
          <TooltipProvider key={indicator.key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showIndicators[indicator.key] ? "default" : "outline"} 
                  size="sm"
                  onClick={() => onToggleIndicator(indicator.key)}
                  className={`h-7 px-2 text-xs gap-1.5 ${
                    showIndicators[indicator.key] 
                      ? 'bg-axium-gray-800 dark:bg-white text-white dark:text-axium-gray-900' 
                      : 'bg-transparent'
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${indicator.color}`}></div>
                  {indicator.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs p-2 max-w-[200px]">
                <div className="flex items-start">
                  <Info className="h-3 w-3 text-axium-blue mr-1 mt-0.5 flex-shrink-0" />
                  <span>{indicator.description}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
