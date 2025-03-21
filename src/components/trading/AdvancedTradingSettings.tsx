
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, BarChart3, LineChart, CandlestickChart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimeframeOption {
  label: string;
  value: string;
  interval?: string;
  days?: number;
  isYTD?: boolean;
}

export interface TechnicalIndicator {
  id: string;
  name: string;
  enabled: boolean;
}

interface AdvancedTradingSettingsProps {
  timeframes: TimeframeOption[];
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
  chartType: 'line' | 'candle';
  onChartTypeChange: (type: 'line' | 'candle') => void;
  technicalIndicators: TechnicalIndicator[];
  onTechnicalIndicatorToggle: (id: string, enabled: boolean) => void;
  className?: string;
}

export const AdvancedTradingSettings = ({
  timeframes,
  selectedTimeframe,
  onTimeframeChange,
  chartType,
  onChartTypeChange,
  technicalIndicators,
  onTechnicalIndicatorToggle,
  className
}: AdvancedTradingSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <div className="flex items-center space-x-1">
        {timeframes.map((timeframe) => (
          <Button
            key={timeframe.value}
            variant="ghost"
            size="sm"
            className={cn(
              "px-3 py-1 h-8",
              selectedTimeframe.value === timeframe.value
                ? "bg-axium-blue text-white hover:bg-axium-blue"
                : "text-axium-gray-600 hover:text-axium-blue"
            )}
            onClick={() => onTimeframeChange(timeframe)}
          >
            {timeframe.label}
          </Button>
        ))}
      </div>
      
      <div className="flex border-l border-gray-200 pl-2 ml-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-3 py-1 h-8",
            chartType === 'line'
              ? "bg-axium-blue text-white hover:bg-axium-blue"
              : "text-axium-gray-600 hover:text-axium-blue"
          )}
          onClick={() => onChartTypeChange('line')}
        >
          <LineChart className="h-4 w-4 mr-1" />
          Line
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-3 py-1 h-8",
            chartType === 'candle'
              ? "bg-axium-blue text-white hover:bg-axium-blue"
              : "text-axium-gray-600 hover:text-axium-blue"
          )}
          onClick={() => onChartTypeChange('candle')}
        >
          <CandlestickChart className="h-4 w-4 mr-1" />
          Candle
        </Button>
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Indicators
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-4">
          <DropdownMenuLabel>Technical Indicators</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="space-y-3 mt-2">
            {technicalIndicators.map((indicator) => (
              <div key={indicator.id} className="flex items-center justify-between">
                <Label htmlFor={indicator.id}>{indicator.name}</Label>
                <Switch 
                  id={indicator.id} 
                  checked={indicator.enabled} 
                  onCheckedChange={(checked) => 
                    onTechnicalIndicatorToggle(indicator.id, checked)
                  }
                />
              </div>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdvancedTradingSettings;
