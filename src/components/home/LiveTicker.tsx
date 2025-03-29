
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

// Mock data for ticker
const mockTickerData = [
  { id: 1, name: "Emma Watson", symbol: "$EMW", price: 24.82, change: 12.5 },
  { id: 2, name: "Zendaya", symbol: "$ZEN", price: 18.40, change: 5.2 },
  { id: 3, name: "Tom Holland", symbol: "$THLD", price: 21.35, change: -1.8 },
  { id: 4, name: "LeBron James", symbol: "$LBJ", price: 56.78, change: 3.4 },
  { id: 5, name: "Taylor Swift", symbol: "$SWIFT", price: 89.21, change: 8.7 },
  { id: 6, name: "BTS", symbol: "$BTS", price: 45.63, change: -2.3 },
  { id: 7, name: "Dua Lipa", symbol: "$DLIPA", price: 19.92, change: 6.1 },
  { id: 8, name: "Cristiano Ronaldo", symbol: "$CR7", price: 72.15, change: 4.5 },
  { id: 9, name: "Billie Eilish", symbol: "$BLSH", price: 31.47, change: -0.9 },
  { id: 10, name: "Ryan Reynolds", symbol: "$RYNR", price: 42.36, change: 7.2 },
];

type TickerItem = {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
};

export const LiveTicker = () => {
  const [tickerData, setTickerData] = useState<TickerItem[]>(mockTickerData);
  const [isPaused, setIsPaused] = useState(false);
  
  // Update ticker data randomly every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTickerData(prev => 
          prev.map(item => ({
            ...item,
            price: parseFloat((item.price + (Math.random() * 0.6 - 0.3)).toFixed(2)),
            change: parseFloat((item.change + (Math.random() * 0.8 - 0.4)).toFixed(1))
          }))
        );
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="relative overflow-hidden bg-axium-gray-100 py-4 border-y border-axium-gray-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={cn(
        "flex items-center space-x-16 animate-ticker whitespace-nowrap",
        isPaused && "animation-play-state-paused"
      )}>
        {/* Double the items to create seamless loop */}
        {[...tickerData, ...tickerData].map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center space-x-2">
            <span className="font-medium text-axium-gray-800">{item.symbol}</span>
            <span className="text-axium-gray-900">${item.price.toFixed(2)}</span>
            <span className={cn(
              "flex items-center text-sm",
              item.change >= 0 ? "text-axium-success" : "text-axium-error"
            )}>
              {item.change >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
              )}
              {Math.abs(item.change).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;
