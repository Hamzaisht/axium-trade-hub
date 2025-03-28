
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
import { SocialPlatformMetrics, CreatorMetrics } from '@/types/api';

interface ExternalMetricsCardProps {
  creatorId?: string;
  className?: string;
}

// Helper function to map API service metrics to the expected format
const mapServiceMetricsToApiTypes = (serviceMetrics: any): CreatorMetrics => {
  if (!serviceMetrics) return null;
  
  // Map social metrics
  const mappedSocial = serviceMetrics.social?.map(platform => ({
    platform: platform.platform,
    score: platform.engagement * 10 || 0,  // Convert engagement to score
    trend: platform.growth > 0 ? 'positive' : 'negative',
    volume: platform.posts * 100 || 0,      // Convert posts to volume
    followers: platform.followers || 0,
    engagement: platform.engagement || 0,
    growth: platform.growth || 0,
    isRealData: platform.isRealData || false
  })) || [];
  
  // Create default revenue data if not present
  const defaultRevenue = {
    totalRevenue: 0,
    contentRevenue: 0,
    sponsorshipRevenue: 0,
    merchandiseRevenue: 0,
    liveEventsRevenue: 0,
    growthRate: 0
  };
  
  // Create default revenue history if not present
  const defaultRevenueHistory = [
    { period: 'Jan', revenue: 0 },
    { period: 'Feb', revenue: 0 },
    { period: 'Mar', revenue: 0 }
  ];
  
  return {
    social: mappedSocial as SocialPlatformMetrics[],
    streaming: serviceMetrics.streaming || [],
    brandDeals: serviceMetrics.brandDeals || [],
    revenue: serviceMetrics.revenue || defaultRevenue,
    revenueHistory: serviceMetrics.revenueHistory || defaultRevenueHistory,
    lastUpdated: serviceMetrics.lastUpdated || new Date().toISOString()
  };
};

export function ExternalMetricsCard({ creatorId, className }: ExternalMetricsCardProps) {
  const [activeTab, setActiveTab] = useState('social');
  
  const { 
    metrics: serviceMetrics, 
    aggregatedMetrics, 
    isLoading, 
    isError, 
    refetch 
  } = useExternalData({
    creatorId,
    enabled: !!creatorId
  });
  
  // Convert service metrics to the expected format
  const metrics = mapServiceMetricsToApiTypes(serviceMetrics);
  
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
