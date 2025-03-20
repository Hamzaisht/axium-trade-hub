
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { externalApiService, CreatorMetrics } from '@/services/externalApiService';
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
      return await externalApiService.getCreatorMetrics(creatorId);
    },
    enabled: !!creatorId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    meta: {
      errorMessage: "Could not fetch creator's external data"
    }
  });

  // Calculate aggregated metrics for easier consumption
  const aggregatedMetrics = creatorMetricsQuery.data ? calculateAggregatedMetrics(creatorMetricsQuery.data) : null;

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
    refetch: creatorMetricsQuery.refetch
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
