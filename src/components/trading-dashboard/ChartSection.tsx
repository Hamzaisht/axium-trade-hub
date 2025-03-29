
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import PriceChart from "@/components/dashboard/PriceChart";
import { CandlestickChart } from "@/components/trading/CandlestickChart";
import { ChartControls } from "@/components/trading-dashboard/ChartControls";
import { ChartIndicators } from "@/components/trading-dashboard/ChartIndicators";
import { ChartSkeleton } from "@/components/ui/skeleton-components";

// Define the ShowIndicators type
type ShowIndicators = {
  volume: boolean;
  sma7: boolean;
  sma30: boolean;
  bollingerBands: boolean;
  vwap: boolean;
}

interface ChartSectionProps {
  isLoading: boolean;
  selectedIPO: {
    id: string;
    symbol: string;
    creatorName: string;
    currentPrice: number;
  };
  chartType: "candlestick" | "line";
  timeframe: string;
  showIndicators: ShowIndicators;
  onChartTypeChange: (type: "candlestick" | "line") => void;
  onTimeframeChange: (timeframe: string) => void;
  onToggleIndicator: (indicator: keyof ShowIndicators) => void;
}

export const ChartSection = ({ 
  isLoading,
  selectedIPO,
  chartType,
  timeframe,
  showIndicators,
  onChartTypeChange,
  onTimeframeChange,
  onToggleIndicator
}: ChartSectionProps) => {
  const generateMockCandlestickData = () => {
    const baseDate = new Date().getTime();
    const basePrice = selectedIPO?.currentPrice || 25;
    const volatility = 5;
    
    return Array.from({ length: 30 }, (_, i) => {
      const timestamp = baseDate - (29 - i) * 86400000 / 6;
      const randomFactor = Math.random() * volatility * 0.2 - volatility * 0.1;
      const open = basePrice * (1 + randomFactor);
      const close = open * (1 + (Math.random() * 0.04 - 0.02));
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 10000) + 1000;
      
      return {
        timestamp,
        open,
        high,
        low,
        close,
        volume,
        sma7: open * (1 + (Math.random() * 0.01 - 0.005)),
        sma30: open * (1 - (Math.random() * 0.01 - 0.005)),
        upperBB: open * 1.02,
        middleBB: open,
        lowerBB: open * 0.98,
        vwap: open * (1 + (Math.random() * 0.005 - 0.0025))
      };
    });
  };

  const candlestickData = generateMockCandlestickData();

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <GlassCard className="p-4">
      <ChartControls 
        chartType={chartType}
        timeframe={timeframe}
        onChartTypeChange={onChartTypeChange}
        onTimeframeChange={onTimeframeChange}
      />
      
      <div className="h-[400px]">
        {isLoading ? (
          <ChartSkeleton height="100%" />
        ) : chartType === "candlestick" ? (
          <CandlestickChart 
            data={candlestickData}
            showVolumeBar={showIndicators.volume}
            showSMA7={showIndicators.sma7}
            showSMA30={showIndicators.sma30}
            showBollingerBands={showIndicators.bollingerBands}
            showVWAP={showIndicators.vwap}
            dateFormatter={formatDate}
          />
        ) : (
          <PriceChart 
            symbol={selectedIPO.symbol}
            name={selectedIPO.creatorName}
            currentPrice={selectedIPO.currentPrice}
            ipoId={selectedIPO.id}
          />
        )}
      </div>
      
      <ChartIndicators 
        showIndicators={showIndicators} 
        onToggleIndicator={onToggleIndicator}
      />
    </GlassCard>
  );
};

