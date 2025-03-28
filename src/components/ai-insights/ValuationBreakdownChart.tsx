
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { Globe, Music, DollarSign, Heart, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ValuationBreakdown } from '@/hooks/ai/useAIValuationEngine';

interface ValuationBreakdownChartProps {
  valuationBreakdown: ValuationBreakdown;
  className?: string;
}

export const ValuationBreakdownChart: React.FC<ValuationBreakdownChartProps> = ({
  valuationBreakdown,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Transform the valuation breakdown into data for the pie chart
  const pieData = [
    {
      name: 'Social',
      value: valuationBreakdown.socialInfluence.weight * 100,
      color: '#3b82f6', // blue
      icon: <Globe className="h-4 w-4" />
    },
    {
      name: 'Streaming',
      value: valuationBreakdown.streamingInfluence.weight * 100,
      color: '#8b5cf6', // purple
      icon: <Music className="h-4 w-4" />
    },
    {
      name: 'Brand Deals',
      value: valuationBreakdown.brandDealsInfluence.weight * 100,
      color: '#f97316', // orange
      icon: <Briefcase className="h-4 w-4" />
    },
    {
      name: 'Sentiment',
      value: valuationBreakdown.sentimentInfluence.weight * 100,
      color: '#ef4444', // red
      icon: <Heart className="h-4 w-4" />
    },
    {
      name: 'Financial',
      value: valuationBreakdown.financialInfluence.weight * 100,
      color: '#22c55e', // green
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      name: 'Fan Engagement',
      value: valuationBreakdown.fanEngagementInfluence.weight * 100,
      color: '#0ea5e9', // sky
      icon: <Users className="h-4 w-4" />
    }
  ];
  
  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-axium-gray-800 p-3 border border-axium-gray-200 dark:border-axium-gray-700 rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-axium-gray-600 dark:text-axium-gray-400">
            Weight: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  const legendFormatter = (value: string, entry: any, index: number) => {
    return (
      <span className="flex items-center gap-1 text-sm">
        {pieData[index].icon} {value}: {pieData[index].value.toFixed(1)}%
      </span>
    );
  };
  
  return (
    <GlassCard className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold mb-4">Valuation Weight Breakdown</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={legendFormatter}
              iconType="circle"
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ paddingLeft: 20 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
