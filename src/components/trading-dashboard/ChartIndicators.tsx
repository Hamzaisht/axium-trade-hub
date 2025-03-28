
import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant={showIndicators.volume ? "default" : "outline"} 
        size="sm"
        onClick={() => onToggleIndicator("volume")}
      >
        Volume
      </Button>
      <Button 
        variant={showIndicators.sma7 ? "default" : "outline"} 
        size="sm"
        onClick={() => onToggleIndicator("sma7")}
      >
        SMA (7)
      </Button>
      <Button 
        variant={showIndicators.sma30 ? "default" : "outline"} 
        size="sm"
        onClick={() => onToggleIndicator("sma30")}
      >
        SMA (30)
      </Button>
      <Button 
        variant={showIndicators.bollingerBands ? "default" : "outline"} 
        size="sm"
        onClick={() => onToggleIndicator("bollingerBands")}
      >
        Bollinger Bands
      </Button>
      <Button 
        variant={showIndicators.vwap ? "default" : "outline"} 
        size="sm"
        onClick={() => onToggleIndicator("vwap")}
      >
        VWAP
      </Button>
    </div>
  );
};
