
import { useState } from 'react';
import { useExternalData } from '@/hooks/useExternalData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricsHeader } from './MetricsHeader';
import { MetricsSummary } from './MetricsSummary';
import { SocialTab } from './SocialTab';
import { RevenueTab } from './RevenueTab';
import { BrandDealsTab } from './BrandDealsTab';

interface ExternalMetricsCardProps {
  creatorId?: string;
  className?: string;
}

export function ExternalMetricsCard({ creatorId, className }: ExternalMetricsCardProps) {
  const [activeTab, setActiveTab] = useState('social');
  
  const { 
    metrics, 
    aggregatedMetrics, 
    isLoading, 
    isError, 
    refetch 
  } = useExternalData({
    creatorId,
    enabled: !!creatorId
  });
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Globe className="h-5 w-5 mr-2 text-blue-500" />
          External Metrics
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={cn(
            "h-4 w-4 mr-1",
            isLoading && "animate-spin"
          )} />
          Refresh
        </Button>
      </div>
      
      {isError ? (
        <div className="text-center py-6">
          <p className="text-axium-gray-600">Failed to load external metrics</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      ) : isLoading || !metrics ? (
        <div className="animate-pulse space-y-4 py-4">
          <div className="h-8 rounded-md bg-axium-gray-200/50 w-full"></div>
          <div className="h-40 rounded-md bg-axium-gray-200/50 w-full"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 rounded-md bg-axium-gray-200/50"></div>
            <div className="h-12 rounded-md bg-axium-gray-200/50"></div>
          </div>
        </div>
      ) : (
        <>
          <MetricsSummary aggregatedMetrics={aggregatedMetrics} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">
                <MetricsHeader tabName="social" />
              </TabsTrigger>
              <TabsTrigger value="revenue">
                <MetricsHeader tabName="revenue" />
              </TabsTrigger>
              <TabsTrigger value="brands">
                <MetricsHeader tabName="brands" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="social" className="pt-2">
              <SocialTab social={metrics.social} />
            </TabsContent>
            
            <TabsContent value="revenue" className="pt-2">
              <RevenueTab metrics={metrics} />
            </TabsContent>
            
            <TabsContent value="brands" className="pt-2">
              <BrandDealsTab brandDeals={metrics.brandDeals} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-2 pt-2 border-t border-axium-gray-200 text-xs text-axium-gray-600">
            Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
          </div>
        </>
      )}
    </GlassCard>
  );
}

export default ExternalMetricsCard;
