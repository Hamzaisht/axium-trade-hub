
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { formatDate, formatCurrency } from '@/lib/formatters';

interface HistoricalData {
  timestamp: string;
  price: number;
  confidence: number;
}

interface HistoricalPerformanceChartProps {
  historicalData: HistoricalData[];
  timeframe: string;
}

export const HistoricalPerformanceChart: React.FC<HistoricalPerformanceChartProps> = ({
  historicalData,
  timeframe
}) => {
  // Format date based on timeframe
  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    
    switch (timeframe) {
      case '1m':
      case '5m':
      case '15m':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1h':
      case '1d':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1w':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '1mo':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-axium-gray-800 p-3 border border-axium-gray-200 dark:border-axium-gray-700 rounded-md shadow-md">
          <p className="text-sm font-medium">
            {formatDate(new Date(label))}
          </p>
          <p className="text-axium-gray-600 dark:text-axium-gray-400">
            Price: ${payload[0].payload.price.toFixed(2)}
          </p>
          <p className="text-axium-gray-600 dark:text-axium-gray-400">
            Confidence: {(payload[0].payload.confidence * 100).toFixed(0)}%
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Calculate price domain for better chart visualization
  const prices = historicalData.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.98; // Give 2% padding
  const maxPrice = Math.max(...prices) * 1.02; // Give 2% padding
  
  // Calculate start and end price for reference line
  const startPrice = historicalData[0]?.price || 0;
  const endPrice = historicalData[historicalData.length - 1]?.price || 0;
  const priceChange = endPrice - startPrice;
  
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            minTickGap={30}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            tickFormatter={(value) => `$${value.toFixed(2)}`} 
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Confidence area */}
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          
          <Area 
            type="monotone"
            dataKey="price"
            stroke="none"
            fill="url(#confidenceGradient)"
            opacity={0.5}
          />
          
          {/* Price line */}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"} 
            dot={false} 
            strokeWidth={2}
          />
          
          {/* Reference line for the starting price */}
          <ReferenceLine 
            y={startPrice} 
            stroke="#94a3b8" 
            strokeDasharray="3 3"
            label={{
              value: `$${startPrice.toFixed(2)}`,
              position: 'left',
              fill: '#94a3b8',
              fontSize: 12
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Add default export to fix the import issue
export default HistoricalPerformanceChart;
