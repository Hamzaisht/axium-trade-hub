
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import CreatorCard from "@/components/dashboard/CreatorCard";
import PriceChart from "@/components/dashboard/PriceChart";
import OrderBook from "@/components/dashboard/OrderBook";
import AITrendPrediction from "@/components/trading/AITrendPrediction";
import MarketDepthChart from "@/components/trading/MarketDepthChart";
import DividendAndVesting from "@/components/trading/DividendAndVesting";
import LiveTrades from "@/components/trading/LiveTrades";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Bell, User, Filter, TrendingUp, 
  BarChart, Sparkles, CircleDollarSign, BrainCircuit 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockIPOAPI } from "@/utils/mockApi";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("trading");
  
  // Fetch IPOs
  const { data: ipos = [], isLoading } = useQuery({
    queryKey: ['ipos'],
    queryFn: mockIPOAPI.getAllIPOs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  
  // Set the first creator as default when data loads
  useEffect(() => {
    if (ipos.length > 0 && !selectedCreator) {
      setSelectedCreator(ipos[0]);
    }
  }, [ipos, selectedCreator]);
  
  const handleCreatorSelect = (id: string) => {
    const creator = ipos.find(ipo => ipo.id === id);
    if (creator) {
      setSelectedCreator(creator);
    }
  };
  
  const filteredCreators = ipos.filter(ipo => 
    ipo.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ipo.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
            
            <div className="flex space-x-2 mt-4 lg:mt-0">
              <Button variant="outline" size="icon" className="bg-white">
                <Bell className="h-5 w-5 text-axium-gray-600" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white">
                <User className="h-5 w-5 text-axium-gray-600" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <GlassCard className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-axium-gray-500" />
                  <Input 
                    placeholder="Search creators or symbols" 
                    className="pl-9 pr-3 py-2 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </GlassCard>
              
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-axium-gray-800">Top Creators</h2>
                <Button variant="ghost" size="sm" className="px-2 text-axium-gray-600 hover:text-axium-blue">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeleton
                  Array(5).fill(0).map((_, idx) => (
                    <div key={idx} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))
                ) : filteredCreators.length > 0 ? (
                  filteredCreators.map(creator => (
                    <CreatorCard 
                      key={creator.id} 
                      creator={{
                        id: creator.id,
                        name: creator.creatorName,
                        symbol: `$${creator.symbol}`,
                        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.creatorName}`,
                        price: creator.currentPrice,
                        change: ((creator.currentPrice - creator.initialPrice) / creator.initialPrice) * 100,
                        marketCap: creator.currentPrice * (creator.totalSupply - creator.availableSupply),
                        followers: "28.5M", // This would come from real data
                        engagement: creator.engagementScore,
                        aiScore: creator.aiScore
                      }} 
                      onSelect={handleCreatorSelect}
                      selected={selectedCreator?.id === creator.id}
                    />
                  ))
                ) : (
                  <div className="text-center py-6 text-axium-gray-500">
                    <p>No creators found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <LiveTrades 
                  ipoId={selectedCreator?.id} 
                  symbol={selectedCreator?.symbol}
                  limit={5}
                />
              </div>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="sm:col-span-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-full bg-axium-blue/10">
                      <TrendingUp className="h-5 w-5 text-axium-blue" />
                    </div>
                    <h3 className="font-medium">Market Trend</h3>
                  </div>
                  <p className="text-2xl font-semibold">+6.3%</p>
                  <p className="text-axium-gray-600 text-sm">24h Change</p>
                </GlassCard>
                
                <GlassCard className="sm:col-span-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-full bg-axium-blue/10">
                      <BarChart className="h-5 w-5 text-axium-blue" />
                    </div>
                    <h3 className="font-medium">Market Volume</h3>
                  </div>
                  <p className="text-2xl font-semibold">$24.8M</p>
                  <p className="text-axium-gray-600 text-sm">24h Volume</p>
                </GlassCard>
                
                <GlassCard className="sm:col-span-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-full bg-axium-blue/10">
                      <Sparkles className="h-5 w-5 text-axium-blue" />
                    </div>
                    <h3 className="font-medium">AI Sentiment</h3>
                  </div>
                  <p className="text-2xl font-semibold">Bullish</p>
                  <p className="text-axium-gray-600 text-sm">Overall Market</p>
                </GlassCard>
              </div>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="w-full bg-axium-gray-100 p-1">
                  <TabsTrigger value="trading" className="flex-1 data-[state=active]:bg-white">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trading
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex-1 data-[state=active]:bg-white">
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    AI Insights
                  </TabsTrigger>
                  <TabsTrigger value="dividends" className="flex-1 data-[state=active]:bg-white">
                    <CircleDollarSign className="h-4 w-4 mr-2" />
                    Smart Contract
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="trading" className="mt-6 space-y-6">
                  <PriceChart 
                    symbol={selectedCreator?.symbol}
                    name={selectedCreator?.creatorName}
                    currentPrice={selectedCreator?.currentPrice}
                    ipoId={selectedCreator?.id}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrderBook 
                      symbol={selectedCreator?.symbol}
                      currentPrice={selectedCreator?.currentPrice}
                    />
                    
                    <MarketDepthChart 
                      ipoId={selectedCreator?.id}
                      symbol={selectedCreator?.symbol}
                      currentPrice={selectedCreator?.currentPrice}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <AITrendPrediction 
                      ipoId={selectedCreator?.id}
                      symbol={selectedCreator?.symbol}
                      currentPrice={selectedCreator?.currentPrice}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MarketDepthChart 
                        ipoId={selectedCreator?.id}
                        symbol={selectedCreator?.symbol}
                        currentPrice={selectedCreator?.currentPrice}
                      />
                      
                      <LiveTrades 
                        ipoId={selectedCreator?.id} 
                        symbol={selectedCreator?.symbol}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="dividends" className="mt-6 space-y-6">
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
