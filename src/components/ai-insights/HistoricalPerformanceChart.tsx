
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';

export interface HistoricalData {
  date: string;
  price: number;
  predictedPrice?: number;
  volume?: number;
}

export interface HistoricalPerformanceChartProps {
  data: HistoricalData[];
  title?: string;
  showPrediction?: boolean;
  height?: number | string;
  className?: string;
}

const HistoricalPerformanceChart: React.FC<HistoricalPerformanceChartProps> = ({
  data,
  title = 'Historical Price Performance',
  showPrediction = true,
  height = 400,
  className = ''
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <GlassCard className={`p-5 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate} 
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatPrice} 
              tick={{ fill: '#666', fontSize: 12 }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              labelFormatter={(label) => formatDate(label)}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                borderRadius: '6px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Actual Price"
            />
            {showPrediction && (
              <Line 
                type="monotone" 
                dataKey="predictedPrice" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                name="Predicted Price"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default HistoricalPerformanceChart;
