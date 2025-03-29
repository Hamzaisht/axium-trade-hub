
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { mockPortfolioAPI } from "@/utils/mockApi";
import { Briefcase, PieChart, TrendingUp, History, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundFX } from "@/hooks/useSoundFX";

interface PortfolioPosition {
  id: string;
  creatorName: string;
  symbol: string;
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercentage: number;
}

const Portfolio = () => {
  const navigate = useNavigate();
  const { playHover, playClick } = useSoundFX();
  const [activeTab, setActiveTab] = useState("holdings");
  
  const { data: positions = [], isLoading, refetch } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const data = await mockPortfolioAPI.getUserPositions();
      return data;
    },
  });
  
  const totalValue = positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0);
  const totalProfit = positions.reduce((sum, pos) => sum + pos.profitLoss, 0);
  const totalProfitPercentage = (totalProfit / (totalValue - totalProfit)) * 100;
  
  const handleRefresh = () => {
    playClick();
    refetch();
  };
  
  return (
    <LayoutShell>
      <DashboardShell>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {/* Portfolio Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold flex items-center text-gray-900 dark:text-white">
                  <Briefcase className="mr-2 h-8 w-8 text-blue-600 dark:text-[#3AA0FF]" />
                  Portfolio
                </h1>
                <p className="text-gray-600 dark:text-[#8A9CCC]">Manage your creator token investments</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="dark:border-[#1A2747] dark:text-[#8A9CCC] dark:hover:bg-[#1A2747]/50"
                  onClick={handleRefresh}
                  onMouseEnter={playHover}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-[#3AA0FF] dark:hover:bg-[#2D7DD2]"
                  onMouseEnter={playHover}
                  onClick={() => {
                    playClick();
                    navigate('/trading');
                  }}
                >
                  Buy Creators
                </Button>
              </div>
            </motion.div>
            
            {/* Portfolio Summary Cards */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <GlassCard className="p-6 hover-scale">
                <h3 className="text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Total Portfolio Value</h3>
                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">${totalValue.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <div className={`flex items-center ${totalProfit >= 0 ? 'text-green-600 dark:text-[#00C076]' : 'text-red-600 dark:text-[#FF4A60]'}`}>
                    {totalProfit >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span>{Math.abs(totalProfitPercentage).toFixed(2)}%</span>
                  </div>
                  <span className="text-gray-600 dark:text-[#8A9CCC] ml-2 text-sm">All time</span>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6 hover-scale">
                <h3 className="text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Total Profit/Loss</h3>
                <p className={`text-3xl font-bold mt-2 ${totalProfit >= 0 ? 'text-green-600 dark:text-[#00C076]' : 'text-red-600 dark:text-[#FF4A60]'}`}>
                  ${totalProfit.toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <div className="text-gray-600 dark:text-[#8A9CCC] text-sm">
                    <span>From {positions.length} creators</span>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6 hover-scale">
                <h3 className="text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Portfolio Diversity</h3>
                <div className="mt-3 flex gap-1">
                  {positions.slice(0, 8).map((position, index) => (
                    <div 
                      key={position.id}
                      className="h-4 rounded-full" 
                      style={{
                        width: `${Math.max(5, (position.shares * position.currentPrice / totalValue) * 100)}%`,
                        backgroundColor: [
                          'rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 
                          'rgb(139, 92, 246)', 'rgb(236, 72, 153)', 'rgb(239, 68, 68)', 
                          'rgb(168, 85, 247)', 'rgb(14, 165, 233)'
                        ][index % 8]
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-600 dark:text-[#8A9CCC]">Categories</span>
                  <div className="text-blue-600 dark:text-[#3AA0FF] text-sm font-medium cursor-pointer hover:underline" onClick={() => setActiveTab("analytics")}>
                    Analytics →
                  </div>
                </div>
              </GlassCard>
            </motion.div>
            
            {/* Portfolio Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-[#0D1424] p-1">
                  <TabsTrigger 
                    value="holdings" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1A2747] dark:text-white"
                    onClick={() => playClick()}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Holdings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1A2747] dark:text-white"
                    onClick={() => playClick()}
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1A2747] dark:text-white"
                    onClick={() => playClick()}
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="holdings" className="space-y-4">
                      <GlassCard className="overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-[#0C1221]">
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Creator</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Shares</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Avg. Buy</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Current</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">P/L</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Value</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-[#8A9CCC]">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#1A2747]">
                              {isLoading ? (
                                <tr>
                                  <td colSpan={7} className="px-4 py-8 text-center text-gray-600 dark:text-[#8A9CCC]">Loading...</td>
                                </tr>
                              ) : positions.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="px-4 py-8 text-center text-gray-600 dark:text-[#8A9CCC]">
                                    No holdings yet. Start trading to build your portfolio.
                                  </td>
                                </tr>
                              ) : (
                                positions.map((position) => (
                                  <tr 
                                    key={position.id} 
                                    className="hover:bg-gray-50 dark:hover:bg-[#0D1424] transition-colors duration-150 cursor-pointer"
                                    onClick={() => navigate(`/creators/${position.symbol.toLowerCase()}`)}
                                    onMouseEnter={playHover}
                                  >
                                    <td className="px-4 py-4">
                                      <div className="flex items-center">
                                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 dark:bg-[#1A2747] flex items-center justify-center mr-3">
                                          <span className="font-semibold text-blue-700 dark:text-[#3AA0FF]">{position.symbol.charAt(0)}</span>
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-900 dark:text-white">{position.creatorName}</div>
                                          <div className="text-sm text-gray-600 dark:text-[#8A9CCC]">${position.symbol}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-900 dark:text-white">{position.shares.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-right text-gray-900 dark:text-white">${position.averageBuyPrice.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-right text-gray-900 dark:text-white">${position.currentPrice.toFixed(2)}</td>
                                    <td className={`px-4 py-4 text-right font-medium ${
                                      position.profitLoss >= 0 
                                        ? 'text-green-600 dark:text-[#00C076]' 
                                        : 'text-red-600 dark:text-[#FF4A60]'
                                    }`}>
                                      ${Math.abs(position.profitLoss).toFixed(2)}
                                      <span className="block text-xs">
                                        {position.profitLossPercentage >= 0 ? "+" : "-"}
                                        {Math.abs(position.profitLossPercentage).toFixed(2)}%
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-white">
                                      ${(position.shares * position.currentPrice).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                      <Button 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-700 dark:bg-[#3AA0FF] dark:hover:bg-[#2D7DD2]"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          playClick();
                                          navigate('/trading');
                                        }}
                                      >
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        Trade
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </GlassCard>
                      
                      {positions.length > 0 && (
                        <div className="flex justify-end">
                          <Button 
                            variant="outline"
                            className="dark:border-[#1A2747] dark:text-[#8A9CCC] dark:hover:bg-[#1A2747]/50"
                            onMouseEnter={playHover}
                            onClick={() => {
                              playClick();
                              // Export functionality would go here
                            }}
                          >
                            Export CSV
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="history" className="space-y-4">
                      <GlassCard className="p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Transaction History</h3>
                        <p className="text-gray-600 dark:text-[#8A9CCC]">Your recent trades and transactions will appear here.</p>
                        
                        <div className="mt-4 text-center py-12">
                          <TrendingUp className="h-12 w-12 mx-auto text-gray-400 dark:text-[#3A4766] mb-3" />
                          <p className="text-gray-600 dark:text-[#8A9CCC]">No transactions recorded yet.</p>
                          <Button 
                            className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-[#3AA0FF] dark:hover:bg-[#2D7DD2]"
                            onMouseEnter={playHover}
                            onClick={() => {
                              playClick();
                              navigate('/trading');
                            }}
                          >
                            Make your first trade
                          </Button>
                        </div>
                      </GlassCard>
                    </TabsContent>
                    
                    <TabsContent value="analytics" className="space-y-4">
                      <GlassCard className="p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Portfolio Analytics</h3>
                        <p className="text-gray-600 dark:text-[#8A9CCC]">
                          Detailed analytics about your portfolio performance will be displayed here.
                        </p>
                        
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-gray-50 dark:bg-[#0C1221] rounded-lg p-4 border border-gray-200 dark:border-[#1A2747]">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-[#8A9CCC] mb-4">Portfolio Allocation</h4>
                            <div className="h-48 flex items-center justify-center">
                              <PieChart className="h-24 w-24 text-gray-400 dark:text-[#3A4766]" />
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-[#0C1221] rounded-lg p-4 border border-gray-200 dark:border-[#1A2747]">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-[#8A9CCC] mb-4">Performance Over Time</h4>
                            <div className="h-48 flex items-center justify-center">
                              <TrendingUp className="h-24 w-24 text-gray-400 dark:text-[#3A4766]" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-center">
                          <p className="text-gray-600 dark:text-[#8A9CCC] text-sm">
                            Enhanced analytics coming soon. Build your portfolio to see more insights.
                          </p>
                        </div>
                      </GlassCard>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};

export default Portfolio;
