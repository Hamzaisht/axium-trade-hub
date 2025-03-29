
import { useState } from "react";
import { IPO } from "@/utils/mockApi";
import { useMarketData } from "@/hooks/useMarketData";

export const useTradingState = (ipos: IPO[], selectedIpoId?: string) => {
  const initialIpo = selectedIpoId 
    ? ipos.find(ipo => ipo.id === selectedIpoId) 
    : ipos[0] || null;

  const [selectedIPO, setSelectedIPO] = useState(initialIpo);
  const [timeframe, setTimeframe] = useState("1D");
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");
  const [showIndicators, setShowIndicators] = useState({
    volume: true,
    sma7: false,
    sma30: false,
    bollingerBands: false,
    vwap: false
  });
  
  const { isConnected, isLoading: marketDataLoading } = useMarketData(
    selectedIPO?.id
  );

  const handleIPOChange = (ipoId: string) => {
    const ipo = ipos.find(i => i.id === ipoId);
    if (ipo) {
      setSelectedIPO(ipo);
    }
  };

  const handleToggleIndicator = (indicator: keyof typeof showIndicators) => {
    setShowIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const calculatePriceChange = () => {
    if (!selectedIPO) return 0;
    const initialPrice = selectedIPO.initialPrice || 0;
    const currentPrice = selectedIPO.currentPrice || 0;
    if (initialPrice === 0) return 0;
    return ((currentPrice - initialPrice) / initialPrice) * 100;
  };

  const priceChangePercent = calculatePriceChange();

  return {
    selectedIPO,
    timeframe,
    chartType,
    showIndicators,
    isConnected,
    marketDataLoading,
    priceChangePercent,
    handleIPOChange,
    setTimeframe,
    setChartType,
    handleToggleIndicator
  };
};
