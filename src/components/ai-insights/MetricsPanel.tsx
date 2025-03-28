
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Progress } from '@/components/ui/progress';
import { Globe, Music, Briefcase, Heart, Users, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ValuationBreakdown } from '@/hooks/ai/useAIValuationEngine';

interface MetricsPanelProps {
  metrics: ValuationBreakdown;
  className?: string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  className
}) => {
  // Normalize values to percentages for visualization
  const maxValue = Math.max(
    metrics.socialInfluence.value,
    metrics.streamingInfluence.value,
    metrics.brandDealsInfluence.value,
    metrics.sentimentInfluence.value,
    metrics.financialInfluence.value,
    metrics.fanEngagementInfluence.value
  );
  
  const normalizeValue = (value: number) => {
    return (value / maxValue) * 100;
  };
  
  return (
    <GlassCard className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold mb-4">Value Components</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Social Influence</span>
            </div>
            <span className="text-sm">{metrics.socialInfluence.value.toFixed(1)}</span>
          </div>
          <Progress 
            value={normalizeValue(metrics.socialInfluence.value)} 
            className="h-2 bg-axium-gray-200"
            indicatorClassName="bg-blue-500"
          />
          <div className="text-xs text-axium-gray-500 mt-1">
            Weight: {(metrics.socialInfluence.weight * 100).toFixed(0)}%
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Streaming Platforms</span>
            </div>
            <span className="text-sm">{metrics.streamingInfluence.value.toFixed(1)}</span>
          </div>
          <Progress 
            value={normalizeValue(metrics.streamingInfluence.value)} 
            className="h-2 bg-axium-gray-200"
            indicatorClassName="bg-purple-500"
          />
          <div className="text-xs text-axium-gray-500 mt-1">
            Weight: {(metrics.streamingInfluence.weight * 100).toFixed(0)}%
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Brand Deals</span>
            </div>
            <span className="text-sm">{metrics.brandDealsInfluence.value.toFixed(1)}</span>
          </div>
          <Progress 
            value={normalizeValue(metrics.brandDealsInfluence.value)} 
            className="h-2 bg-axium-gray-200"
            indicatorClassName="bg-orange-500"
          />
          <div className="text-xs text-axium-gray-500 mt-1">
            Weight: {(metrics.brandDealsInfluence.weight * 100).toFixed(0)}%
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Sentiment</span>
            </div>
            <span className="text-sm">{metrics.sentimentInfluence.value.toFixed(1)}</span>
          </div>
          <Progress 
            value={normalizeValue(metrics.sentimentInfluence.value)} 
            className="h-2 bg-axium-gray-200"
            indicatorClassName="bg-red-500"
          />
          <div className="text-xs text-axium-gray-500 mt-1">
            Weight: {(metrics.sentimentInfluence.weight * 100).toFixed(0)}%
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Financial Metrics</span>
            </div>
            <span className="text-sm">{metrics.financialInfluence.value.toFixed(1)}</span>
          </div>
          <Progress 
            value={normalizeValue(metrics.financialInfluence.value)} 
            className="h-2 bg-axium-gray-200"
            indicatorClassName="bg-green-500"
          />
          <div className="text-xs text-axium-gray-500 mt-1">
            Weight: {(metrics.financialInfluence.weight * 100).toFixed(0)}%
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-500" />
              <span className="text-sm font-medium">Fan Engagement</span>
            </div>
            <span className="text-sm">{metrics.fanEngagementInfluence.value.toFixed(1)}</span>
          </div>
          <Progress 
            value={normalizeValue(metrics.fanEngagementInfluence.value)} 
            className="h-2 bg-axium-gray-200"
            indicatorClassName="bg-sky-500"
          />
          <div className="text-xs text-axium-gray-500 mt-1">
            Weight: {(metrics.fanEngagementInfluence.weight * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
