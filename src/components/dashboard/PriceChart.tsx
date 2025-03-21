
import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, 
  BarChart, Bar,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ComposedChart,
  Line,
  Scatter
} from "recharts";
import { useMarketData } from "@/hooks/useMarketData";
import { CandlestickChart } from "../trading/CandlestickChart";
import { 
  CircleHelp,
  EyeOff,
  Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnomalyDetection } from "@/hooks/ai/useAnomalyDetection";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Only used for initial data load, then we use real-time data
const generateHistoricalData = (days: number, startPrice: number, volatility: number) => {
  const data = [];
  let currentPrice = startPrice;
  
  const now = new Date();
  let date = new Date();
  date.setDate(date.getDate() - days);
  
  // For candlestick data
  while (date <= now) {
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = Math.max(0.1, currentPrice + change);
    
    // Generate OHLC data for candlesticks
    const open = currentPrice;
    const high = open * (1 + (Math.random() * 0.02));
    const low = open * (1 - (Math.random() * 0.02));
    const close = (high + low) / 2;
    
    const volume = Math.round(Math.random() * 1000000);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      price: parseFloat(currentPrice.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
    
    // Increment by appropriate interval based on timeframe
    if (days <= 1) {
      // For 1D, increment by 15 minutes
      date = new Date(date.getTime() + 15 * 60 * 1000);
    } else if (days <= 7) {
      // For 1W, increment by 1 hour
      date = new Date(date.getTime() + 60 * 60 * 1000);
    } else if (days <= 30) {
      // For 1M, increment by 4 hours
      date = new Date(date.getTime() + 4 * 60 * 60 * 1000);
    } else {
      // For longer periods, increment by 1 day
      date.setDate(date.getDate() + 1);
    }
  }
  
  return data;
};

const timeRanges = [
  { label: "15M", days: 0.01, interval: "minute" },
  { label: "1H", days: 0.04, interval: "minute" },
  { label: "4H", days: 0.17, interval: "minute" },
  { label: "1D", days: 1, interval: "hour" },
  { label: "1W", days: 7, interval: "day" },
  { label: "1M", days: 30, interval: "day" },
  { label: "YTD", days: 0, interval: "month", isYTD: true },
  { label: "All", days: 1095, interval: "month" }
];

interface PriceChartProps {
  symbol?: string;
  name?: string;
  currentPrice?: number;
  ipoId?: string;
}

export const PriceChart = ({ 
  symbol = "$EMW", 
  name = "Emma Watson",
  currentPrice = 24.82,
  ipoId 
}: PriceChartProps) => {
  const [activeRange, setActiveRange] = useState(timeRanges[4]); // Default to 1W
  const [baseChartData, setBaseChartData] = useState<any[]>([]);
  const [livePrice, setLivePrice] = useState(currentPrice);
  const [chartType, setChartType] = useState<'line' | 'candle'>('candle');
  const [showTechnicals, setShowTechnicals] = useState({
    rsi: false,
    macd: false,
    bb: false,
    vwap: false,
    sma7: true,
    sma30: true,
    volume: true
  });
  
  // Use our WebSocket hook for real-time market data
  const { isConnected, priceUpdates, latestPrices } = useMarketData(ipoId);
  
  // Check for anomalies
  const { data: anomalyData } = useAnomalyDetection({
    ipoId,
    enabled: !!ipoId
  });
  
  // Generate initial historical data
  useEffect(() => {
    // Ensure we have a valid current price before generating data
    const price = currentPrice || 25.0;
    
    // For YTD, calculate days from Jan 1 to now
    let days = activeRange.days;
    if (activeRange.isYTD) {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      days = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    setBaseChartData(generateHistoricalData(days, price, price * 0.05));
    setLivePrice(price);
  }, [activeRange, currentPrice]);
  
  // Update live price when we get updates
  useEffect(() => {
    if (ipoId && latestPrices[ipoId] !== undefined) {
      setLivePrice(latestPrices[ipoId]);
    }
  }, [ipoId, latestPrices]);
  
  // Warn users about anomalies
  useEffect(() => {
    if (anomalyData?.detected && anomalyData.anomalies?.some(a => a.severity >= 7)) {
      const anomaly = anomalyData.anomalies.find(a => a.severity >= 7);
      if (anomaly) {
        toast.warning(`Warning: ${anomaly.description}`, {
          duration: 5000,
          position: 'top-right',
        });
      }
    }
  }, [anomalyData]);
  
  // Merge historical data with real-time updates for chart display
  const chartData = useMemo(() => {
    if (!baseChartData.length) return [];
    
    // Clone base data
    const combinedData = [...baseChartData];
    
    // Add real-time price updates if available
    if (priceUpdates.length > 0 && ipoId) {
      // Filter only relevant updates for this IPO
      const relevantUpdates = priceUpdates
        .filter(update => update.ipoId === ipoId)
        .slice(0, 20); // Take most recent 20 updates
      
      // Add live data points
      relevantUpdates.forEach((update, index) => {
        const date = new Date(update.timestamp);
        
        // Generate OHLC data based on last known price
        const lastKnownPrice = combinedData[combinedData.length - 1]?.close || update.newPrice;
        const open = lastKnownPrice;
        const close = update.newPrice;
        const high = Math.max(open, close) * (1 + (Math.random() * 0.005));
        const low = Math.min(open, close) * (1 - (Math.random() * 0.005));
        
        combinedData.push({
          date: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: date.getTime(),
          price: update.newPrice,
          open,
          high,
          low,
          close,
          volume: Math.round(Math.random() * 200000),
          isLive: true
        });
      });
    }
    
    // Calculate technical indicators
    return combinedData.map((item, index, array) => {
      // Calculate SMA (Simple Moving Average)
      const sma7 = index >= 6 
        ? array.slice(index - 6, index + 1).reduce((sum, i) => sum + i.close, 0) / 7 
        : null;
        
      const sma30 = index >= 29 
        ? array.slice(index - 29, index + 1).reduce((sum, i) => sum + i.close, 0) / 30 
        : null;
      
      // Calculate RSI (Relative Strength Index)
      let rsi = 50; // Default neutral RSI
      if (index >= 14) {
        const changes = array.slice(index - 14, index + 1)
          .map((item, i, arr) => i === 0 ? 0 : item.close - arr[i - 1].close);
        
        const gains = changes.filter(change => change > 0);
        const losses = changes.filter(change => change < 0).map(loss => Math.abs(loss));
        
        const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / 14;
        const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / 14;
        
        const rs = avgGain / (avgLoss || 0.001); // Avoid division by zero
        rsi = 100 - (100 / (1 + rs));
      }
      
      // Calculate VWAP (Volume Weighted Average Price)
      const vwap = array.slice(0, index + 1)
        .reduce((sum, item) => sum + (item.close * item.volume), 0) / 
        array.slice(0, index + 1).reduce((sum, item) => sum + item.volume, 1);
      
      // Calculate Bollinger Bands (20-period SMA with 2 standard deviations)
      let upperBB = null;
      let lowerBB = null;
      let middleBB = null;
      
      if (index >= 19) {
        const period = 20;
        const slice = array.slice(index - period + 1, index + 1);
        middleBB = slice.reduce((sum, item) => sum + item.close, 0) / period;
        
        const stdDev = Math.sqrt(
          slice.reduce((sum, item) => sum + Math.pow(item.close - middleBB, 2), 0) / period
        );
        
        upperBB = middleBB + (2 * stdDev);
        lowerBB = middleBB - (2 * stdDev);
      }
      
      // Calculate MACD
      const ema12 = calculateEMA(array, index, 12, 'close');
      const ema26 = calculateEMA(array, index, 26, 'close');
      const macd = ema12 - ema26;
      const signal = calculateEMA(
        array.map((item, i) => ({ 
          ...item, 
          macd: calculateEMA(array, i, 12, 'close') - calculateEMA(array, i, 26, 'close')
        })),
        index,
        9,
        'macd'
      );
      const histogram = macd - signal;
      
      return {
        ...item,
        sma7: sma7 !== null ? parseFloat(sma7.toFixed(2)) : null,
        sma30: sma30 !== null ? parseFloat(sma30.toFixed(2)) : null,
        rsi: parseFloat(rsi.toFixed(2)),
        vwap: parseFloat(vwap.toFixed(2)),
        upperBB: upperBB !== null ? parseFloat(upperBB.toFixed(2)) : null,
        lowerBB: lowerBB !== null ? parseFloat(lowerBB.toFixed(2)) : null,
        middleBB: middleBB !== null ? parseFloat(middleBB.toFixed(2)) : null,
        macd: parseFloat(macd.toFixed(2)),
        signal: parseFloat(signal.toFixed(2)),
        histogram: parseFloat(histogram.toFixed(2))
      };
    });
  }, [baseChartData, priceUpdates, ipoId]);
  
  // Helper function to calculate EMA (Exponential Moving Average)
  const calculateEMA = (data: any[], index: number, period: number, key: string) => {
    if (index < period - 1) {
      // Not enough data
      return data[index][key];
    } else if (index === period - 1) {
      // First EMA is SMA
      return data.slice(0, period).reduce((sum, item) => sum + item[key], 0) / period;
    } else {
      // Calculate EMA
      const multiplier = 2 / (period + 1);
      const previousEMA = calculateEMA(data, index - 1, period, key);
      return ((data[index][key] - previousEMA) * multiplier) + previousEMA;
    }
  };
  
  // Calculate price change
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };
    
    const firstPrice = chartData[0]?.close || 0;
    const lastPrice = livePrice;
    const change = lastPrice - firstPrice;
    const percentage = firstPrice > 0 ? (change / firstPrice) * 100 : 0;
    
    return {
      value: parseFloat(change.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(2))
    };
  }, [chartData, livePrice]);
  
  const isPositiveChange = priceChange.value >= 0;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard className="px-4 py-2 border-none">
          <p className="text-axium-gray-800 font-medium">{label}</p>
          
          {chartType === 'candle' ? (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <p className="text-sm">O: <span className={cn("font-mono", 
                  payload[0].payload.open <= payload[0].payload.close 
                    ? "text-axium-success" 
                    : "text-axium-error"
                )}>${payload[0].payload.open}</span></p>
                <p className="text-sm">C: <span className={cn("font-mono", 
                  payload[0].payload.open <= payload[0].payload.close 
                    ? "text-axium-success" 
                    : "text-axium-error"
                )}>${payload[0].payload.close}</span></p>
                <p className="text-sm">H: <span className="font-mono text-axium-success">${payload[0].payload.high}</span></p>
                <p className="text-sm">L: <span className="font-mono text-axium-error">${payload[0].payload.low}</span></p>
              </div>
              <div className="mt-1 pt-1 border-t border-gray-200">
                <p className="text-xs text-axium-gray-600">Volume: {(payload[0].payload.volume).toLocaleString()}</p>
              </div>
            </>
          ) : (
            <p className="text-axium-blue font-semibold">${payload[0].value.toFixed(2)}</p>
          )}
          
          {/* Show technical indicators if enabled */}
          {(showTechnicals.rsi || showTechnicals.macd || showTechnicals.vwap || showTechnicals.bb) && (
            <div className="mt-1 pt-1 border-t border-gray-200 space-y-1">
              {showTechnicals.rsi && (
                <p className="text-xs">RSI: <span className={cn("font-mono", 
                  payload[0].payload.rsi < 30 ? "text-axium-error" : 
                  payload[0].payload.rsi > 70 ? "text-axium-success" : 
                  "text-axium-gray-600"
                )}>{payload[0].payload.rsi}</span></p>
              )}
              {showTechnicals.macd && (
                <p className="text-xs">MACD: <span className="font-mono text-axium-blue">{payload[0].payload.macd}</span></p>
              )}
              {showTechnicals.vwap && (
                <p className="text-xs">VWAP: <span className="font-mono text-purple-600">${payload[0].payload.vwap}</span></p>
              )}
              {showTechnicals.bb && payload[0].payload.middleBB && (
                <p className="text-xs">BB: <span className="font-mono text-orange-600">${payload[0].payload.middleBB}</span></p>
              )}
            </div>
          )}
          
          {payload[0].payload.isLive && (
            <p className="text-xs text-axium-success mt-1">Live Data</p>
          )}
        </GlassCard>
      );
    }
    return null;
  };
  
  // Safeguard against empty data
  if (chartData.length === 0) {
    return (
      <GlassCard className="h-full p-4">
        <div className="text-center py-10">
          <p className="text-axium-gray-500">Loading chart data...</p>
        </div>
      </GlassCard>
    );
  }
  
  // Get custom date formatter based on selected timeframe
  const getDateFormatter = () => {
    switch (activeRange.interval) {
      case 'minute':
        return (date: number) => new Date(date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      case 'hour':
        return (date: number) => new Date(date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      case 'day':
        return (date: number) => new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'month':
        return (date: number) => new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          year: '2-digit' 
        });
      default:
        return (date: number) => new Date(date).toLocaleDateString();
    }
  };
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center">
            {symbol}{" "}
            <span className="text-axium-gray-500 text-base font-normal ml-2">
              {name}
            </span>
            {isConnected && (
              <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full" 
                title="Live data connected"></span>
            )}
          </h2>
          <div className="mt-1 flex items-baseline space-x-3">
            <span className="text-3xl font-semibold">${livePrice.toFixed(2)}</span>
            <span className={cn(
              "flex items-center text-sm font-medium",
              isPositiveChange ? "text-axium-success" : "text-axium-error"
            )}>
              {isPositiveChange ? "+" : ""}{priceChange.value} ({isPositiveChange ? "+" : ""}{priceChange.percentage}%)
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
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
          
          <div className="flex border-l border-gray-200 pl-2 ml-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-1 h-8",
                chartType === 'line'
                  ? "bg-axium-blue text-white hover:bg-axium-blue"
                  : "text-axium-gray-600 hover:text-axium-blue"
              )}
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-1 h-8",
                chartType === 'candle'
                  ? "bg-axium-blue text-white hover:bg-axium-blue"
                  : "text-axium-gray-600 hover:text-axium-blue"
              )}
              onClick={() => setChartType('candle')}
            >
              Candle
            </Button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <CircleHelp className="h-4 w-4 mr-1" />
                Indicators
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <h4 className="font-medium mb-3">Technical Indicators</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sma7">SMA (7)</Label>
                  <Switch 
                    id="sma7" 
                    checked={showTechnicals.sma7} 
                    onCheckedChange={(checked) => 
                      setShowTechnicals({...showTechnicals, sma7: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sma30">SMA (30)</Label>
                  <Switch 
                    id="sma30" 
                    checked={showTechnicals.sma30} 
                    onCheckedChange={(checked) => 
                      setShowTechnicals({...showTechnicals, sma30: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume">Volume</Label>
                  <Switch 
                    id="volume" 
                    checked={showTechnicals.volume} 
                    onCheckedChange={(checked) => 
                      setShowTechnicals({...showTechnicals, volume: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="rsi">RSI</Label>
                  <Switch 
                    id="rsi" 
                    checked={showTechnicals.rsi} 
                    onCheckedChange={(checked) => 
                      setShowTechnicals({...showTechnicals, rsi: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="macd">MACD</Label>
                  <Switch 
                    id="macd" 
                    checked={showTechnicals.macd} 
                    onCheckedChange={(checked) => 
                      setShowTechnicals({...showTechnicals, macd: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bb">Bollinger Bands</Label>
                  <Switch 
                    id="bb" 
                    checked={showTechnicals.bb} 
                    onCheckedChange={(checked) => 
                      setShowTechnicals({...showTechnicals, bb: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="vwap">VWAP</Label>
                  <Switch 
                    id="vwap" 
                    checked={showTechnicals.vwap} 
                    onCheckedChange={(checked) => 
                      setShowTechnicals({...showTechnicals, vwap: checked})
                    }
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="h-[350px]">
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="price" className="flex-1">Price Chart</TabsTrigger>
            <TabsTrigger value="technicals" className="flex-1">Technical Indicators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="h-[300px]">
            {chartType === 'candle' ? (
              <CandlestickChart 
                data={chartData} 
                showVolumeBar={showTechnicals.volume}
                showSMA7={showTechnicals.sma7}
                showSMA30={showTechnicals.sma30}
                showBollingerBands={showTechnicals.bb}
                showVWAP={showTechnicals.vwap}
                dateFormatter={getDateFormatter()}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
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
                    dataKey="timestamp" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6C757D' }}
                    minTickGap={30}
                    tickFormatter={getDateFormatter()}
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
                  {chartData.length > 0 && chartData[0]?.close && (
                    <ReferenceLine 
                      y={chartData[0].close} 
                      stroke="#ADB5BD" 
                      strokeDasharray="3 3" 
                    />
                  )}
                  <Area 
                    type="monotone" 
                    dataKey="close"
                    stroke={isPositiveChange ? "#0050FF" : "#F43F5E"}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                  {showTechnicals.sma7 && (
                    <Line 
                      type="monotone" 
                      dataKey="sma7" 
                      stroke="#4CAF50" 
                      dot={false} 
                      strokeWidth={1.5}
                    />
                  )}
                  {showTechnicals.sma30 && (
                    <Line 
                      type="monotone" 
                      dataKey="sma30" 
                      stroke="#F59E0B" 
                      dot={false} 
                      strokeWidth={1.5}
                    />
                  )}
                  {showTechnicals.vwap && (
                    <Line 
                      type="monotone" 
                      dataKey="vwap" 
                      stroke="#8B5CF6" 
                      dot={false} 
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                  )}
                  {showTechnicals.bb && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="upperBB" 
                        stroke="#FB923C" 
                        dot={false} 
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="middleBB" 
                        stroke="#FB923C" 
                        dot={false} 
                        strokeWidth={1}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lowerBB" 
                        stroke="#FB923C" 
                        dot={false} 
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          
          <TabsContent value="technicals" className="h-[300px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* RSI Chart */}
              <div className="h-full">
                <p className="text-sm font-medium mb-1">RSI (14)</p>
                <ResponsiveContainer width="100%" height="90%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke="#EEEEEE" strokeDasharray="5 5" vertical={false} />
                    <XAxis 
                      dataKey="timestamp" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#6C757D' }}
                      minTickGap={30}
                      tickFormatter={getDateFormatter()}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#6C757D' }}
                      ticks={[0, 30, 50, 70, 100]}
                    />
                    <Tooltip />
                    <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
                    <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" />
                    <Line 
                      type="monotone" 
                      dataKey="rsi" 
                      stroke="#8884d8" 
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* MACD Chart */}
              <div className="h-full">
                <p className="text-sm font-medium mb-1">MACD (12,26,9)</p>
                <ResponsiveContainer width="100%" height="90%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke="#EEEEEE" strokeDasharray="5 5" vertical={false} />
                    <XAxis 
                      dataKey="timestamp" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#6C757D' }}
                      minTickGap={30}
                      tickFormatter={getDateFormatter()}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#6C757D' }}
                    />
                    <Tooltip />
                    <ReferenceLine y={0} stroke="#000" strokeOpacity={0.5} />
                    <Line 
                      type="monotone" 
                      dataKey="macd" 
                      stroke="#2563EB" 
                      dot={false} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="signal" 
                      stroke="#F43F5E" 
                      dot={false} 
                    />
                    <Bar 
                      dataKey="histogram" 
                      fill={(data) => data > 0 ? "#2dd4bf" : "#f87171"}
                      stroke={(data) => data > 0 ? "#2dd4bf" : "#f87171"}
                      barSize={3}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GlassCard>
  );
};

export default PriceChart;
