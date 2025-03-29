
import { EnhancedOrderBook } from "@/components/market/EnhancedOrderBook";
import TradePanel from "@/components/market/TradePanel";
import { useDemoMode } from "@/contexts/DemoModeContext";

interface TradePanelSectionProps {
  creatorId: string;
  currentPrice: number;
  symbol: string;
}

export const TradePanelSection = ({ creatorId, currentPrice, symbol }: TradePanelSectionProps) => {
  const { isDemo } = useDemoMode();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TradePanel 
        creatorId={creatorId}
        currentPrice={currentPrice}
        symbol={symbol}
      />
      
      <EnhancedOrderBook 
        creatorId={creatorId}
        symbol={symbol}
      />
      
      {isDemo && (
        <div className="col-span-1 md:col-span-2 bg-blue-500/10 border border-blue-500/20 rounded-md p-3 text-sm">
          <div className="flex items-center justify-center text-blue-400">
            <span className="font-semibold">Demo Mode Active</span>
            <span className="mx-2">•</span>
            <span>All features are visible but transactions are disabled</span>
            <span className="mx-2">•</span>
            <span>Add <code>?demo=false</code> to URL to disable</span>
          </div>
        </div>
      )}
    </div>
  );
};
