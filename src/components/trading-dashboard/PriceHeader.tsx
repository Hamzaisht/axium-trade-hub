
import { GlassCard } from "@/components/ui/GlassCard";

interface PriceHeaderProps {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChangePercent: number;
}

export const PriceHeader = ({ symbol, name, currentPrice, priceChangePercent }: PriceHeaderProps) => {
  return (
    <GlassCard className="p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{symbol}</h2>
          <p className="text-axium-gray-600">{name}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-3xl font-semibold">${currentPrice.toFixed(2)}</div>
          <div className={`text-sm ${priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
