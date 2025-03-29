
import { useAuth } from "@/contexts/AuthContext";
import { useTrading } from "@/contexts/TradingContext";
import { useIPO } from "@/contexts/IPOContext";
import { showNotification } from "@/components/notifications/ToastContainer";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { LoadingState } from "@/components/trading-dashboard/LoadingState";
import { NoAssetsState } from "@/components/trading-dashboard/NoAssetsState";
import { TradingDashboard } from "@/components/trading-dashboard/TradingDashboard";
import { useTradingState } from "@/components/trading-dashboard/useTradingState";

const Trading = () => {
  const { isLoading: tradingLoading } = useTrading();
  const { ipos, isLoading: iposLoading } = useIPO();
  
  const {
    selectedIPO,
    timeframe,
    chartType,
    showIndicators,
    marketDataLoading,
    priceChangePercent,
    handleIPOChange,
    setTimeframe,
    setChartType,
    handleToggleIndicator
  } = useTradingState(ipos);

  const isLoading = iposLoading || tradingLoading;

  // Handle notification for IPO change
  const handleIPOChangeWithNotification = (ipoId: string) => {
    const ipo = ipos.find(i => i.id === ipoId);
    if (ipo) {
      handleIPOChange(ipoId);
      showNotification.info(`Switched to ${ipo.symbol} - ${ipo.creatorName}`);
    }
  };

  const handleRefresh = () => {
    showNotification.info("Refreshing market data");
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!selectedIPO) {
    return <NoAssetsState />;
  }

  return (
    <LayoutShell>
      <DashboardShell>
        <TradingDashboard
          ipos={ipos}
          selectedIPO={selectedIPO}
          isLoading={isLoading}
          marketDataLoading={marketDataLoading}
          priceChangePercent={priceChangePercent}
          timeframe={timeframe}
          chartType={chartType}
          showIndicators={showIndicators}
          onSelectIPO={handleIPOChangeWithNotification}
          onTimeframeChange={setTimeframe}
          onChartTypeChange={setChartType}
          onToggleIndicator={handleToggleIndicator}
          onRefresh={handleRefresh}
        />
      </DashboardShell>
    </LayoutShell>
  );
};

export default Trading;
