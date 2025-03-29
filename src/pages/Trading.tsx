
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTrading } from "@/contexts/TradingContext";
import { useIPO } from "@/contexts/IPOContext";
import { useMarketData } from "@/hooks/useMarketData";
import { GlassCard, DarkCard } from "@/components/ui/card";
import { showNotification } from "@/components/notifications/ToastContainer";
import { TradeFormSkeleton } from "@/components/ui/skeleton-components";
import TradeForm from "@/components/trading/trade-form";
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
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Briefcase, Database, LineChart, Loader2 } from "lucide-react";

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
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-[#3AA0FF] animate-spin mb-4" />
              <div className="text-lg font-medium text-white">Loading Trading Terminal...</div>
              <div className="text-sm text-[#8A9CCC] mt-2">Connecting to market data</div>
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
            <DarkCard className="p-8 max-w-md text-center">
              <Database className="h-16 w-16 mx-auto mb-4 text-[#3AA0FF]/50" />
              <h2 className="text-xl font-semibold mb-2 text-white">No Trading Assets Available</h2>
              <p className="text-[#8A9CCC] mb-6">We couldn't find any trading assets in your account. Please check back later or contact support.</p>
              <div className="flex space-x-4 justify-center">
                <Button variant="outline" className="border-[#1A2747] text-[#8A9CCC] hover:text-white">
                  Contact Support
                </Button>
                <Button onClick={() => window.location.reload()} className="bg-[#3AA0FF] hover:bg-[#2D7DD2] text-white">
                  Refresh
                </Button>
              </div>
            </DarkCard>
          </div>
        </DashboardShell>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <DashboardShell>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <LineChart className="h-6 w-6 mr-2 text-[#3AA0FF]" /> 
                Advanced Trading
              </h1>
              <p className="text-[#8A9CCC]">Professional trading tools with institutional-grade features</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                } mr-2`}></div>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              
              <Button className="bg-[#1A2747] hover:bg-[#243760] text-white">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Open Positions
              </Button>
              
              <Button className="bg-[#3AA0FF] hover:bg-[#2D7DD2] text-white">
                <Briefcase className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </div>
          </div>
          
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
              
              <OrderBookSection 
                symbol={selectedIPO.symbol}
                currentPrice={selectedIPO.currentPrice}
                ipoId={selectedIPO.id}
              />
              
              <MetricsGrid creatorId={selectedIPO.id} />
              
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
