
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTrading } from "@/contexts/TradingContext";
import { useIPO } from "@/contexts/IPOContext";
import { useMarketData } from "@/hooks/useMarketData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BarChart4,
  LineChart,
  BookOpen,
  History,
  Settings,
  TrendingUp
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TradeForm from "@/components/trading/TradeForm";
import OrderBook from "@/components/dashboard/OrderBook";
import PriceChart from "@/components/dashboard/PriceChart";
import { CandlestickChart } from "@/components/trading/CandlestickChart";
import AdvancedOrderTypes from "@/components/trading/AdvancedOrderTypes";
import InstitutionalTrading from "@/components/trading/institutional/InstitutionalTrading";
import LiveTrades from "@/components/trading/LiveTrades";
import SentimentInsights from "@/components/trading/SentimentInsights";
import ExternalMetricsCard from "@/components/trading/external-metrics/ExternalMetricsCard";
import LiquidityPoolInfo from "@/components/trading/liquidity-pool/LiquidityPoolInfo";

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
  const navigate = useNavigate();
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
  
  const { isConnected, priceUpdates, latestPrices, orderBook, recentTrades } = useMarketData(
    selectedIPO?.id
  );

  // Select a different IPO
  const handleIPOChange = (ipoId: string) => {
    const ipo = ipos.find(i => i.id === ipoId);
    if (ipo) {
      setSelectedIPO(ipo);
    }
  };

  // Create mock candlestick data
  const generateMockCandlestickData = () => {
    const baseDate = new Date().getTime();
    const basePrice = selectedIPO?.currentPrice || 25;
    const volatility = selectedIPO?.volatilityScore || 5;
    
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

  if (iposLoading || tradingLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!selectedIPO) {
    return <div className="flex justify-center items-center min-h-screen">No trading assets available</div>;
  }

  return (
    <div className="bg-axium-gray-100/30 min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Trading Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-axium-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {/* Main content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Chart and trading controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset selector */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              {ipos.map(ipo => (
                <Button
                  key={ipo.id}
                  variant={selectedIPO?.id === ipo.id ? "default" : "outline"}
                  className="whitespace-nowrap"
                  onClick={() => handleIPOChange(ipo.id)}
                >
                  {ipo.symbol} - {ipo.creatorName}
                </Button>
              ))}
            </div>
            
            {/* Price header */}
            <GlassCard className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedIPO.symbol}</h2>
                  <p className="text-axium-gray-600">{selectedIPO.creatorName}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-3xl font-semibold">${selectedIPO.currentPrice.toFixed(2)}</div>
                  <div className={`text-sm ${selectedIPO.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedIPO.priceChangePercent >= 0 ? '+' : ''}{selectedIPO.priceChangePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </GlassCard>
            
            {/* Chart with controls */}
            <GlassCard className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === "candlestick" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("candlestick")}
                  >
                    <BarChart4 className="h-4 w-4 mr-2" />
                    Candlestick
                  </Button>
                  <Button 
                    variant={chartType === "line" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    Line
                  </Button>
                </div>
                
                <div className="flex space-x-1 overflow-x-auto">
                  {["15m", "1H", "1D", "1W", "1M", "YTD", "All"].map(tf => (
                    <Button 
                      key={tf}
                      variant={timeframe === tf ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="h-[400px]">
                {chartType === "candlestick" ? (
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
                    token={selectedIPO.symbol} 
                    priceData={candlestickData.map(d => ({ timestamp: d.timestamp, price: d.close }))} 
                  />
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  variant={showIndicators.volume ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowIndicators({...showIndicators, volume: !showIndicators.volume})}
                >
                  Volume
                </Button>
                <Button 
                  variant={showIndicators.sma7 ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowIndicators({...showIndicators, sma7: !showIndicators.sma7})}
                >
                  SMA (7)
                </Button>
                <Button 
                  variant={showIndicators.sma30 ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowIndicators({...showIndicators, sma30: !showIndicators.sma30})}
                >
                  SMA (30)
                </Button>
                <Button 
                  variant={showIndicators.bollingerBands ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowIndicators({...showIndicators, bollingerBands: !showIndicators.bollingerBands})}
                >
                  Bollinger Bands
                </Button>
                <Button 
                  variant={showIndicators.vwap ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowIndicators({...showIndicators, vwap: !showIndicators.vwap})}
                >
                  VWAP
                </Button>
              </div>
            </GlassCard>
            
            {/* Order book & trades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-2">Order Book</h3>
                <OrderBook 
                  asks={orderBook?.asks || []} 
                  bids={orderBook?.bids || []} 
                  token={selectedIPO.symbol}
                />
              </GlassCard>
              
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-2">Recent Trades</h3>
                <LiveTrades trades={recentTrades} />
              </GlassCard>
            </div>
            
            {/* External data and sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentInsights creatorId={selectedIPO.creatorId} symbol={selectedIPO.symbol} />
              <ExternalMetricsCard creatorId={selectedIPO.creatorId} />
            </div>
            
            {/* Institutional features (conditional) */}
            {user && (user.role === 'admin' || user.role === 'investor') && (
              <InstitutionalTrading />
            )}
            
            {/* Liquidity pool info */}
            <LiquidityPoolInfo ipoId={selectedIPO.id} symbol={selectedIPO.symbol} />
          </div>
          
          {/* Right column - Trading form and order management */}
          <div className="space-y-6">
            {/* Trading form */}
            <TradeForm ipo={selectedIPO} />
            
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
