
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatCompactNumber } from '@/utils/formatters';
import { SocialPlatformMetrics } from '@/types/api';

interface SocialTabProps {
  social: SocialPlatformMetrics[];
}

export function SocialTab({ social }: SocialTabProps) {
  const formatSocialData = () => {
    if (!social || !Array.isArray(social)) return [];
    
    const socialData = [];
    const platforms = ['youtube', 'instagram', 'twitter', 'tiktok'];
    
    platforms.forEach(platformName => {
      const platformData = social.find(p => p.platform.toLowerCase() === platformName);
      if (platformData) {
        socialData.push({
          name: platformData.platform,
          value: platformData.followers,
          color: getPlatformColor(platformName),
          change: platformData.growth
        });
      }
    });
    
    return socialData;
  };
  
  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'youtube': return '#ff0000';
      case 'instagram': return '#E1306C';
      case 'twitter': return '#1DA1F2';
      case 'tiktok': return '#000000';
      default: return '#6E7191';
    }
  };
  
  const formatEngagementData = () => {
    if (!social || !Array.isArray(social)) return [];
    
    const engagementData = [];
    const platforms = ['youtube', 'instagram', 'twitter', 'tiktok'];
    
    platforms.forEach(platformName => {
      const platformData = social.find(p => p.platform.toLowerCase() === platformName);
      if (platformData) {
        engagementData.push({
          name: platformData.platform,
          value: platformData.engagement ? platformData.engagement * 100 : 0,
          color: getPlatformColor(platformName)
        });
      }
    });
    
    return engagementData;
  };

  return (
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
  );
}
