
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAIValuation } from '@/hooks/useAIValuation';
import { PredictionTimeframe, AIModelType } from '@/utils/mockAIModels';
import { ArrowUp, ArrowDown, ArrowRight, BrainCircuit, Sparkles, TrendingUp, LineChart, BarChart3, AlertTriangle, DollarSign } from 'lucide-react';

interface AITrendPredictionProps {
  ipoId?: string;
  symbol?: string;
  currentPrice?: number;
}

export const AITrendPrediction = ({ ipoId, symbol = 'EMW', currentPrice = 24.82 }: AITrendPredictionProps) => {
  const [activeTab, setActiveTab] = useState('price');
  
  const { 
    pricePrediction, 
    socialSentiment, 
    anomalyData,
    isPredictionLoading, 
    isSocialSentimentLoading,
    isAnomalyDetectionLoading,
    selectedTimeframe,
    setSelectedTimeframe,
    selectedModel,
    setSelectedModel
  } = useAIValuation({ ipoId });
  
  // Helper to handle timeframe selection
  const handleTimeframeSelect = (tf: PredictionTimeframe) => {
    setSelectedTimeframe(tf);
  };
  
  // Helper to handle model selection
  const handleModelSelect = (model: AIModelType) => {
    setSelectedModel(model);
  };
  
  // Render price prediction information
  const renderPricePrediction = () => {
    if (isPredictionLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!pricePrediction) {
      return (
        <div className="text-center py-10 text-axium-gray-500">
          <p>No prediction data available</p>
        </div>
      );
    }
    
    // Calculate price change percentage
    const priceChange = pricePrediction.targetPrice - (currentPrice || 0);
    const priceChangePercent = ((priceChange / (currentPrice || 1)) * 100).toFixed(2);
    const isPositive = priceChange >= 0;
    
    // Get icon based on prediction
    let PredictionIcon = ArrowRight;
    let predictionColorClass = "text-axium-gray-600";
    
    if (pricePrediction.prediction.includes('up')) {
      PredictionIcon = ArrowUp;
      predictionColorClass = "text-axium-success";
    } else if (pricePrediction.prediction.includes('down')) {
      PredictionIcon = ArrowDown;
      predictionColorClass = "text-axium-error";
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <PredictionIcon className={cn("h-6 w-6", predictionColorClass)} />
              <h3 className={cn("text-lg font-semibold capitalize", predictionColorClass)}>
                {pricePrediction.prediction.replace('_', ' ')}
              </h3>
            </div>
            <p className="text-axium-gray-500 text-sm">
              {selectedTimeframe} prediction with {pricePrediction.confidence}% confidence
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-semibold">${pricePrediction.targetPrice}</div>
            <div className={cn(
              "text-sm",
              isPositive ? "text-axium-success" : "text-axium-error"
            )}>
              {isPositive ? "+" : ""}{priceChangePercent}%
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Based on:</h4>
          <div className="flex flex-wrap gap-2">
            {pricePrediction.factors.map((factor, idx) => (
              <Badge key={idx} variant="outline" className="bg-axium-blue/5 text-axium-blue">
                {factor}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <div className="text-xs text-axium-gray-500 mb-1">Prediction Timeframe</div>
          <div className="flex space-x-1">
            {(['24h', '7d', '30d', '90d'] as PredictionTimeframe[]).map((tf) => (
              <Button 
                key={tf}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full px-3 py-1 h-7",
                  selectedTimeframe === tf ? "bg-axium-blue/10 text-axium-blue" : "text-axium-gray-600"
                )}
                onClick={() => handleTimeframeSelect(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render social sentiment information
  const renderSocialSentiment = () => {
    if (isSocialSentimentLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!socialSentiment) {
      return (
        <div className="text-center py-10 text-axium-gray-500">
          <p>No sentiment data available</p>
        </div>
      );
    }
    
    // Helper to get color class based on sentiment trend
    const getTrendColorClass = (trend: string): string => {
      if (trend.includes('positive')) return 'text-axium-success';
      if (trend.includes('negative')) return 'text-axium-error';
      return 'text-axium-gray-600';
    };
    
    return (
      <div className="space-y-5">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            getTrendColorClass(socialSentiment.overall),
            socialSentiment.overall.includes('positive') ? 'bg-axium-success/10' : 
            socialSentiment.overall.includes('negative') ? 'bg-axium-error/10' : 'bg-axium-gray-100'
          )}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className={cn("text-lg font-semibold capitalize", getTrendColorClass(socialSentiment.overall))}>
              {socialSentiment.overall.replace('_', ' ')}
            </h3>
            <p className="text-axium-gray-500 text-sm">Overall Social Sentiment</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(socialSentiment.metrics).map(([platform, data]) => (
            <div key={platform} className="rounded-lg bg-axium-gray-50 p-2">
              <div className="text-xs text-axium-gray-500 capitalize mb-1">{platform}</div>
              <div className={cn("text-sm font-medium capitalize", getTrendColorClass(data.trend))}>
                {data.trend.replace('_', ' ')}
              </div>
              <div className="text-xs text-axium-gray-500">
                {(data.volume / 1000).toFixed(0)}k volume
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Trending Keywords:</h4>
          <div className="flex flex-wrap gap-2">
            {socialSentiment.keywords.map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="bg-axium-blue/5 text-axium-blue">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // New component to render anomaly detection information
  const renderAnomalyDetection = () => {
    if (isAnomalyDetectionLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!anomalyData) {
      return (
        <div className="text-center py-10 text-axium-gray-500">
          <p>No anomaly detection data available</p>
        </div>
      );
    }
    
    // Get severity color class
    const getSeverityColor = (severity: number): string => {
      if (severity >= 8) return 'text-axium-error';
      if (severity >= 5) return 'text-amber-500';
      return 'text-axium-gray-600';
    };
    
    const getSeverityBgColor = (severity: number): string => {
      if (severity >= 8) return 'bg-axium-error/10';
      if (severity >= 5) return 'bg-amber-500/10';
      return 'bg-axium-gray-100';
    };
    
    return (
      <div className="space-y-5">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            anomalyData.detected ? 
              anomalyData.riskScore > 50 ? 'bg-axium-error/10 text-axium-error' : 'bg-amber-500/10 text-amber-500' 
              : 'bg-green-500/10 text-green-500'
          )}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className={cn(
              "text-lg font-semibold",
              anomalyData.detected ? 
                anomalyData.riskScore > 50 ? 'text-axium-error' : 'text-amber-500' 
                : 'text-green-500'
            )}>
              {anomalyData.detected ? 'Anomalies Detected' : 'No Anomalies Detected'}
            </h3>
            <p className="text-axium-gray-500 text-sm">
              Risk score: {anomalyData.riskScore}/100
            </p>
          </div>
        </div>
        
        {anomalyData.detected && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Detected Anomalies:</h4>
            <div className="space-y-2">
              {anomalyData.anomalies.map((anomaly, idx) => (
                <div key={idx} className={cn(
                  "rounded-lg p-3",
                  getSeverityBgColor(anomaly.severity)
                )}>
                  <div className="flex justify-between items-start">
                    <div className={cn("font-medium capitalize", getSeverityColor(anomaly.severity))}>
                      {anomaly.type.replace('_', ' ')}
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      getSeverityColor(anomaly.severity)
                    )}>
                      Severity: {anomaly.severity}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-axium-gray-600 mt-1">{anomaly.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {anomaly.affectedMetrics.map((metric, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-white bg-opacity-50">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Recommendations:</h4>
              <ul className="space-y-1 text-sm text-axium-gray-600">
                {anomalyData.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {!anomalyData.detected && (
          <div className="rounded-lg bg-green-50 p-3 text-green-800">
            <p>No unusual trading patterns have been detected. Trading activity appears normal.</p>
          </div>
        )}
      </div>
    );
  };
  
  // Render AI model selection
  const renderModelSelection = () => {
    const models = [
      { id: AIModelType.HYBRID, name: 'Hybrid', icon: BrainCircuit, description: 'Balanced analysis using all factors' },
      { id: AIModelType.ENGAGEMENT, name: 'Engagement', icon: TrendingUp, description: 'Focuses on social engagement metrics' },
      { id: AIModelType.SENTIMENT, name: 'Sentiment', icon: Sparkles, description: 'Emphasizes public sentiment analysis' },
      { id: AIModelType.REVENUE_WEIGHTED, name: 'Revenue', icon: DollarSign, description: 'Prioritizes revenue and financial metrics' },
      { id: AIModelType.SOCIAL_WEIGHTED, name: 'Social', icon: BarChart3, description: 'Focuses heavily on social metrics' }
    ];
    
    return (
      <div className="space-y-1 pt-3">
        <div className="text-xs text-axium-gray-500 mb-1">AI Model Selection</div>
        <div className="grid grid-cols-5 gap-1">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <Button
                key={model.id}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center px-1 py-2 h-auto rounded",
                  selectedModel === model.id ? "bg-axium-blue/10 text-axium-blue" : "text-axium-gray-600"
                )}
                onClick={() => handleModelSelect(model.id)}
                title={model.description}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{model.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Add error handling wrapper
  useEffect(() => {
    console.log("AITrendPrediction component loaded with ipoId:", ipoId);
  }, [ipoId]);
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <BrainCircuit className="text-axium-blue mr-2 h-5 w-5" />
          AI Insights {symbol && <span className="text-axium-gray-500 font-normal ml-1">({symbol})</span>}
        </h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="price">Price Prediction</TabsTrigger>
          <TabsTrigger value="sentiment">Social Sentiment</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price" className="pt-2">
          {renderPricePrediction()}
          {renderModelSelection()}
        </TabsContent>
        
        <TabsContent value="sentiment" className="pt-2">
          {renderSocialSentiment()}
        </TabsContent>
        
        <TabsContent value="anomalies" className="pt-2">
          {renderAnomalyDetection()}
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default AITrendPrediction;
