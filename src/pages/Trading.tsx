
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
  TrendingDown
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

// Helper for date formatting
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
  const [showIndicators, setShowIndicators] = useState({
    volume: true,
    sma7: false,
    sma30: false,
    bollingerBands: false,
    vwap: false
  });
  
  // Handle selecting IPO from query parameter
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

  // Select a different IPO
  const handleIPOChange = (ipoId: string) => {
    const ipo = ipos.find(i => i.id === ipoId);
    if (ipo) {
      setSelectedIPO(ipo);
      showNotification.info(`Switched to ${ipo.symbol} - ${ipo.creatorName}`);
    }
  };

  // Toggle chart indicator
  const handleToggleIndicator = (indicator: keyof typeof showIndicators) => {
    setShowIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  // Create mock candlestick data
  const generateMockCandlestickData = () => {
    const baseDate = new Date().getTime();
    const basePrice = selectedIPO?.currentPrice || 25;
    // Use a default volatility value
    const volatility = 5; // Default volatility
    
    return Array.from({ length: 30 }, (_, i) => {
      const timestamp = baseDate - (29 - i) * 86400000 / 6; // Going backwards from today
      const randomFactor = Math.random() * volatility * 0.2 - volatility * 0.1;
      const open = basePrice * (1 + randomFactor);
      const close = open * (1 + (Math.random() * 0.04 - 0.02));
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 10000) + 1000;
      
      // Calculate SMA, Bollinger Bands, and VWAP for visualization
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

  // Calculate price change percentage for display
  const calculatePriceChange = () => {
    if (!selectedIPO) return 0;
    // Using the initial price as a base for calculation
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
        {/* Header with navigation */}
        <TradingHeader 
          title="Trading Dashboard"
          isConnected={isConnected}
        />
        
        {/* Main content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Chart and trading controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset selector */}
            <AssetSelector 
              ipos={ipos}
              selectedIPO={selectedIPO}
              onSelectIPO={handleIPOChange}
            />
            
            {/* Price header */}
            <PriceHeader 
              symbol={selectedIPO.symbol}
              name={selectedIPO.creatorName}
              currentPrice={selectedIPO.currentPrice}
              priceChangePercent={priceChangePercent}
            />
            
            {/* Chart with controls */}
            <GlassCard className="p-4">
              <ChartControls 
                chartType={chartType}
                timeframe={timeframe}
                onChartTypeChange={type => setChartType(type)}
                onTimeframeChange={tf => setTimeframe(tf)}
              />
              
              <div className="h-[400px]">
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
            
            {/* Order book & trades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-2">Order Book</h3>
                <VirtualizedOrderBook 
                  symbol={selectedIPO.symbol}
                  currentPrice={selectedIPO.currentPrice}
                  ipoId={selectedIPO.id}
                />
              </GlassCard>
              
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-2">Recent Trades</h3>
                <VirtualizedTradeHistory 
                  ipoId={selectedIPO.id} 
                  symbol={selectedIPO.symbol} 
                />
              </GlassCard>
            </div>
            
            {/* External data and sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentInsights creatorId={selectedIPO.id} className="h-full" />
              <ExternalMetricsCard creatorId={selectedIPO.id} className="h-full" />
            </div>
            
            {/* Institutional features (conditional) */}
            {user && (user.role === 'admin' || user.role === 'investor') && (
              <InstitutionalTrading />
            )}
            
            {/* Liquidity pool info */}
            <LiquidityPoolInfo symbol={selectedIPO.symbol} />
          </div>
          
          {/* Right column - Trading form and order management */}
          <div className="space-y-6">
            {/* Trading form */}
            {tradingLoading ? (
              <TradeFormSkeleton />
            ) : (
              <TradeForm ipo={selectedIPO} />
            )}
            
            {/* Advanced order types */}
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
            
            {/* User's open orders & positions */}
            <GlassCard className="p-4">
              <Tabs defaultValue="orders">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="positions">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Positions
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="h-4 w-4 mr-2" />
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
            
            {/* Trading settings */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Trading Settings</h3>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              <div className="space-y-2 text-sm text-axium-gray-600">
                <div className="flex justify-between">
                  <span>Execution Mode</span>
                  <span className="font-medium">Standard</span>
                </div>
                <div className="flex justify-between">
                  <span>Default Order Type</span>
                  <span className="font-medium">Limit</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmation</span>
                  <span className="font-medium">Required</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Alerts</span>
                  <span className="font-medium">Enabled</span>
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
