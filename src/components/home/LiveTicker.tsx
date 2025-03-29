
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className={`relative py-4 backdrop-blur-md border-y overflow-hidden ${
      isDark ? 'bg-[#0B0F1A]/80 border-axium-neon-blue/20' : 'bg-white/80 border-gray-200'
    }`}>
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-r from-axium-neon-blue/5 via-transparent to-axium-neon-mint/5"></div>
      )}
      
      <div className="relative">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...TOKENS, ...TOKENS].map((token, index) => (
            <motion.div 
              key={`${token.symbol}-${index}`} 
              className={`flex items-center mx-4 py-2 px-4 rounded-md ${
                isDark ? 'bg-[#0F0F12]/90' : 'bg-white/90'
              } backdrop-blur-md border ${
                token.change >= 0 
                  ? 'border-axium-positive/20'
                  : 'border-axium-negative/20'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={hoveredIndex === index ? {
                y: [0, -5, 0],
                scale: [1, 1.05, 1],
                transition: { duration: 0.5 }
              } : {}}
              whileHover={{
                z: 10
              }}
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
              
              {/* 3D Oracle hover effect */}
              {hoveredIndex === index && (
                <motion.div 
                  className="absolute inset-0 rounded-md pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    boxShadow: token.change >= 0 
                      ? "0 0 20px rgba(42, 255, 145, 0.3)" 
                      : "0 0 20px rgba(255, 61, 94, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {/* Enhanced 3D Oracle effect on hover */}
              {hoveredIndex === index && (
                <motion.div 
                  className="absolute inset-0 rounded-md pointer-events-none overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className={`absolute inset-0 opacity-20 ${
                      token.change >= 0 ? 'bg-axium-positive' : 'bg-axium-negative'
                    }`}
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <motion.div 
                    className="absolute -inset-1 opacity-30"
                    style={{ 
                      background: `radial-gradient(circle at 50% 50%, ${
                        token.change >= 0 ? 'rgba(42, 255, 145, 0.6)' : 'rgba(255, 61, 94, 0.6)'
                      }, transparent 70%)` 
                    }}
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Gradient fade effect on edges */}
      <div className={`absolute top-0 left-0 h-full w-20 z-10 ${
        isDark 
          ? 'bg-gradient-to-r from-[#0B0F1A] via-[#0B0F1A]/90 to-transparent' 
          : 'bg-gradient-to-r from-[#F7F9FB] via-[#F7F9FB]/90 to-transparent'
      }`}></div>
      <div className={`absolute top-0 right-0 h-full w-20 z-10 ${
        isDark 
          ? 'bg-gradient-to-l from-[#0B0F1A] via-[#0B0F1A]/90 to-transparent' 
          : 'bg-gradient-to-l from-[#F7F9FB] via-[#F7F9FB]/90 to-transparent'
      }`}></div>
    </div>
  );
};

export default LiveTicker;
