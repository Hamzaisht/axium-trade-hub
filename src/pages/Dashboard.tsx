
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import CreatorCard from "@/components/dashboard/CreatorCard";
import PriceChart from "@/components/dashboard/PriceChart";
import OrderBook from "@/components/dashboard/OrderBook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, User, Filter, TrendingUp, BarChart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for creators
const mockCreators = [
  {
    id: "1",
    name: "Emma Watson",
    symbol: "$EMW",
    image: "emma.jpg",
    price: 24.82,
    change: 12.5,
    marketCap: 124100000,
    followers: "28.5M",
    engagement: 82,
    aiScore: 91
  },
  {
    id: "2",
    name: "Zendaya",
    symbol: "$ZEN",
    image: "zendaya.jpg",
    price: 18.40,
    change: 5.2,
    marketCap: 92000000,
    followers: "169M",
    engagement: 75,
    aiScore: 87
  },
  {
    id: "3",
    name: "Tom Holland",
    symbol: "$THLD",
    image: "tom.jpg",
    price: 21.35,
    change: -1.8,
    marketCap: 106800000,
    followers: "75.4M",
    engagement: 68,
    aiScore: 79
  },
  {
    id: "4",
    name: "LeBron James",
    symbol: "$LBJ",
    image: "lebron.jpg",
    price: 56.78,
    change: 3.4,
    marketCap: 283900000,
    followers: "154M",
    engagement: 79,
    aiScore: 93
  },
  {
    id: "5",
    name: "Taylor Swift",
    symbol: "$SWIFT",
    image: "taylor.jpg",
    price: 89.21,
    change: 8.7,
    marketCap: 446050000,
    followers: "267M",
    engagement: 94,
    aiScore: 98
  }
];

// Derived types
type Creator = typeof mockCreators[0];

const Dashboard = () => {
  const [selectedCreator, setSelectedCreator] = useState<Creator>(mockCreators[0]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleCreatorSelect = (id: string) => {
    const creator = mockCreators.find(creator => creator.id === id);
    if (creator) {
      setSelectedCreator(creator);
    }
  };
  
  const filteredCreators = mockCreators.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    creator.symbol.toLowerCase().includes(searchQuery.toLowerCase())
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
                {filteredCreators.map(creator => (
                  <CreatorCard 
                    key={creator.id} 
                    creator={creator} 
                    onSelect={handleCreatorSelect}
                    selected={selectedCreator.id === creator.id}
                  />
                ))}
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
              
              <PriceChart 
                symbol={selectedCreator.symbol}
                name={selectedCreator.name}
                currentPrice={selectedCreator.price}
              />
              
              <OrderBook 
                symbol={selectedCreator.symbol}
                currentPrice={selectedCreator.price}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
