
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Briefcase, LineChart } from "lucide-react";
import { IPO } from "@/utils/mockApi";

import { AssetSelector } from "./AssetSelector";
import { PriceHeader } from "./PriceHeader";
import { ChartSection } from "./ChartSection";
import { TradePanelSection } from "./TradePanelSection";
import { OrderBookSection } from "./OrderBookSection";
import { MetricsGrid } from "./MetricsGrid";
import { TradingSettings } from "./TradingSettings";
import { TradingOrders } from "./TradingOrders";
import { AdvancedOrderSection } from "./AdvancedOrderSection";
import { PriceTicker } from "@/components/market/PriceTicker";
import InstitutionalTrading from "@/components/trading/institutional/InstitutionalTrading";
import LiquidityPoolInfo from "@/components/trading/liquidity-pool";
import TradeForm from "@/components/trading/trade-form";
import { TradeFormSkeleton } from "@/components/ui/skeleton-components";

interface TradingDashboardProps {
  ipos: IPO[];
  selectedIPO: IPO;
  tradingLoading: boolean;
  marketDataLoading: boolean;
  priceChangePercent: number;
  timeframe: string;
  chartType: "candlestick" | "line";
  showIndicators: {
    volume: boolean;
    sma7: boolean;
    sma30: boolean;
    bollingerBands: boolean;
    vwap: boolean;
  };
  onSelectIPO: (ipoId: string) => void;
  onTimeframeChange: (timeframe: string) => void;
  onChartTypeChange: (type: "candlestick" | "line") => void;
  onToggleIndicator: (indicator: keyof typeof showIndicators) => void;
}

export const TradingDashboard = ({
  ipos,
  selectedIPO,
  tradingLoading,
  marketDataLoading,
  priceChangePercent,
  timeframe,
  chartType,
  showIndicators,
  onSelectIPO,
  onTimeframeChange,
  onChartTypeChange,
  onToggleIndicator,
}: TradingDashboardProps) => {
  const { user } = useAuth();

  return (
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
              onSelectIPO={onSelectIPO}
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
            onChartTypeChange={onChartTypeChange}
            onTimeframeChange={onTimeframeChange}
            onToggleIndicator={onToggleIndicator}
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
  );
};
