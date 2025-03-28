
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTrading } from "@/contexts/TradingContext";
import { useIPO } from "@/contexts/IPOContext";
import { useMarketData } from "@/hooks/useMarketData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BookOpen,
  History,
  Settings,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Monitor,
  Grid,
  Info,
  Infinity
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TradeForm from "@/components/trading/TradeForm";
import VirtualizedOrderBook from "@/components/dashboard/VirtualizedOrderBook";
import PriceChart from "@/components/dashboard/PriceChart";
import { CandlestickChart } from "@/components/trading/CandlestickChart";
import AdvancedOrderTypes from "@/components/trading/AdvancedOrderTypes";
import InstitutionalTrading from "@/components/trading/institutional/InstitutionalTrading";
import VirtualizedTradeHistory from "@/components/trading/VirtualizedTradeHistory";
import SentimentInsights from "@/components/trading/SentimentInsights";
import { ExternalMetricsCard } from "@/components/trading/external-metrics";
import LiquidityPoolInfo from "@/components/trading/liquidity-pool";
import { showNotification } from "@/components/notifications/ToastContainer";
import { 
  TradingHeader, 
  AssetSelector,
  PriceHeader,
  ChartControls,
  ChartIndicators
} from "@/components/trading-dashboard";
import {
  ChartSkeleton,
  TradeFormSkeleton
} from "@/components/ui/skeleton-components";
import AITrendPrediction from "@/components/trading/AITrendPrediction";

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Trading = () => {
  const { user } = useAuth();
  const { isLoading: tradingLoading } = useTrading();
  const { ipos, isLoading: iposLoading } = useIPO();
  const [searchParams] = useSearchParams();
  const ipoQueryParam = searchParams.get('ipo');
  
  const [selectedIPO, setSelectedIPO] = useState(ipos[0] || null);
  const [timeframe, setTimeframe] = useState("1D");
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");
  const [layoutMode, setLayoutMode] = useState<"standard" | "advanced" | "compact">("standard");
  const [showIndicators, setShowIndicators] = useState({
    volume: true,
    sma7: false,
    sma30: false,
    bollingerBands: false,
    vwap: false
  });
  
  useEffect(() => {
    if (ipoQueryParam && !iposLoading && ipos.length > 0) {
      const ipo = ipos.find(i => i.id === ipoQueryParam);
      if (ipo) {
        setSelectedIPO(ipo);
      }
    }
  }, [ipoQueryParam, ipos, iposLoading]);
  
  const { isConnected, priceUpdates, latestPrices, orderBook, recentTrades, isLoading: marketDataLoading } = useMarketData(
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

  const generateMockCandlestickData = () => {
    const baseDate = new Date().getTime();
    const basePrice = selectedIPO?.currentPrice || 25;
    const volatility = 5;
    
    return Array.from({ length: 30 }, (_, i) => {
      const timestamp = baseDate - (29 - i) * 86400000 / 6;
      const randomFactor = Math.random() * volatility * 0.2 - volatility * 0.1;
      const open = basePrice * (1 + randomFactor);
      const close = open * (1 + (Math.random() * 0.04 - 0.02));
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 10000) + 1000;
      
      return {
        timestamp,
        open,
        high,
        low,
        close,
        volume,
        sma7: open * (1 + (Math.random() * 0.01 - 0.005)),
        sma30: open * (1 - (Math.random() * 0.01 - 0.005)),
        upperBB: open * 1.02,
        middleBB: open,
        lowerBB: open * 0.98,
        vwap: open * (1 + (Math.random() * 0.005 - 0.0025))
      };
    });
  };

  const candlestickData = generateMockCandlestickData();

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
    <div className="bg-gradient-to-br from-axium-gray-100/10 to-axium-gray-100/30 dark:from-axium-gray-800/20 dark:to-axium-gray-900/40 min-h-screen">
      <div className="container max-w-[1920px] mx-auto px-4 py-4">
        <TradingHeader 
          title="Advanced Trading Terminal"
          isConnected={isConnected}
        />
        
        <div className="flex items-center justify-between mb-4">
          <AssetSelector 
            ipos={ipos}
            selectedIPO={selectedIPO}
            onSelectIPO={handleIPOChange}
          />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-1 rounded-md border border-axium-gray-200 bg-white dark:bg-axium-gray-800 dark:border-axium-gray-700 p-1">
              <Button
                variant={layoutMode === "standard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("standard")}
                className="h-8 gap-1"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Standard</span>
              </Button>
              <Button
                variant={layoutMode === "advanced" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("advanced")}
                className="h-8 gap-1"
              >
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </Button>
              <Button
                variant={layoutMode === "compact" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("compact")}
                className="h-8 gap-1"
              >
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline">Compact</span>
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className="h-8">
              <Infinity className="h-4 w-4 mr-1" />
              AI Assist
            </Button>
          </div>
        </div>
        
        <PriceHeader 
          symbol={selectedIPO.symbol}
          name={selectedIPO.creatorName}
          currentPrice={selectedIPO.currentPrice}
          priceChangePercent={priceChangePercent}
        />
            
        <div className={`grid gap-4 ${
          layoutMode === "standard" ? "grid-cols-1 lg:grid-cols-3" : 
          layoutMode === "advanced" ? "grid-cols-1 xl:grid-cols-4" : 
          "grid-cols-1 lg:grid-cols-2 xl:grid-cols-6"
        }`}>
          {/* Main chart section */}
          <div className={`${
            layoutMode === "standard" ? "lg:col-span-2" : 
            layoutMode === "advanced" ? "xl:col-span-3" : 
            "xl:col-span-4"
          } space-y-4`}>
            <GlassCard className="p-4">
              <ChartControls 
                chartType={chartType}
                timeframe={timeframe}
                onChartTypeChange={type => setChartType(type)}
                onTimeframeChange={tf => setTimeframe(tf)}
              />
              
              <div className="h-[500px]">
                {marketDataLoading ? (
                  <ChartSkeleton height="100%" />
                ) : chartType === "candlestick" ? (
                  <CandlestickChart 
                    data={candlestickData}
                    showVolumeBar={showIndicators.volume}
                    showSMA7={showIndicators.sma7}
                    showSMA30={showIndicators.sma30}
                    showBollingerBands={showIndicators.bollingerBands}
                    showVWAP={showIndicators.vwap}
                    dateFormatter={formatDate}
                  />
                ) : (
                  <PriceChart 
                    symbol={selectedIPO.symbol}
                    name={selectedIPO.creatorName}
                    currentPrice={selectedIPO.currentPrice}
                    ipoId={selectedIPO.id}
                  />
                )}
              </div>
              
              <ChartIndicators 
                showIndicators={showIndicators} 
                onToggleIndicator={handleToggleIndicator}
              />
            </GlassCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-axium-blue" />
                  Order Book
                </h3>
                <VirtualizedOrderBook 
                  symbol={selectedIPO.symbol}
                  currentPrice={selectedIPO.currentPrice}
                  ipoId={selectedIPO.id}
                  maxHeight={300}
                />
              </GlassCard>
              
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <History className="h-4 w-4 mr-2 text-axium-blue" />
                  Recent Trades
                </h3>
                <VirtualizedTradeHistory 
                  ipoId={selectedIPO.id} 
                  symbol={selectedIPO.symbol}
                />
              </GlassCard>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SentimentInsights ipoId={selectedIPO?.id || ''} className="h-full" />
              <ExternalMetricsCard creatorId={selectedIPO.id} className="h-full" />
            </div>
            
            {(layoutMode === "advanced" || layoutMode === "standard") && (
              <>
                {user && (user.role === 'admin' || user.role === 'investor') && (
                  <InstitutionalTrading />
                )}
                
                <LiquidityPoolInfo symbol={selectedIPO.symbol} />
              </>
            )}
          </div>
          
          {/* Sidebar with trading panel and other tools */}
          <div className={`${layoutMode === "compact" ? "xl:col-span-2" : ""} space-y-4`}>
            {tradingLoading ? (
              <TradeFormSkeleton />
            ) : (
              <TradeForm ipo={selectedIPO} />
            )}
            
            <AITrendPrediction ipoId={selectedIPO.id} />
            
            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="standard">
                {/* This is intentionally left empty as TradeForm already handles standard orders */}
              </TabsContent>
              <TabsContent value="advanced">
                <AdvancedOrderTypes 
                  symbol={selectedIPO.symbol} 
                  currentPrice={selectedIPO.currentPrice} 
                  className="mt-4"
                  onOrderSubmit={orderData => {
                    showNotification.orderPlaced(
                      selectedIPO.symbol,
                      orderData.side,
                      orderData.quantity,
                      orderData.limitPrice || selectedIPO.currentPrice,
                      orderData.type
                    );
                  }}
                />
              </TabsContent>
            </Tabs>
            
            <GlassCard className="p-4">
              <Tabs defaultValue="orders">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders" className="text-xs">
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="positions" className="text-xs">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    Positions
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-xs">
                    <History className="h-3.5 w-3.5 mr-1" />
                    History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <div className="py-2">
                    <p className="text-center text-axium-gray-500 py-8">No open orders</p>
                  </div>
                </TabsContent>
                <TabsContent value="positions">
                  <div className="py-2">
                    <p className="text-center text-axium-gray-500 py-8">No open positions for this asset</p>
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  <div className="py-2">
                    <p className="text-center text-axium-gray-500 py-8">No trading history for this asset</p>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
            
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-axium-blue" />
                  Trading Settings
                </h3>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/50 p-2 rounded">
                  <div className="text-axium-gray-500 text-xs">Execution Mode</div>
                  <div className="font-medium">Standard</div>
                </div>
                <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/50 p-2 rounded">
                  <div className="text-axium-gray-500 text-xs">Default Order</div>
                  <div className="font-medium">Limit</div>
                </div>
                <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/50 p-2 rounded">
                  <div className="text-axium-gray-500 text-xs">Confirmation</div>
                  <div className="font-medium">Required</div>
                </div>
                <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/50 p-2 rounded">
                  <div className="text-axium-gray-500 text-xs">Price Alerts</div>
                  <div className="font-medium">Enabled</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
