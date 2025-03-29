
import { useState, useEffect } from "react";
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
import { PriceFlashIndicator } from "@/components/market/PriceFlashIndicator";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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

  // Auto-connection animation effect
  const [connectionAnim, setConnectionAnim] = useState(false);
  
  useEffect(() => {
    // Trigger connection animation when connected
    if (isConnected) {
      setConnectionAnim(true);
      const timer = setTimeout(() => setConnectionAnim(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

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
      <div className="flex justify-center items-center min-h-screen bg-axium-dark-bg">
        <div className="space-y-4 text-center">
          <div className="inline-block relative">
            <Sparkles className="animate-pulse text-axium-neon-blue w-16 h-16" />
            <div className="absolute inset-0 bg-axium-neon-blue/20 blur-xl rounded-full animate-pulse"></div>
          </div>
          <p className="text-white text-xl animate-pulse">Loading Trading Terminal...</p>
        </div>
      </div>
    );
  }

  if (!selectedIPO) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-axium-dark-bg">
        <GlassCard className="p-8 max-w-md text-center">
          <Sparkles className="mx-auto text-axium-neon-blue w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Trading Assets</h2>
          <p className="text-axium-gray-400">There are no assets available for trading at this time.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-axium-dark-bg relative overflow-hidden">
      {/* Background grid and ambient effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(11,15,26,0.3)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(11,15,26,0.3)_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-axium-blue/5 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-axium-neon-blue/5 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <div className="container max-w-7xl mx-auto px-4 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TradingHeader 
            title="Trading Terminal"
            isConnected={isConnected}
          />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
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
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="relative"
              >
                <PriceTicker creatorId={selectedIPO.id} symbol={selectedIPO.symbol} />
                <PriceFlashIndicator creatorId={selectedIPO.id} className="absolute -top-6 right-0" />
                
                {connectionAnim && (
                  <motion.div 
                    className="absolute -right-2 -top-2 w-3 h-3 bg-green-500 rounded-full"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0] }}
                    transition={{ 
                      duration: 2,
                      repeat: 1,
                      ease: "easeInOut" 
                    }}
                  />
                )}
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
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
              
              {/* Ambient glow effect */}
              <div className="absolute -inset-1 bg-axium-neon-blue/5 rounded-lg blur-lg -z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TradePanelSection 
                creatorId={selectedIPO.id}
                currentPrice={selectedIPO.currentPrice}
                symbol={selectedIPO.symbol}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderBookSection 
                symbol={selectedIPO.symbol}
                currentPrice={selectedIPO.currentPrice}
                ipoId={selectedIPO.id}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <MetricsGrid creatorId={selectedIPO.id} />
            </motion.div>
            
            {user && (user.role === 'admin' || user.role === 'investor') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <InstitutionalTrading />
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <LiquidityPoolInfo symbol={selectedIPO.symbol} />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative group"
            >
              {tradingLoading ? (
                <TradeFormSkeleton />
              ) : (
                <TradeForm ipo={selectedIPO} />
              )}
              
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-axium-blue/10 rounded-lg blur-xl -z-10 opacity-0 group-hover:opacity-60 transition-opacity"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <AdvancedOrderSection 
                symbol={selectedIPO.symbol}
                currentPrice={selectedIPO.currentPrice}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <TradingOrders />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <TradingSettings />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
