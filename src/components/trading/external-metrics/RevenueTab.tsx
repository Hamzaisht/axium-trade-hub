
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  LineChart,
  Line,
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatCompactNumber } from '@/utils/formatters';
import { CreatorMetrics } from '@/types/api';

interface RevenueTabProps {
  metrics: CreatorMetrics;
}

export function RevenueTab({ metrics }: RevenueTabProps) {
  const formatRevenueData = () => {
    if (!metrics?.revenue) return [];
    
    const revenueData = [
      { 
        name: 'Content', 
        value: metrics.revenue.contentRevenue || 500000, 
        color: '#3b82f6' 
      },
      { 
        name: 'Sponsorship', 
        value: metrics.revenue.sponsorshipRevenue || 300000, 
        color: '#10b981' 
      },
      { 
        name: 'Merch', 
        value: metrics.revenue.merchandiseRevenue || 200000, 
        color: '#8b5cf6' 
      },
      { 
        name: 'Live', 
        value: metrics.revenue.liveEventsRevenue || 100000, 
        color: '#f59e0b' 
      }
    ];
    
    return revenueData.sort((a, b) => b.value - a.value);
  };
  
  const formatRevenueHistory = () => {
    if (!metrics?.revenueHistory) {
      return [
        { name: 'Q1 2022', value: 500000 },
        { name: 'Q2 2022', value: 600000 },
        { name: 'Q3 2022', value: 550000 },
        { name: 'Q4 2022', value: 750000 },
        { name: 'Q1 2023', value: 800000 },
        { name: 'Q2 2023', value: 900000 }
      ];
    }
    
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

  return (
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
            <div className="font-semibold">${formatCompactNumber(metrics.revenue?.totalRevenue || 0)}</div>
          </div>
          <div className="p-1 border border-axium-gray-200 rounded">
            <span className="text-axium-gray-600">Growth:</span>
            <div className={(metrics.revenue?.growthRate || 0) >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
              {(metrics.revenue?.growthRate || 0) > 0 ? '+' : ''}{metrics.revenue?.growthRate || 0}%
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
  );
}
