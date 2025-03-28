
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, TrendingDown, BarChart4, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { usePricePrediction, PriceMovementResponse } from '@/hooks/ai/usePricePrediction';
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';

interface AITrendPredictionProps {
  ipoId: string;
  className?: string;
}

const AITrendPrediction = ({ ipoId, className }: AITrendPredictionProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>('24h');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('balanced');
  
  const { 
    data: predictionData,
    isLoading,
    error,
    refetch
  } = usePricePrediction({
    ipoId,
    selectedTimeframe,
    selectedModel
  });
  
  const getDirectionColor = (direction?: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') return "text-green-500";
    if (direction === 'down') return "text-red-500";
    return "text-blue-500";
  };
  
  const getDirectionIcon = (direction?: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (direction === 'down') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <BarChart4 className="h-5 w-5 text-blue-500" />;
  };
  
  const getModelName = (modelType: AIModelType) => {
    switch (modelType) {
      case 'conservative': return 'Conservative';
      case 'balanced': return 'Balanced';
      case 'aggressive': return 'Aggressive';
      case 'experimental': return 'Experimental';
      default: return 'Balanced';
    }
  };
  
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value as PredictionTimeframe);
  };
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value as AIModelType);
  };
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
          AI Trend Prediction
        </h3>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/30">
          Beta
        </Badge>
      </div>
      
      <Tabs defaultValue="prediction" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prediction" className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              <p>Error loading prediction: {error.message}</p>
            </div>
          ) : predictionData && predictionData.prediction ? (
            <>
              <div className="bg-axium-gray-100/50 dark:bg-axium-gray-800/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-axium-gray-500 mb-1">Predicted Movement ({selectedTimeframe})</div>
                    <div className="text-2xl font-bold flex items-center">
                      {getDirectionIcon(predictionData.prediction.direction)}
                      <span className={cn("ml-2", getDirectionColor(predictionData.prediction.direction))}>
                        {predictionData.prediction.direction === 'up' ? '+' : predictionData.prediction.direction === 'down' ? '-' : ''}
                        {predictionData.prediction.percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-axium-gray-500 mb-1">Confidence</div>
                    <div className="text-2xl font-bold">{predictionData.confidence}%</div>
                  </div>
                </div>
                
                {predictionData.targetPrice && (
                  <div className="mt-3 pt-3 border-t border-axium-gray-200 dark:border-axium-gray-700">
                    <div className="text-sm text-axium-gray-500 mb-1">Predicted Target Price</div>
                    <div className="text-xl font-semibold">${predictionData.targetPrice.toFixed(2)}</div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-axium-gray-500 mb-2">Key Factors</div>
                <div className="space-y-2">
                  {predictionData.factors?.map((factor, index) => (
                    <div key={index} className="text-sm flex items-start">
                      <Zap className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-axium-gray-500 mt-2">
                Model: {getModelName(predictionData.modelUsed)} • Last Updated: {new Date(predictionData.timestamp).toLocaleString()}
              </div>
            </>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-600 rounded-md">
              <p>No prediction data available</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Timeframe</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedTimeframe === '24h' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleTimeframeChange('24h')}
                >
                  24h
                </Button>
                <Button 
                  variant={selectedTimeframe === '7d' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleTimeframeChange('7d')}
                >
                  7 Days
                </Button>
                <Button 
                  variant={selectedTimeframe === '30d' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleTimeframeChange('30d')}
                >
                  30 Days
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Model Type</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedModel === 'conservative' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleModelChange('conservative')}
                >
                  Conservative
                </Button>
                <Button 
                  variant={selectedModel === 'balanced' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleModelChange('balanced')}
                >
                  Balanced
                </Button>
                <Button 
                  variant={selectedModel === 'aggressive' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleModelChange('aggressive')}
                >
                  Aggressive
                </Button>
                <Button 
                  variant={selectedModel === 'experimental' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleModelChange('experimental')}
                >
                  Experimental
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full mt-2" 
              onClick={() => refetch()}
            >
              Update Prediction
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default AITrendPrediction;
