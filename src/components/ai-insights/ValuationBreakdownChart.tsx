
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface ValuationFactor {
  name: string;
  value: number;
}

export interface ValuationBreakdownChartProps {
  data: ValuationFactor[];
}

export const ValuationBreakdownChart: React.FC<ValuationBreakdownChartProps> = ({ data }) => {
  // Colors for the different factors
  const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
  ];
  
  // Format the tooltip label to display the value as a percentage
  const renderTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <div className="bg-white dark:bg-axium-gray-800 p-2 shadow-md rounded border border-axium-gray-200 dark:border-axium-gray-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-axium-blue">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValuationBreakdownChart;
