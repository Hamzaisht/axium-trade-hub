
import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Line,
  ComposedChart,
  Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLastTradePrice } from "@/hooks/useLastTradePrice";
import { ChartIndicators } from "@/components/trading-dashboard/ChartIndicators";

interface ShowIndicators {
  volume: boolean;
  sma7: boolean;
  sma30: boolean;
  bollingerBands: boolean;
  vwap: boolean;
}

interface LivePriceChartProps {
  creatorId: string;
  symbol?: string;
}

export function LivePriceChart({ creatorId, symbol = "CREATOR" }: LivePriceChartProps) {
  const [timeframe, setTimeframe] = useState<string>("1D");
  const { lastTradePrice, priceChange } = useLastTradePrice(creatorId);
  const [chartData, setChartData] = useState<Array<{
    timestamp: string;
    price: number;
    volume: number;
  }>>([]);
  const [showIndicators, setShowIndicators] = useState<ShowIndicators>({
    volume: false,
    sma7: false,
    sma30: false,
    bollingerBands: false,
    vwap: false
  });

  // Generate initial mock data
  useEffect(() => {
    const generateMockChartData = () => {
      const data = [];
      const baseDate = new Date();
      let price = lastTradePrice || 10;
      
      for (let i = 0; i < 30; i++) {
        const timestamp = new Date(baseDate);
        timestamp.setMinutes(baseDate.getMinutes() - (30 - i) * 5);
        
        price += (Math.random() - 0.5) * 0.5;
        const volume = Math.floor(Math.random() * 1000) + 100;
        
        data.push({
          timestamp: timestamp.toISOString(),
          price: Number(price.toFixed(2)),
          volume
        });
      }
      return data;
    };
    
    setChartData(generateMockChartData());
  }, [lastTradePrice]);

  // Update chart data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        if (prev.length === 0) return prev;
        
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const timestamp = new Date(new Date(last.timestamp).getTime() + 5 * 60000).toISOString();
        const newPrice = Number((last.price + (Math.random() - 0.5) * 0.5).toFixed(2));
        const volume = Math.floor(Math.random() * 1000) + 100;
        
        next.push({ timestamp, price: newPrice, volume });
        return next;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Update with new trade price when available
  useEffect(() => {
    if (lastTradePrice && chartData.length > 0) {
      setChartData((prev) => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        newData[lastIndex] = {
          ...newData[lastIndex],
          price: lastTradePrice
        };
        return newData;
      });
    }
  }, [lastTradePrice]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-background border border-border shadow-md p-2">
          <div className="text-xs font-medium">
            {new Date(label).toLocaleString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="mt-1">
            <div className="text-sm font-semibold">
              ${payload[0].value.toFixed(2)}
            </div>
            {showIndicators.volume && payload[1] && (
              <div className="text-xs text-muted-foreground">
                Volume: {payload[1].value}
              </div>
            )}
          </div>
        </Card>
      );
    }
    return null;
  };

  const handleToggleIndicator = (indicator: keyof ShowIndicators) => {
    setShowIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle>{symbol} Price Chart</CardTitle>
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
        <div className="flex items-center mt-1">
          <span className="text-2xl font-semibold mr-2">
            ${lastTradePrice?.toFixed(2) || '0.00'}
          </span>
          <span 
            className={`text-sm ${priceChange === 'up' ? 'text-green-500' : priceChange === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            {priceChange === 'up' ? '↑' : priceChange === 'down' ? '↓' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[16/9]">
          <ResponsiveContainer width="100%" height="100%">
            {showIndicators.volume ? (
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxis} 
                  minTickGap={30}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="price"
                  domain={['auto', 'auto']}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  domain={[0, 'dataMax']}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  yAxisId="price"
                  fill="url(#colorPrice)" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fillOpacity={0.1}
                />
                <Bar 
                  dataKey="volume" 
                  yAxisId="volume"
                  fill="var(--muted)" 
                  opacity={0.5}
                  barSize={20}
                />
                {showIndicators.sma7 && (
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    yAxisId="price"
                    stroke="#22C55E" 
                    dot={false}
                    strokeWidth={1.5}
                  />
                )}
                {showIndicators.sma30 && (
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    yAxisId="price"
                    stroke="#EF4444" 
                    dot={false}
                    strokeWidth={1.5}
                  />
                )}
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxis} 
                  minTickGap={30}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  fill="url(#colorPrice)" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fillOpacity={0.1}
                />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <ChartIndicators 
          showIndicators={showIndicators}
          onToggleIndicator={handleToggleIndicator}
        />
      </CardContent>
    </Card>
  );
}
