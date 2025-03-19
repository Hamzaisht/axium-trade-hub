
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Mock data for the chart
const generateMockData = (days: number, startPrice: number, volatility: number) => {
  const data = [];
  let currentPrice = startPrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = Math.max(0.1, currentPrice + change);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.round(Math.random() * 1000000)
    });
  }
  
  return data;
};

const timeRanges = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "All", days: 1095 }
];

interface PriceChartProps {
  symbol?: string;
  name?: string;
  currentPrice?: number;
}

export const PriceChart = ({ 
  symbol = "$EMW", 
  name = "Emma Watson",
  currentPrice = 24.82 
}: PriceChartProps) => {
  const [activeRange, setActiveRange] = useState(timeRanges[2]); // Default to 1M
  const [chartData, setChartData] = useState<any[]>([]);
  const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 });
  
  useEffect(() => {
    const data = generateMockData(activeRange.days, currentPrice, currentPrice * 0.05);
    setChartData(data);
    
    // Calculate price change
    if (data.length > 1) {
      const firstPrice = data[0].price;
      const lastPrice = data[data.length - 1].price;
      const change = lastPrice - firstPrice;
      const percentage = (change / firstPrice) * 100;
      
      setPriceChange({
        value: parseFloat(change.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2))
      });
    }
  }, [activeRange, currentPrice]);
  
  const isPositiveChange = priceChange.value >= 0;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard className="px-4 py-2 border-none">
          <p className="text-axium-gray-800 font-medium">{label}</p>
          <p className="text-axium-blue font-semibold">${payload[0].value.toFixed(2)}</p>
        </GlassCard>
      );
    }
    return null;
  };
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold flex items-center">
            {symbol}{" "}
            <span className="text-axium-gray-500 text-base font-normal ml-2">
              {name}
            </span>
          </h2>
          <div className="mt-1 flex items-baseline space-x-3">
            <span className="text-3xl font-semibold">${currentPrice.toFixed(2)}</span>
            <span className={cn(
              "flex items-center text-sm font-medium",
              isPositiveChange ? "text-axium-success" : "text-axium-error"
            )}>
              {isPositiveChange ? "+" : ""}{priceChange.value} ({isPositiveChange ? "+" : ""}{priceChange.percentage}%)
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {timeRanges.map((range) => (
            <Button
              key={range.label}
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-1 h-8",
                activeRange.label === range.label
                  ? "bg-axium-blue text-white hover:bg-axium-blue"
                  : "text-axium-gray-600 hover:text-axium-blue"
              )}
              onClick={() => setActiveRange(range)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositiveChange ? "#0050FF" : "#F43F5E"} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={isPositiveChange ? "#0050FF" : "#F43F5E"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EEEEEE" strokeDasharray="5 5" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6C757D' }}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6C757D' }}
              orientation="right"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={chartData[0]?.price} stroke="#ADB5BD" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="price"
              stroke={isPositiveChange ? "#0050FF" : "#F43F5E"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: isPositiveChange ? "#0050FF" : "#F43F5E", strokeWidth: 0 }}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export default PriceChart;
