
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface UseAnomalyDetectionProps {
  ipoId?: string;
  recentTrades?: any[];
  enabled?: boolean;
}

export const useAnomalyDetection = ({ 
  ipoId, 
  recentTrades = [],
  enabled = true 
}: UseAnomalyDetectionProps) => {
  return useQuery({
    queryKey: ['anomaly-detection', ipoId, recentTrades.length],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        // Pass the recent trades for analysis
        return await mockAIValuationAPI.detectAnomalies(ipoId, recentTrades);
      } catch (error) {
        console.error('Error detecting anomalies:', error);
        throw error;
      }
    },
    enabled: !!ipoId && enabled && recentTrades.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter time since we want to detect anomalies quickly
    refetchOnWindowFocus: true
  });
};

// This hook monitors anomalies and triggers alerts when needed
export const useAnomalyAlerts = ({ 
  anomalyData,
  enabled = true
}: { 
  anomalyData: any, 
  enabled: boolean 
}) => {
  useEffect(() => {
    if (!enabled || !anomalyData) return;
    
    // Check if there are high severity anomalies to alert about
    const highSeverityAnomalies = anomalyData.anomalies?.filter(
      (anomaly: any) => anomaly.severity >= 8
    );
    
    if (highSeverityAnomalies?.length > 0) {
      const mostSevere = highSeverityAnomalies[0];
      toast.warning(`Unusual trading pattern detected: ${mostSevere.description}`, {
        duration: 6000,
        position: 'top-right',
      });
    }
  }, [anomalyData, enabled]);
  
  return null;
};
