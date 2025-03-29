
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTrading } from "@/contexts/TradingContext";
import { useIPO } from "@/contexts/IPOContext";
import { useMarketData } from "@/hooks/useMarketData";
import { GlassCard } from "@/components/ui/card";
import { showNotification } from "@/components/notifications/ToastContainer";
import { TradeFormSkeleton } from "@/components/ui/skeleton-components";
import TradeForm from "@/components/trading/TradeForm";
import InstitutionalTrading from "@/components/trading/institutional/InstitutionalTrading";
import LiquidityPoolInfo from "@/components/trading/liquidity-pool";
import { PriceTicker } from "@/components/market/PriceTicker";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";
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
    return (
      <LayoutShell>
        <DashboardShell>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-[#2D3748] h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-[#2D3748] rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#2D3748] rounded"></div>
                  <div className="h-4 bg-[#2D3748] rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </DashboardShell>
      </LayoutShell>
    );
  }

  if (!selectedIPO) {
    return (
      <LayoutShell>
        <DashboardShell>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No trading assets available</h2>
              <p className="text-gray-400">Please check back later or contact support.</p>
            </div>
          </div>
        </DashboardShell>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <DashboardShell>
        <div className="max-w-7xl mx-auto">
          <TradingHeader 
            title="Trading Dashboard"
            isConnected={isConnected}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-4">
                <AssetSelector 
                  ipos={ipos}
                  selectedIPO={selectedIPO}
                  onSelectIPO={handleIPOChange}
                />
              </GlassCard>
              
              <GlassCard className="p-4">
                <div className="flex justify-between items-center">
                  <PriceHeader 
                    symbol={selectedIPO.symbol}
                    name={selectedIPO.creatorName}
                    currentPrice={selectedIPO.currentPrice}
                    priceChangePercent={priceChangePercent}
                  />
                  <PriceTicker creatorId={selectedIPO.id} symbol={selectedIPO.symbol} />
                </div>
              </GlassCard>
              
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
              
              <GlassCard className="p-4">
                <TradePanelSection 
                  creatorId={selectedIPO.id}
                  currentPrice={selectedIPO.currentPrice}
                  symbol={selectedIPO.symbol}
                />
              </GlassCard>
              
              <GlassCard className="p-4">
                <OrderBookSection 
                  symbol={selectedIPO.symbol}
                  currentPrice={selectedIPO.currentPrice}
                  ipoId={selectedIPO.id}
                />
              </GlassCard>
              
              <GlassCard className="p-4">
                <MetricsGrid creatorId={selectedIPO.id} />
              </GlassCard>
              
              {user && (user.role === 'admin' || user.role === 'investor') && (
                <GlassCard className="p-4">
                  <InstitutionalTrading />
                </GlassCard>
              )}
              
              <GlassCard className="p-4">
                <LiquidityPoolInfo symbol={selectedIPO.symbol} />
              </GlassCard>
            </div>
            
            <div className="space-y-6">
              <GlassCard className="p-4">
                {tradingLoading ? (
                  <TradeFormSkeleton />
                ) : (
                  <TradeForm ipo={selectedIPO} />
                )}
              </GlassCard>
              
              <GlassCard className="p-4">
                <AdvancedOrderSection 
                  symbol={selectedIPO.symbol}
                  currentPrice={selectedIPO.currentPrice}
                />
              </GlassCard>
              
              <GlassCard className="p-4">
                <TradingOrders />
              </GlassCard>
              
              <GlassCard className="p-4">
                <TradingSettings />
              </GlassCard>
            </div>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};

export default Trading;
