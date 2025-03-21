
import { Users, BarChart2, Radio, ShoppingBag } from 'lucide-react';
import { formatNumber, formatPercentage } from './utils';

interface AggregatedMetrics {
  totalFollowers: number;
  avgEngagement: number;
  totalStreams: number;
  totalBrandValue: number;
  averageGrowth: number;
  streamingPopularity: number;
  activeBrandDeals: number;
  lastUpdated: string;
}

interface SummaryStatsProps {
  aggregatedMetrics: AggregatedMetrics | null;
}

export const SummaryStats = ({ aggregatedMetrics }: SummaryStatsProps) => {
  return (
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
  );
};
