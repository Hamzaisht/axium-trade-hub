
import { useState } from "react";
import { IPO } from "@/utils/mockApi";
import { AssetSelector } from "@/components/trading-dashboard/AssetSelector";
import { ChartSection } from "@/components/trading-dashboard/ChartSection";
import { OrderBookSection } from "@/components/trading-dashboard/OrderBookSection";
import { TradePanelSection } from "@/components/trading-dashboard/TradePanelSection";
import { PriceHeader } from "@/components/trading-dashboard/PriceHeader";

interface TradingDashboardProps {
  ipos: IPO[];
  selectedIPO: IPO | null;
  onSelectIPO: (ipoId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  priceChangePercent?: number;
  timeframe?: string;
  chartType?: "candlestick" | "line";
  showIndicators?: {
    volume: boolean;
    sma7: boolean;
    sma30: boolean;
    bollingerBands: boolean;
    vwap: boolean;
  };
  onTimeframeChange?: (timeframe: string) => void;
  onChartTypeChange?: (type: "candlestick" | "line") => void;
  onToggleIndicator?: (indicator: string) => void;
  marketDataLoading?: boolean;
}

export const TradingDashboard = ({
  ipos,
  selectedIPO,
  onSelectIPO,
  onRefresh,
  isLoading,
  priceChangePercent = 0,
  timeframe = "1D",
  chartType = "candlestick",
  showIndicators = {
    volume: true,
    sma7: false,
    sma30: false,
    bollingerBands: false,
    vwap: false
  },
  onTimeframeChange,
  onChartTypeChange,
  onToggleIndicator,
  marketDataLoading = false
}: TradingDashboardProps) => {
  const [localTimeframe, setLocalTimeframe] = useState<"1H" | "1D" | "1W" | "1M" | "1Y">("1D");
  const [localIndicators, setLocalIndicators] = useState({
    showVolume: true,
    showMA: false,
    showRSI: false,
    showBollingerBands: false
  });

  const toggleIndicator = (indicator: keyof typeof localIndicators) => {
    setLocalIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  if (!selectedIPO) return null;

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="bg-[#0B0F1A] border border-[#1E375F] rounded-md p-4">
        <AssetSelector 
          ipos={ipos} 
          selectedIPO={selectedIPO} 
          onSelectIPO={onSelectIPO} 
        />
      </div>

      <PriceHeader 
        symbol={selectedIPO.symbol}
        name={selectedIPO.creatorName}
        currentPrice={selectedIPO.currentPrice}
        priceChangePercent={priceChangePercent}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <ChartSection 
            isLoading={marketDataLoading || isLoading}
            selectedIPO={{
              id: selectedIPO.id,
              symbol: selectedIPO.symbol,
              creatorName: selectedIPO.creatorName,
              currentPrice: selectedIPO.currentPrice
            }}
            chartType={chartType as "candlestick" | "line"}
            timeframe={timeframe}
            showIndicators={showIndicators}
            onChartTypeChange={onChartTypeChange || (() => {})}
            onTimeframeChange={onTimeframeChange || (() => {})}
            onToggleIndicator={(indicator) => onToggleIndicator ? onToggleIndicator(indicator) : null}
          />
          
          <OrderBookSection 
            symbol={selectedIPO.symbol}
            currentPrice={selectedIPO.currentPrice}
            ipoId={selectedIPO.id}
          />
        </div>
        
        <div className="xl:col-span-1">
          <TradePanelSection 
            creatorId={selectedIPO.id}
            currentPrice={selectedIPO.currentPrice}
            symbol={selectedIPO.symbol}
          />
        </div>
      </div>
    </div>
  );
};
