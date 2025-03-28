
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  title?: string;
  color?: string;
  barSize?: number;
  height?: number;
  stacked?: boolean;
  bars?: Array<{
    dataKey: string;
    color: string;
    name?: string;
  }>;
  tooltipFormatter?: (value: any) => string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'name',
  title,
  color = '#3b82f6',
  barSize = 20,
  height = 300,
  stacked = false,
  bars,
  tooltipFormatter,
  xAxisFormatter,
  yAxisFormatter
}) => {
  const renderBars = () => {
    if (bars) {
      return bars.map((bar) => (
        <Bar
          key={bar.dataKey}
          dataKey={bar.dataKey}
          fill={bar.color}
          name={bar.name || bar.dataKey}
          stackId={stacked ? "stack" : undefined}
          radius={stacked ? undefined : [4, 4, 0, 0]}
        />
      ));
    }
    
    return (
      <Bar
        dataKey={dataKey}
        fill={color}
        radius={[4, 4, 0, 0]}
      />
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-axium-gray-800 p-3 border border-axium-gray-200 dark:border-axium-gray-700 rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`tooltip-${index}`}
              className="text-axium-gray-600 dark:text-axium-gray-400"
              style={{ color: entry.color }}
            >
              {entry.name}: {tooltipFormatter ? tooltipFormatter(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full">
      {title && <h3 className="text-base font-medium mb-2">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xAxisKey} 
              tickFormatter={xAxisFormatter}
            />
            <YAxis 
              tickFormatter={yAxisFormatter}
            />
            <Tooltip content={<CustomTooltip />} />
            {bars && bars.length > 1 && <Legend />}
            {renderBars()}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
