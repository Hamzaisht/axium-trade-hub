
import { GlassCard } from "@/components/ui/GlassCard";
import VirtualizedOrderBook from "@/components/dashboard/VirtualizedOrderBook";
import VirtualizedTradeHistory from "@/components/trading/VirtualizedTradeHistory";

interface OrderBookSectionProps {
  symbol: string;
  currentPrice: number;
  ipoId: string;
}

export const OrderBookSection = ({ symbol, currentPrice, ipoId }: OrderBookSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <GlassCard className="p-4 h-fit">
        <h3 className="text-lg font-semibold mb-2">Order Book</h3>
        <VirtualizedOrderBook 
          symbol={symbol}
          currentPrice={currentPrice}
          ipoId={ipoId}
          maxHeight={300}
        />
      </GlassCard>
      
      <GlassCard className="p-4 h-fit">
        <h3 className="text-lg font-semibold mb-2">Recent Trades</h3>
        <VirtualizedTradeHistory 
          ipoId={ipoId} 
          symbol={symbol}
          maxHeight={300}
        />
      </GlassCard>
    </div>
  );
};
