
import { useState, useEffect } from 'react';
import { useIPO } from '@/contexts/IPOContext';
import { useAIValuation } from '@/hooks/ai/useAIValuation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Zap, 
  BarChart4, 
  RefreshCw, 
  BrainCircuit,
  TrendingUp,
  Gift,
  AlertTriangle,
  Layers
} from 'lucide-react';
import CreatorMarketScoreCard from '@/components/trading/CreatorMarketScoreCard';
import { ExternalMetricsCard } from '@/components/trading/external-metrics';
import SentimentInsights from '@/components/trading/SentimentInsights';
import { Separator } from '@/components/ui/separator';
import { showNotification } from '@/components/notifications/ToastContainer';

const AIValuation = () => {
  const { ipos, isLoading: iposLoading } = useIPO();
  const [selectedIPO, setSelectedIPO] = useState<string | undefined>(undefined);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const { 
    isLoading,
    creatorMarketScore,
    externalMetrics,
    sentimentData,
    pricePrediction,
    anomalyData,
    setAutoRefresh: setAIAutoRefresh,
    refetchAll
  } = useAIValuation({
    ipoId: selectedIPO
  });
  
  // Set the first IPO as selected when data loads
  useEffect(() => {
    if (ipos.length > 0 && !selectedIPO) {
      setSelectedIPO(ipos[0].id);
    }
  }, [ipos, selectedIPO]);
  
  // Handle auto-refresh toggle
  useEffect(() => {
    setAIAutoRefresh(autoRefresh);
  }, [autoRefresh, setAIAutoRefresh]);
  
  const handleRefresh = () => {
    refetchAll();
    toast.success('Valuation data refreshed');
  };
  
  const handleIPOChange = (ipoId: string) => {
    setSelectedIPO(ipoId);
    showNotification.info(`Switched to ${ipos.find(ipo => ipo.id === ipoId)?.creatorName || 'New Creator'}`);
  };
  
  // Get current creator details
  const currentCreator = ipos.find(ipo => ipo.id === selectedIPO);
  
  if (iposLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-axium-gray-100/30 min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <BrainCircuit className="h-6 w-6 mr-2 text-blue-500" />
              AI Valuation System
            </h1>
            <p className="text-axium-gray-600">
              Real-time creator valuation metrics powered by AI
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-refresh" 
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="cursor-pointer">
                Live Updates (15s)
              </Label>
            </div>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Creator Selector */}
        <GlassCard className="mb-6 p-4">
          <h2 className="text-lg font-medium mb-4">Select Creator</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ipos.map(ipo => (
              <Button
                key={ipo.id}
                variant={selectedIPO === ipo.id ? "default" : "outline"}
                className="flex flex-col items-center p-2 h-auto"
                onClick={() => handleIPOChange(ipo.id)}
              >
                <div 
                  className="w-12 h-12 rounded-full bg-axium-gray-200 mb-1 overflow-hidden"
                  style={{
                    backgroundImage: `url(${ipo.logoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <span className="text-sm font-medium">{ipo.symbol}</span>
                <span className="text-xs text-axium-gray-600 truncate w-full text-center">
                  {ipo.creatorName}
                </span>
              </Button>
            ))}
          </div>
        </GlassCard>
        
        {/* Selected Creator Info */}
        {currentCreator && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <div 
                className="w-16 h-16 rounded-full bg-axium-gray-200 mr-4 overflow-hidden"
                style={{
                  backgroundImage: `url(${currentCreator.logoUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div>
                <h2 className="text-xl font-bold">{currentCreator.creatorName}</h2>
                <div className="flex items-center">
                  <span className="bg-axium-gray-200 text-axium-gray-700 px-2 py-0.5 rounded text-sm mr-2">
                    ${currentCreator.symbol}
                  </span>
                  <span className="text-axium-gray-600">
                    Current: ${currentCreator.currentPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-axium-gray-100 p-2 rounded-md">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-axium-gray-600">CMS</div>
                  <div className="font-semibold">
                    {isLoading ? '-' : creatorMarketScore?.totalScore || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-axium-gray-600">Target</div>
                  <div className="font-semibold">
                    {isLoading ? '-' : creatorMarketScore?.priceImpact?.recommendedPrice 
                      ? `$${creatorMarketScore.priceImpact.recommendedPrice}` 
                      : '-'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-xs text-axium-gray-600">Confidence</div>
                  <div className="font-semibold">
                    {isLoading ? '-' : creatorMarketScore?.priceImpact?.confidence 
                      ? `${creatorMarketScore.priceImpact.confidence}%` 
                      : '-'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Metrics Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Creator Market Score */}
          <div className="md:col-span-2 space-y-6">
            <CreatorMarketScoreCard ipoId={selectedIPO} />
            
            <Tabs defaultValue="metrics">
              <TabsList className="w-full">
                <TabsTrigger value="metrics">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  External Metrics
                </TabsTrigger>
                <TabsTrigger value="sentiment">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Sentiment Analysis
                </TabsTrigger>
                <TabsTrigger value="alerts">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alerts & Anomalies
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics">
                <ExternalMetricsCard creatorId={selectedIPO} />
              </TabsContent>
              
              <TabsContent value="sentiment">
                <SentimentInsights creatorId={selectedIPO} />
              </TabsContent>
              
              <TabsContent value="alerts">
                <GlassCard className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Anomaly Detection</h3>
                  
                  {anomalyData?.detected ? (
                    <div>
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <span className="font-semibold">Anomalies Detected</span>
                        </div>
                        <p className="text-sm mt-1">
                          Our AI has detected unusual patterns in this creator's data.
                          Risk Score: {anomalyData.riskScore}/100
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {anomalyData.anomalies.map((anomaly: any, index: number) => (
                          <div key={index} className="border border-axium-gray-200 rounded-md p-3">
                            <div className="font-medium">{anomaly.type.replace(/_/g, ' ')}</div>
                            <div className="text-sm text-axium-gray-600">{anomaly.description}</div>
                            <div className="flex justify-between mt-1 text-xs">
                              <span>Confidence: {anomaly.confidence}%</span>
                              <span>Severity: {anomaly.severity}/10</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recommendations</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {anomalyData.recommendations.map((rec: string, index: number) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="bg-green-100 text-green-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-8 w-8" />
                      </div>
                      <h4 className="font-medium mb-1">No Anomalies Detected</h4>
                      <p className="text-sm text-axium-gray-600">
                        This creator's metrics and trading patterns appear normal.
                      </p>
                    </div>
                  )}
                </GlassCard>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Additional Insights */}
          <div className="space-y-6">
            {/* Price Prediction */}
            <GlassCard className="p-4">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Layers className="h-5 w-5 mr-2 text-purple-500" />
                Price Prediction
              </h3>
              
              {isLoading || !pricePrediction ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-axium-gray-200/50 rounded w-1/2"></div>
                  <div className="h-16 bg-axium-gray-200/50 rounded"></div>
                  <div className="h-32 bg-axium-gray-200/50 rounded"></div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-medium">
                      ${pricePrediction.targetPrice.toFixed(2)}
                    </div>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${
                      pricePrediction.prediction === 'up' || pricePrediction.prediction === 'strong_up' 
                        ? 'bg-green-100 text-green-800' 
                        : pricePrediction.prediction === 'down' || pricePrediction.prediction === 'strong_down'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pricePrediction.prediction.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="bg-axium-gray-100 rounded-md p-3 mb-4">
                    <div className="text-sm font-medium mb-1">Confidence: {pricePrediction.confidence}%</div>
                    <div className="w-full bg-axium-gray-300 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${pricePrediction.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Factors</h4>
                    <ul className="space-y-2">
                      {pricePrediction.factors.map((factor: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs mr-2 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </GlassCard>
            
            {/* Key Metrics Overview */}
            <GlassCard className="p-4">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Gift className="h-5 w-5 mr-2 text-green-500" />
                Key Metrics
              </h3>
              
              {isLoading || !externalMetrics ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-axium-gray-200/50 rounded"></div>
                  <div className="h-16 bg-axium-gray-200/50 rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Social Media Performance</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-axium-gray-100 rounded p-2">
                        <div className="text-xs text-axium-gray-600">Followers</div>
                        <div className="font-semibold">
                          {externalMetrics.social ? new Intl.NumberFormat().format(
                            externalMetrics.social.youtube.subscribers +
                            externalMetrics.social.instagram.followers +
                            externalMetrics.social.twitter.followers +
                            externalMetrics.social.tiktok.followers
                          ) : '-'}
                        </div>
                      </div>
                      <div className="bg-axium-gray-100 rounded p-2">
                        <div className="text-xs text-axium-gray-600">Avg. Engagement</div>
                        <div className="font-semibold">
                          {externalMetrics.social ? (
                            (((
                              externalMetrics.social.youtube.engagement +
                              externalMetrics.social.instagram.engagement +
                              externalMetrics.social.twitter.engagement +
                              externalMetrics.social.tiktok.engagement
                            ) / 4) * 100).toFixed(1) + '%'
                          ) : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Revenue Streams</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-axium-gray-100 rounded p-2">
                        <div className="text-xs text-axium-gray-600">Annual Revenue</div>
                        <div className="font-semibold">
                          {externalMetrics.revenue ? 
                            `$${new Intl.NumberFormat().format(externalMetrics.revenue.totalRevenue)}` : '-'}
                        </div>
                      </div>
                      <div className="bg-axium-gray-100 rounded p-2">
                        <div className="text-xs text-axium-gray-600">Revenue Growth</div>
                        <div className={`font-semibold ${
                          externalMetrics.revenue && externalMetrics.revenue.growthRate >= 0 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {externalMetrics.revenue ? 
                            `${externalMetrics.revenue.growthRate > 0 ? '+' : ''}${externalMetrics.revenue.growthRate}%` 
                            : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Sentiment Analysis</h4>
                    <div className="bg-axium-gray-100 rounded p-2">
                      <div className="flex justify-between">
                        <div className="text-xs text-axium-gray-600">Overall Sentiment</div>
                        <div className={`text-xs font-medium px-2 rounded ${
                          sentimentData?.summary.overallScore >= 75 ? 'bg-green-100 text-green-800' :
                          sentimentData?.summary.overallScore >= 50 ? 'bg-blue-100 text-blue-800' :
                          sentimentData?.summary.overallScore >= 25 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sentimentData?.summary.overallScore 
                            ? `${sentimentData.summary.overallScore}%` 
                            : '-'}
                        </div>
                      </div>
                      
                      <div className="mt-2 w-full bg-axium-gray-300 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            sentimentData?.summary.overallScore >= 75 ? 'bg-green-500' :
                            sentimentData?.summary.overallScore >= 50 ? 'bg-blue-500' :
                            sentimentData?.summary.overallScore >= 25 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${sentimentData?.summary.overallScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIValuation;
