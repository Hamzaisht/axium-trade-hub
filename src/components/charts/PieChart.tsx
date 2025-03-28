
import React, { useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector
} from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  tooltipFormatter?: (value: any) => string;
  showLegend?: boolean;
  paddingAngle?: number;
  dataKey?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 300,
  innerRadius = 60,
  outerRadius = 80,
  tooltipFormatter,
  showLegend = true,
  paddingAngle = 2,
  dataKey = 'value'
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Default colors if none provided
  const defaultColors = [
    '#3b82f6', '#8b5cf6', '#f97316', '#ef4444', 
    '#22c55e', '#0ea5e9', '#f59e0b', '#ec4899'
  ];
  
  // Ensure all data items have colors
  const colorizedData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length]
  }));
  
  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
      percent
    } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={cx} y={cy} dy={-15} textAnchor="middle" fill="#888">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#333" fontSize={16} fontWeight="bold">
          {tooltipFormatter ? tooltipFormatter(value) : value}
        </text>
        <text x={cx} y={cy} dy={35} textAnchor="middle" fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-axium-gray-800 p-3 border border-axium-gray-200 dark:border-axium-gray-700 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-axium-gray-600 dark:text-axium-gray-400" style={{ color: data.color }}>
            {tooltipFormatter ? tooltipFormatter(data.value) : data.value}
          </p>
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
          <RechartsPieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              data={colorizedData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              paddingAngle={paddingAngle}
              dataKey={dataKey}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {colorizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
