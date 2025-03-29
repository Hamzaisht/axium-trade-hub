
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CreatorHeader } from "@/components/market/CreatorHeader";
import { LiveChart } from "@/components/market/LiveChart";
import { BuySellSection } from "@/components/market/buy-sell/BuySellSection";
import { OrderBookTable } from "@/components/market/OrderBookTable";
import { TradeHistory } from "@/components/market/TradeHistory";
import { AIInsightsCard } from "@/components/market/AIInsightsCard";
import { MarketFeed } from "@/components/market/MarketFeed";
import { GlassCard } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { showNotification } from "@/components/notifications/ToastContainer";
import { mockIPOAPI } from "@/utils/mockApi";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { useAnomalyDetection, useAnomalyAlerts } from "@/hooks/ai/useAnomalyDetection";
import { useAIValuation } from "@/hooks/ai";
import { AlertCircle, BarChart4, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const aiValuationResult = useAIValuation({
    ipoId: selectedCreator?.id
  });

  const handleCreatorSelect = (id: string) => {
    const creator = ipos.find(ipo => ipo.id === id);
    if (creator) {
      setSelectedCreator(creator);
      showNotification.info(`Selected ${creator.creatorName} ($${creator.symbol})`);
    }
  };

  if (error) {
    return (
      <LayoutShell>
        <div className="flex items-center justify-center min-h-screen bg-[#0A0E17]">
          <div className="text-center max-w-md px-6">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">Connection Error</h2>
            <p className="mb-6 text-[#8A9CCC]">We couldn't connect to the trading servers. Please check your connection and try again.</p>
            <Button onClick={() => window.location.reload()} className="bg-[#3AA0FF] hover:bg-[#2D7DD2] text-white">
              Reconnect
            </Button>
          </div>
        </div>
      </LayoutShell>
    );
  }
  
  return (
    <LayoutShell>
      <DashboardShell>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <BarChart4 className="inline-block mr-2 text-[#3AA0FF]" /> 
                  Trading Terminal
                </h1>
                <p className="text-[#8A9CCC]">Real-time creator token trading with AI-powered insights</p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="border-[#1A2747] text-[#8A9CCC] hover:text-white">
                  <TrendingUp className="h-4 w-4 mr-2 text-[#3AA0FF]" />
                  Market Overview
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="space-y-6">
                <GlassCard className="p-4">
                  <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                  
                  <div className="mt-4 space-y-1.5">
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full bg-[#1A2747]/40" />
                      ))
                    ) : (
                      filteredCreators.map(creator => (
                        <div 
                          key={creator.id}
                          className={`flex items-center p-3 rounded-md cursor-pointer transition-all ${
                            selectedCreator?.id === creator.id 
                              ? 'bg-gradient-to-r from-[#1A2747] to-[#1A2747]/40 border-l-2 border-[#3AA0FF]' 
                              : 'hover:bg-[#1A2747]/40'
                          }`}
                          onClick={() => handleCreatorSelect(creator.id)}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <img 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.creatorName}`}
                              alt={creator.creatorName}
                              className="h-8 w-8 rounded-full bg-[#1A2747] p-0.5"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{creator.creatorName}</div>
                            <div className="text-sm text-[#8A9CCC]">${creator.symbol}</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="font-medium">${creator.currentPrice.toFixed(2)}</div>
                            <div className={`text-xs ${
                              creator.currentPrice > creator.initialPrice 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              {((creator.currentPrice - creator.initialPrice) / creator.initialPrice * 100).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </GlassCard>
                
                <TradeHistory 
                  creatorId={selectedCreator?.id} 
                  symbol={selectedCreator?.symbol} 
                />
                
                <MarketFeed />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-6">
                <CreatorHeader 
                  creator={selectedCreator} 
                  aiValuation={aiValuationResult?.pricePrediction?.targetPrice} 
                />
                
                <GlassCard className="p-4">
                  <LiveChart 
                    creatorId={selectedCreator?.id} 
                    symbol={selectedCreator?.symbol} 
                  />
                </GlassCard>
                
                <GlassCard className="p-4">
                  <BuySellSection 
                    creatorId={selectedCreator?.id} 
                    symbol={selectedCreator?.symbol} 
                    currentPrice={selectedCreator?.currentPrice} 
                  />
                </GlassCard>
              </div>
            </div>
            
            <div className="md:col-span-3 lg:col-span-1">
              <div className="space-y-6">
                <GlassCard className="p-4">
                  <OrderBookTable 
                    creatorId={selectedCreator?.id} 
                    symbol={selectedCreator?.symbol} 
                  />
                </GlassCard>
                
                <GlassCard className="p-4">
                  <AIInsightsCard creatorId={selectedCreator?.id} />
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};

export default Dashboard;
