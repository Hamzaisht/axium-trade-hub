
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShowIndicators } from "./ChartSection";

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
  
  const renderIndicatorButton = (indicator: keyof ShowIndicators, label: string) => {
    const isActive = showIndicators[indicator];
    
    return (
      <Tooltip key={indicator}>
        <TooltipTrigger asChild>
          <Button 
            variant={isActive ? "default" : "outline"} 
            size="sm"
            onClick={() => onToggleIndicator(indicator)}
            className={isActive 
              ? "bg-[#1E375F] text-white" 
              : "border-[#1E375F] text-[#8A9CCC] hover:bg-[#1E375F]/30"}
          >
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[#1A2747] border-[#1E375F] text-white">
          <p className="text-xs">{indicatorDescriptions[indicator]}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {renderIndicatorButton("volume", "Volume")}
      {renderIndicatorButton("sma7", "SMA (7)")}
      {renderIndicatorButton("sma30", "SMA (30)")}
      {renderIndicatorButton("bollingerBands", "Bollinger")}
      {renderIndicatorButton("vwap", "VWAP")}
    </div>
  );
};
