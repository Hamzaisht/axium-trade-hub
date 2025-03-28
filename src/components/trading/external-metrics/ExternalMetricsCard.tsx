
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useExternalData } from '@/hooks/useExternalData';
import { useAPIConfiguration } from '@/hooks/useAPIConfiguration';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import our refactored components
import { ApiStatusBadge } from './ApiStatusBadge';
import { StatusAlerts } from './StatusAlerts';
import { SummaryStats } from './SummaryStats';
import { DataTabs } from './DataTabs';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';
import { NoDataState } from './NoDataState';

interface ExternalMetricsCardProps {
  creatorId?: string;
  className?: string;
}

export const ExternalMetricsCard = ({ creatorId, className }: ExternalMetricsCardProps) => {
  const { 
    metrics, 
    aggregatedMetrics,
    isLoading, 
    isError, 
    refetch,
    dataSourceStats 
  } = useExternalData({ creatorId });
  
  const { apiServiceStatus, apiStatus, availablePlatforms } = useAPIConfiguration();
  
  // Handle refreshing data
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  useEffect(() => {
    // Show appropriate notifications based on API status
    if (apiServiceStatus === 'mock') {
      toast.info(
        "Using mock data. Set API keys in environment variables to use real data.", 
        { id: "api-mock-notice", duration: 5000 }
      );
    } else if (apiServiceStatus === 'mixed') {
      toast.info(
        `Using ${apiStatus.real} real APIs and ${apiStatus.mock} mock APIs.`,
        { id: "api-mixed-notice", duration: 5000 }
      );
    }
  }, [apiServiceStatus, apiStatus]);
  
  if (!creatorId) {
    return null;
  }
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">External Data</h3>
          <ApiStatusBadge status={apiServiceStatus} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={cn(
            "h-4 w-4 mr-1",
            (isLoading || isRefreshing) && "animate-spin"
          )} />
          Refresh
        </Button>
      </div>
      
      <StatusAlerts 
        apiServiceStatus={apiServiceStatus} 
        availablePlatforms={availablePlatforms} 
      />
      
      {isError ? (
        <ErrorState onRetry={handleRefresh} />
      ) : isLoading ? (
        <LoadingState />
      ) : !metrics ? (
        <NoDataState />
      ) : (
        <div className="space-y-4">
          {/* Data source stats */}
          {dataSourceStats.real > 0 && (
            <div className="flex items-center justify-between px-2 py-1 bg-blue-50 rounded text-sm">
              <span className="text-blue-700">
                Using {dataSourceStats.real} real data source{dataSourceStats.real !== 1 ? 's' : ''}
              </span>
              <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
          )}
          
          {/* Summary Stats */}
          <SummaryStats aggregatedMetrics={aggregatedMetrics} />
          
          {/* Detailed Tabs */}
          <DataTabs metrics={metrics} />
        </div>
      )}
    </GlassCard>
  );
};

export default ExternalMetricsCard;
