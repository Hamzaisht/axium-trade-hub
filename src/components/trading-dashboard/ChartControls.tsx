
import { Button } from "@/components/ui/button";
import { BarChart4, LineChart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChartControlsProps {
  chartType: "candlestick" | "line";
  timeframe: string;
  onChartTypeChange: (type: "candlestick" | "line") => void;
  onTimeframeChange: (timeframe: string) => void;
}

export const ChartControls = ({
  chartType,
  timeframe,
  onChartTypeChange,
  onTimeframeChange
}: ChartControlsProps) => {
  const timeframes = ["15m", "1H", "1D", "1W", "1M", "YTD", "All"];
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={chartType === "candlestick" ? "default" : "outline"} 
              size="sm"
              onClick={() => onChartTypeChange("candlestick")}
            >
              <BarChart4 className="h-4 w-4 mr-2" />
              Candlestick
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Display price as candlestick chart</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={chartType === "line" ? "default" : "outline"} 
              size="sm"
              onClick={() => onChartTypeChange("line")}
            >
              <LineChart className="h-4 w-4 mr-2" />
              Line
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Display price as line chart</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex space-x-1 overflow-x-auto">
        {timeframes.map(tf => (
          <Tooltip key={tf}>
            <TooltipTrigger asChild>
              <Button 
                variant={timeframe === tf ? "default" : "outline"} 
                size="sm"
                onClick={() => onTimeframeChange(tf)}
              >
                {tf}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Show {tf} timeframe data</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
