
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const indicatorDescriptions = {
    volume: "Show trading volume below the chart",
    sma7: "Simple Moving Average (7 periods)",
    sma30: "Simple Moving Average (30 periods)",
    bollingerBands: "Bollinger Bands (standard deviation channels)",
    vwap: "Volume Weighted Average Price"
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {(Object.keys(showIndicators) as Array<keyof ShowIndicators>).map(indicator => (
        <Tooltip key={indicator}>
          <TooltipTrigger asChild>
            <Button 
              variant={showIndicators[indicator] ? "default" : "outline"} 
              size="sm"
              onClick={() => onToggleIndicator(indicator)}
            >
              {indicator === "sma7" ? "SMA (7)" : 
               indicator === "sma30" ? "SMA (30)" : 
               indicator.charAt(0).toUpperCase() + indicator.slice(1)}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">{indicatorDescriptions[indicator]}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
