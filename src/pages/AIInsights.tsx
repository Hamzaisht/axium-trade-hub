
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIPO } from '@/contexts/IPOContext';
import { useAIValuationEngine } from '@/hooks/ai/useAIValuationEngine';
import { useSocialSentiment } from '@/hooks/ai/useSocialSentiment';
import { useCreatorMarketScore } from '@/hooks/ai/useCreatorMarketScore';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Info,
  AlertTriangle,
  Loader2,
  FileType,
  Users,
  TrendingUp,
  Radio,
  Zap,
  Twitter,
  Instagram,
  Youtube,
  DollarSign,
  Layers,
  TrendingDown,
  Heart,
  Check,
  X,
  Brain,
  BarChart4,
  LineChart,
  PieChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { ValuationBreakdownChart } from '@/components/ai-insights/ValuationBreakdownChart';
import { HistoricalPerformanceChart } from '@/components/ai-insights/HistoricalPerformanceChart';
import { MarketMoversTable } from '@/components/ai-insights/MarketMoversTable'; 
import { MetricsPanel } from '@/components/ai-insights/MetricsPanel';

const AIInsights = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ipos, findIPO } = useIPO();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  
  // Find creator data from id param or use first creator
  const selectedIPO = id ? findIPO(id) : ipos[0];
  
  const {
    valuation,
    isLoading,
    isError,
    error,
    refetch,
    toggleRealTime,
    isRealTimeEnabled,
    rawMetrics
  } = useAIValuationEngine(selectedIPO?.id);
  
  // Get social sentiment data
  const { sentimentData, isLoading: isSentimentLoading } = useSocialSentiment({ creatorId: selectedIPO?.id || '' });
  
  // Get creator market score
  const { score: creatorScore, isLoading: isScoreLoading } = useCreatorMarketScore(selectedIPO?.id || '');
  
  // Handle navigation to different creator
  const handleCreatorChange = (creatorId: string) => {
    navigate(`/ai-insights/${creatorId}`);
  };
  
  // Historical performance mock data
  const generateHistoricalData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Base value around current price with some fluctuation
      const basePrice = selectedIPO?.currentPrice || 20;
      const rangePercent = 0.15; // 15% range
      
      // More volatility in the middle, more stable at ends
      const volatilityFactor = Math.sin((i / 30) * Math.PI) * 0.6 + 0.4;
      const randomFactor = (Math.random() * 2 - 1) * rangePercent * volatilityFactor;
      
      // Create a trend direction (up or down)
      const trendDirection = i > 15 ? -1 : 1; // down then up
      const trendFactor = (Math.abs(i - 15) / 15) * 0.1 * trendDirection;
      
      // Combine factors
      const priceFactor = 1 + randomFactor + trendFactor;
      const price = basePrice * priceFactor;
      
      // Confidence is higher in the middle of the range
      const confidence = Math.max(0.6, Math.min(0.9, 0.75 + randomFactor));
      
      data.push({
        timestamp: date.toISOString(),
        price: price,
        confidence: confidence
      });
    }
    
    return data;
  };
  
  const historicalData = generateHistoricalData();
  
  if (isLoading || isSentimentLoading || isScoreLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-axium-gray-100/50 to-axium-gray-200/50 dark:from-axium-gray-900/50 dark:to-axium-gray-800/50">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-axium-blue mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Loading AI Insights</h2>
              <p className="text-axium-gray-600 dark:text-axium-gray-400 max-w-md">
                Our AI models are analyzing the latest data to provide you with valuable insights...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError || !valuation || !selectedIPO) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-axium-gray-100/50 to-axium-gray-200/50 dark:from-axium-gray-900/50 dark:to-axium-gray-800/50">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Unable to Load AI Insights</h2>
              <p className="text-axium-gray-600 dark:text-axium-gray-400 max-w-md mb-6">
                {error instanceof Error ? error.message : "There was an error loading the AI insights. Please try again later."}
              </p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Extract data from valuation result
  const {
    currentPrice,
    previousPrice,
    predictedPrice,
    priceChange,
    priceChangePercent,
    valuationBreakdown,
    newsEvents,
    marketMovers
  } = valuation;
  
  const isPositiveChange = priceChangePercent >= 0;
  const formattedPriceChange = `${isPositiveChange ? '+' : ''}${priceChangePercent.toFixed(2)}%`;
  
  // Format market score for display
  const formatMarketScore = (score: number) => {
    if (score >= 90) return { text: 'Exceptional', color: 'text-green-500' };
    if (score >= 80) return { text: 'Excellent', color: 'text-green-500' };
    if (score >= 70) return { text: 'Very Good', color: 'text-green-400' };
    if (score >= 60) return { text: 'Good', color: 'text-blue-500' };
    if (score >= 50) return { text: 'Average', color: 'text-blue-400' };
    if (score >= 40) return { text: 'Below Average', color: 'text-amber-500' };
    if (score >= 30) return { text: 'Concerning', color: 'text-orange-500' };
    return { text: 'Poor', color: 'text-red-500' };
  };
  
  const marketScoreDisplay = formatMarketScore(creatorScore?.overall || 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-axium-gray-100/50 to-axium-gray-200/50 dark:from-axium-gray-900/50 dark:to-axium-gray-800/50">
      <Navbar />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Brain className="h-7 w-7 mr-2 text-axium-blue" />
              AI Insights
            </h1>
            <p className="text-axium-gray-600 dark:text-axium-gray-400 mt-1">
              Advanced analysis and valuations powered by Axium's neural network
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isRealTimeEnabled}
                onCheckedChange={toggleRealTime}
                id="real-time-mode"
              />
              <label
                htmlFor="real-time-mode"
                className="text-sm font-medium cursor-pointer"
              >
                Real-time updates
              </label>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-5 lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{selectedIPO.creatorName}</h2>
                  <Badge variant="outline" className="uppercase text-xs font-semibold">
                    {selectedIPO.category}
                  </Badge>
                </div>
                <p className="text-axium-gray-600 dark:text-axium-gray-400 text-sm">
                  IPO Date: {new Date(selectedIPO.ipoDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">${currentPrice.toFixed(2)}</span>
                  <Badge 
                    className={`flex items-center ${isPositiveChange ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}
                  >
                    {isPositiveChange ? 
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> : 
                      <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                    }
                    {formattedPriceChange}
                  </Badge>
                </div>
                <p className="text-axium-gray-600 dark:text-axium-gray-400 text-sm">
                  AI Valuation: ${predictedPrice.toFixed(2)}
                </p>
              </div>
            </div>
            
            {/* Market Score Banner */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-axium-gray-100/50 dark:bg-axium-gray-800/50 p-4 rounded-lg mb-5">
              <div className="flex items-center">
                <div className="hidden sm:block mr-4">
                  <div className="h-16 w-16 rounded-full bg-axium-gray-200/80 dark:bg-axium-gray-700/80 flex items-center justify-center border-4 border-white dark:border-axium-gray-800 shadow-md">
                    <span className="text-lg font-bold">
                      {Math.round(creatorScore?.overall || 0)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-lg mr-2">Creator Market Score</h3>
                    <Badge variant="outline" className={`${marketScoreDisplay.color}`}>
                      {marketScoreDisplay.text}
                    </Badge>
                  </div>
                  <p className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                    Composite score based on market potential, social reach, engagement metrics and sentiment analysis
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                {sentimentData?.platforms && Object.entries(sentimentData.platforms).slice(0, 3).map(([platform, data]) => (
                  <div key={platform} className="bg-white dark:bg-axium-gray-900/90 p-2 rounded-lg shadow-sm flex items-center gap-2">
                    {platform === 'twitter' ? (
                      <Twitter className="h-4 w-4 text-blue-400" />
                    ) : platform === 'instagram' ? (
                      <Instagram className="h-4 w-4 text-pink-500" />
                    ) : (
                      <Youtube className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="text-xs uppercase font-semibold">
                        {platform}
                      </div>
                      <div className="flex items-center">
                        {data.sentiment > 65 ? (
                          <Heart className="h-3 w-3 text-green-500 mr-1" />
                        ) : data.sentiment > 45 ? (
                          <Check className="h-3 w-3 text-blue-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className="text-xs">
                          {Math.round(data.sentiment as unknown as number)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="performance" className="text-sm">Performance</TabsTrigger>
                <TabsTrigger value="factors" className="text-sm">Valuation Factors</TabsTrigger>
                <TabsTrigger value="news" className="text-sm">News & Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Historical Performance</h3>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" className={selectedTimeframe === '24h' ? 'bg-axium-blue text-white' : ''} onClick={() => setSelectedTimeframe('24h')}>24h</Button>
                      <Button variant="outline" size="sm" className={selectedTimeframe === '7d' ? 'bg-axium-blue text-white' : ''} onClick={() => setSelectedTimeframe('7d')}>7d</Button>
                      <Button variant="outline" size="sm" className={selectedTimeframe === '30d' ? 'bg-axium-blue text-white' : ''} onClick={() => setSelectedTimeframe('30d')}>30d</Button>
                    </div>
                  </div>
                  <HistoricalPerformanceChart 
                    historicalData={historicalData} 
                    timeframe={selectedTimeframe}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="factors">
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">Valuation Breakdown</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <ValuationBreakdownChart 
                        data={valuationBreakdown}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Factor Weights & Contributions</h4>
                        {valuationBreakdown.map((factor) => (
                          <div key={factor.name} className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                {factor.name === 'Social Reach' && <Users className="h-3.5 w-3.5 mr-1.5 text-blue-500" />}
                                {factor.name === 'Engagement' && <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />}
                                {factor.name === 'Growth Rate' && <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-500" />}
                                {factor.name === 'Revenue Potential' && <DollarSign className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />}
                                {factor.name === 'Content Quality' && <Layers className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />}
                                {factor.name === 'Market Sentiment' && <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500" />}
                                <span className="text-sm">{factor.name}</span>
                              </div>
                              <div className="text-sm font-medium">{factor.value}%</div>
                            </div>
                            <Progress value={factor.value} max={100} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                      
                      {sentimentData?.trust && (
                        <div className="bg-axium-gray-100/70 dark:bg-axium-gray-800/70 p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Info className="h-3.5 w-3.5 mr-1.5 text-axium-blue" />
                            AI Confidence & Trust Score
                          </h4>
                          <div className="flex items-center mb-1">
                            <div className="text-lg font-bold mr-2">{sentimentData.trust}/100</div>
                            <Badge variant={sentimentData.trust > 70 ? 'outline' : 'secondary'}>
                              {sentimentData.trust > 70 ? 'High Trust' : 'Moderate Trust'}
                            </Badge>
                          </div>
                          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400">
                            Our AI model's confidence in this valuation based on data quality, quantity, consistency, and external validation.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="news">
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">What's Moving the Market</h3>
                  <div className="space-y-3">
                    {newsEvents.length > 0 ? newsEvents.map((event, idx) => (
                      <div key={idx} className="flex bg-axium-gray-100/70 dark:bg-axium-gray-800/70 p-3 rounded-lg">
                        <div className={`flex flex-shrink-0 items-center justify-center h-10 w-10 rounded-full mr-3 ${
                          event.impact > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {event.impact > 0 ? (
                            <TrendingUp className={`h-5 w-5 text-green-500`} />
                          ) : (
                            <TrendingDown className={`h-5 w-5 text-red-500`} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <Badge className="ml-2" variant={event.impact > 0 ? 'default' : 'destructive'}>
                              {event.impact > 0 ? '+' : ''}{event.impact.toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mt-1">
                            {event.description}
                          </p>
                          <div className="flex items-center mt-1.5">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {event.source}
                            </Badge>
                            <span className="text-[10px] text-axium-gray-500 dark:text-axium-gray-500 ml-2">
                              {event.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-axium-gray-500">
                        <FileType className="h-12 w-12 mx-auto mb-3 opacity-40" />
                        <p>No significant news events detected in the current time period</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
          
          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Metrics Panel */}
            <MetricsPanel 
              metrics={rawMetrics}
              symbol={selectedIPO.symbol}
            />
            
            {/* Market Movers */}
            <GlassCard className="p-5">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <BarChart4 className="h-5 w-5 mr-2 text-axium-blue" />
                Market Movers
              </h3>
              <MarketMoversTable 
                data={marketMovers} 
                onSelectCreator={handleCreatorChange}
              />
            </GlassCard>
          </div>
        </div>
        
        {/* Bottom Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-axium-blue" />
              AI Prediction
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Undervalued</span>
                <span>Overvalued</span>
              </div>
              <div className="h-2 bg-axium-gray-200 dark:bg-axium-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    predictedPrice > currentPrice ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(
                      100, 
                      Math.abs((predictedPrice - currentPrice) / currentPrice * 100) * 5
                    )}%`,
                    marginLeft: predictedPrice > currentPrice ? '0' : 'auto'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-axium-gray-100/70 dark:bg-axium-gray-800/70 p-3 rounded-lg mb-4">
              <div className="flex items-center">
                {predictedPrice > currentPrice ? (
                  <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500 mr-3" />
                )}
                <div>
                  <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                    AI Prediction
                  </div>
                  <div className="text-xl font-bold">
                    ${predictedPrice.toFixed(2)}
                  </div>
                </div>
              </div>
              <div>
                <Badge className={`${
                  predictedPrice > currentPrice ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                }`}>
                  {predictedPrice > currentPrice ? '+' : ''}
                  {((predictedPrice - currentPrice) / currentPrice * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
              Our AI model predicts this creator is <span className={`font-semibold ${
                predictedPrice > currentPrice ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {predictedPrice > currentPrice ? 'undervalued' : 'overvalued'}
              </span> based on current market conditions, social metrics, and projected earnings.
            </p>
          </GlassCard>
          
          <GlassCard className="p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-axium-blue" />
              Growth Metrics
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Follower Growth (30d)</span>
                  <span className="font-medium">+{(Math.random() * 10 + 5).toFixed(1)}%</span>
                </div>
                <Progress value={63} max={100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement Rate</span>
                  <span className="font-medium">{(Math.random() * 5 + 2).toFixed(1)}%</span>
                </div>
                <Progress value={42} max={100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Content Production</span>
                  <span className="font-medium">+{(Math.random() * 15 + 5).toFixed(1)}%</span>
                </div>
                <Progress value={78} max={100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Brand Deal Activity</span>
                  <span className="font-medium">+{(Math.random() * 20 + 10).toFixed(1)}%</span>
                </div>
                <Progress value={85} max={100} className="h-2" />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-axium-gray-200 dark:border-axium-gray-700">
              <div className="text-sm font-medium mb-1">Growth Potential</div>
              <div className="flex items-center">
                <div className="flex-1 h-2 bg-axium-gray-200 dark:bg-axium-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${Math.round(creatorScore?.components.growth || 0) * 10}%` }}
                  ></div>
                </div>
                <span className="ml-3 font-bold">{Math.round(creatorScore?.components.growth || 0)}/10</span>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-axium-blue" />
              Risk Assessment
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-axium-gray-100/70 dark:bg-axium-gray-800/70 p-3 rounded-lg">
                  <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400 mb-1">Market Volatility</div>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
                    <span className="font-medium">Medium</span>
                  </div>
                </div>
                
                <div className="bg-axium-gray-100/70 dark:bg-axium-gray-800/70 p-3 rounded-lg">
                  <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400 mb-1">Platform Risk</div>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Low</span>
                  </div>
                </div>
                
                <div className="bg-axium-gray-100/70 dark:bg-axium-gray-800/70 p-3 rounded-lg">
                  <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400 mb-1">Audience Loyalty</div>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">High</span>
                  </div>
                </div>
                
                <div className="bg-axium-gray-100/70 dark:bg-axium-gray-800/70 p-3 rounded-lg">
                  <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400 mb-1">Revenue Stability</div>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
                    <span className="font-medium">Medium</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Overall Risk Rating</div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Moderate
                  </Badge>
                </div>
                <p className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                  This creator presents a moderate risk investment with strong audience loyalty but some platform dependency risks.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
