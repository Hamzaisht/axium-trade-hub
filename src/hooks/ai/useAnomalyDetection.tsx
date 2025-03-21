
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useMarketData } from '@/hooks/useMarketData';
import { AnomalyType, detectAnomalies } from '@/utils/mockAIModels';

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
  // Use the market data hook to get real-time trade data if not provided
  const { recentTrades: marketTrades } = useMarketData(ipoId);
  
  // Use provided trades or fall back to market trades
  const tradesToAnalyze = recentTrades.length > 0 ? recentTrades : marketTrades;
  
  return useQuery({
    queryKey: ['anomaly-detection', ipoId, tradesToAnalyze.length],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        // Use the mockAPI for simulating AI detection
        return await mockAIValuationAPI.detectAnomalies(ipoId, tradesToAnalyze);
      } catch (error) {
        console.error('Error detecting anomalies:', error);
        throw error;
      }
    },
    enabled: !!ipoId && enabled && tradesToAnalyze.length > 0,
    staleTime: 1000 * 60 * 1, // 1 minute - shorter time for anomaly detection
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for simulation
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
      (anomaly: any) => anomaly.severity >= 7
    );
    
    if (highSeverityAnomalies?.length > 0) {
      const mostSevere = highSeverityAnomalies[0];
      
      // Different toast styles based on severity
      if (mostSevere.severity >= 9) {
        toast.error(`Critical anomaly detected: ${mostSevere.description}`, {
          duration: 6000,
          position: 'top-right',
        });
      } else {
        toast.warning(`Unusual trading pattern detected: ${mostSevere.description}`, {
          duration: 6000,
          position: 'top-right',
        });
      }
    }
  }, [anomalyData, enabled]);
  
  return null;
};

// Hook to get all anomalies across the market
export const useMarketAnomalies = (ipoIds: string[] = []) => {
  return useQuery({
    queryKey: ['market-anomalies', ipoIds.join('-')],
    queryFn: async () => {
      if (ipoIds.length === 0) return [];
      
      try {
        // Fetch anomalies for all provided IPO IDs
        const anomalyPromises = ipoIds.map(id => 
          mockAIValuationAPI.detectAnomalies(id)
        );
        
        const results = await Promise.all(anomalyPromises);
        
        // Filter to only include IPOs with detected anomalies
        return results
          .map((result, index) => ({
            ...result,
            ipoId: ipoIds[index]
          }))
          .filter(result => result.detected);
      } catch (error) {
        console.error('Error detecting market anomalies:', error);
        return [];
      }
    },
    enabled: ipoIds.length > 0,
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchInterval: 1000 * 45, // Refetch every 45 seconds
  });
};

// Helper function to get severity text and color
export const getSeverityInfo = (severity: number): { 
  text: 'Low' | 'Medium' | 'High' | 'Critical',
  color: 'green' | 'yellow' | 'orange' | 'red'
} => {
  if (severity >= 9) return { text: 'Critical', color: 'red' };
  if (severity >= 7) return { text: 'High', color: 'orange' };
  if (severity >= 5) return { text: 'Medium', color: 'yellow' };
  return { text: 'Low', color: 'green' };
};

// Helper function to get suggested action based on anomaly type and severity
export const getSuggestedAction = (
  type: AnomalyType, 
  severity: number
): string => {
  if (severity >= 9) {
    switch (type) {
      case AnomalyType.WASH_TRADING:
      case AnomalyType.PUMP_AND_DUMP:
      case AnomalyType.CIRCULAR_TRADING:
        return 'Freeze token';
      default:
        return 'Investigate immediately';
    }
  }
  
  if (severity >= 7) {
    switch (type) {
      case AnomalyType.WASH_TRADING:
      case AnomalyType.CIRCULAR_TRADING:
        return 'Investigate accounts';
      case AnomalyType.RAPID_PRICE_CHANGE:
      case AnomalyType.UNUSUAL_VOLUME:
        return 'Monitor closely';
      default:
        return 'Alert users';
    }
  }
  
  if (severity >= 5) {
    return 'Monitor activity';
  }
  
  return 'No action needed';
};
