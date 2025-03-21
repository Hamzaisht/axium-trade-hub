
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import PriceChart from "@/components/dashboard/PriceChart";
import VirtualizedOrderBook from "@/components/dashboard/VirtualizedOrderBook";
import AITrendPrediction from "@/components/trading/AITrendPrediction";
import MarketDepthChart from "@/components/trading/MarketDepthChart";
import DividendAndVesting from "@/components/trading/DividendAndVesting";
import VirtualizedTradeHistory from "@/components/trading/VirtualizedTradeHistory";
import SentimentInsights from "@/components/trading/SentimentInsights";
import { ExternalMetricsCard } from "@/components/trading/external-metrics";
import SentimentScoreBadge from "@/components/trading/SentimentScoreBadge";
import RiskAnomalyCenter from "@/components/risk/RiskAnomalyCenter";
import AnomalyWarningBanner from "@/components/risk/AnomalyWarningBanner";
import { useAnomalyDetection, useAnomalyAlerts } from "@/hooks/ai/useAnomalyDetection";
import { 
  TrendingUp, 
  BarChart, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { mockIPOAPI } from "@/utils/mockApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  SearchBar,
  CreatorsList,
  MetricCard,
  DashboardTabs
} from "@/components/dashboard";
import { 
  ChartSkeleton,
  MetricCardSkeleton,
  SentimentInsightsSkeleton
} from "@/components/ui/skeleton-components";
import { Button } from "@/components/ui/button";
import { showNotification } from "@/components/notifications/ToastContainer";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("trading");
  
  const { data: ipos = [], isLoading, error } = useQuery({
    queryKey: ['ipos'],
    queryFn: async () => {
      try {
        return await mockIPOAPI.getAllIPOs();
      } catch (error) {
        console.error("Error fetching IPOs:", error);
        toast.error("Failed to load creators. Please try again.");
        showNotification.error("Failed to load creators. Please try again.");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  
  useEffect(() => {
    if (ipos.length > 0 && !selectedCreator) {
      setSelectedCreator(ipos[0]);
    }
  }, [ipos, selectedCreator]);
  
  const handleCreatorSelect = (id: string) => {
    const creator = ipos.find(ipo => ipo.id === id);
    if (creator) {
      setSelectedCreator(creator);
      showNotification.info(`Selected ${creator.creatorName} ($${creator.symbol})`);
    }
  };
  
  const filteredCreators = ipos.filter(ipo => 
    ipo.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (ipo.symbol && ipo.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const { data: anomalyData } = useAnomalyDetection({
    ipoId: selectedCreator?.id,
    enabled: !!selectedCreator?.id
  });

  useAnomalyAlerts({
    anomalyData,
    enabled: true
  });

  if (error) {
    return (
      <div className="min-h-screen bg-axium-gray-100/30">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-axium-error mb-4" />
              <h2 className="text-2xl font-semibold text-axium-gray-900">Failed to load dashboard</h2>
              <p className="mt-2 text-axium-gray-600">There was an error loading the dashboard data. Please try again later.</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-axium-gray-100/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-axium-gray-900">Trading Dashboard</h1>
              <p className="text-axium-gray-600">Real-time creator token trading with AI-powered insights</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Search Bar */}
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
              />
              
              {/* Creators List */}
              <CreatorsList 
                creators={filteredCreators.map(creator => ({
                  id: creator.id,
                  name: creator.creatorName,
                  symbol: `$${creator.symbol}`,
                  image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.creatorName}`,
                  price: creator.currentPrice,
                  change: ((creator.currentPrice - creator.initialPrice) / creator.initialPrice) * 100,
                  marketCap: creator.currentPrice * (creator.totalSupply - creator.availableSupply),
                  followers: "28.5M",
                  engagement: creator.engagementScore,
                  aiScore: creator.aiScore
                }))}
                selectedCreatorId={selectedCreator?.id}
                onSelectCreator={handleCreatorSelect}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
              
              <div className="space-y-4">
                <VirtualizedTradeHistory 
                  ipoId={selectedCreator?.id} 
                  symbol={selectedCreator?.symbol}
                  limit={5}
                />
              </div>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isLoading ? (
                  <>
                    <MetricCardSkeleton />
                    <MetricCardSkeleton />
                    <MetricCardSkeleton />
                  </>
                ) : (
                  <>
                    <MetricCard
                      title="Market Trend"
                      value="+6.3%"
                      subtitle="24h Change"
                      icon={TrendingUp}
                    />
                    
                    <MetricCard
                      title="Market Volume"
                      value="$24.8M"
                      subtitle="24h Volume"
                      icon={BarChart}
                    />
                    
                    <GlassCard className="sm:col-span-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 rounded-full bg-axium-blue/10">
                          <Sparkles className="h-5 w-5 text-axium-blue" />
                        </div>
                        <h3 className="font-medium">AI Sentiment</h3>
                      </div>
                      <div className="flex items-center">
                        {selectedCreator ? (
                          <SentimentScoreBadge 
                            creatorId={selectedCreator?.id} 
                            size="lg" 
                            className="mt-0.5 mb-0.5"
                          />
                        ) : (
                          <p className="text-2xl font-semibold">Bullish</p>
                        )}
                      </div>
                      <p className="text-axium-gray-600 text-sm">Overall Market</p>
                    </GlassCard>
                  </>
                )}
              </div>
              
              {selectedCreator && (
                <AnomalyWarningBanner ipoId={selectedCreator.id} />
              )}
              
              <DashboardTabs
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
              >
                <TabsContent value="trading" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                      <ChartSkeleton />
                    ) : (
                      <PriceChart 
                        symbol={selectedCreator?.symbol}
                        name={selectedCreator?.creatorName}
                        currentPrice={selectedCreator?.currentPrice}
                        ipoId={selectedCreator?.id}
                      />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {isLoading ? (
                        <>
                          <ChartSkeleton height="300px" />
                          <ChartSkeleton height="300px" />
                        </>
                      ) : (
                        <>
                          <VirtualizedOrderBook 
                            symbol={selectedCreator?.symbol}
                            currentPrice={selectedCreator?.currentPrice}
                            ipoId={selectedCreator?.id}
                          />
                          
                          <div className="space-y-6">
                            <MarketDepthChart 
                              ipoId={selectedCreator?.id}
                              symbol={selectedCreator?.symbol}
                              currentPrice={selectedCreator?.currentPrice}
                            />
                            
                            <VirtualizedTradeHistory 
                              ipoId={selectedCreator?.id} 
                              symbol={selectedCreator?.symbol}
                              limit={10}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sentiment" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                      <SentimentInsightsSkeleton />
                    ) : (
                      <SentimentInsights creatorId={selectedCreator?.id} />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {isLoading ? (
                        <>
                          <ChartSkeleton height="300px" />
                          <ChartSkeleton height="300px" />
                        </>
                      ) : (
                        <>
                          <ExternalMetricsCard creatorId={selectedCreator?.id} />
                          
                          <VirtualizedTradeHistory 
                            ipoId={selectedCreator?.id} 
                            symbol={selectedCreator?.symbol}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                      <ChartSkeleton />
                    ) : (
                      <AITrendPrediction 
                        ipoId={selectedCreator?.id}
                        symbol={selectedCreator?.symbol}
                        currentPrice={selectedCreator?.currentPrice}
                      />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {isLoading ? (
                        <>
                          <ChartSkeleton height="300px" />
                          <ChartSkeleton height="300px" />
                        </>
                      ) : (
                        <>
                          <MarketDepthChart 
                            ipoId={selectedCreator?.id}
                            symbol={selectedCreator?.symbol}
                            currentPrice={selectedCreator?.currentPrice}
                          />
                          
                          <VirtualizedTradeHistory 
                            ipoId={selectedCreator?.id} 
                            symbol={selectedCreator?.symbol}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="risk" className="mt-6">
                  <RiskAnomalyCenter />
                </TabsContent>
                
                <TabsContent value="dividends" className="mt-6 space-y-6">
                  {isLoading ? (
                    <>
                      <ChartSkeleton />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ChartSkeleton height="300px" />
                        <ChartSkeleton height="300px" />
                      </div>
                    </>
                  ) : (
                    <>
                      <DividendAndVesting 
                        ipoId={selectedCreator?.id}
                        symbol={selectedCreator?.symbol}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PriceChart 
                          symbol={selectedCreator?.symbol}
                          name={selectedCreator?.creatorName}
                          currentPrice={selectedCreator?.currentPrice}
                          ipoId={selectedCreator?.id}
                        />
                        
                        <AITrendPrediction 
                          ipoId={selectedCreator?.id}
                          symbol={selectedCreator?.symbol}
                          currentPrice={selectedCreator?.currentPrice}
                        />
                      </div>
                    </>
                  )}
                </TabsContent>
              </DashboardTabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
