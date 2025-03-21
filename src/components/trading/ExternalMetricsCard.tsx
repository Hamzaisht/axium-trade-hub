
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useExternalData } from '@/hooks/useExternalData';
import { useAPIConfiguration, APIServiceStatus } from '@/hooks/useAPIConfiguration';
import { 
  Users, BarChart2, Radio, ShoppingBag, TrendingUp, RefreshCw, 
  AlertCircle, Shield, Database, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  
  // Get badge for API service status
  const getApiStatusBadge = (status: APIServiceStatus) => {
    switch (status) {
      case 'mock':
        return (
          <div className="ml-2 flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            <AlertCircle className="h-3 w-3 mr-1" />
            Mock Data
          </div>
        );
      case 'live':
        return (
          <div className="ml-2 flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
            Live APIs
          </div>
        );
      case 'secure':
        return (
          <div className="ml-2 flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            <Shield className="h-3 w-3 mr-1" />
            Secure APIs
          </div>
        );
      case 'mixed':
        return (
          <div className="ml-2 flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
            <Database className="h-3 w-3 mr-1" />
            Mixed APIs
          </div>
        );
      default:
        return null;
    }
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
          {getApiStatusBadge(apiServiceStatus)}
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
      
      {isError ? (
        <div className="py-6 text-center text-axium-gray-500">
          <AlertCircle className="h-12 w-12 text-axium-error mx-auto mb-2" />
          <p className="mb-2">Failed to load external metrics</p>
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
          <Database className="h-12 w-12 text-axium-gray-400 mx-auto mb-2" />
          <p>No external data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Data source stats */}
          {dataSourceStats.real > 0 && (
            <div className="flex items-center justify-between px-2 py-1 bg-blue-50 rounded text-sm">
              <span className="text-blue-700">
                Using {dataSourceStats.real} real data source{dataSourceStats.real !== 1 ? 's' : ''}
              </span>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
          )}
          
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
                        <div className="font-medium flex items-center">
                          {platform.platform}
                          {platform.isRealData && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                              Real
                            </span>
                          )}
                        </div>
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
                        <div className="font-medium flex items-center">
                          {platform.platform}
                          {platform.isRealData && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                              Real
                            </span>
                          )}
                        </div>
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
