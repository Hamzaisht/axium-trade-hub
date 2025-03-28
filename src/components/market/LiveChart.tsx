
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
  Bar,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartDataPoint, TimeFrame, getChartData } from "@/mock/chartData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartIndicators } from "@/components/trading-dashboard/ChartIndicators";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ShowIndicators {
  volume: boolean;
  sma7: boolean;
  sma30: boolean;
  bollingerBands: boolean;
  vwap: boolean;
}

interface LiveChartProps {
  creatorId: string;
  symbol?: string;
}

export function LiveChart({ creatorId, symbol }: LiveChartProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showIndicators, setShowIndicators] = useState<ShowIndicators>({
    volume: false,
    sma7: false,
    sma30: false,
    bollingerBands: false,
    vwap: false
  });

  useEffect(() => {
    if (!creatorId) return;
    
    setIsLoading(true);
    getChartData(creatorId, timeframe)
      .then(data => {
        setChartData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching chart data:", error);
        setIsLoading(false);
      });
  }, [creatorId, timeframe]);

  const handleToggleIndicator = (indicator: keyof ShowIndicators) => {
    setShowIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    
    switch (timeframe) {
      case "1D":
        return format(date, "HH:mm");
      case "1W":
        return format(date, "EEE");
      case "1M":
      case "3M":
        return format(date, "MMM dd");
      case "1Y":
        return format(date, "MMM yyyy");
      default:
        return format(date, "MMM dd");
    }
  };

  const formatTooltipDate = (tickItem: string) => {
    const date = new Date(tickItem);
    
    switch (timeframe) {
      case "1D":
        return format(date, "HH:mm:ss");
      case "1W":
        return format(date, "EEE, MMM dd, HH:mm");
      default:
        return format(date, "MMM dd, yyyy");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-background border border-border shadow-md p-2">
          <div className="text-xs font-medium">{formatTooltipDate(label)}</div>
          <div className="mt-1">
            <div className="text-sm font-semibold">
              {formatPrice(payload[0].value)}
            </div>
            {showIndicators.volume && payload[1] && (
              <div className="text-xs text-muted-foreground">
                Volume: {payload[1].value.toLocaleString()}
              </div>
            )}
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle>{symbol || "Creator"} Price Chart</CardTitle>
          <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as TimeFrame)}>
            <TabsList>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full aspect-[16/9]">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <>
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
                      tickFormatter={(value) => `${value / 1000}K`}
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
                    {showIndicators.sma7 && (
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#22C55E" 
                        dot={false}
                        strokeWidth={1.5}
                      />
                    )}
                    {showIndicators.sma30 && (
                      <Line 
                        type="monotone" 
                        dataKey="price" 
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
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
            
            <ChartIndicators 
              showIndicators={showIndicators}
              onToggleIndicator={handleToggleIndicator}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
