
import { useState } from 'react';
import { useExternalData } from '@/hooks/useExternalData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { formatCompactNumber } from '@/utils/formatters';
import { 
  Youtube, 
  Instagram, 
  Twitter, 
  Music, 
  ShoppingBag,
  DollarSign,
  RefreshCw, 
  Globe,
  MessageSquare,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  // Format social metrics for chart
  const formatSocialData = () => {
    if (!metrics?.social) return [];
    
    return [
      { 
        name: 'YouTube', 
        value: metrics.social.youtube.subscribers, 
        color: '#ff0000',
        change: metrics.social.youtube.growthRate
      },
      { 
        name: 'Instagram', 
        value: metrics.social.instagram.followers, 
        color: '#E1306C',
        change: metrics.social.instagram.growthRate
      },
      { 
        name: 'Twitter', 
        value: metrics.social.twitter.followers, 
        color: '#1DA1F2',
        change: metrics.social.twitter.growthRate
      },
      { 
        name: 'TikTok', 
        value: metrics.social.tiktok.followers, 
        color: '#000000',
        change: metrics.social.tiktok.growthRate
      }
    ];
  };
  
  // Format engagement metrics for chart
  const formatEngagementData = () => {
    if (!metrics?.social) return [];
    
    return [
      { 
        name: 'YouTube', 
        value: metrics.social.youtube.engagement * 100, 
        color: '#ff0000' 
      },
      { 
        name: 'Instagram', 
        value: metrics.social.instagram.engagement * 100, 
        color: '#E1306C' 
      },
      { 
        name: 'Twitter', 
        value: metrics.social.twitter.engagement * 100, 
        color: '#1DA1F2' 
      },
      { 
        name: 'TikTok', 
        value: metrics.social.tiktok.engagement * 100, 
        color: '#000000' 
      }
    ];
  };
  
  // Format revenue data for chart
  const formatRevenueData = () => {
    if (!metrics?.revenue) return [];
    
    const data = [
      { 
        name: 'Content', 
        value: metrics.revenue.contentRevenue, 
        color: '#3b82f6' 
      },
      { 
        name: 'Sponsorship', 
        value: metrics.revenue.sponsorshipRevenue, 
        color: '#10b981' 
      },
      { 
        name: 'Merch', 
        value: metrics.revenue.merchandiseRevenue, 
        color: '#8b5cf6' 
      },
      { 
        name: 'Live', 
        value: metrics.revenue.liveEventsRevenue, 
        color: '#f59e0b' 
      }
    ];
    
    // Sort by value descending
    return data.sort((a, b) => b.value - a.value);
  };
  
  // Format revenue history for chart
  const formatRevenueHistory = () => {
    if (!metrics?.revenueHistory) return [];
    
    return metrics.revenueHistory.map(item => ({
      name: item.period,
      value: item.revenue
    })).sort((a, b) => {
      const periods = ['Q1', 'Q2', 'Q3', 'Q4'];
      const [aPeriod, aYear] = a.name.split(' ');
      const [bPeriod, bYear] = b.name.split(' ');
      
      if (aYear !== bYear) return Number(aYear) - Number(bYear);
      return periods.indexOf(aPeriod) - periods.indexOf(bPeriod);
    });
  };
  
  // Format brand deals for display
  const formatBrandDeals = () => {
    if (!metrics?.brandDeals) return [];
    
    return metrics.brandDeals.map(deal => ({
      name: deal.brand,
      value: deal.dealValue,
      startDate: new Date(deal.startDate).toLocaleDateString(),
      endDate: new Date(deal.endDate).toLocaleDateString(),
      engagement: deal.engagement
    })).sort((a, b) => b.value - a.value);
  };
  
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
          {/* Aggregated Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1">
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-lg font-semibold">
                {formatCompactNumber(aggregatedMetrics.totalFollowers)}
              </div>
              <div className="text-xs text-axium-gray-600">Followers</div>
            </div>
            
            <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1">
                <MessageSquare className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-lg font-semibold">
                {(aggregatedMetrics.avgEngagement * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-axium-gray-600">Engagement</div>
            </div>
            
            <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1">
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-lg font-semibold">
                ${formatCompactNumber(aggregatedMetrics.totalRevenue)}
              </div>
              <div className="text-xs text-axium-gray-600">Revenue</div>
            </div>
            
            <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
              <div className="flex justify-center mb-1">
                <ShoppingBag className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-lg font-semibold">
                {formatCompactNumber(aggregatedMetrics.brandDeals)}
              </div>
              <div className="text-xs text-axium-gray-600">Brand Deals</div>
            </div>
          </div>
          
          {/* Tabs for different metric categories */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">
                <Instagram className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="revenue">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="brands">
                <ShoppingBag className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Brands</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Social Media Tab */}
            <TabsContent value="social" className="pt-2">
              <Tabs defaultValue="followers">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="followers">Followers</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>
                
                <TabsContent value="followers">
                  <div className="h-[180px] mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formatSocialData()}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [formatCompactNumber(value as number), 'Followers']}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {formatSocialData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    {formatSocialData().map((platform, index) => (
                      <div key={index} className="flex justify-between items-center p-1 border border-axium-gray-200 rounded">
                        <span>{platform.name}</span>
                        <span className={platform.change >= 0 ? "text-green-500" : "text-red-500"}>
                          {platform.change > 0 ? '+' : ''}{platform.change}%
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="engagement">
                  <div className="h-[180px] mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formatEngagementData()}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Engagement Rate']}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {formatEngagementData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="text-xs text-axium-gray-600 mt-2">
                    Engagement rate is the percentage of followers who interact with content (likes, comments, shares).
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* Revenue Tab */}
            <TabsContent value="revenue" className="pt-2">
              <Tabs defaultValue="breakdown">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="breakdown">
                  <div className="h-[180px] mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formatRevenueData()}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        layout="vertical"
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip 
                          formatter={(value) => [`$${formatCompactNumber(value as number)}`, 'Revenue']}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {formatRevenueData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-1 border border-axium-gray-200 rounded">
                      <span className="text-axium-gray-600">Annual Revenue:</span>
                      <div className="font-semibold">${formatCompactNumber(metrics.revenue.totalRevenue)}</div>
                    </div>
                    <div className="p-1 border border-axium-gray-200 rounded">
                      <span className="text-axium-gray-600">Growth:</span>
                      <div className={metrics.revenue.growthRate >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                        {metrics.revenue.growthRate > 0 ? '+' : ''}{metrics.revenue.growthRate}%
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="h-[180px] mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={formatRevenueHistory()}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${formatCompactNumber(value as number)}`, 'Revenue']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* Brands Tab */}
            <TabsContent value="brands" className="pt-2">
              <div className="h-[180px] overflow-auto pr-2">
                <table className="w-full text-sm">
                  <thead className="text-xs text-axium-gray-600">
                    <tr>
                      <th className="text-left py-2">Brand</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formatBrandDeals().map((deal, index) => (
                      <tr key={index} className="border-t border-axium-gray-200">
                        <td className="py-2">{deal.name}</td>
                        <td className="text-right py-2">${formatCompactNumber(deal.value)}</td>
                        <td className="text-right py-2">{deal.engagement}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-xs text-axium-gray-600 mt-2">
                Total brand deals: {metrics.brandDeals.length} • 
                Total value: ${formatCompactNumber(metrics.brandDeals.reduce((sum, deal) => sum + deal.dealValue, 0))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Last updated timestamp */}
          <div className="mt-2 pt-2 border-t border-axium-gray-200 text-xs text-axium-gray-600">
            Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
          </div>
        </>
      )}
    </GlassCard>
  );
}

export default ExternalMetricsCard;
