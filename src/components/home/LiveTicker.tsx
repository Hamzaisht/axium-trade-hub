
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const TOKENS = [
  { name: "Emma Watson", symbol: "EMW", price: 24.82, change: 12.5 },
  { name: "Zendaya", symbol: "ZEN", price: 18.4, change: 5.7 },
  { name: "Tom Holland", symbol: "THLD", price: 21.35, change: -2.3 },
  { name: "Ryan Reynolds", symbol: "RYAN", price: 32.75, change: 8.9 },
  { name: "Dwayne Johnson", symbol: "ROCK", price: 47.22, change: 15.2 },
  { name: "Taylor Swift", symbol: "SWIFT", price: 56.89, change: 3.1 },
  { name: "Kylie Jenner", symbol: "KYLJ", price: 29.11, change: -4.5 },
  { name: "Lebron James", symbol: "KING", price: 43.65, change: 7.2 },
];

export const LiveTicker = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="relative py-4 bg-background/80 backdrop-blur-md border-y border-axium-neon-blue/20 overflow-hidden">
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-r from-axium-neon-blue/5 via-transparent to-axium-neon-mint/5"></div>
      )}
      
      <div className="relative">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...TOKENS, ...TOKENS].map((token, index) => (
            <div 
              key={`${token.symbol}-${index}`} 
              className={`flex items-center mx-4 py-2 px-4 rounded-md ${isDark ? 'bg-foreground/5' : 'bg-background/90'} backdrop-blur-md border ${
                token.change >= 0 
                  ? 'border-axium-positive/20'
                  : 'border-axium-negative/20'
              }`}
            >
              <div className="flex items-center">
                <span className="font-medium mr-2 text-foreground">{token.symbol}</span>
                <span className="text-muted-foreground text-sm mr-3">{token.name}</span>
                <span className="font-bold mr-2">${token.price.toFixed(2)}</span>
                <span className={`flex items-center text-sm ${
                  token.change >= 0 
                    ? 'text-axium-positive' 
                    : 'text-axium-negative'
                }`}>
                  {token.change >= 0 
                    ? <TrendingUp className="h-3 w-3 mr-1" /> 
                    : <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {Math.abs(token.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradient fade effect on edges */}
      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-background via-background/90 to-transparent z-10"></div>
      <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background via-background/90 to-transparent z-10"></div>
    </div>
  );
};

export default LiveTicker;
