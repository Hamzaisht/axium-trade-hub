
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart3, LineChart, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant={chartType === "candlestick" ? "default" : "outline"}
          onClick={() => onChartTypeChange("candlestick")}
          className="group relative h-7 px-3 text-xs hover:shadow-[0_0_10px_rgba(30,174,219,0.5)]"
        >
          <motion.span
            className="relative z-10 flex items-center"
            animate={{ 
              color: chartType === "candlestick" ? "#ffffff" : "#999999",
            }}
            transition={{ duration: 0.3 }}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            <span>Candlestick</span>
          </motion.span>
          {chartType === "candlestick" && (
            <motion.span
              layoutId="chartTypeHighlight"
              className="absolute inset-0 bg-gradient-to-r from-axium-blue via-axium-neon-blue to-axium-blue-light rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Button>
        
        <Button
          size="sm"
          variant={chartType === "line" ? "default" : "outline"}
          onClick={() => onChartTypeChange("line")}
          className="group relative h-7 px-3 text-xs hover:shadow-[0_0_10px_rgba(30,174,219,0.5)]"
        >
          <motion.span
            className="relative z-10 flex items-center"
            animate={{ 
              color: chartType === "line" ? "#ffffff" : "#999999",
            }}
            transition={{ duration: 0.3 }}
          >
            <LineChart className="w-3.5 h-3.5 mr-1" />
            <span>Line</span>
          </motion.span>
          {chartType === "line" && (
            <motion.span
              layoutId="chartTypeHighlight"
              className="absolute inset-0 bg-gradient-to-r from-axium-blue via-axium-neon-blue to-axium-blue-light rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Button>
      </div>
      
      <div className="flex items-center">
        <Clock className="w-3.5 h-3.5 text-axium-gray-500 mr-1.5" />
        <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && onTimeframeChange(value)}>
          {["1H", "1D", "1W", "1M"].map((tf) => (
            <ToggleGroupItem 
              key={tf} 
              value={tf}
              className="relative h-7 w-9 text-xs"
              variant="outline"
            >
              <motion.span
                className="relative z-10"
                animate={{ 
                  color: timeframe === tf ? "#ffffff" : "#999999",
                }}
                transition={{ duration: 0.3 }}
              >
                {tf}
              </motion.span>
              {timeframe === tf && (
                <motion.span
                  layoutId="timeframeHighlight"
                  className="absolute inset-0 bg-gradient-to-r from-axium-blue/80 to-axium-neon-blue/80 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};
