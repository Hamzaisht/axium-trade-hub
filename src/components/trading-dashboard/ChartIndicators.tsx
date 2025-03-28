
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, Activity, Banknote, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChartIndicatorsProps {
  showIndicators: {
    volume?: boolean;
    sma7?: boolean;
    sma30?: boolean;
    bollingerBands?: boolean;
    vwap?: boolean;
    prTrendline?: boolean;
  };
  onToggleIndicator: (indicator: string) => void;
}

export const ChartIndicators = ({ showIndicators, onToggleIndicator }: ChartIndicatorsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showIndicators.volume ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleIndicator('volume')}
              className="text-xs h-7 px-2"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Volume
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle volume display</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showIndicators.sma7 ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleIndicator('sma7')}
              className="text-xs h-7 px-2"
            >
              <LineChart className="h-4 w-4 mr-1" />
              SMA 7
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simple Moving Average (7 periods)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showIndicators.sma30 ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleIndicator('sma30')}
              className="text-xs h-7 px-2"
            >
              <LineChart className="h-4 w-4 mr-1" />
              SMA 30
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Simple Moving Average (30 periods)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showIndicators.bollingerBands ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleIndicator('bollingerBands')}
              className="text-xs h-7 px-2"
            >
              <Activity className="h-4 w-4 mr-1" />
              BB
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bollinger Bands</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showIndicators.vwap ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleIndicator('vwap')}
              className="text-xs h-7 px-2"
            >
              <Banknote className="h-4 w-4 mr-1" />
              VWAP
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Volume Weighted Average Price</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showIndicators.prTrendline ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleIndicator('prTrendline')}
              className="text-xs h-7 px-2"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              PR
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>PR & Sentiment Trendline</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
