
import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  CartesianGrid
} from 'recharts';
import { useMarketData } from '@/hooks/useMarketData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle,
  Link,
  Link2Off
} from 'lucide-react';
import { formatCompactNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  ipoId?: string;
  symbol?: string;
  name?: string;
  currentPrice?: number;
  className?: string;
}

// Define the BrushStartEndIndex type for brush events
type BrushStartEndIndex = {
  startIndex: number;
  endIndex: number;
};

const PriceChart = ({ 
  ipoId, 
  symbol = 'EMW', 
  name = 'Example Creator', 
  currentPrice = 25.00,
  className
}: PriceChartProps) => {
  const { 
    isConnected, 
    priceUpdates, 
    connect, 
    disconnect 
  } = useMarketData(ipoId);
  const [data, setData] = useState<any[]>([]);
  const [syncBrush, setSyncBrush] = useState(false);
  const [brushStartIndex, setBrushStartIndex] = useState(0);
  const [brushEndIndex, setBrushEndIndex] = useState(50);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isManualDisconnect, setIsManualDisconnect] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isChartReady, setIsChartReady] = useState(false);
  
  const chartRef = useRef<any>(null);
  
  // Format the chart data
  useEffect(() => {
    if (priceUpdates && priceUpdates.length > 0) {
      const formattedData = priceUpdates.map(update => ({
        time: new Date(update.timestamp).getTime(),
        price: update.newPrice
      }));
      setData(formattedData);
      setIsChartReady(true);
    }
  }, [priceUpdates]);
  
  // Handle connection status
  useEffect(() => {
    if (isConnected) {
      setIsConnecting(false);
      setIsReconnecting(false);
      setIsError(false);
      setErrorMessage('');
      setIsInitialLoad(false);
    } else {
      if (!isManualDisconnect && !isInitialLoad) {
        setIsReconnecting(true);
      }
    }
  }, [isConnected, isManualDisconnect, isInitialLoad]);
  
  // Handle connection attempts
  const handleConnect = () => {
    setIsConnecting(true);
    setIsManualDisconnect(false);
    connect();
  };
  
  // Handle disconnection attempts
  const handleDisconnect = () => {
    disconnect();
    setIsManualDisconnect(true);
    setIsDisconnecting(true);
    
    // Set a timeout to reconnect after 3 seconds
    setTimeout(() => {
      connect();
      setIsDisconnecting(false);
    }, 3000);
  };
  
  // Handle zoom reset
  const handleZoomReset = () => {
    setBrushStartIndex(0);
    setBrushEndIndex(50);
    setIsZoomed(false);
  };
  
  // Handle brush change
  const handleBrushChange = (newIndex: BrushStartEndIndex) => {
    setBrushStartIndex(newIndex.startIndex);
    setBrushEndIndex(newIndex.endIndex);
    setIsZoomed(true);
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-axium-gray-200 rounded-md shadow-md">
          <p className="font-medium text-axium-gray-900">{new Date(label).toLocaleTimeString()}</p>
          <p className="text-axium-gray-700">Price: ${payload[0].value}</p>
        </div>
      );
    }
    return null;
  };
  
  // Calculate price change
  const calculatePriceChange = () => {
    if (!data || data.length < 2) return 0;
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };
  
  const priceChange = calculatePriceChange();
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Price Chart {symbol && <span className="text-axium-gray-500 font-normal ml-1">({symbol})</span>}
        </h3>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Badge variant="outline" className="bg-green-100 text-green-600 border-green-500">
              <Link className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-600 border-red-500">
              <Link2Off className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting || isDisconnecting || isReconnecting}
          >
            {isConnecting ? 'Connecting...' : isDisconnecting ? 'Disconnecting...' : isReconnecting ? 'Reconnecting...' : isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </div>
      
      {isError ? (
        <div className="text-center py-6">
          <AlertTriangle className="h-8 w-8 text-axium-error mx-auto mb-2" />
          <h4 className="text-axium-error font-medium mb-1">Failed to load chart data</h4>
          <p className="text-sm text-axium-gray-600 mb-4">
            {errorMessage || 'There was an error fetching the price data.'}
          </p>
          <Button variant="outline" size="sm" onClick={handleConnect}>
            Retry
          </Button>
        </div>
      ) : !isChartReady ? (
        <div className="flex items-center justify-center h-[300px] text-axium-gray-500">
          Loading chart data...
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-axium-gray-500">
          No price data available
        </div>
      ) : (
        <>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                ref={chartRef}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  domain={['dataMin', 'dataMax']}
                  name="Time"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                  type="number"
                  interval="preserveStartEnd"
                />
                <YAxis 
                  dataKey="price"
                  name="Price"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(price) => `$${price.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#priceGradient)" 
                />
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#0050FF" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: `$${currentPrice}`, 
                    position: 'right',
                    fill: '#0050FF',
                    fontSize: 12
                  }}
                />
                {syncBrush && (
                  <Brush 
                    dataKey="time"
                    startIndex={brushStartIndex}
                    endIndex={brushEndIndex}
                    onChange={handleBrushChange}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-axium-gray-600">
              Price Change: 
              <span className={cn(
                "font-medium ml-1",
                priceChange >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {priceChange >= 0 ? <ArrowUp className="inline-block h-4 w-4 mr-1" /> : <ArrowDown className="inline-block h-4 w-4 mr-1" />}
                {priceChange.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleZoomReset}
                disabled={!isZoomed}
              >
                Reset Zoom
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSyncBrush(!syncBrush)}
              >
                {syncBrush ? 'Disable Brush' : 'Enable Brush'}
              </Button>
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
};

export default PriceChart;
