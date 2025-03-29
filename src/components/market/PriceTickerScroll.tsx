
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockIPOAPI } from '@/utils/mockApi';

interface PriceTickerScrollProps {
  className?: string;
}

export function PriceTickerScroll({ className }: PriceTickerScrollProps) {
  const [scrollPos, setScrollPos] = useState(0);
  
  const { data: ipos = [] } = useQuery({
    queryKey: ['ipos'],
    queryFn: () => mockIPOAPI.getAllIPOs(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculate price change percentage
  const getPercentageChange = (initialPrice: number, currentPrice: number) => {
    if (initialPrice === 0) return 0;
    return ((currentPrice - initialPrice) / initialPrice) * 100;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPos((prev) => (prev + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (ipos.length === 0) {
    return null;
  }

  return (
    <div className={`overflow-hidden bg-axium-dark-bg text-white text-sm border-b border-zinc-700 py-2 ${className}`}>
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ transform: `translateX(-${scrollPos}px)` }}
      >
        {ipos.map((ipo) => {
          const percentChange = getPercentageChange(ipo.initialPrice, ipo.currentPrice);
          const isPositive = percentChange >= 0;
          
          return (
            <span key={ipo.id} className="px-4 flex items-center">
              <span className="font-medium">{ipo.symbol}:</span>
              <span className="ml-1">${ipo.currentPrice.toFixed(2)}</span>
              <span 
                className={`ml-1 text-xs ${isPositive ? 'text-axium-positive' : 'text-axium-negative'}`}
              >
                {isPositive ? '▲' : '▼'} {Math.abs(percentChange).toFixed(2)}%
              </span>
            </span>
          );
        })}
        
        {/* Duplicate the items to create a seamless loop */}
        {ipos.map((ipo) => {
          const percentChange = getPercentageChange(ipo.initialPrice, ipo.currentPrice);
          const isPositive = percentChange >= 0;
          
          return (
            <span key={`${ipo.id}-dup`} className="px-4 flex items-center">
              <span className="font-medium">{ipo.symbol}:</span>
              <span className="ml-1">${ipo.currentPrice.toFixed(2)}</span>
              <span 
                className={`ml-1 text-xs ${isPositive ? 'text-axium-positive' : 'text-axium-negative'}`}
              >
                {isPositive ? '▲' : '▼'} {Math.abs(percentChange).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
