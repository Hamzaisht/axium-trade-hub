
import { useState, useEffect } from "react";
import { useMarketData, PriceUpdate } from "@/hooks/useMarketData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { mockWebSocket } from "@/utils/mockWebSocket";

interface PriceChartProps {
  symbol?: string;
  name?: string;
  currentPrice?: number;
  ipoId?: string;
}

const PriceChart = ({ symbol, name, currentPrice, ipoId }: PriceChartProps) => {
  const { priceUpdates, isConnected } = useMarketData(ipoId);
  const [timeframe, setTimeframe] = useState("1D");
  const [chartData, setChartData] = useState<{ timestamp: number; price: number; date: string }[]>([]);
  
  // Process price updates and format for the chart
  useEffect(() => {
    if (priceUpdates && priceUpdates.length > 0) {
      // Format timestamps and ensure sorted by time
      const formattedData = priceUpdates
        .filter(update => update.ipoId === ipoId)
        .map(update => ({
          timestamp: new Date(update.timestamp).getTime(),
          price: update.newPrice,
          date: new Date(update.timestamp).toLocaleTimeString()
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      
      setChartData(formattedData);
    }
  }, [priceUpdates, ipoId]);
  
  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (chartData.length < 2) return 0;
    
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };
  
  const priceChange = calculatePriceChange();
  const priceDirection = priceChange >= 0 ? "up" : "down";
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-axium-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{payload[0].payload.date}</p>
          <p className="text-axium-blue">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-medium">
            {symbol && `${symbol} `}
            <span className="text-axium-gray-600 font-normal text-sm">
              {name && `(${name})`}
            </span>
          </h2>
          <div className="flex items-center">
            <span className="text-2xl font-semibold mr-2">
              ${currentPrice?.toFixed(2) || chartData[chartData.length - 1]?.price.toFixed(2) || "0.00"}
            </span>
            <span 
              className={`text-sm ${priceDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}
            >
              {priceDirection === 'up' ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant={timeframe === "1H" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("1H")}
            className="text-xs h-7 px-2"
          >
            1H
          </Button>
          <Button
            variant={timeframe === "1D" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("1D")}
            className="text-xs h-7 px-2"
          >
            1D
          </Button>
          <Button
            variant={timeframe === "1W" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("1W")}
            className="text-xs h-7 px-2"
          >
            1W
          </Button>
          <Button
            variant={timeframe === "1M" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("1M")}
            className="text-xs h-7 px-2"
          >
            1M
          </Button>
        </div>
      </div>
      
      <div className="h-72">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={40}
                tickFormatter={(value) => `$${value.toFixed(1)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={priceDirection === 'up' ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-axium-gray-500 mb-2">No price data available</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => mockWebSocket.reconnect()}
                disabled={isConnected}
              >
                {isConnected ? "Connected" : "Connect"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
