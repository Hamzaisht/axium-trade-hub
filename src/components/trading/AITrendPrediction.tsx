
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { usePricePrediction } from '@/hooks/ai';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AITrendPredictionProps {
  ipoId: string;
  className?: string;
}

export default function AITrendPrediction({ ipoId, className }: AITrendPredictionProps) {
  const { prediction, confidence, timeframe, isLoading, error } = usePricePrediction(ipoId);
  
  if (isLoading) {
    return (
      <GlassCard className={`p-4 ${className || ''}`}>
        <h3 className="text-lg font-semibold mb-2">AI Trend Prediction</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-axium-gray-200 dark:bg-axium-gray-700 rounded mb-3 w-3/4"></div>
          <div className="h-10 bg-axium-gray-200 dark:bg-axium-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-axium-gray-200 dark:bg-axium-gray-700 rounded w-1/2"></div>
        </div>
      </GlassCard>
    );
  }
  
  if (error || !prediction) {
    return (
      <GlassCard className={`p-4 ${className || ''}`}>
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <h3 className="text-lg font-semibold">AI Prediction Unavailable</h3>
        </div>
        <p className="text-axium-gray-600 dark:text-axium-gray-400 text-sm">
          Our AI model is currently recalibrating based on recent market events. Check back soon.
        </p>
      </GlassCard>
    );
  }
  
  const isPositive = prediction > 0;
  const indicatorClassName = isPositive ? "bg-green-500" : "bg-red-500";
  
  return (
    <GlassCard className={`p-4 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-2">AI Trend Prediction</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
            {timeframe} Forecast
          </span>
          <span className="text-sm font-medium">
            Confidence: {confidence}%
          </span>
        </div>
        <Progress value={confidence} max={100} indicatorClassName={indicatorClassName} />
      </div>
      
      <div className={`flex items-center justify-between p-3 rounded-lg ${
        isPositive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
      }`}>
        <div className="flex items-center">
          {isPositive ? (
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-500 mr-3" />
          )}
          <div>
            <div className={`text-xl font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{prediction.toFixed(2)}%
            </div>
            <div className="text-sm text-axium-gray-600 dark:text-axium-gray-400">
              Expected movement
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-axium-gray-500 mt-3">
        Based on historical data, sentiment analysis, and market conditions
      </p>
    </GlassCard>
  );
}
