
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
}

export const TradingDashboard = ({
  ipos,
  selectedIPO,
  onSelectIPO,
  onRefresh,
  isLoading
}: TradingDashboardProps) => {
  const [timeframe, setTimeframe] = useState<"1H" | "1D" | "1W" | "1M" | "1Y">("1D");
  // State for chart indicators
  const [indicators, setIndicators] = useState({
    showVolume: true,
    showMA: false,
    showRSI: false,
    showBollingerBands: false
  });

  const toggleIndicator = (indicator: keyof typeof indicators) => {
    setIndicators(prev => ({
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
        selectedIPO={selectedIPO} 
        onRefresh={onRefresh} 
        isLoading={isLoading} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <ChartSection 
            selectedIPO={selectedIPO} 
            timeframe={timeframe} 
            setTimeframe={setTimeframe}
            indicators={indicators}
            toggleIndicator={toggleIndicator}
          />
          <OrderBookSection selectedIPO={selectedIPO} />
        </div>
        
        <div className="xl:col-span-1">
          <TradePanelSection selectedIPO={selectedIPO} />
        </div>
      </div>
    </div>
  );
};
