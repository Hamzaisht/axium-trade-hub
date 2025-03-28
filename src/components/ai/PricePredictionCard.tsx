
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, ArrowDown, ArrowUp, BarChart4, Cpu, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PredictionData {
  price: number;
  confidence: number;
  direction: 'up' | 'down' | 'neutral';
  percentageChange: number;
  volatility: number;
  supportLevels: number[];
  resistanceLevels: number[];
  timeframe: PredictionTimeframe;
  generatedAt: string;
  modelType: AIModelType;
}

interface PricePredictionCardProps {
  prediction: PredictionData | null | undefined;
  isLoading?: boolean;
  symbol?: string;
  onRefresh?: () => void;
  onTimeframeChange?: (timeframe: PredictionTimeframe) => void;
  onModelChange?: (model: AIModelType) => void;
}

export const PricePredictionCard: React.FC<PricePredictionCardProps> = ({
  prediction,
  isLoading = false,
  symbol,
  onRefresh,
  onTimeframeChange,
  onModelChange
}) => {
  if (isLoading) {
    return <PredictionCardSkeleton />;
  }

  if (!prediction) {
    return (
      <Card className="p-4">
        <Alert variant="default" className="bg-gray-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No prediction data available for {symbol || "this asset"}. 
            {onRefresh && (
              <Button variant="link" className="p-0 h-auto mt-1" onClick={onRefresh}>
                Refresh data
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Format the prediction data for display
  const formattedPrice = prediction.price.toFixed(2);
  const formattedChange = Math.abs(prediction.percentageChange).toFixed(2);
  const confidenceColor = prediction.confidence > 75 
    ? 'text-green-600' 
    : prediction.confidence > 50 
      ? 'text-amber-600' 
      : 'text-red-600';
  
  // Format the timestamp
  const generatedAt = prediction.generatedAt 
    ? new Date(prediction.generatedAt).toLocaleString() 
    : 'Unknown time';

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            Price Prediction 
            {prediction.timeframe && (
              <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded">
                {prediction.timeframe}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500">Generated at {generatedAt}</p>
        </div>
        
        {/* Controls for timeframe and model selection if handlers provided */}
        {(onTimeframeChange || onModelChange) && (
          <div className="flex gap-2">
            {onTimeframeChange && (
              <Select 
                defaultValue={prediction.timeframe} 
                onValueChange={(value) => onTimeframeChange(value as PredictionTimeframe)}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {onModelChange && (
              <Select 
                defaultValue={prediction.modelType} 
                onValueChange={(value) => onModelChange(value as AIModelType)}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neural">Neural</SelectItem>
                  <SelectItem value="statistical">Statistical</SelectItem>
                  <SelectItem value="ensemble">Ensemble</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
      
      {/* Low confidence warning */}
      {prediction.confidence < 50 && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Low confidence prediction. Consider using additional indicators for decision making.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Predicted Price</span>
            <span className="text-sm bg-gray-200 px-2 py-0.5 rounded">{symbol}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold">${formattedPrice}</span>
            <div className={cn(
              "ml-2 flex items-center",
              prediction.direction === 'up' ? 'text-green-600' : 
              prediction.direction === 'down' ? 'text-red-600' : 
              'text-gray-600'
            )}>
              {prediction.direction === 'up' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : prediction.direction === 'down' ? (
                <ArrowDown className="h-4 w-4 mr-1" />
              ) : (
                <span className="h-4 w-4 mr-1">—</span>
              )}
              <span className="text-sm font-medium">{formattedChange}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="text-sm text-gray-500">Model Confidence</span>
          <div className="flex items-center mt-1">
            <span className={cn("text-2xl font-bold", confidenceColor)}>
              {prediction.confidence}%
            </span>
            <span className="ml-2">
              {prediction.modelType === 'hybrid' && <Cpu className="h-4 w-4" />}
              {prediction.modelType === 'statistical' && <BarChart4 className="h-4 w-4" />}
            </span>
          </div>
        </div>
      </div>
      
      {/* Support and Resistance Levels */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Support Levels</h4>
          <div className="space-y-1">
            {prediction.supportLevels && prediction.supportLevels.length > 0 ? (
              prediction.supportLevels.map((level, i) => (
                <div key={`support-${i}`} className="bg-green-50 text-green-800 py-1 px-2 rounded text-sm">
                  ${level.toFixed(2)}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No support levels available</div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Resistance Levels</h4>
          <div className="space-y-1">
            {prediction.resistanceLevels && prediction.resistanceLevels.length > 0 ? (
              prediction.resistanceLevels.map((level, i) => (
                <div key={`resistance-${i}`} className="bg-red-50 text-red-800 py-1 px-2 rounded text-sm">
                  ${level.toFixed(2)}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No resistance levels available</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Volatility Indicator */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Expected Volatility</h4>
        <div className="h-4 bg-gray-100 rounded overflow-hidden w-full">
          <div 
            className={cn(
              "h-full",
              prediction.volatility < 30 ? "bg-green-500" : 
              prediction.volatility < 60 ? "bg-yellow-500" : 
              "bg-red-500"
            )}
            style={{ width: `${prediction.volatility}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </Card>
  );
};

const PredictionCardSkeleton = () => (
  <Card className="p-4">
    <div className="flex justify-between items-start mb-4">
      <div>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Skeleton className="h-5 w-24 mb-2" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      
      <div>
        <Skeleton className="h-5 w-24 mb-2" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
    
    <div className="mt-4">
      <Skeleton className="h-5 w-36 mb-2" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between mt-1">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  </Card>
);

export default PricePredictionCard;
