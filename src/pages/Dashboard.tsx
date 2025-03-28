
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIPO } from "@/contexts/IPOContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DashboardTabs } from "@/components/dashboard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import CreatorsList from "@/components/dashboard/CreatorsList";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";
import PortfolioBreakdown from "@/components/portfolio/PortfolioBreakdown";
import { GlassCard } from "@/components/ui/GlassCard";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Activity, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { ipos, isLoading } = useIPO();
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate market overview data
  const marketOverview = {
    totalMarketCap: 12500000,
    marketCapChange: 3.7,
    averagePrice: 27.82,
    averagePriceChange: 1.9,
    activeCreators: 125,
    activeCreatorsChange: 5.3,
    volume24h: 4620000,
    volumeChange: 8.2
  };

  // Calculate top performers and losers
  const topPerformers = ipos.slice(0, 5).map(ipo => ({
    id: ipo.id,
    creatorName: ipo.creatorName,
    symbol: ipo.symbol,
    currentPrice: ipo.currentPrice,
    priceChange: ipo.priceChange,
  }));

  const topLosers = [...ipos].reverse().slice(0, 5).map(ipo => ({
    id: ipo.id,
    creatorName: ipo.creatorName,
    symbol: ipo.symbol,
    currentPrice: ipo.currentPrice,
    priceChange: -Math.abs(ipo.priceChange),
  }));

  return (
    <div className="min-h-screen bg-axium-gray-100/30">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-axium-gray-600">Welcome back, {user?.name || "User"}!</p>
          </div>
          
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Market Cap"
            value={`$${(marketOverview?.totalMarketCap || 0).toLocaleString()}`}
            change={marketOverview?.marketCapChange || 0}
            icon={<Activity size={20} className="h-5 w-5" />}
          />
          <MetricCard
            title="Avg. Creator Price"
            value={`$${(marketOverview?.averagePrice || 0).toFixed(2)}`}
            change={marketOverview?.averagePriceChange || 0}
            icon={<TrendingUp size={20} className="h-5 w-5" />}
          />
          <MetricCard
            title="Active Creators"
            value={`${marketOverview?.activeCreators || 0}`}
            change={marketOverview?.activeCreatorsChange || 0}
            icon={<Users size={20} className="h-5 w-5" />}
          />
          <MetricCard
            title="24h Volume"
            value={`$${(marketOverview?.volume24h || 0).toLocaleString()}`}
            change={marketOverview?.volumeChange || 0}
            icon={<Activity size={20} className="h-5 w-5" />}
          />
        </div>
        
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <PortfolioOverview />
          <PortfolioBreakdown />
        </div>
        
        {/* Top Performers & Losers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <GlassCard>
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <TrendingUp size={20} className="mr-2 text-green-500" /> Top Performers
              </h2>
              <div className="space-y-5">
                {topPerformers.map((performer) => (
                  <div key={performer.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 mr-3 rounded bg-axium-blue/10 flex items-center justify-center text-axium-blue font-semibold"
                      >
                        {performer.creatorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{performer.creatorName}</p>
                        <p className="text-sm text-axium-gray-500">${performer.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${performer.currentPrice.toFixed(2)}</p>
                      <p className="text-green-500 text-sm flex items-center justify-end">
                        <TrendingUp size={12} className="h-3 w-3 mr-1" />
                        {performer.priceChange.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <TrendingUp size={20} className="mr-2 text-red-500 transform rotate-180" /> Top Losers
              </h2>
              <div className="space-y-5">
                {topLosers.map((loser) => (
                  <div key={loser.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 mr-3 rounded bg-axium-gray-200 flex items-center justify-center text-axium-gray-600 font-semibold"
                      >
                        {loser.creatorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{loser.creatorName}</p>
                        <p className="text-sm text-axium-gray-500">${loser.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${loser.currentPrice.toFixed(2)}</p>
                      <p className="text-red-500 text-sm flex items-center justify-end">
                        <TrendingUp size={12} className="h-3 w-3 mr-1 transform rotate-180" />
                        {Math.abs(loser.priceChange).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
        
        {/* Featured Creators */}
        <CreatorsList />
        
        {/* Market Insights Tabs */}
        <div className="mt-8">
          <DashboardTabs selectedTab="market" onTabChange={() => {}}>
            <div>Market insights content will go here</div>
          </DashboardTabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
