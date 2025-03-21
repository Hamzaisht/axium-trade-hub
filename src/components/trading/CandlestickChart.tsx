
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Bar,
  Line,
  Area
} from 'recharts';

interface CandlestickChartProps {
  data: any[];
  showVolumeBar?: boolean;
  showSMA7?: boolean;
  showSMA30?: boolean;
  showBollingerBands?: boolean;
  showVWAP?: boolean;
  dateFormatter: (date: number) => string;
}

export const CandlestickChart = ({
  data,
  showVolumeBar = true,
  showSMA7 = false,
  showSMA30 = false,
  showBollingerBands = false,
  showVWAP = false,
  dateFormatter
}: CandlestickChartProps) => {
  // Calculate chart domain
  const prices = data.flatMap(d => [d.high, d.low, d.open, d.close])
    .filter(p => p !== undefined && p !== null);
  
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;
  
  // Calculate volume domain for the secondary axis
  const volumes = data.map(d => d.volume).filter(v => v !== undefined && v !== null);
  const maxVolume = Math.max(...volumes);
  
  // Add custom candlestick rendering
  const renderCandlestick = (props: any) => {
    const { 
      x, y, width, height, fill,
      index, payload
    } = props;
    
    // Determine if this is a bullish or bearish candle
    const isBullish = payload.close >= payload.open;
    
    // Adjust the candlestick dimensions
    const candleWidth = Math.max(1, width * 0.8);
    const wickWidth = Math.max(1, width * 0.1);
    
    const candleX = x + (width - candleWidth) / 2;
    const wickX = x + (width - wickWidth) / 2;
    
    const highY = y + height * (1 - (payload.high - minPrice) / (maxPrice - minPrice));
    const lowY = y + height * (1 - (payload.low - minPrice) / (maxPrice - minPrice));
    const openY = y + height * (1 - (payload.open - minPrice) / (maxPrice - minPrice));
    const closeY = y + height * (1 - (payload.close - minPrice) / (maxPrice - minPrice));
    
    const candleTop = Math.min(openY, closeY);
    const candleBottom = Math.max(openY, closeY);
    const candleHeight = Math.max(1, candleBottom - candleTop);
    
    const bullishColor = "#22c55e";
    const bearishColor = "#ef4444";
    const color = isBullish ? bullishColor : bearishColor;
    
    return (
      <g key={`candle-${index}`}>
        {/* Upper wick */}
        <line 
          x1={wickX + wickWidth / 2} 
          y1={highY} 
          x2={wickX + wickWidth / 2} 
          y2={candleTop} 
          stroke={color} 
          strokeWidth={wickWidth}
        />
        
        {/* Lower wick */}
        <line 
          x1={wickX + wickWidth / 2} 
          y1={candleBottom} 
          x2={wickX + wickWidth / 2} 
          y2={lowY} 
          stroke={color} 
          strokeWidth={wickWidth}
        />
        
        {/* Candle body */}
        <rect 
          x={candleX} 
          y={candleTop} 
          width={candleWidth} 
          height={candleHeight} 
          fill={color} 
          stroke={color}
        />
      </g>
    );
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={dateFormatter}
          axisLine={false}
          tickLine={false}
          minTickGap={50}
        />
        <YAxis 
          yAxisId="price" 
          domain={[minPrice, maxPrice]} 
          orientation="right" 
          tickFormatter={(value) => `$${value.toFixed(2)}`}
          axisLine={false}
          tickLine={false}
        />
        {showVolumeBar && (
          <YAxis 
            yAxisId="volume" 
            domain={[0, maxVolume * 1.1]} 
            orientation="left" 
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            axisLine={false}
            tickLine={false}
            width={35}
          />
        )}
        
        <Tooltip />
        
        {/* Render SMA lines */}
        {showSMA7 && (
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="sma7" 
            stroke="#4CAF50" 
            dot={false} 
            strokeWidth={1.5}
            name="SMA (7)"
          />
        )}
        
        {showSMA30 && (
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="sma30" 
            stroke="#F59E0B" 
            dot={false} 
            strokeWidth={1.5}
            name="SMA (30)"
          />
        )}
        
        {/* Render Bollinger Bands */}
        {showBollingerBands && (
          <>
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="upperBB" 
              stroke="#FB923C" 
              dot={false} 
              strokeWidth={1}
              strokeDasharray="2 2"
              name="Upper BB"
            />
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="middleBB" 
              stroke="#FB923C" 
              dot={false} 
              strokeWidth={1}
              name="Middle BB"
            />
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="lowerBB" 
              stroke="#FB923C" 
              dot={false} 
              strokeWidth={1}
              strokeDasharray="2 2"
              name="Lower BB"
            />
          </>
        )}
        
        {/* Render VWAP */}
        {showVWAP && (
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="vwap" 
            stroke="#8B5CF6" 
            dot={false} 
            strokeWidth={1.5}
            strokeDasharray="3 3"
            name="VWAP"
          />
        )}
        
        {/* Render volume bars */}
        {showVolumeBar && (
          <Bar 
            yAxisId="volume" 
            dataKey="volume" 
            fill="#60a5fa" 
            opacity={0.3} 
            barSize={Math.max(2, 100 / data.length)}
            name="Volume"
          />
        )}
        
        {/* Custom candlestick elements */}
        {data.map((entry, index) => renderCandlestick({
          x: index * (100 / data.length),
          y: 20,
          width: 100 / data.length,
          height: 300 - 30,
          fill: entry.open < entry.close ? "#22c55e" : "#ef4444",
          index,
          payload: entry
        }))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
