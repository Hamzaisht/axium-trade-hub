
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold mb-2">Order Book</h3>
        <VirtualizedOrderBook 
          symbol={symbol}
          currentPrice={currentPrice}
          ipoId={ipoId}
        />
      </GlassCard>
      
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold mb-2">Recent Trades</h3>
        <VirtualizedTradeHistory 
          ipoId={ipoId} 
          symbol={symbol} 
        />
      </GlassCard>
    </div>
  );
};
