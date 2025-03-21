
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatorMetrics } from '@/services/api/ApiConfigService';
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  TrendingUp, 
  Music
} from 'lucide-react';

interface DataTabsProps {
  metrics: CreatorMetrics;
}

export const DataTabs = ({ metrics }: DataTabsProps) => {
  return (
    <Tabs defaultValue="social" className="w-full">
      <TabsList className="grid grid-cols-3 h-8">
        <TabsTrigger value="social" className="text-xs">
          <Twitter className="h-3 w-3 mr-1" />
          Social
        </TabsTrigger>
        <TabsTrigger value="streaming" className="text-xs">
          <Music className="h-3 w-3 mr-1" />
          Streaming
        </TabsTrigger>
        <TabsTrigger value="brand" className="text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          Brand
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="social" className="pt-2">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {metrics.social.map((platform, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 bg-axium-gray-50/70 rounded text-sm"
            >
              <div className="flex items-center">
                {getPlatformIcon(platform.platform)}
                <span className="ml-2">{platform.platform}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatNumber(platform.followers)} followers</div>
                <div className="text-xs text-axium-gray-600">
                  {platform.engagement.toFixed(2)}% engagement
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="streaming" className="pt-2">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {metrics.streaming.map((platform, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 bg-axium-gray-50/70 rounded text-sm"
            >
              <div className="flex items-center">
                {getPlatformIcon(platform.platform)}
                <span className="ml-2">{platform.platform}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatNumber(platform.listeners)} listeners</div>
                <div className="text-xs text-axium-gray-600">
                  {formatNumber(platform.streams)} streams
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="brand" className="pt-2">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {metrics.brandDeals.length > 0 ? (
            metrics.brandDeals.map((deal, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 bg-axium-gray-50/70 rounded text-sm"
              >
                <div>
                  <div className="font-medium">{deal.brand}</div>
                  <div className="text-xs text-axium-gray-600">
                    {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${formatCurrency(deal.dealValue)}</div>
                  <div className="text-xs text-axium-gray-600">
                    {deal.engagement.toFixed(2)}% engagement
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-axium-gray-500">
              No active brand deals
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

const formatCurrency = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getPlatformIcon = (platform: string) => {
  const iconClass = "h-4 w-4";
  
  switch (platform.toLowerCase()) {
    case 'twitter':
      return <Twitter className={`${iconClass} text-blue-400`} />;
    case 'instagram':
      return <Instagram className={`${iconClass} text-pink-500`} />;
    case 'youtube':
      return <Youtube className={`${iconClass} text-red-500`} />;
    case 'spotify':
      return <Music className={`${iconClass} text-green-500`} />;
    default:
      return <TrendingUp className={`${iconClass} text-gray-500`} />;
  }
};
