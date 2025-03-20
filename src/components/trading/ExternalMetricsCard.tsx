
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useExternalData } from '@/hooks/useExternalData';
import { Users, BarChart2, Radio, ShoppingBag, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExternalMetricsCardProps {
  creatorId?: string;
  className?: string;
}

export const ExternalMetricsCard = ({ creatorId, className }: ExternalMetricsCardProps) => {
  const [activeTab, setActiveTab] = useState('social');
  const { 
    metrics, 
    aggregatedMetrics,
    isLoading, 
    isError, 
    refetch 
  } = useExternalData({ creatorId });
  
  // Handle refreshing data
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };
  
  // Format currency
  const formatCurrency = (num: number) => {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return '$' + (num / 1000).toFixed(1) + 'K';
    }
    return '$' + num.toFixed(0);
  };
  
  // Format percentage
  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  if (!creatorId) {
    return null;
  }
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">External Data</h3>
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
      
      {isError ? (
        <div className="py-6 text-center text-axium-gray-500">
          <p>Failed to load external metrics</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !metrics ? (
        <div className="py-6 text-center text-axium-gray-500">
          <p>No external data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <Users className="h-4 w-4 text-axium-blue mr-1" />
                <span className="text-xs text-axium-gray-600">Followers</span>
              </div>
              <p className="text-xl font-semibold">
                {formatNumber(aggregatedMetrics?.totalFollowers || 0)}
              </p>
            </div>
            
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <BarChart2 className="h-4 w-4 text-axium-blue mr-1" />
                <span className="text-xs text-axium-gray-600">Engagement</span>
              </div>
              <p className="text-xl font-semibold">
                {formatPercentage(aggregatedMetrics?.avgEngagement || 0)}
              </p>
            </div>
            
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <Radio className="h-4 w-4 text-axium-blue mr-1" />
                <span className="text-xs text-axium-gray-600">Streams</span>
              </div>
              <p className="text-xl font-semibold">
                {formatNumber(aggregatedMetrics?.totalStreams || 0)}
              </p>
            </div>
            
            <div className="bg-white/50 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <ShoppingBag className="h-4 w-4 text-axium-blue mr-1" />
                <span className="text-xs text-axium-gray-600">Brand Deals</span>
              </div>
              <p className="text-xl font-semibold">
                {aggregatedMetrics?.activeBrandDeals || 0}
              </p>
            </div>
          </div>
          
          {/* Detailed Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="streaming">Streaming</TabsTrigger>
              <TabsTrigger value="brands">Brand Deals</TabsTrigger>
            </TabsList>
            
            {/* Social Media Tab */}
            <TabsContent value="social" className="pt-3">
              {metrics.social.length > 0 ? (
                <div className="space-y-3">
                  {metrics.social.map((platform, index) => (
                    <div key={`${platform.platform}-${index}`} className="bg-white/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{platform.platform}</div>
                        <div className="flex items-center">
                          <TrendingUp className={cn(
                            "h-4 w-4 mr-1",
                            platform.growth > 0 ? "text-green-500" : "text-red-500"
                          )} />
                          <span className={cn(
                            platform.growth > 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {formatPercentage(platform.growth)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-axium-gray-600">Followers</p>
                          <p className="font-semibold">{formatNumber(platform.followers)}</p>
                        </div>
                        <div>
                          <p className="text-axium-gray-600">Engagement</p>
                          <p className="font-semibold">{formatPercentage(platform.engagement)}</p>
                        </div>
                        <div>
                          <p className="text-axium-gray-600">Posts</p>
                          <p className="font-semibold">{platform.posts}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-axium-gray-500">
                  <p>No social media data available</p>
                </div>
              )}
            </TabsContent>
            
            {/* Streaming Tab */}
            <TabsContent value="streaming" className="pt-3">
              {metrics.streaming.length > 0 ? (
                <div className="space-y-3">
                  {metrics.streaming.map((platform, index) => (
                    <div key={`${platform.platform}-${index}`} className="bg-white/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{platform.platform}</div>
                        <div className="flex items-center">
                          <TrendingUp className={cn(
                            "h-4 w-4 mr-1",
                            platform.growth > 0 ? "text-green-500" : "text-red-500"
                          )} />
                          <span className={cn(
                            platform.growth > 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {formatPercentage(platform.growth)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-axium-gray-600">Listeners</p>
                          <p className="font-semibold">{formatNumber(platform.listeners)}</p>
                        </div>
                        <div>
                          <p className="text-axium-gray-600">Streams</p>
                          <p className="font-semibold">{formatNumber(platform.streams)}</p>
                        </div>
                        <div>
                          <p className="text-axium-gray-600">Avg Time</p>
                          <p className="font-semibold">{platform.avgStreamTime.toFixed(0)}s</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-axium-gray-500">
                  <p>No streaming data available</p>
                </div>
              )}
            </TabsContent>
            
            {/* Brand Deals Tab */}
            <TabsContent value="brands" className="pt-3">
              {metrics.brandDeals.length > 0 ? (
                <div className="space-y-3">
                  {metrics.brandDeals.map((deal, index) => (
                    <div key={`${deal.brand}-${index}`} className="bg-white/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{deal.brand}</div>
                        <div className="font-semibold text-axium-blue">
                          {formatCurrency(deal.dealValue)}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-axium-gray-600">Start</p>
                          <p className="font-semibold">{deal.startDate}</p>
                        </div>
                        <div>
                          <p className="text-axium-gray-600">End</p>
                          <p className="font-semibold">{deal.endDate}</p>
                        </div>
                        <div>
                          <p className="text-axium-gray-600">Engagement</p>
                          <p className="font-semibold">{formatPercentage(deal.engagement)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-axium-gray-500">
                  <p>No brand deals data available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="text-right text-xs text-axium-gray-500">
            Last updated: {formatDate(metrics.lastUpdated)}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default ExternalMetricsCard;
