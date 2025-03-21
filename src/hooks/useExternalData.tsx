
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiConfigService, CreatorMetrics } from '@/services/api/ApiConfigService';
import { toast } from 'sonner';

interface UseExternalDataProps {
  creatorId?: string;
  enabled?: boolean;
}

export const useExternalData = ({ creatorId, enabled = true }: UseExternalDataProps) => {
  // Fetch creator metrics using react-query
  const creatorMetricsQuery = useQuery({
    queryKey: ['creator-metrics', creatorId],
    queryFn: async () => {
      if (!creatorId) return null;
      try {
        return await apiConfigService.getCreatorMetrics(creatorId);
      } catch (error) {
        console.error('Error fetching creator metrics:', error);
        throw new Error('Failed to fetch creator metrics');
      }
    },
    enabled: !!creatorId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    meta: {
      errorMessage: "Could not fetch creator's external data"
    }
  });

  // Calculate data source stats
  const getDataSourceStats = (data: CreatorMetrics | null | undefined) => {
    if (!data) return { total: 0, real: 0, mock: 0 };
    
    const socialPlatforms = data.social.length;
    const streamingPlatforms = data.streaming.length;
    const totalPlatforms = socialPlatforms + streamingPlatforms;
    
    const realSocialPlatforms = data.social.filter(p => p.isRealData).length;
    const realStreamingPlatforms = data.streaming.filter(p => p.isRealData).length;
    const totalRealPlatforms = realSocialPlatforms + realStreamingPlatforms;
    
    return {
      total: totalPlatforms,
      real: totalRealPlatforms,
      mock: totalPlatforms - totalRealPlatforms
    };
  };

  // Calculate aggregated metrics for easier consumption
  const aggregatedMetrics = creatorMetricsQuery.data ? calculateAggregatedMetrics(creatorMetricsQuery.data) : null;
  
  // Get stats about data sources
  const dataSourceStats = getDataSourceStats(creatorMetricsQuery.data);

  return {
    // Raw data
    metrics: creatorMetricsQuery.data,
    
    // Aggregated metrics for easy consumption
    aggregatedMetrics,
    
    // Query state
    isLoading: creatorMetricsQuery.isLoading,
    isError: creatorMetricsQuery.isError,
    error: creatorMetricsQuery.error,
    
    // Refresh function
    refetch: creatorMetricsQuery.refetch,
    
    // Data source statistics
    dataSourceStats
  };
};

// Helper function to calculate aggregated metrics
const calculateAggregatedMetrics = (metrics: CreatorMetrics) => {
  // Total followers across platforms
  const totalFollowers = metrics.social.reduce((sum, platform) => sum + platform.followers, 0);
  
  // Average engagement rate
  const avgEngagement = metrics.social.length > 0
    ? metrics.social.reduce((sum, platform) => sum + platform.engagement, 0) / metrics.social.length
    : 0;
  
  // Total streams
  const totalStreams = metrics.streaming.reduce((sum, platform) => sum + platform.streams, 0);
  
  // Total brand deal value
  const totalBrandValue = metrics.brandDeals.reduce((sum, deal) => sum + deal.dealValue, 0);
  
  // Calculate growth metrics
  const averageGrowth = metrics.social.length > 0
    ? metrics.social.reduce((sum, platform) => sum + platform.growth, 0) / metrics.social.length
    : 0;
  
  // Calculate streaming popularity
  const streamingPopularity = metrics.streaming.length > 0
    ? metrics.streaming.reduce((sum, platform) => sum + platform.popularity, 0) / metrics.streaming.length
    : 0;
  
  return {
    totalFollowers,
    avgEngagement,
    totalStreams,
    totalBrandValue,
    averageGrowth,
    streamingPopularity,
    activeBrandDeals: metrics.brandDeals.length,
    lastUpdated: metrics.lastUpdated
  };
};

export default useExternalData;
