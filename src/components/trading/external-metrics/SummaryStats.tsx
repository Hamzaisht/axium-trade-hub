
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Play, 
  DollarSign
} from 'lucide-react';

interface AggregatedMetricsProps {
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
  aggregatedMetrics: AggregatedMetricsProps | null;
}

export const SummaryStats = ({ aggregatedMetrics }: SummaryStatsProps) => {
  if (!aggregatedMetrics) return null;
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toFixed(0);
    }
  };
  
  const formatPercent = (num: number): string => {
    return num.toFixed(2) + '%';
  };
  
  const formatCurrency = (num: number): string => {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(1) + 'K';
    } else {
      return '$' + num.toFixed(0);
    }
  };
  
  const stats = [
    {
      label: 'Followers',
      value: formatNumber(aggregatedMetrics.totalFollowers),
      icon: <Users className="h-4 w-4 text-blue-500" />
    },
    {
      label: 'Avg. Engagement',
      value: formatPercent(aggregatedMetrics.avgEngagement),
      icon: <Activity className="h-4 w-4 text-green-500" />
    },
    {
      label: 'Growth',
      value: formatPercent(aggregatedMetrics.averageGrowth),
      icon: <TrendingUp className="h-4 w-4 text-purple-500" />
    },
    {
      label: 'Total Streams',
      value: formatNumber(aggregatedMetrics.totalStreams),
      icon: <Play className="h-4 w-4 text-red-500" />
    },
    {
      label: 'Brand Value',
      value: formatCurrency(aggregatedMetrics.totalBrandValue),
      icon: <DollarSign className="h-4 w-4 text-yellow-500" />
    }
  ];
  
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-2 bg-axium-gray-50 rounded-md"
        >
          <div className="flex items-center mb-1">
            {stat.icon}
            <span className="ml-1 text-axium-gray-600 text-xs">{stat.label}</span>
          </div>
          <span className="font-semibold">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};
