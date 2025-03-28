
import { Eye, MessageSquare, DollarSign, ShoppingBag } from 'lucide-react';
import { formatCompactNumber } from '@/utils/formatters';

interface MetricsSummaryProps {
  aggregatedMetrics: {
    totalFollowers: number;
    avgEngagement: number;
    totalBrandValue: number;
    activeBrandDeals: number;
  } | null;
}

export function MetricsSummary({ aggregatedMetrics }: MetricsSummaryProps) {
  if (!aggregatedMetrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
        <div className="flex justify-center mb-1">
          <Eye className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-lg font-semibold">
          {formatCompactNumber(aggregatedMetrics.totalFollowers || 0)}
        </div>
        <div className="text-xs text-axium-gray-600">Followers</div>
      </div>
      
      <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
        <div className="flex justify-center mb-1">
          <MessageSquare className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-lg font-semibold">
          {((aggregatedMetrics.avgEngagement || 0) * 100).toFixed(1)}%
        </div>
        <div className="text-xs text-axium-gray-600">Engagement</div>
      </div>
      
      <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
        <div className="flex justify-center mb-1">
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="text-lg font-semibold">
          ${formatCompactNumber(aggregatedMetrics.totalBrandValue || 0)}
        </div>
        <div className="text-xs text-axium-gray-600">Revenue</div>
      </div>
      
      <div className="bg-axium-gray-100/50 rounded-md p-2 text-center">
        <div className="flex justify-center mb-1">
          <ShoppingBag className="h-4 w-4 text-purple-500" />
        </div>
        <div className="text-lg font-semibold">
          {formatCompactNumber(aggregatedMetrics.activeBrandDeals || 0)}
        </div>
        <div className="text-xs text-axium-gray-600">Brand Deals</div>
      </div>
    </div>
  );
}
