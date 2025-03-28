
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Progress } from '@/components/ui/progress';
import { ChartBar, LineChart, TrendingUp, DollarSign, Heart, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface MetricsPanelProps {
  metrics: {
    socialInfluence?: number;
    streamingInfluence?: number;
    brandDealsInfluence?: number;
    sentimentInfluence?: number;
    marketDepthInfluence?: number;
    newsInfluence?: number;
  };
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  // Normalize metrics to ensure we don't have undefined values
  const normalizedMetrics = {
    socialInfluence: metrics?.socialInfluence || 0,
    streamingInfluence: metrics?.streamingInfluence || 0,
    brandDealsInfluence: metrics?.brandDealsInfluence || 0,
    sentimentInfluence: metrics?.sentimentInfluence || 0,
    marketDepthInfluence: metrics?.marketDepthInfluence || 0,
    newsInfluence: metrics?.newsInfluence || 0,
  };

  // Helper function for rating labels
  const getRatingLabel = (value: number) => {
    if (value >= 75) return { text: 'Excellent', color: 'text-green-500' };
    if (value >= 60) return { text: 'Good', color: 'text-blue-500' };
    if (value >= 45) return { text: 'Average', color: 'text-amber-500' };
    if (value >= 30) return { text: 'Below Average', color: 'text-orange-500' };
    return { text: 'Poor', color: 'text-red-500' };
  };

  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <ChartBar className="h-5 w-5 mr-2 text-axium-blue" />
        AI Metrics
      </h3>
      
      <div className="space-y-5">
        {/* Social Media Metrics */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Radio className="h-4 w-4 mr-1.5 text-blue-500" />
              <span className="text-sm font-medium">Social Media</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold mr-2">
                {Math.round(normalizedMetrics.socialInfluence)}%
              </span>
              <Badge variant="outline" className={getRatingLabel(normalizedMetrics.socialInfluence).color}>
                {getRatingLabel(normalizedMetrics.socialInfluence).text}
              </Badge>
            </div>
          </div>
          <Progress value={normalizedMetrics.socialInfluence} max={100} className="h-1.5" />
          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mt-1">
            Follower growth, engagement rates and audience reach metrics
          </p>
        </div>
        
        {/* Content Performance */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <LineChart className="h-4 w-4 mr-1.5 text-amber-500" />
              <span className="text-sm font-medium">Content Performance</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold mr-2">
                {Math.round(normalizedMetrics.streamingInfluence)}%
              </span>
              <Badge variant="outline" className={getRatingLabel(normalizedMetrics.streamingInfluence).color}>
                {getRatingLabel(normalizedMetrics.streamingInfluence).text}
              </Badge>
            </div>
          </div>
          <Progress value={normalizedMetrics.streamingInfluence} max={100} className="h-1.5" />
          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mt-1">
            Video views, watch time, and content schedule consistency
          </p>
        </div>
        
        {/* Brand Partnerships */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1.5 text-green-500" />
              <span className="text-sm font-medium">Brand Partnerships</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold mr-2">
                {Math.round(normalizedMetrics.brandDealsInfluence)}%
              </span>
              <Badge variant="outline" className={getRatingLabel(normalizedMetrics.brandDealsInfluence).color}>
                {getRatingLabel(normalizedMetrics.brandDealsInfluence).text}
              </Badge>
            </div>
          </div>
          <Progress value={normalizedMetrics.brandDealsInfluence} max={100} className="h-1.5" />
          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mt-1">
            Sponsorship deals, brand integration quality and monetization
          </p>
        </div>
        
        {/* Market Sentiment */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1.5 text-red-500" />
              <span className="text-sm font-medium">Market Sentiment</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold mr-2">
                {Math.round(normalizedMetrics.sentimentInfluence)}%
              </span>
              <Badge variant="outline" className={getRatingLabel(normalizedMetrics.sentimentInfluence).color}>
                {getRatingLabel(normalizedMetrics.sentimentInfluence).text}
              </Badge>
            </div>
          </div>
          <Progress value={normalizedMetrics.sentimentInfluence} max={100} className="h-1.5" />
          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mt-1">
            Public perception, social media sentiment and audience loyalty
          </p>
        </div>
        
        {/* Market Depth */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1.5 text-purple-500" />
              <span className="text-sm font-medium">Market Depth</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold mr-2">
                {Math.round(normalizedMetrics.marketDepthInfluence)}%
              </span>
              <Badge variant="outline" className={getRatingLabel(normalizedMetrics.marketDepthInfluence).color}>
                {getRatingLabel(normalizedMetrics.marketDepthInfluence).text}
              </Badge>
            </div>
          </div>
          <Progress value={normalizedMetrics.marketDepthInfluence} max={100} className="h-1.5" />
          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mt-1">
            Trading volume, liquidity, and demand indicators
          </p>
        </div>
        
        {/* News Impact */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Radio className="h-4 w-4 mr-1.5 text-pink-500" />
              <span className="text-sm font-medium">News Impact</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold mr-2">
                {Math.round(normalizedMetrics.newsInfluence)}%
              </span>
              <Badge variant="outline" className={getRatingLabel(normalizedMetrics.newsInfluence).color}>
                {getRatingLabel(normalizedMetrics.newsInfluence).text}
              </Badge>
            </div>
          </div>
          <Progress value={normalizedMetrics.newsInfluence} max={100} className="h-1.5" />
          <p className="text-xs text-axium-gray-600 dark:text-axium-gray-400 mt-1">
            Media coverage, news sentiment, and public relations
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default MetricsPanel;
