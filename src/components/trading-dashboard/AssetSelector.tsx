
import { useEffect } from "react";
import { IPO } from "@/utils/mockApi";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AssetSelectorProps {
  ipos: IPO[];
  selectedIPO: IPO | null;
  onSelectIPO: (ipoId: string) => void;
  className?: string;
}

export const AssetSelector = ({ 
  ipos, 
  selectedIPO, 
  onSelectIPO, 
  className 
}: AssetSelectorProps) => {
  if (!ipos || ipos.length === 0 || !selectedIPO) {
    return null;
  }

  // Sort by current price (highest first)
  const sortedIPOs = [...ipos].sort((a, b) => b.currentPrice - a.currentPrice);

  return (
    <GlassCard className={cn("p-4", className)}>
      <h3 className="text-base font-semibold mb-4">Trade Assets</h3>
      <div className="overflow-x-auto">
        <div className="flex space-x-2 pb-1">
          {sortedIPOs.map((ipo) => (
            <Button
              key={ipo.id}
              variant={selectedIPO?.id === ipo.id ? "default" : "outline"}
              className={cn(
                "flex-shrink-0 h-auto py-2",
                selectedIPO?.id === ipo.id ? "bg-axium-blue text-white" : "border-axium-gray-200"
              )}
              onClick={() => onSelectIPO(ipo.id)}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">{ipo.symbol}</span>
                <div 
                  className={cn(
                    "flex items-center text-xs mt-1",
                    (ipo.priceChange >= 0) ? "text-green-500" : "text-red-500"
                  )}
                >
                  <span>${ipo.currentPrice.toFixed(2)}</span>
                  {(ipo.priceChange >= 0) ? (
                    <TrendingUp size={12} className="h-3 w-3 ml-1" />
                  ) : (
                    <TrendingDown size={12} className="h-3 w-3 ml-1" />
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default AssetSelector;
