
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AlertTriangle, Activity, Info } from 'lucide-react';
import { useAnomalyDetection } from '@/hooks/ai/useAnomalyDetection';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AnomalyDetectionCardProps {
  ipoId?: string;
  className?: string;
}

export const AnomalyDetectionCard: React.FC<AnomalyDetectionCardProps> = ({ 
  ipoId,
  className 
}) => {
  const { data: anomalyData, isLoading, refetch } = useAnomalyDetection({ 
    ipoId,
    enabled: true
  });

  const getAnomalySeverityColor = (severity: number): string => {
    if (severity >= 8) return 'text-red-500';
    if (severity >= 6) return 'text-orange-500';
    if (severity >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <GlassCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          Anomaly Detection
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : !anomalyData ? (
        <p className="text-axium-gray-500">No anomaly data available</p>
      ) : !anomalyData.detected ? (
        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-green-800 text-sm">
              No anomalies detected in recent trading patterns. Market behavior appears normal.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                {anomalyData.anomalies.length} anomalies detected in recent trading patterns. 
                The most severe is classified as {anomalyData.anomalies[0]?.type.toLowerCase().replace('_', ' ')}.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {anomalyData.anomalies.slice(0, 3).map((anomaly, index) => (
              <div key={index} className="border p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={cn("font-medium", getAnomalySeverityColor(anomaly.severity))}>
                    {anomaly.type.replace('_', ' ')}
                  </h4>
                  <span className="text-xs text-axium-gray-500">
                    {new Date(anomaly.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-axium-gray-600 mb-2">{anomaly.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-axium-gray-500">Severity:</span>
                  <Progress value={anomaly.severity * 10} className="h-1.5 flex-grow" />
                  <span className="text-xs font-medium">{anomaly.severity}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default AnomalyDetectionCard;
