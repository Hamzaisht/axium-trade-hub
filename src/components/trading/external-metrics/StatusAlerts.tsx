
import { AlertCircle, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { APIServiceStatus } from '@/hooks/useAPIConfiguration';

interface StatusAlertsProps {
  apiServiceStatus: APIServiceStatus;
  availablePlatforms: string[];
}

export const StatusAlerts = ({ apiServiceStatus, availablePlatforms }: StatusAlertsProps) => {
  return (
    <>
      {apiServiceStatus === 'mock' && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Using mock data</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            Add API keys as environment variables to connect to real APIs. Example: 
            VITE_TWITTER_API_KEY, VITE_INSTAGRAM_API_KEY, VITE_SPOTIFY_API_KEY, etc.
          </AlertDescription>
        </Alert>
      )}
      
      {apiServiceStatus === 'mixed' && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Database className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Using mixed data sources</AlertTitle>
          <AlertDescription className="text-blue-700 text-sm">
            Available APIs: {availablePlatforms.join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
