
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { APIServiceStatus } from '@/hooks/useAPIConfiguration';

interface StatusAlertsProps {
  apiServiceStatus: APIServiceStatus;
  availablePlatforms: string[];
}

export const StatusAlerts = ({ apiServiceStatus, availablePlatforms }: StatusAlertsProps) => {
  if (apiServiceStatus === 'live' || (apiServiceStatus === 'mixed' && availablePlatforms.length > 2)) {
    return null;
  }
  
  if (apiServiceStatus === 'mock') {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Using Mock Data</AlertTitle>
        <AlertDescription>
          External API keys are not configured. Add API keys in environment variables to use real data sources.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (apiServiceStatus === 'mixed' && availablePlatforms.length <= 2) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Limited Real Data</AlertTitle>
        <AlertDescription>
          Only {availablePlatforms.length} platform{availablePlatforms.length === 1 ? '' : 's'} configured with real API keys. 
          Add more API keys for a more comprehensive analysis.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
