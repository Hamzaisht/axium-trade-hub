
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Brain, AlertCircle, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { useAIValuationEngine } from '@/hooks/ai/useAIValuationEngine';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface AITrendPredictionProps {
  ipoId: string;
  className?: string;
}

export const AITrendPrediction: React.FC<AITrendPredictionProps> = ({ ipoId, className }) => {
  const { valuation, isLoading, refetch } = useAIValuationEngine({ ipoId });
  
  if (isLoading) {
    return (
      <GlassCard className={`p-4 ${className || ''}`}>
        <div className="flex items-center mb-3">
          <Brain className="h-5 w-5 text-axium-blue mr-2" />
          <h3 className="text-lg font-semibold">AI Price Prediction</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-axium-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-axium-gray-200 rounded"></div>
          <div className="h-4 bg-axium-gray-200 rounded w-1/2"></div>
        </div>
      </GlassCard>
    );
  }
  
  if (!valuation) {
    return (
      <GlassCard className={`p-4 ${className || ''}`}>
        <div className="flex items-center mb-3">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold">Prediction Unavailable</h3>
        </div>
        <p className="text-axium-gray-600 text-sm mb-3">
          We couldn't generate a price prediction for this asset.
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Try Again
        </Button>
      </GlassCard>
    );
  }
  
  const isPriceRising = valuation.priceChangePercent >= 0;
  
  // Extract top market movers to explain prediction
  const topMovers = valuation.marketMovers.slice(0, 2);
  
  return (
    <GlassCard className={`p-4 ${className || ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-axium-blue mr-2" />
          <h3 className="text-lg font-semibold">AI Price Prediction</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Info className="h-4 w-4 text-axium-gray-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm max-w-[200px]">
                AI prediction based on social engagement, sentiment analysis, and market trends
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mb-2">
        <div className="text-sm text-axium-gray-600">Predicted Price</div>
        <div className="flex items-baseline">
          <div className="text-2xl font-semibold">${valuation.currentPrice.toFixed(2)}</div>
          <div className={`ml-2 text-sm flex items-center ${isPriceRising ? 'text-green-500' : 'text-red-500'}`}>
            {isPriceRising ? (
              <>
                <ArrowUpRight className="h-4 w-4 mr-0.5" />
                +{valuation.priceChangePercent.toFixed(2)}%
              </>
            ) : (
              <>
                <ArrowDownRight className="h-4 w-4 mr-0.5" />
                {valuation.priceChangePercent.toFixed(2)}%
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-xs text-axium-gray-600 flex justify-between mb-1">
          <span>Confidence: {(valuation.confidence * 100).toFixed(0)}%</span>
          <span>Volatility: {(valuation.volatility * 100).toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-axium-gray-200 rounded-full">
          <div 
            className={`h-full rounded-full ${isPriceRising ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${valuation.confidence * 100}%` }}
          />
        </div>
      </div>
      
      <div className="text-xs text-axium-gray-600 mt-3">
        <div className="font-medium mb-1">Market Movers:</div>
        <ul className="space-y-1">
          {topMovers.map((mover, index) => (
            <li key={index} className="flex items-start">
              <span className={`inline-block h-2 w-2 rounded-full mt-1 mr-1.5 ${mover.impact >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{mover.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
};

export default AITrendPrediction;
