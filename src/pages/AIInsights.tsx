
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle, 
  TrendingUp, 
  BarChart4, 
  LineChart, 
  BrainCircuit, 
  Info,
  Twitter,
  Instagram,
  Youtube,
  Lock,
  ExternalLink,
  Shield
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { useSocialSentiment } from '@/hooks/ai/useSocialSentiment';
import { usePricePrediction } from '@/hooks/ai/usePricePrediction';
import { useAIValuationEngine } from '@/hooks/ai/useAIValuationEngine';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AIModelType } from '@/utils/mockAIModels';

// Import placeholder components that will be implemented later
// These components would be created separately with proper TypeScript definitions
const ValuationBreakdownChart = ({ data }: any) => (
  <div className="h-64 w-full bg-axium-gray-100/50 dark:bg-axium-gray-800/30 rounded-lg flex items-center justify-center">
    {data ? (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={Object.entries(data).map(([key, value]) => ({ name: key, value }))}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            <Cell key="social" fill="#10B981" />
            <Cell key="brand" fill="#3B82F6" />
            <Cell key="content" fill="#6366F1" />
            <Cell key="sentiment" fill="#8B5CF6" />
            <Cell key="market" fill="#EC4899" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-axium-gray-500">Valuation breakdown visualization</p>
    )}
  </div>
);

const HistoricalPerformanceChart = ({ data }: any) => (
  <div className="h-64 w-full bg-axium-gray-100/50 dark:bg-axium-gray-800/30 rounded-lg flex items-center justify-center">
    <p className="text-axium-gray-500">Historical performance visualization</p>
  </div>
);

const SentimentAnalysisChart = ({ data }: any) => (
  <div className="h-64 w-full bg-axium-gray-100/50 dark:bg-axium-gray-800/30 rounded-lg flex items-center justify-center">
    <p className="text-axium-gray-500">Sentiment analysis visualization</p>
  </div>
);

const MarketMoversTable = ({ data }: any) => (
  <div className="w-full bg-axium-gray-100/50 dark:bg-axium-gray-800/30 rounded-lg p-4">
    <p className="text-axium-gray-500">Market movers table</p>
  </div>
);

const TechnicalIndicatorsPanel = ({ data }: any) => (
  <div className="w-full bg-axium-gray-100/50 dark:bg-axium-gray-800/30 rounded-lg p-4">
    <p className="text-axium-gray-500">Technical indicators panel</p>
  </div>
);

