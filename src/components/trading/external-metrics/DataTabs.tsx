
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialTab } from './SocialTab';
import { StreamingTab } from './StreamingTab';
import { BrandDealsTab } from './BrandDealsTab';
import { formatDate } from './utils';

interface CreatorMetrics {
  social: any[];
  streaming: any[];
  brandDeals: any[];
  lastUpdated: string;
}

interface DataTabsProps {
  metrics: CreatorMetrics;
}

export const DataTabs = ({ metrics }: DataTabsProps) => {
  const [activeTab, setActiveTab] = useState('social');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="streaming">Streaming</TabsTrigger>
        <TabsTrigger value="brands">Brand Deals</TabsTrigger>
      </TabsList>
      
      {/* Social Media Tab */}
      <TabsContent value="social" className="pt-3">
        <SocialTab social={metrics.social} />
      </TabsContent>
      
      {/* Streaming Tab */}
      <TabsContent value="streaming" className="pt-3">
        <StreamingTab streaming={metrics.streaming} />
      </TabsContent>
      
      {/* Brand Deals Tab */}
      <TabsContent value="brands" className="pt-3">
        <BrandDealsTab brandDeals={metrics.brandDeals} />
      </TabsContent>
      
      <div className="text-right text-xs text-axium-gray-500 mt-4">
        Last updated: {formatDate(metrics.lastUpdated)}
      </div>
    </Tabs>
  );
};
