
import { Button } from "@/components/ui/button";
import { BarChart4, LineChart, Save, Share2, Maximize2, Download, PanelLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D", "1W", "1M"];
  
  return (
    <div className="bg-axium-gray-100/70 dark:bg-axium-gray-800/50 rounded-md p-1.5 mb-3">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          <Tabs defaultValue={chartType} onValueChange={(v) => onChartTypeChange(v as "candlestick" | "line")}>
            <TabsList className="h-8">
              <TabsTrigger value="candlestick" className="h-7 px-2 text-xs">
                <BarChart4 className="h-3.5 w-3.5 mr-1" />
                Candlestick
              </TabsTrigger>
              <TabsTrigger value="line" className="h-7 px-2 text-xs">
                <LineChart className="h-3.5 w-3.5 mr-1" />
                Line
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <PanelLeft className="h-4 w-4 text-axium-gray-500" />
          
          <div className="flex border border-axium-gray-200 dark:border-axium-gray-700 rounded-md overflow-hidden">
            {timeframes.map(tf => (
              <Button 
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => onTimeframeChange(tf)}
                className={`h-7 px-2 py-0 text-xs rounded-none ${
                  timeframe === tf 
                    ? 'bg-axium-blue/80 text-white hover:bg-axium-blue hover:text-white' 
                    : 'hover:bg-axium-gray-200/50 dark:hover:bg-axium-gray-700/50'
                }`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 mt-1 sm:mt-0">
          <Select defaultValue="indicators">
            <SelectTrigger className="h-7 w-[130px] text-xs">
              <SelectValue placeholder="Indicators" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indicators">Indicators</SelectItem>
              <SelectItem value="ma">Moving Average</SelectItem>
              <SelectItem value="bollinger">Bollinger Bands</SelectItem>
              <SelectItem value="rsi">RSI</SelectItem>
              <SelectItem value="macd">MACD</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="drawing">
            <SelectTrigger className="h-7 w-[100px] text-xs">
              <SelectValue placeholder="Drawing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drawing">Drawing</SelectItem>
              <SelectItem value="line">Trend Line</SelectItem>
              <SelectItem value="fib">Fibonacci</SelectItem>
              <SelectItem value="channel">Channel</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Save className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