const MetricsPanel = ({ title, metrics, isLoading }: any) => (
  <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/30 rounded-lg p-4">
    <h3 className="text-base font-medium mb-3">{title}</h3>
    {isLoading ? (
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    ) : (
      <div className="space-y-2">
        {metrics.map((metric: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="text-sm text-axium-gray-600">{metric.name}</div>
            <div className="text-sm font-medium">{metric.value}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const RiskIndicator = ({ level, score, isLoading }: any) => {
  const getColorClass = () => {
    if (level === 'low') return "text-green-500";
    if (level === 'medium') return "text-amber-500";
    return "text-red-500";
  };

  const getMessage = () => {
    if (level === 'low') return "Low Risk";
    if (level === 'medium') return "Medium Risk";
    return "High Risk";
  };
  
  return (
    <div className="flex items-center space-x-2">
      {isLoading ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <>
          <div className={cn("font-medium", getColorClass())}>
            {getMessage()} • {score}
          </div>
          <AlertTriangle className={cn("h-4 w-4", getColorClass())} />
        </>
      )}
    </div>
  );
};

const AIInsights = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [modelType, setModelType] = useState<AIModelType>(AIModelType.HYBRID);
  
  // Replace with actual creator data from context or API
  const creatorName = "Alex Johnson";
  const creatorSymbol = "AJX";
  const currentPrice = 35.78;
  
  // Fetch sentiment data
  const { 
    data: sentimentData,
    isLoading: isSentimentLoading 
  } = useSocialSentiment({ 
    ipoId: creatorId 
  });
  
  // Fetch price prediction
  const {
    data: pricePrediction,
    isLoading: isPredictionLoading
  } = usePricePrediction({
    ipoId: creatorId || '',
    selectedTimeframe: '7d',
    selectedModel: modelType
  });
  
  // Fetch AI valuation
  const {
    data: aiValuation,
    isLoading: isValuationLoading,
    refetch: refetchValuation
  } = useAIValuationEngine({
    ipoId: creatorId
  });
  
  // Mock data for valuation breakdown
  const valuationBreakdown = {
    socialInfluence: 35,
    brandDealsInfluence: 25,
    contentEngagement: 20,
    marketSentiment: 15,
    externalFactors: 5
  };
  
  // Format percentage for display
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };
  
  // Get color class based on value
  const getValueColorClass = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-axium-gray-600";
  };
  
  // Get icon based on value
  const getValueIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <BarChart4 className="h-4 w-4 text-axium-gray-500" />;
  };
  
  if (!creatorId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GlassCard className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <BrainCircuit className="h-16 w-16 text-axium-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Creator Selected</h2>
            <p className="text-axium-gray-500 mb-6 text-center max-w-md">
              Please select a creator to view AI-powered insights and analysis for their performance.
            </p>
            <Button onClick={() => navigate('/creators')}>
              Browse Creators
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BrainCircuit className="h-6 w-6 mr-2 text-purple-500" />
            AI Insights
          </h1>
          <p className="text-axium-gray-500">
            Advanced AI-powered analytics and predictions for {creatorName || "selected creator"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">BETA</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  AI Insights is in beta. All predictions are experimental and should not be used as financial advice.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button onClick={() => refetchValuation()}>
            Refresh Analysis
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-4">
          <div className="text-sm text-axium-gray-500 mb-1">Creator</div>
          <div className="text-xl font-semibold">{creatorName || "Unknown"}</div>
          <div className="text-sm text-axium-gray-500">{creatorSymbol || "---"}</div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="text-sm text-axium-gray-500 mb-1">AI Valuation</div>
          {isValuationLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <div className="text-xl font-semibold">
              ${aiValuation?.currentValue.toFixed(2) || "29.45"}
              <span className="ml-2 text-sm font-normal text-green-500">
                {formatPercentage((currentPrice ? (((aiValuation?.currentValue || 29.45) - currentPrice) / currentPrice) * 100 : 8.53))}
              </span>
            </div>
          )}
          <div className="text-sm text-axium-gray-500">vs current price ${currentPrice}</div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="text-sm text-axium-gray-500 mb-1">Prediction Confidence</div>
          {isValuationLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <div className="text-xl font-semibold">{aiValuation?.confidence || 82}%</div>
          )}
          <div className="flex justify-between">
            <div className="text-sm text-axium-gray-500">Based on {aiValuation?.factors?.length || 5} factors</div>
            <RiskIndicator level="low" score={15} isLoading={isValuationLoading} />
          </div>
        </GlassCard>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="social">Social Analysis</TabsTrigger>
            <TabsTrigger value="prediction">Price Prediction</TabsTrigger>
            <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Valuation Breakdown</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-axium-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Breakdown of factors influencing the AI valuation of this creator
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {isValuationLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ValuationBreakdownChart data={valuationBreakdown} />
              )}
              
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Key Factors</div>
                {isValuationLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {(aiValuation?.factors || [
                      { factor: "Social Media Engagement", impact: 4.2, description: "Strong growth in follower count and engagement metrics" },
                      { factor: "Content Quality", impact: 3.8, description: "High production value and audience retention" },
                      { factor: "Brand Partnerships", impact: 3.5, description: "Increased number of high-value sponsorships" }
                    ]).slice(0, 3).map((factor, index) => (
                      <div key={index} className="bg-axium-gray-100/50 dark:bg-axium-gray-800/30 p-2 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium text-sm">{factor.factor}</div>
                          <div className={cn("text-sm", getValueColorClass(factor.impact))}>
                            {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)}
                          </div>
                        </div>
                        <div className="text-xs text-axium-gray-500">{factor.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
            
            <div className="space-y-6">
              <GlassCard className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">7-Day Forecast</h2>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/30">
                    AI Generated
                  </Badge>
                </div>
                
                {isPredictionLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-axium-gray-500 mb-1">Price Movement (7d)</div>
                        <div className="text-2xl font-bold flex items-center">
                          {getValueIcon(pricePrediction?.prediction?.percentage || 3.25)}
                          <span className={cn("ml-2", getValueColorClass(pricePrediction?.prediction?.percentage || 3.25))}>
                            {formatPercentage(pricePrediction?.prediction?.percentage || 3.25)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-axium-gray-500 mb-1">Target Price</div>
                        <div className="text-2xl font-bold">${pricePrediction?.targetPrice?.toFixed(2) || "37.05"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-axium-gray-500">
                        Confidence: <span className="font-medium">{pricePrediction?.confidence || 76}%</span>
                      </div>
                      <div className="text-axium-gray-500">
                        Model: <span className="font-medium">Balanced</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Influencing Factors</div>
                  {isPredictionLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {(pricePrediction?.factors || [
                        "Strong engagement metrics growth trend",
                        "Recent positive sentiment shift in social media",
                        "New content format gaining traction"
                      ]).slice(0, 2).map((factor, index) => (
                        <div key={index} className="text-sm flex items-start">
                          <TrendingUp className="h-4 w-4 text-axium-gray-400 mr-1.5 mt-0.5 flex-shrink-0" />
                          <span className="text-axium-gray-600">{factor}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlassCard>
              
              <GlassCard className="p-4">
                <h2 className="text-lg font-semibold mb-4">Social Media Sentiment</h2>
                
                {isSentimentLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/30 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Twitter className="h-5 w-5 text-blue-400 mr-3" />
                        <div className="flex-grow">
                          <div className="text-sm font-medium">Twitter</div>
                          <div className="h-2 bg-axium-gray-200 dark:bg-axium-gray-700 rounded-full mt-1.5">
                            <div 
                              className="h-2 bg-blue-400 rounded-full" 
                              style={{ width: `${sentimentData?.platforms?.twitter?.sentiment || 75}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm font-medium ml-3">
                          {sentimentData?.platforms?.twitter?.sentiment?.toFixed(0) || 75}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/30 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Instagram className="h-5 w-5 text-pink-500 mr-3" />
                        <div className="flex-grow">
                          <div className="text-sm font-medium">Instagram</div>
                          <div className="h-2 bg-axium-gray-200 dark:bg-axium-gray-700 rounded-full mt-1.5">
                            <div 
                              className="h-2 bg-pink-500 rounded-full" 
                              style={{ width: `${sentimentData?.platforms?.instagram?.sentiment || 82}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm font-medium ml-3">
                          {sentimentData?.platforms?.instagram?.sentiment?.toFixed(0) || 82}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/30 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Youtube className="h-5 w-5 text-red-500 mr-3" />
                        <div className="flex-grow">
                          <div className="text-sm font-medium">YouTube</div>
                          <div className="h-2 bg-axium-gray-200 dark:bg-axium-gray-700 rounded-full mt-1.5">
                            <div 
                              className="h-2 bg-red-500 rounded-full" 
                              style={{ width: `${sentimentData?.platforms?.youtube?.sentiment || 68}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm font-medium ml-3">
                          {sentimentData?.platforms?.youtube?.sentiment?.toFixed(0) || 68}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Overall Trust Score</div>
                    <div className="flex items-center">
                      <div className={cn(
                        "text-sm font-medium",
                        sentimentData?.trust && sentimentData.trust > 70 ? "text-green-500" : 
                        sentimentData?.trust && sentimentData.trust > 40 ? "text-amber-500" : 
                        "text-red-500"
                      )}>
                        {sentimentData?.trust || 75}/100
                      </div>
                      <Shield className={cn(
                        "ml-1 h-4 w-4",
                        sentimentData?.trust && sentimentData.trust > 70 ? "text-green-500" : 
                        sentimentData?.trust && sentimentData.trust > 40 ? "text-amber-500" : 
                        "text-red-500"
                      )} />
                    </div>
                  </div>
                  
                  <div className="h-2 bg-axium-gray-200 dark:bg-axium-gray-700 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        sentimentData?.trust && sentimentData.trust > 70 ? "bg-green-500" : 
                        sentimentData?.trust && sentimentData.trust > 40 ? "bg-amber-500" : 
                        "bg-red-500"
                      )}
                      style={{ width: `${sentimentData?.trust || 75}%` }}
                    ></div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="md:col-span-2 p-4">
              <h2 className="text-lg font-semibold mb-4">Historical Performance</h2>
              <HistoricalPerformanceChart data={null} />
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
              <MetricsPanel 
                title="Engagement"
                metrics={[
                  { name: "Active Users", value: "1.2M" },
                  { name: "Growth Rate", value: "+8.3%" },
                  { name: "Retention", value: "76%" }
                ]}
                isLoading={false}
              />
              
              <Separator className="my-4" />
              
              <MetricsPanel 
                title="Content"
                metrics={[
                  { name: "Output Frequency", value: "3.5/week" },
                  { name: "Avg. Watch Time", value: "8:32" },
                  { name: "Completion Rate", value: "72%" }
                ]}
                isLoading={false}
              />
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="social">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-4">
              <h2 className="text-lg font-semibold mb-4">Sentiment Analysis</h2>
              <SentimentAnalysisChart data={null} />
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Top Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {isSentimentLoading ? (
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-8 w-1/2" />
                  </div>
                ) : (
                  (sentimentData?.keywords || [
                    'engaging', 'authentic', 'trending', 'quality', 'innovative', 
                    'entertaining', 'consistent', 'professional'
                  ]).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1.5">
                      {keyword}
                    </Badge>
                  ))
                )}
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Platform Analysis</h2>
              {/* Platform specific analysis content */}
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Audience Demographics</h2>
              {/* Audience demographics content */}
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Engagement Trends</h2>
              {/* Engagement trends content */}
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="prediction">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-4">
              <h2 className="text-lg font-semibold mb-4">Price Projection Models</h2>
              {/* Price projection models content */}
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">AI Model Selection</h2>
              {/* AI model selection content */}
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Volatility Analysis</h2>
              {/* Volatility analysis content */}
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Risk Assessment</h2>
              {/* Risk assessment content */}
            </GlassCard>
            
            <GlassCard className="lg:col-span-2 p-4">
              <h2 className="text-lg font-semibold mb-4">Market Events Impact</h2>
              {/* Market events impact content */}
            </GlassCard>
          </div>
        </TabsContent>
        
        <TabsContent value="technical">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-4">
              <h2 className="text-lg font-semibold mb-4">Technical Indicators</h2>
              <TechnicalIndicatorsPanel data={null} />
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Market Movers</h2>
              <MarketMoversTable data={null} />
            </GlassCard>
            
            <GlassCard className="p-4">
              <h2 className="text-lg font-semibold mb-4">Support & Resistance</h2>
              {/* Support & resistance content */}
            </GlassCard>
            
            <GlassCard className="lg:col-span-2 p-4">
              <h2 className="text-lg font-semibold mb-4">Volume Analysis</h2>
              {/* Volume analysis content */}
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center text-xs text-axium-gray-500">
        <p>
          AI-powered analysis is provided for informational purposes only and should not be considered financial advice.
          <br />
          Past performance is not indicative of future results. All predictions are speculative.
        </p>
      </div>
    </div>
  );
};

export default AIInsights;
export { ValuationBreakdownChart, HistoricalPerformanceChart, MetricsPanel, MarketMoversTable };
