
import { EnhancedOrderBook } from "@/components/market/EnhancedOrderBook";
import TradePanel from "@/components/market/TradePanel";

interface TradePanelSectionProps {
  creatorId: string;
  currentPrice: number;
  symbol: string;
}

export const TradePanelSection = ({ creatorId, currentPrice, symbol }: TradePanelSectionProps) => {
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
    </div>
  );
};
