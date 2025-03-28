
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIPO } from '@/contexts/IPOContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart } from '@/components/charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { useAIValuationEngine } from '@/hooks/ai/useAIValuationEngine';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  Music, 
  DollarSign, 
  Heart,
  Users,
  Briefcase,
  Refresh,
  Info,
  Settings
} from 'lucide-react';
import { formatDate, formatCurrency, formatNumber } from '@/lib/formatters';
import { ValuationBreakdownChart } from '@/components/ai-insights/ValuationBreakdownChart';
import { MarketMoversTable } from '@/components/ai-insights/MarketMoversTable';
import { HistoricalPerformanceChart } from '@/components/ai-insights/HistoricalPerformanceChart';
import { MetricsPanel } from '@/components/ai-insights/MetricsPanel';

const AIInsights = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ipos, getIPOById } = useIPO();
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(id);
  const [timeframe, setTimeframe] = useState('1d');
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    valuation,
    isLoading,
    isError,
    refetch,
    isRealTimeEnabled,
    toggleRealTime,
    rawMetrics
  } = useAIValuationEngine(selectedAsset, timeframe);
  
  // If no ID is specified in URL, use the first IPO
  useEffect(() => {
    if (!id && ipos.length > 0) {
      navigate(`/ai-insights/${ipos[0].id}`);
    }
  }, [id, ipos, navigate]);
  
  // Update selected asset when ID changes
  useEffect(() => {
    if (id) {
      setSelectedAsset(id);
    }
  }, [id]);
  
  // Get the current IPO details
  const currentIPO = getIPOById(selectedAsset || '');
  
  // Handle asset selection change
  const handleAssetChange = (value: string) => {
    navigate(`/ai-insights/${value}`);
  };
  
  if (!currentIPO) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-axium-gray-100/30 pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">AI Insights Dashboard</h1>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-axium-blue border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-axium-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Creator Selected</h2>
                <p className="text-axium-gray-600 mb-6">Please select a creator to view AI insights</p>
                {ipos.length > 0 ? (
                  <Select onValueChange={handleAssetChange}>
                    <SelectTrigger className="w-[300px] mx-auto">
                      <SelectValue placeholder="Select a creator" />
                    </SelectTrigger>
                    <SelectContent>
                      {ipos.map((ipo) => (
                        <SelectItem key={ipo.id} value={ipo.id}>
                          {ipo.symbol} - {ipo.creatorName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-axium-gray-500">No creators available</p>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-axium-gray-100/10 to-axium-gray-100/30 dark:from-axium-gray-800/20 dark:to-axium-gray-900/40 min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">AI Insights Dashboard</h1>
              <p className="text-axium-gray-600">Advanced AI analysis and valuation breakdown</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedAsset} onValueChange={handleAssetChange}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select a creator" />
                </SelectTrigger>
                <SelectContent>
                  {ipos.map((ipo) => (
                    <SelectItem key={ipo.id} value={ipo.id}>
                      {ipo.symbol} - {ipo.creatorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="gap-2"
              >
                <Refresh className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              
              <Button 
                variant={isRealTimeEnabled ? "default" : "outline"} 
                size="sm" 
                onClick={toggleRealTime}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isRealTimeEnabled ? "Disable Real-time" : "Enable Real-time"}
                </span>
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <GlassCard key={i} className="p-6 h-40 animate-pulse">
                  <div className="w-1/3 h-4 mb-4 bg-axium-gray-300 rounded"></div>
                  <div className="w-1/2 h-8 mb-2 bg-axium-gray-300 rounded"></div>
                  <div className="w-1/4 h-4 bg-axium-gray-300 rounded"></div>
                </GlassCard>
              ))}
              
              <GlassCard className="p-6 md:col-span-3 h-80 animate-pulse">
                <div className="w-1/4 h-6 mb-8 bg-axium-gray-300 rounded"></div>
                <div className="w-full h-64 bg-axium-gray-300 rounded"></div>
              </GlassCard>
            </div>
          ) : isError ? (
            <GlassCard className="p-6 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading AI Insights</h2>
              <p className="text-axium-gray-600 mb-6">We couldn't load the AI valuation data for this creator</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </GlassCard>
          ) : (
            <>
              {valuation && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <GlassCard className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-axium-gray-600">Current Valuation</div>
                        <div className="text-xs bg-axium-gray-200 px-2 py-0.5 rounded-full">
                          {isRealTimeEnabled ? "Live" : "Static"}
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <div className="text-3xl font-semibold">${valuation.currentPrice.toFixed(2)}</div>
                        <div className={`text-sm ml-2 ${valuation.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {valuation.priceChangePercent >= 0 ? (
                            <span className="flex items-center">
                              <ArrowUpRight className="h-3 w-3 mr-0.5" />
                              {valuation.priceChangePercent.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <ArrowDownRight className="h-3 w-3 mr-0.5" />
                              {Math.abs(valuation.priceChangePercent).toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-axium-gray-500 mt-1">
                        Last updated: {formatDate(new Date(valuation.lastUpdated))}
                      </div>
                    </GlassCard>
                    
                    <GlassCard className="p-6">
                      <div className="text-sm text-axium-gray-600 mb-2">Risk Assessment</div>
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-xs text-axium-gray-500">Confidence</div>
                          <div className="flex items-baseline">
                            <div className="text-2xl font-medium">{(valuation.confidence * 100).toFixed(0)}%</div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 ml-1 text-axium-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs max-w-[200px]">
                                    AI confidence in valuation accuracy based on available data quality and consistency
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-axium-gray-500">Volatility</div>
                          <div className="flex items-baseline">
                            <div className="text-2xl font-medium">{(valuation.volatility * 100).toFixed(1)}%</div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 ml-1 text-axium-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs max-w-[200px]">
                                    Expected price fluctuation based on historical performance and market conditions
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs text-axium-gray-500">Market Stability</div>
                        <div className="h-2 w-full bg-axium-gray-200 rounded-full mt-1">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
                            style={{ width: `${valuation.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </GlassCard>
                    
                    <GlassCard className="p-6">
                      <div className="text-sm text-axium-gray-600 mb-2">Key Metrics</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-axium-gray-500 flex items-center">
                            <Users className="h-3 w-3 mr-1" /> Social Influence
                          </div>
                          <div className="text-lg font-medium">
                            {(valuation.valuationBreakdown.socialInfluence.value).toFixed(1)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-axium-gray-500 flex items-center">
                            <Music className="h-3 w-3 mr-1" /> Streaming
                          </div>
                          <div className="text-lg font-medium">
                            {(valuation.valuationBreakdown.streamingInfluence.value).toFixed(1)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-axium-gray-500 flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" /> Brand Deals
                          </div>
                          <div className="text-lg font-medium">
                            {(valuation.valuationBreakdown.brandDealsInfluence.value).toFixed(1)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-axium-gray-500 flex items-center">
                            <Heart className="h-3 w-3 mr-1" /> Sentiment
                          </div>
                          <div className="text-lg font-medium">
                            {(valuation.valuationBreakdown.sentimentInfluence.value).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
                      <TabsTrigger value="overview" className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" /> Overview
                      </TabsTrigger>
                      <TabsTrigger value="valuation" className="flex items-center gap-1">
                        <PieChartIcon className="h-4 w-4" /> Valuation Breakdown
                      </TabsTrigger>
                      <TabsTrigger value="history" className="flex items-center gap-1">
                        <LineChartIcon className="h-4 w-4" /> Historical Data
                      </TabsTrigger>
                      <TabsTrigger value="marketMovers" className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" /> Market Movers
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <ValuationBreakdownChart 
                        valuationBreakdown={valuation.valuationBreakdown}
                        className="lg:col-span-2"
                      />
                      <MarketMoversTable marketMovers={valuation.marketMovers} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="valuation" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <MetricsPanel 
                        metrics={valuation.valuationBreakdown}
                        className="lg:col-span-1"
                      />
                      <GlassCard className="p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Detailed Valuation Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Globe className="h-4 w-4 mr-1 text-blue-500" /> Social Media Influence
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(valuation.valuationBreakdown.socialInfluence.breakdown).map(([platform, value]) => (
                                <div key={platform} className="flex justify-between items-center">
                                  <div className="text-sm capitalize">{platform}</div>
                                  <div className="text-sm">{value.toFixed(1)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Music className="h-4 w-4 mr-1 text-purple-500" /> Streaming Platforms
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(valuation.valuationBreakdown.streamingInfluence.breakdown).map(([platform, value]) => (
                                <div key={platform} className="flex justify-between items-center">
                                  <div className="text-sm capitalize">{platform}</div>
                                  <div className="text-sm">{formatNumber(value)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-green-500" /> Financial Metrics
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(valuation.valuationBreakdown.financialInfluence.breakdown).map(([metric, value]) => (
                                <div key={metric} className="flex justify-between items-center">
                                  <div className="text-sm capitalize">
                                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                                  </div>
                                  <div className="text-sm">
                                    {metric === 'ownedCompanies' 
                                      ? value 
                                      : formatCurrency(value)
                                    }
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-red-500" /> Other Factors
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="text-sm">Brand Deals Value</div>
                                <div className="text-sm">{valuation.valuationBreakdown.brandDealsInfluence.value.toFixed(1)}</div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm">Sentiment Score</div>
                                <div className="text-sm">{valuation.valuationBreakdown.sentimentInfluence.value.toFixed(1)}</div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm">Fan Engagement</div>
                                <div className="text-sm">{valuation.valuationBreakdown.fanEngagementInfluence.value.toFixed(1)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-0">
                    <div className="grid grid-cols-1 gap-6">
                      <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Historical Performance</h3>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant={timeframe === "1m" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => setTimeframe("1m")}
                            >
                              1M
                            </Button>
                            <Button 
                              variant={timeframe === "5m" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => setTimeframe("5m")}
                            >
                              5M
                            </Button>
                            <Button 
                              variant={timeframe === "15m" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => setTimeframe("15m")}
                            >
                              15M
                            </Button>
                            <Button 
                              variant={timeframe === "1h" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => setTimeframe("1h")}
                            >
                              1H
                            </Button>
                            <Button 
                              variant={timeframe === "1d" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => setTimeframe("1d")}
                            >
                              1D
                            </Button>
                            <Button 
                              variant={timeframe === "1w" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => setTimeframe("1w")}
                            >
                              1W
                            </Button>
                            <Button 
                              variant={timeframe === "1mo" ? "default" : "outline"} 
                              size="sm" 
                              onClick={() => setTimeframe("1mo")}
                            >
                              1M
                            </Button>
                          </div>
                        </div>
                        <HistoricalPerformanceChart 
                          historicalData={valuation.historicalPrices}
                          timeframe={timeframe}
                        />
                      </GlassCard>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="marketMovers" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <GlassCard className="p-6 lg:col-span-3">
                        <h3 className="text-lg font-semibold mb-4">What Moved The Market Today</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-axium-gray-200">
                                <th className="text-left py-2 px-4 font-medium text-axium-gray-600">Factor</th>
                                <th className="text-left py-2 px-4 font-medium text-axium-gray-600">Impact</th>
                                <th className="text-left py-2 px-4 font-medium text-axium-gray-600">Description</th>
                                <th className="text-left py-2 px-4 font-medium text-axium-gray-600">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {valuation.marketMovers.map((mover, index) => (
                                <tr key={index} className="border-b border-axium-gray-200/50">
                                  <td className="py-3 px-4">{mover.factor}</td>
                                  <td className="py-3 px-4">
                                    <span className={`flex items-center ${mover.impact >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {mover.impact >= 0 ? (
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4 mr-1" />
                                      )}
                                      {Math.abs(mover.impact).toFixed(2)}%
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">{mover.description}</td>
                                  <td className="py-3 px-4 text-axium-gray-500">
                                    {formatDate(new Date(mover.timestamp))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </GlassCard>
                    </div>
                  </TabsContent>
                </>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIInsights;
