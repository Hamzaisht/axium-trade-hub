
import { Button } from "@/components/ui/button";
import { ShowIndicators } from "./ChartSection";

interface ChartIndicatorsProps {
  showIndicators: ShowIndicators;
  onToggleIndicator: (indicator: keyof ShowIndicators) => void;
}

export const ChartIndicators = ({ 
  showIndicators, 
  onToggleIndicator 
}: ChartIndicatorsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        size="sm"
        variant={showIndicators.volume ? "default" : "outline"}
        onClick={() => onToggleIndicator('volume')}
        className={`text-xs ${showIndicators.volume ? 'bg-blue-600 dark:bg-[#3676FF] text-white' : 'text-gray-700 dark:text-axium-gray-300'}`}
      >
        Volume
      </Button>
      <Button
        size="sm"
        variant={showIndicators.sma7 ? "default" : "outline"}
        onClick={() => onToggleIndicator('sma7')}
        className={`text-xs ${showIndicators.sma7 ? 'bg-blue-600 dark:bg-[#3676FF] text-white' : 'text-gray-700 dark:text-axium-gray-300'}`}
      >
        SMA 7
      </Button>
      <Button
        size="sm"
        variant={showIndicators.sma30 ? "default" : "outline"}
        onClick={() => onToggleIndicator('sma30')}
        className={`text-xs ${showIndicators.sma30 ? 'bg-blue-600 dark:bg-[#3676FF] text-white' : 'text-gray-700 dark:text-axium-gray-300'}`}
      >
        SMA 30
      </Button>
      <Button
        size="sm"
        variant={showIndicators.bollingerBands ? "default" : "outline"}
        onClick={() => onToggleIndicator('bollingerBands')}
        className={`text-xs ${showIndicators.bollingerBands ? 'bg-blue-600 dark:bg-[#3676FF] text-white' : 'text-gray-700 dark:text-axium-gray-300'}`}
      >
        Bollinger Bands
      </Button>
      <Button
        size="sm"
        variant={showIndicators.vwap ? "default" : "outline"}
        onClick={() => onToggleIndicator('vwap')}
        className={`text-xs ${showIndicators.vwap ? 'bg-blue-600 dark:bg-[#3676FF] text-white' : 'text-gray-700 dark:text-axium-gray-300'}`}
      >
        VWAP
      </Button>
    </div>
  );
};
