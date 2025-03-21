
import { useAnomalyDetection } from '@/hooks/ai/useAnomalyDetection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnomalyWarningBannerProps {
  ipoId?: string;
  className?: string;
}

const AnomalyWarningBanner = ({ ipoId, className }: AnomalyWarningBannerProps) => {
  const { data: anomalyData, isLoading } = useAnomalyDetection({
    ipoId,
    enabled: !!ipoId
  });
  
  if (isLoading || !anomalyData || !anomalyData.detected) {
    return null;
  }
  
  // Only show warning for high severity anomalies
  const highSeverityAnomalies = anomalyData.anomalies?.filter(
    (anomaly: any) => anomaly.severity >= 7
  );
  
  if (!highSeverityAnomalies || highSeverityAnomalies.length === 0) {
    return null;
  }
  
  // Get the most severe anomaly
  const mostSevere = highSeverityAnomalies.reduce(
    (prev: any, current: any) => (current.severity > prev.severity ? current : prev),
    highSeverityAnomalies[0]
  );
  
  const getWarningMessage = (anomaly: any) => {
    switch (anomaly.type) {
      case 'wash_trading':
        return 'Suspicious trading patterns detected. Possible wash trading.';
      case 'pump_and_dump':
        return 'Warning: Possible pump and dump activity. Trade with caution.';
      case 'rapid_price_change':
        return 'Trading activity flagged for high volatility. Proceed with caution.';
      case 'unusual_volume':
        return 'Unusually high trading volume detected. Market may be unstable.';
      case 'circular_trading':
        return 'Circular trading pattern identified. Possible market manipulation.';
      default:
        return 'Unusual trading activity detected. Proceed with caution.';
    }
  };
  
  return (
    <Alert 
      variant="warning" 
      className={cn(className)}
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        ⚠️ {getWarningMessage(mostSevere)}
      </AlertDescription>
    </Alert>
  );
};

export default AnomalyWarningBanner;
