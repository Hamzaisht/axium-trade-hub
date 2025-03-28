
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAIValuation } from '@/hooks/useAIValuation';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';
import { MarketDepth } from '@/types/api';

interface MarketDepthChartProps {
  ipoId?: string;
  symbol?: string;
  currentPrice?: number;
}

export const MarketDepthChart = ({ 
  ipoId, 
  symbol = 'EMW',
  currentPrice = 24.82 
}: MarketDepthChartProps) => {
  const { marketDepth, isMarketDepthLoading } = useAIValuation({ ipoId });
  const [depthData, setDepthData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!marketDepth || !currentPrice) {
      setDepthData([]);
      return;
    }
    
    const { supportLevels, resistanceLevels } = marketDepth;
    const priceLevels = [...supportLevels, currentPrice, ...resistanceLevels].sort((a, b) => a - b);
    
    const minPrice = Math.min(...priceLevels) * 0.9;
    const maxPrice = Math.max(...priceLevels) * 1.1;
    
    const pricePoints = [];
    const step = (maxPrice - minPrice) / 40;
    
    for (let price = minPrice; price <= maxPrice; price += step) {
      pricePoints.push(parseFloat(price.toFixed(2)));
    }
    
    const data = pricePoints.map(price => {
      let buyVolume = 0;
      let sellVolume = 0;
      
      if (price <= currentPrice) {
        const distance = (currentPrice - price) / currentPrice;
        const nearSupport = supportLevels.some(support => Math.abs(price - support) < step * 2);
        
        buyVolume = marketDepth.buyWallStrength * 1000 * (1 + distance * 5) * (nearSupport ? 1.5 : 1);
      }
      
      if (price >= currentPrice) {
        const distance = (price - currentPrice) / currentPrice;
        const nearResistance = resistanceLevels.some(resistance => Math.abs(price - resistance) < step * 2);
        
        sellVolume = marketDepth.sellWallStrength * 1000 * (1 + distance * 4) * (nearResistance ? 1.4 : 1);
      }
      
      return {
        price,
        buyVolume: parseFloat(buyVolume.toFixed(0)),
        sellVolume: parseFloat(sellVolume.toFixed(0))
      };
    });
    
    setDepthData(data);
  }, [marketDepth, currentPrice]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const price = payload[0].payload.price;
      const buyVolume = payload[0].payload.buyVolume;
      const sellVolume = payload[0].payload.sellVolume;
      
      return (
        <div className="bg-white p-3 border border-axium-gray-200 rounded-md shadow-md">
          <p className="font-medium text-axium-gray-900">${price.toFixed(2)}</p>
          {buyVolume > 0 && (
            <p className="text-axium-success text-sm">Buy: {buyVolume.toLocaleString()} tokens</p>
          )}
          {sellVolume > 0 && (
            <p className="text-axium-error text-sm">Sell: {sellVolume.toLocaleString()} tokens</p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Layers className="text-axium-blue mr-2 h-5 w-5" />
          Market Depth {symbol && <span className="text-axium-gray-500 font-normal ml-1">({symbol})</span>}
        </h2>
      </div>
      
      {isMarketDepthLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      ) : !marketDepth ? (
        <div className="text-center py-10 text-axium-gray-500">
          <p>No market depth data available</p>
        </div>
      ) : (
        <>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={depthData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="price" 
                  tickFormatter={(value) => `$${value}`}
                  domain={['dataMin', 'dataMax']}
                  type="number"
                  allowDecimals={false}
                  tickCount={5}
                />
                <YAxis 
                  orientation="right"
                  tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  x={currentPrice} 
                  stroke="#0050FF" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: `$${currentPrice}`, 
                    position: 'top',
                    fill: '#0050FF',
                    fontSize: 12
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="buyVolume" 
                  stroke="#22c55e" 
                  fillOpacity={1}
                  fill="url(#colorBuy)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="sellVolume" 
                  stroke="#ef4444" 
                  fillOpacity={1}
                  fill="url(#colorSell)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[120px]">
              <Badge className="bg-axium-success/10 text-axium-success hover:bg-axium-success/20 mb-2">
                Buy Wall: {marketDepth?.buyWallStrength * 10}/10
              </Badge>
              <div className="text-xs text-axium-gray-600">
                Support levels at: 
                {marketDepth?.supportLevels.map((level, i) => (
                  <span key={i} className="ml-1 font-medium text-axium-success">${level}</span>
                ))}
              </div>
            </div>
            
            <div className="flex-1 min-w-[120px]">
              <Badge className="bg-axium-error/10 text-axium-error hover:bg-axium-error/20 mb-2">
                Sell Wall: {marketDepth?.sellWallStrength * 10}/10
              </Badge>
              <div className="text-xs text-axium-gray-600">
                Resistance levels at:
                {marketDepth?.resistanceLevels.map((level, i) => (
                  <span key={i} className="ml-1 font-medium text-axium-error">${level}</span>
                ))}
              </div>
            </div>
            
            <div className="flex-1 min-w-[120px]">
              <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
                Current Spread
              </Badge>
              <div className="text-xs text-axium-gray-600">
                Bid: <span className="text-axium-success font-medium">
                  ${marketDepth?.currentSpread && typeof marketDepth.currentSpread === 'object' && marketDepth.currentSpread?.bid ? marketDepth.currentSpread.bid.toFixed(2) : '0.00'}
                </span> 
                <span className="mx-1">|</span> 
                Ask: <span className="text-axium-error font-medium">
                  ${marketDepth?.currentSpread && typeof marketDepth.currentSpread === 'object' && marketDepth.currentSpread?.ask ? marketDepth.currentSpread.ask.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
};

export default MarketDepthChart;
