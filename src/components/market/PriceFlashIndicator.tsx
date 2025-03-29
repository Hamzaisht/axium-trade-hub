
import { motion } from "framer-motion";
import { useLastTradePrice } from "@/hooks/useLastTradePrice";

interface PriceFlashIndicatorProps {
  creatorId: string;
  className?: string;
  showSymbol?: boolean;
  symbol?: string;
}

export function PriceFlashIndicator({ 
  creatorId, 
  className = "", 
  showSymbol = false,
  symbol
}: PriceFlashIndicatorProps) {
  const { lastTradePrice, priceChange } = useLastTradePrice(creatorId);
  
  if (!lastTradePrice) return null;
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(lastTradePrice);
  
  return (
    <motion.div
      className={`font-mono text-sm font-semibold ${className}`}
      initial={{ backgroundColor: "transparent" }}
      animate={{
        backgroundColor: 
          priceChange === 'up' 
            ? 'rgba(34, 197, 94, 0.15)' 
            : priceChange === 'down' 
              ? 'rgba(239, 68, 68, 0.15)' 
              : 'transparent',
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {showSymbol && symbol && <span className="mr-1 text-zinc-400">{symbol}</span>}
      <span className={
        priceChange === 'up' 
          ? 'text-green-500' 
          : priceChange === 'down' 
            ? 'text-red-500' 
            : 'text-white'
      }>
        {formattedPrice}
      </span>
    </motion.div>
  );
}
