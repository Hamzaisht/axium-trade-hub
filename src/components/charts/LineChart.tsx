
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  title?: string;
  color?: string;
  height?: number;
  lines?: Array<{
    dataKey: string;
    color: string;
    name?: string;
    strokeDasharray?: string;
    dot?: boolean;
  }>;
  referenceLines?: Array<{
    y?: number;
    x?: number | string;
    label?: string;
    color?: string;
  }>;
  tooltipFormatter?: (value: any) => string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'name',
  title,
  color = '#3b82f6',
  height = 300,
  lines,
  referenceLines,
  tooltipFormatter,
  xAxisFormatter,
  yAxisFormatter
}) => {
  const renderLines = () => {
    if (lines) {
      return lines.map((line) => (
        <Line
          key={line.dataKey}
          type="monotone"
          dataKey={line.dataKey}
          stroke={line.color}
          name={line.name || line.dataKey}
          strokeDasharray={line.strokeDasharray}
          dot={line.dot ?? false}
          activeDot={{ r: 6 }}
        />
      ));
    }
    
    return (
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        dot={false}
        activeDot={{ r: 6 }}
      />
    );
  };
  
  const renderReferenceLines = () => {
    if (!referenceLines) return null;
    
    return referenceLines.map((line, index) => (
      <ReferenceLine
        key={`ref-line-${index}`}
        y={line.y}
        x={line.x}
        stroke={line.color || '#94a3b8'}
        strokeDasharray="3 3"
        label={line.label ? { value: line.label, position: 'insideBottomRight' } : undefined}
      />
    ));
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
          <RechartsLineChart
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
            {lines && lines.length > 1 && <Legend />}
            {renderLines()}
            {renderReferenceLines()}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
