
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useAIValuationEngine, 
  useSocialSentiment,
  useCreatorMarketScore
} from '@/hooks/ai';
import { useIPO } from '@/contexts/IPOContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Brain,
  TrendingUp, 
  BarChart2,
  Users,
  RefreshCw,
  Info,
  AlertTriangle,
  Zap,
  LineChart,
  AreaChart
} from 'lucide-react';
import ValuationBreakdownChart from '@/components/ai-insights/ValuationBreakdownChart';
import HistoricalPerformanceChart from '@/components/ai-insights/HistoricalPerformanceChart';
import { MarketMoversTable } from '@/components/ai-insights/MarketMoversTable';
import MetricsPanel from '@/components/ai-insights/MetricsPanel';

const AIInsights = () => {
  const { id } = useParams<{ id: string }>();
  const { ipos, getIPO } = useIPO();
  const [selectedCreator, setSelectedCreator] = useState<string | null>(id || null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const { 
    creatorValuation, 
    valuationFactors,
    confidence,
    lastUpdated,
    isLoading: valuationLoading 
  } = useAIValuationEngine(selectedCreator || '');
  
  const { 
    sentimentData, 
    isLoading: sentimentLoading 
  } = useSocialSentiment(selectedCreator || '');
  
  const {
    score: marketScore,
    isLoading: scoreLoading
  } = useCreatorMarketScore(selectedCreator || '');
  
  const isLoading = valuationLoading || sentimentLoading || scoreLoading;
  
  useEffect(() => {
    if (id) {
      setSelectedCreator(id);
    } else if (ipos.length > 0 && !selectedCreator) {
      setSelectedCreator(ipos[0].id);
    }
  }, [id, ipos, selectedCreator]);
  
  const handleCreatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCreator(e.target.value);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate refresh of data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  
  // Mock market movers data for the "What Moved the Market" section
  const marketMovers = [
    {
      factor: "Social Media Engagement",
      impact: 2.8,
      description: "Spike in engagement after latest Instagram post",
      timestamp: new Date().toISOString()
    },
    {
      factor: "News Sentiment",
      impact: -1.2,
      description: "Industry-wide negative press on sponsorship deals",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      factor: "Brand Deal Announcement",
      impact: 4.5,
      description: "New partnership with major fashion brand",
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      factor: "Content Performance",
      impact: 1.3,
      description: "Latest video exceeded view expectations by 20%",
      timestamp: new Date(Date.now() - 10800000).toISOString()
    },
    {
      factor: "Competitor Activity",
      impact: -0.7,
      description: "Similar creator launched competing product line",
      timestamp: new Date(Date.now() - 14400000).toISOString()
    }
  ];
  
  const selectedIPO = selectedCreator ? getIPO(selectedCreator) : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Brain className="mr-2 h-6 w-6 text-axium-blue" />
              AI Insights Dashboard
            </h1>
            <p className="text-axium-gray-600 dark:text-axium-gray-400">
              Harnessing machine learning to provide deeper market intelligence
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <select 
                value={selectedCreator || ''} 
                onChange={handleCreatorChange}
                className="w-full px-3 py-2 bg-white dark:bg-axium-gray-800 border border-axium-gray-200 dark:border-axium-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-axium-blue focus:border-axium-blue"
              >
                <option value="" disabled>Select Creator Asset</option>
                {ipos.map(ipo => (
                  <option key={ipo.id} value={ipo.id}>
                    {ipo.symbol} - {ipo.creatorName}
                  </option>
                ))}
              </select>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="flex items-center"
              disabled={refreshing || isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Main content area */}
        {selectedCreator && selectedIPO ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Creator valuation and factors */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedIPO.creatorName} ({selectedIPO.symbol})</h2>
                    <p className="text-axium-gray-600 dark:text-axium-gray-400 text-sm">
                      AI-Derived Valuation Analysis
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-axium-gray-100 dark:bg-axium-gray-800 px-2 py-1 rounded-full flex items-center">
                      <Info className="h-3 w-3 mr-1" /> 
                      {confidence}% Confidence
                    </span>
                    
                    <span className="text-xs bg-axium-gray-100 dark:bg-axium-gray-800 px-2 py-1 rounded-full">
                      Updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Recently'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-1">AI Valuation Breakdown</h3>
                      <p className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                        Key factors influencing current valuation
                      </p>
                    </div>
                    
                    {valuationLoading ? (
                      <div className="h-64 flex items-center justify-center bg-axium-gray-100 dark:bg-axium-gray-800 rounded-lg animate-pulse">
                        <div className="text-axium-gray-500">Loading valuation data...</div>
                      </div>
                    ) : (
                      <ValuationBreakdownChart data={valuationFactors} />
                    )}
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-1">Historical Performance</h3>
                      <p className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                        Asset price vs. AI valuation over time
                      </p>
                    </div>
                    
                    {valuationLoading ? (
                      <div className="h-64 flex items-center justify-center bg-axium-gray-100 dark:bg-axium-gray-800 rounded-lg animate-pulse">
                        <div className="text-axium-gray-500">Loading historical data...</div>
                      </div>
                    ) : (
                      <HistoricalPerformanceChart ipoId={selectedCreator} />
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="social">Social Impact</TabsTrigger>
                      <TabsTrigger value="brand">Brand Value</TabsTrigger>
                      <TabsTrigger value="forecast">Forecasts</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-axium-gray-50 dark:bg-axium-gray-800/50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="h-5 w-5 text-axium-blue mr-2" />
                            <h4 className="font-medium">Current Status</h4>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-axium-gray-600 dark:text-axium-gray-400">Market Price</span>
                              <span className="font-medium">${selectedIPO.currentPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-axium-gray-600 dark:text-axium-gray-400">AI Valuation</span>
                              <span className="font-medium">${creatorValuation?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-axium-gray-600 dark:text-axium-gray-400">Variance</span>
                              {creatorValuation && (
                                <span className={`font-medium ${
                                  creatorValuation > selectedIPO.currentPrice 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {(((creatorValuation - selectedIPO.currentPrice) / selectedIPO.currentPrice) * 100).toFixed(2)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-axium-gray-50 dark:bg-axium-gray-800/50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <BarChart2 className="h-5 w-5 text-axium-blue mr-2" />
                            <h4 className="font-medium">Risk Assessment</h4>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-axium-gray-600 dark:text-axium-gray-400">Volatility</span>
                              <span className="font-medium">Medium</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-axium-gray-600 dark:text-axium-gray-400">Stability Score</span>
                              <span className="font-medium">{marketScore?.components.stability || 'N/A'}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-axium-gray-600 dark:text-axium-gray-400">Confidence</span>
                              <span className="font-medium">{confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-axium-gray-50 dark:bg-axium-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                          <h4 className="font-medium">AI Insights</h4>
                        </div>
                        
                        <p className="text-sm text-axium-gray-700 dark:text-axium-gray-300 mb-2">
                          {selectedIPO.creatorName}'s asset is currently {
                            creatorValuation && creatorValuation > selectedIPO.currentPrice
                              ? <span className="text-green-600 dark:text-green-400 font-medium">undervalued</span>
                              : <span className="text-red-600 dark:text-red-400 font-medium">overvalued</span>
                          } by our AI model. The valuation is primarily driven by {
                            valuationFactors.length > 0 
                              ? `strong ${valuationFactors[0].name.toLowerCase()} metrics`
                              : 'several key metrics'
                          }.
                        </p>
                        
                        <p className="text-sm text-axium-gray-700 dark:text-axium-gray-300">
                          Our model has detected {sentimentData?.positive > 70 ? 'highly positive' : 'mixed'} sentiment trends from social media and content performance.
                          {marketScore?.components.stability && marketScore.components.stability > 70 
                            ? ' Long-term projections indicate stable growth potential.'
                            : ' The asset shows higher than average volatility in the near term.'}
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="social" className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2 bg-axium-gray-50 dark:bg-axium-gray-800/50 rounded-lg p-4">
                          <h4 className="font-medium mb-4">Social Media Performance</h4>
                          
                          {sentimentLoading ? (
                            <div className="h-48 flex items-center justify-center animate-pulse">
                              <div className="text-axium-gray-500">Loading sentiment data...</div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-axium-gray-800 rounded p-3 shadow-sm">
                                  <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400">Overall Sentiment</div>
                                  <div className="mt-1 text-2xl font-bold">
                                    {sentimentData?.overall || 'N/A'}<span className="text-sm font-normal">/100</span>
                                  </div>
                                </div>
                                
                                <div className="bg-white dark:bg-axium-gray-800 rounded p-3 shadow-sm">
                                  <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400">Engagement Rate</div>
                                  <div className="mt-1 text-2xl font-bold">
                                    {marketScore?.details.social.engagement || 'N/A'}<span className="text-sm font-normal">%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-white dark:bg-axium-gray-800 rounded p-3 shadow-sm">
                                <div className="flex justify-between mb-2">
                                  <div className="text-sm">Sentiment Breakdown</div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <div className="text-xs text-axium-gray-600 dark:text-axium-gray-400">Positive</div>
                                    <div className="text-green-600 dark:text-green-400 font-medium">{sentimentData?.positive || 0}%</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-axium-gray-600 dark:text-axium-gray-400">Neutral</div>
                                    <div className="text-axium-gray-600 dark:text-axium-gray-400 font-medium">{sentimentData?.neutral || 0}%</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-axium-gray-600 dark:text-axium-gray-400">Negative</div>
                                    <div className="text-red-600 dark:text-red-400 font-medium">{sentimentData?.negative || 0}%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-axium-gray-50 dark:bg-axium-gray-800/50 rounded-lg p-4">
                          <h4 className="font-medium mb-4">Platform Breakdown</h4>
                          
                          {sentimentData?.platforms ? (
                            <div className="space-y-3">
                              {Object.entries(sentimentData.platforms).map(([platform, score]) => (
                                <div key={platform} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" 
                                      style={{ 
                                        backgroundColor: score > 70 
                                          ? '#10B981' 
                                          : score > 40 
                                            ? '#F59E0B' 
                                            : '#EF4444'
                                      }} 
                                    />
                                    <span className="text-sm">{platform}</span>
                                  </div>
                                  <span className="text-sm font-medium">{score}/100</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-48 flex items-center justify-center">
                              <div className="text-axium-gray-500 text-sm">Platform data unavailable</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="brand" className="pt-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-axium-gray-50 dark:bg-axium-gray-800/50 rounded-lg p-4">
                          <h4 className="font-medium mb-4">Brand Value Components</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-axium-gray-800 p-4 rounded shadow-sm">
                              <div className="flex items-center mb-2">
                                <Zap className="h-4 w-4 text-amber-500 mr-2" />
                                <h5 className="font-medium">Active Brand Deals</h5>
                              </div>
                              <div className="text-3xl font-bold mb-1">
                                {marketScore?.details.brand.deals || 'N/A'}
                              </div>
                              <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                                Growth: {marketScore?.details.brand.growth || 0}% year-over-year
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-axium-gray-800 p-4 rounded shadow-sm">
                              <div className="flex items-center mb-2">
                                <BarChart2 className="h-4 w-4 text-axium-blue mr-2" />
                                <h5 className="font-medium">Est. Deal Value</h5>
                              </div>
                              <div className="text-3xl font-bold mb-1">
                                ${marketScore?.details.brand.value 
                                  ? (marketScore.details.brand.value / 1000000).toFixed(1) + 'M'
                                  : 'N/A'
                                }
                              </div>
                              <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                                Average of ${marketScore?.details.brand.value && marketScore.details.brand.deals
                                  ? ((marketScore.details.brand.value / marketScore.details.brand.deals) / 1000).toFixed(0) + 'K'
                                  : 'N/A'
                                } per deal
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-axium-gray-800 p-4 rounded shadow-sm">
                              <div className="flex items-center mb-2">
                                <Users className="h-4 w-4 text-indigo-500 mr-2" />
                                <h5 className="font-medium">Audience Trust</h5>
                              </div>
                              <div className="text-3xl font-bold mb-1">
                                {(sentimentData?.trust || 0) * 100}%
                              </div>
                              <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
                                Based on engagement and sentiment
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-4 border border-axium-gray-200 dark:border-axium-gray-700 rounded-lg bg-white dark:bg-axium-gray-800/50">
                            <h5 className="font-medium mb-2">AI Brand Analysis</h5>
                            <p className="text-sm text-axium-gray-700 dark:text-axium-gray-300">
                              {selectedIPO.creatorName}'s brand partnerships show {
                                marketScore?.details.brand.growth && marketScore.details.brand.growth > 0
                                  ? 'positive growth'
                                  : 'some signs of slowing'
                              } with an estimated impact of {
                                valuationFactors.find(f => f.name === 'Brand Value')?.value.toFixed(2) || '15-25'
                              }% on total asset valuation. The creator maintains {
                                sentimentData?.trust && sentimentData.trust > 0.7
                                  ? 'strong audience trust'
                                  : 'moderate audience trust'
                              } which is a key factor for future brand deal potential.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="forecast" className="pt-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-axium-gray-50 dark:bg-axium-gray-800/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">AI Price Projections</h4>
                            <div className="text-xs bg-axium-gray-100 dark:bg-axium-gray-800 px-2 py-1 rounded-full flex items-center">
                              <Info className="h-3 w-3 mr-1" /> 
                              {confidence}% Model Confidence
                            </div>
                          </div>
                          
                          <div className="h-64 flex items-center justify-center bg-axium-gray-100 dark:bg-axium-gray-800 rounded-lg">
                            <div className="text-axium-gray-500">Price projection charts coming soon</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-white dark:bg-axium-gray-800 p-3 rounded shadow-sm">
                              <div className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mb-1">30-Day Projection</div>
                              <div className="text-xl font-bold flex items-center">
                                ${(selectedIPO.currentPrice * 1.08).toFixed(2)}
                                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-normal flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-0.5" />
                                  8.0%
                                </span>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-axium-gray-800 p-3 rounded shadow-sm">
                              <div className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mb-1">90-Day Projection</div>
                              <div className="text-xl font-bold flex items-center">
                                ${(selectedIPO.currentPrice * 1.15).toFixed(2)}
                                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-normal flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-0.5" />
                                  15.0%
                                </span>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-axium-gray-800 p-3 rounded shadow-sm">
                              <div className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mb-1">1-Year Target</div>
                              <div className="text-xl font-bold flex items-center">
                                ${(selectedIPO.currentPrice * 1.35).toFixed(2)}
                                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-normal flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-0.5" />
                                  35.0%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            </div>
            
            {/* Right column - metrics, market movers */}
            <div className="space-y-6">
              <MetricsPanel 
                creatorId={selectedCreator} 
                marketScore={marketScore}
                isLoading={scoreLoading}
              />
              
              <MarketMoversTable marketMovers={marketMovers} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-axium-gray-800 rounded-lg shadow-sm p-8 text-center">
            <Brain className="h-12 w-12 mx-auto text-axium-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Select a Creator Asset</h3>
            <p className="text-axium-gray-600 dark:text-axium-gray-400 mb-6">
              Choose a creator asset from the dropdown above to view AI insights and analytics.
            </p>
            <Button onClick={() => setSelectedCreator(ipos[0]?.id)}>
              Load First Creator
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
