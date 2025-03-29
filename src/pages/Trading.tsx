
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTrading } from "@/contexts/TradingContext";
import { useIPO } from "@/contexts/IPOContext";
import { useMarketData } from "@/hooks/useMarketData";
import { GlassCard } from "@/components/ui/GlassCard";
import { showNotification } from "@/components/notifications/ToastContainer";
import { TradeFormSkeleton } from "@/components/ui/skeleton-components";
import TradeForm from "@/components/trading/TradeForm";
import InstitutionalTrading from "@/components/trading/institutional/InstitutionalTrading";
import LiquidityPoolInfo from "@/components/trading/liquidity-pool";
import { PriceTicker } from "@/components/market/PriceTicker";
import { 
  TradingHeader, 
  AssetSelector,
  PriceHeader,
  ChartSection,
  MetricsGrid,
  OrderBookSection,
  TradePanelSection,
  TradingSettings,
  TradingOrders,
  AdvancedOrderSection
} from "@/components/trading-dashboard";

const Trading = () => {
  const { user } = useAuth();
  const { isLoading: tradingLoading } = useTrading();
  const { ipos, isLoading: iposLoading } = useIPO();
  const [selectedIPO, setSelectedIPO] = useState(ipos[0] || null);
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
      showNotification.info(`Switched to ${ipo.symbol} - ${ipo.creatorName}`);
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
  const isLoading = iposLoading || tradingLoading;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!selectedIPO) {
    return <div className="flex justify-center items-center min-h-screen">No trading assets available</div>;
  }

  return (
    <div className="bg-axium-gray-100/30 min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <TradingHeader 
          title="Trading Dashboard"
          isConnected={isConnected}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AssetSelector 
              ipos={ipos}
              selectedIPO={selectedIPO}
              onSelectIPO={handleIPOChange}
            />
            
            <div className="flex justify-between items-center">
              <PriceHeader 
                symbol={selectedIPO.symbol}
                name={selectedIPO.creatorName}
                currentPrice={selectedIPO.currentPrice}
                priceChangePercent={priceChangePercent}
              />
              <PriceTicker creatorId={selectedIPO.id} symbol={selectedIPO.symbol} />
            </div>
            
            <ChartSection 
              isLoading={marketDataLoading}
              selectedIPO={selectedIPO}
              chartType={chartType}
              timeframe={timeframe}
              showIndicators={showIndicators}
              onChartTypeChange={setChartType}
              onTimeframeChange={setTimeframe}
              onToggleIndicator={handleToggleIndicator}
            />
            
            <TradePanelSection 
              creatorId={selectedIPO.id}
              currentPrice={selectedIPO.currentPrice}
              symbol={selectedIPO.symbol}
            />
            
            <OrderBookSection 
              symbol={selectedIPO.symbol}
              currentPrice={selectedIPO.currentPrice}
              ipoId={selectedIPO.id}
            />
            
            <MetricsGrid creatorId={selectedIPO.id} />
            
            {user && (user.role === 'admin' || user.role === 'investor') && (
              <InstitutionalTrading />
            )}
            
            <LiquidityPoolInfo symbol={selectedIPO.symbol} />
          </div>
          
          <div className="space-y-6">
            {tradingLoading ? (
              <TradeFormSkeleton />
            ) : (
              <TradeForm ipo={selectedIPO} />
            )}
            
            <AdvancedOrderSection 
              symbol={selectedIPO.symbol}
              currentPrice={selectedIPO.currentPrice}
            />
            
            <TradingOrders />
            
            <TradingSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
