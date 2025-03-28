import React, { useState, useEffect } from 'react';
import { useAIValuation as useAIValuationHook } from '@/hooks/ai/useAIValuation';
import { useExternalData } from '@/hooks/useExternalData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend 
} from 'recharts';
import { formatCompactNumber } from '@/utils/formatters';
import { 
  TrendingUp, 
  RefreshCw, 
  Zap, 
  DollarSign, 
  Users, 
  MessageSquare, 
  AlertTriangle,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialPlatformMetrics } from '@/types/api';

interface AIValuationProps {
  ipoId?: string;
  className?: string;
}

const getPlatformData = (metrics: any, platform: string): SocialPlatformMetrics | undefined => {
  if (!metrics?.social || !Array.isArray(metrics.social)) return undefined;
  return metrics.social.find(p => p.platform.toLowerCase() === platform);
};

const AIValuation = ({ ipoId, className }: AIValuationProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const {
    pricePrediction,
    socialSentiment,
    marketDepth,
    anomalyData,
    isMarketDepthLoading: isLoading,
    refetchMarketDepth: refetch
  } = useAIValuationHook({ ipoId });
  
  const { 
    metrics: externalMetrics,
    aggregatedMetrics,
    isLoading: isExternalMetricsLoading,
    isError: isExternalMetricsError,
    refetch: refetchExternalMetrics
  } = useExternalData({ creatorId: ipoId });
  
  const [valuationFactors, setValuationFactors] = useState<any>(null);
  
  useEffect(() => {
    if (externalMetrics) {
      setValuationFactors({
        socialEngagement: {
          score: 75,
          weight: 0.35,
          breakdown: {
            twitter: 80,
            instagram: 70,
            youtube: 75
          }
        },
        contentQuality: {
          score: 82,
          weight: 0.25,
          breakdown: {
            consistency: 85,
            audience_retention: 80,
            production_value: 82
          }
        },
        revenueStreams: {
          score: 68,
          weight: 0.4,
          breakdown: {
            ad_revenue: 65,
            sponsorships: 72,
            merchandise: 68,
            live_events: 60
          }
        }
      });
    }
  }, [externalMetrics]);
  
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (autoRefresh && ipoId) {
      intervalId = setInterval(() => {
        refetch();
        refetchExternalMetrics();
      }, 15000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, ipoId, refetch, refetchExternalMetrics]);
  
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => {
      const newState = !prev;
      return newState;
    });
  };
  
  const getPieChartData = () => {
    if (!valuationFactors) return [];
    
    return [
      { 
        name: 'Social', 
        value: valuationFactors.socialEngagement.score * valuationFactors.socialEngagement.weight, 
        fullValue: valuationFactors.socialEngagement.score,
        weight: valuationFactors.socialEngagement.weight,
        color: '#3b82f6' 
      },
      { 
        name: 'Content', 
        value: valuationFactors.contentQuality.score * valuationFactors.contentQuality.weight, 
        fullValue: valuationFactors.contentQuality.score,
        weight: valuationFactors.contentQuality.weight,
        color: '#8b5cf6' 
      },
      { 
        name: 'Revenue', 
        value: valuationFactors.revenueStreams.score * valuationFactors.revenueStreams.weight, 
        fullValue: valuationFactors.revenueStreams.score,
        weight: valuationFactors.revenueStreams.weight,
        color: '#10b981' 
      }
    ];
  };
  
  const getFactorData = (type: 'social' | 'content' | 'revenue') => {
    if (!valuationFactors) return [];
    
    let factors;
    
    switch (type) {
      case 'social':
        factors = valuationFactors.socialEngagement.breakdown;
        break;
      case 'content':
        factors = valuationFactors.contentQuality.breakdown;
        break;
      case 'revenue':
        factors = valuationFactors.revenueStreams.breakdown;
        break;
    }
    
    return Object.entries(factors).map(([name, value]) => ({
      name,
      value: Math.round(value as number),
      description: ''
    }));
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const youtubeData = getPlatformData(externalMetrics, 'youtube');
  const instagramData = getPlatformData(externalMetrics, 'instagram');
  const twitterData = getPlatformData(externalMetrics, 'twitter');
  const tiktokData = getPlatformData(externalMetrics, 'tiktok');
  
  const mockRevenueData = {
    totalRevenue: 250000,
    contentRevenue: 100000,
    sponsorshipRevenue: 80000,
    merchandiseRevenue: 50000,
    liveEventsRevenue: 20000,
    growthRate: 12
  };

  const revenueData = externalMetrics?.revenue || mockRevenueData;
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">AI Valuation Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Valuation Factors
              </h3>
              
              <div className="flex space-x-2">
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={toggleAutoRefresh}
                  className={autoRefresh ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4 mr-1",
                    autoRefresh && "animate-spin"
                  )} />
                  {autoRefresh ? "Live" : "15s"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4 mr-1",
                    isLoading && "animate-spin"
                  )} />
                  Refresh
                </Button>
              </div>
            </div>
            
            {isExternalMetricsError ? (
              <div className="text-center py-6">
                <AlertTriangle className="h-8 w-8 text-axium-error mx-auto mb-2" />
                <h4 className="text-axium-error font-medium mb-1">Failed to load valuation data</h4>
                <p className="text-sm text-axium-gray-600 mb-4">
                  There was an error analyzing creator market performance
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : isLoading || !valuationFactors ? (
              <div className="animate-pulse space-y-4 py-4">
                <div className="h-12 rounded-md bg-axium-gray-200/50 w-1/2 mx-auto"></div>
                <div className="h-24 rounded-md bg-axium-gray-200/50 w-full"></div>
                <div className="h-32 rounded-md bg-axium-gray-200/50 w-full"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-4">
                  <div className={cn(
                    "text-4xl font-bold",
                    getScoreColor(valuationFactors.socialEngagement.score)
                  )}>
                    {valuationFactors.socialEngagement.score}
                  </div>
                  <p className="text-xs text-axium-gray-600 mt-1">
                    Confidence: 85%
                  </p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="overview">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="breakdown">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Breakdown</span>
                    </TabsTrigger>
                    <TabsTrigger value="factors">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Factors</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="pt-2">
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, fullValue }) => `${name}: ${fullValue}`}
                            labelLine={false}
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name, props) => [`${props.payload.fullValue}`, name]}
                            separator=": "
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-center text-sm">
                      <div>
                        <div className={getScoreColor(valuationFactors.socialEngagement.score)}>
                          {valuationFactors.socialEngagement.score}
                        </div>
                        <div className="text-xs text-axium-gray-600">Social</div>
                      </div>
                      <div>
                        <div className={getScoreColor(valuationFactors.contentQuality.score)}>
                          {valuationFactors.contentQuality.score}
                        </div>
                        <div className="text-xs text-axium-gray-600">Content</div>
                      </div>
                      <div>
                        <div className={getScoreColor(valuationFactors.revenueStreams.score)}>
                          {valuationFactors.revenueStreams.score}
                        </div>
                        <div className="text-xs text-axium-gray-600">Revenue</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="breakdown" className="pt-2">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getPieChartData()}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis 
                            domain={[0, 100]} 
                            label={{ value: 'Score', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value, name, props) => [`${props.payload.fullValue}`, name]}
                            separator=": "
                          />
                          <Bar dataKey="fullValue" radius={[4, 4, 0, 0]}>
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-axium-gray-600">Weight Distribution:</span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden">
                        {getPieChartData().map((section, i) => (
                          <div 
                            key={i} 
                            className="h-full" 
                            style={{ 
                              width: `${section.weight * 100}%`, 
                              backgroundColor: section.color 
                            }} 
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs pt-1">
                        {getPieChartData().map((section, i) => (
                          <div key={i}>
                            {section.name}: {(section.weight * 100).toFixed(0)}%
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="factors" className="pt-2">
                    <Tabs defaultValue="social" className="w-full">
                      <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="social">Social</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="social" className="pt-2">
                        <div className="h-[160px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getFactorData('social')}
                              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                              layout="vertical"
                            >
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="name" type="category" width={120} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="content" className="pt-2">
                        <div className="h-[160px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getFactorData('content')}
                              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                              layout="vertical"
                            >
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="name" type="category" width={120} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="revenue" className="pt-2">
                        <div className="h-[160px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getFactorData('revenue')}
                              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                              layout="vertical"
                            >
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis dataKey="name" type="category" width={120} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-2 pt-2 border-t border-axium-gray-200 text-xs text-axium-gray-600">
                  Last updated: {new Date().toLocaleTimeString()}
                  {autoRefresh && " • Live updates enabled"}
                </div>
              </>
            )}
          </GlassCard>
          
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Price Prediction
            </h3>
            
            {isLoading || !pricePrediction ? (
              <div className="text-center py-6">
                Loading price prediction...
              </div>
            ) : (
              <>
                <div className="text-2xl font-semibold">
                  {pricePrediction.prediction === 'up' ? (
                    <span className="text-green-500">Upward Trend</span>
                  ) : (
                    <span className="text-red-500">Downward Trend</span>
                  )}
                </div>
                <div className="text-sm text-axium-gray-500">
                  Predicted price change in 24 hours: {pricePrediction.changePercent}%
                </div>
              </>
            )}
          </GlassCard>
          
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
              Social Sentiment Analysis
            </h3>
            
            {isLoading || !socialSentiment ? (
              <div className="text-center py-6">
                Loading social sentiment data...
              </div>
            ) : (
              <>
                <div className="text-xl font-semibold">
                  Overall Sentiment: {socialSentiment.overall}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Twitter: <span className="font-medium">{socialSentiment.metrics.twitter.score}</span></div>
                  <div>Instagram: <span className="font-medium">{socialSentiment.metrics.instagram.score}</span></div>
                  <div>YouTube: <span className="font-medium">{socialSentiment.metrics.youtube.score}</span></div>
                </div>
              </>
            )}
          </GlassCard>
        </div>
        
        <div className="space-y-6">
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-purple-500" />
              External Metrics
            </h3>
            
            {isExternalMetricsLoading || !externalMetrics ? (
              <div className="text-center py-6">
                Loading external metrics data...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    YouTube: <span className="font-medium">{formatCompactNumber(youtubeData?.followers || 0)}</span>
                  </div>
                  <div>
                    Instagram: <span className="font-medium">{formatCompactNumber(instagramData?.followers || 0)}</span>
                  </div>
                  <div>
                    Twitter: <span className="font-medium">{formatCompactNumber(twitterData?.followers || 0)}</span>
                  </div>
                  <div>
                    TikTok: <span className="font-medium">{formatCompactNumber(tiktokData?.followers || 0)}</span>
                  </div>
                </div>
                
                <div className="text-xl font-semibold">
                  ${formatCompactNumber(revenueData.totalRevenue || 0)}
                </div>
                <div className="text-sm text-axium-gray-500">
                  {(revenueData.growthRate || 0) > 0 ? '+' : ''}{revenueData.growthRate || 0}% YoY
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="col-span-2 sm:col-span-1">
                    <h4 className="font-medium">Content Revenue</h4>
                    <div className="text-lg">${formatCompactNumber(revenueData.contentRevenue || 0)}</div>
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <h4 className="font-medium">Sponsorships</h4>
                    <div className="text-lg">${formatCompactNumber(revenueData.sponsorshipRevenue || 0)}</div>
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <h4 className="font-medium">Merchandise</h4>
                    <div className="text-lg">${formatCompactNumber(revenueData.merchandiseRevenue || 0)}</div>
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <h4 className="font-medium">Live Events</h4>
                    <div className="text-lg">${formatCompactNumber(revenueData.liveEventsRevenue || 0)}</div>
                  </div>
                </div>
              </>
            )}
          </GlassCard>
          
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <LayoutDashboard className="h-5 w-5 mr-2 text-orange-500" />
              Market Depth Analysis
            </h3>
            
            {isLoading || !marketDepth ? (
              <div className="text-center py-6">
                Loading market depth data...
              </div>
            ) : (
              <>
                <div>Buy Wall Strength: {marketDepth.buyWallStrength}</div>
                <div>Sell Wall Strength: {marketDepth.sellWallStrength}</div>
                <div>Current Spread: {marketDepth && marketDepth.currentSpread ? 
                  `${marketDepth.currentSpread?.bid ?? 0} - ${marketDepth.currentSpread?.ask ?? 0}` : 'N/A'}</div>
              </>
            )}
          </GlassCard>
          
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Anomaly Detection
            </h3>
            
            {isLoading || !anomalyData ? (
              <div className="text-center py-6">
                Loading anomaly detection data...
              </div>
            ) : (
              <>
                {anomalyData.detected ? (
                  <div className="text-red-500">Anomalies Detected!</div>
                ) : (
                  <div className="text-green-500">No Anomalies Detected</div>
                )}
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AIValuation;
