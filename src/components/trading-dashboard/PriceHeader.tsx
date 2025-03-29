
import { GlassCard } from "@/components/ui/GlassCard";

interface PriceHeaderProps {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChangePercent: number;
}

export const PriceHeader = ({ symbol, name, currentPrice, priceChangePercent }: PriceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-white">{symbol}</h2>
          <span className="ml-2 px-2 py-1 bg-[#1A2747] rounded-md text-xs text-[#8A9CCC]">{name}</span>
        </div>
      </div>
      <div className="flex flex-col items-end mt-2 md:mt-0">
        <div className="text-3xl font-semibold text-white">${currentPrice.toFixed(2)}</div>
        <div className={`text-sm px-2 py-0.5 rounded ${priceChangePercent >= 0 
          ? 'bg-[#00C076]/20 text-[#00C076]' 
          : 'bg-[#FF5757]/20 text-[#FF5757]'}`}>
          {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};
