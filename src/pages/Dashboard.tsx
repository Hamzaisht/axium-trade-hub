import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CreatorHeader } from "@/components/market/CreatorHeader";
import { LiveChart } from "@/components/market/LiveChart";
import { BuySellSection } from "@/components/market/BuySellSection";
import { OrderBookTable } from "@/components/market/OrderBookTable";
import { TradeHistory } from "@/components/market/TradeHistory";
import { AIInsightsCard } from "@/components/market/AIInsightsCard";
import { MarketFeed } from "@/components/market/MarketFeed";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { showNotification } from "@/components/notifications/ToastContainer";
import { mockIPOAPI } from "@/utils/mockApi";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { useAnomalyDetection, useAnomalyAlerts } from "@/hooks/ai/useAnomalyDetection";
import { useAIValuation } from "@/hooks/ai";
import { AlertCircle } from "lucide-react";
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
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-axium-error mb-4" />
          <h2 className="text-2xl font-semibold text-axium-gray-900">Failed to load dashboard</h2>
          <p className="mt-2 text-axium-gray-600">There was an error loading the dashboard data. Please try again later.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </LayoutShell>
    );
  }
  
  return (
    <LayoutShell>
      <DashboardShell>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-axium-gray-900">Trading Dashboard</h1>
            <p className="text-axium-gray-600">Real-time creator token trading with AI-powered insights</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="space-y-6">
                <GlassCard>
                  <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                  
                  <div className="mt-4 space-y-2">
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))
                    ) : (
                      filteredCreators.map(creator => (
                        <div 
                          key={creator.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedCreator?.id === creator.id 
                              ? 'bg-primary/10 border border-primary/20' 
                              : 'hover:bg-accent'
                          }`}
                          onClick={() => handleCreatorSelect(creator.id)}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <img 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.creatorName}`}
                              alt={creator.creatorName}
                              className="h-8 w-8 rounded-full"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{creator.creatorName}</div>
                            <div className="text-sm text-muted-foreground">${creator.symbol}</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="font-medium">${creator.currentPrice.toFixed(2)}</div>
                            <div className={`text-xs ${
                              creator.currentPrice > creator.initialPrice 
                                ? 'text-axium-positive' 
                                : 'text-axium-negative'
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
                
                <LiveChart 
                  creatorId={selectedCreator?.id} 
                  symbol={selectedCreator?.symbol} 
                />
                
                <BuySellSection 
                  creatorId={selectedCreator?.id} 
                  symbol={selectedCreator?.symbol} 
                  currentPrice={selectedCreator?.currentPrice} 
                />
              </div>
            </div>
            
            <div className="md:col-span-3 lg:col-span-1">
              <div className="space-y-6">
                <OrderBookTable 
                  creatorId={selectedCreator?.id} 
                  symbol={selectedCreator?.symbol} 
                />
                
                <AIInsightsCard creatorId={selectedCreator?.id} />
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};

export default Dashboard;
