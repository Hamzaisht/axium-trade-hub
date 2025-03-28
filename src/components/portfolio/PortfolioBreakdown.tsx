
import { useEffect, useState } from "react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useNavigate } from "react-router-dom";
import { useIPO } from "@/contexts/IPOContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Define enhanced holding type with the properties we need
interface EnhancedHolding {
  ipoId: string;
  quantity: number;
  averagePurchasePrice: number;
  currentPrice?: number;
  creatorSymbol?: string;
  creatorName?: string;
  priceChange?: number;
  value?: number;
  percent?: number;
  color?: string;
}

const PortfolioBreakdown = () => {
  const { portfolio, isLoading } = usePortfolio();
  const { ipos } = useIPO();
  const navigate = useNavigate();
  const [holdingsWithData, setHoldingsWithData] = useState<EnhancedHolding[]>([]);
  
  // Enhance holdings with creator data
  useEffect(() => {
    if (!portfolio || !portfolio.holdings || !ipos || ipos.length === 0) {
      return;
    }
    
    // Map portfolio holdings to include creator data from ipos
    const enhancedHoldings = portfolio.holdings.map(holding => {
      const ipoData = ipos.find(ipo => ipo.id === holding.ipoId);
      
      // If we found matching IPO data, include it
      if (ipoData) {
        const priceChange = ipoData.currentPrice && ipoData.initialPrice 
          ? ((ipoData.currentPrice - ipoData.initialPrice) / ipoData.initialPrice) * 100
          : 0;
          
        return {
          ...holding,
          creatorSymbol: ipoData.symbol,
          creatorName: ipoData.creatorName,
          priceChange: Number(priceChange.toFixed(2))
        };
      }
      
      // Return the original holding if no IPO data found
      return holding;
    });
    
    setHoldingsWithData(enhancedHoldings);
  }, [portfolio, ipos]);
  
  // Calculate the percentage each holding represents
  const calculatePercentages = () => {
    if (!holdingsWithData || holdingsWithData.length === 0) {
      return [];
    }
    
    const totalValue = holdingsWithData.reduce(
      (sum, holding) => sum + holding.quantity * (holding.currentPrice || holding.averagePurchasePrice), 
      0
    );
    
    return holdingsWithData.map((holding, index) => {
      const value = holding.quantity * (holding.currentPrice || holding.averagePurchasePrice);
      const percent = (value / totalValue * 100).toFixed(1);
      
      // Assign a color from a predefined palette
      const colors = [
        "#0050FF", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE",
        "#8B5CF6", "#A78BFA", "#C4B5FD", "#D946EF", "#E879F9", "#F0ABFC"
      ];
      
      return {
        ...holding,
        value,
        percent: parseFloat(percent),
        color: colors[index % colors.length]
      };
    });
  };
  
  const holdingsWithPercent = calculatePercentages();
  
  const handleViewCreator = (creatorId: string) => {
    navigate(`/creator/${creatorId}`);
  };
  
  if (isLoading) {
    return (
      <GlassCard>
        <div className="p-5">
          <div className="animate-pulse">
            <div className="h-8 bg-axium-gray-200 rounded mb-6 w-1/2"></div>
            <div className="h-40 bg-axium-gray-200 rounded mb-6"></div>
            <div className="h-24 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      </GlassCard>
    );
  }
  
  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <GlassCard>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-4">Portfolio Breakdown</h3>
          <div className="flex flex-col items-center justify-center h-60">
            <p className="text-axium-gray-600 mb-4">You don't have any holdings yet</p>
            <Button onClick={() => navigate('/creators')}>Explore Creators</Button>
          </div>
        </div>
      </GlassCard>
    );
  }
  
  return (
    <GlassCard>
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Portfolio Breakdown</h3>
        </div>
        
        <div className="h-[200px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={holdingsWithPercent}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {holdingsWithPercent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                labelFormatter={(index) => holdingsWithPercent[index].creatorSymbol || 'Unknown'}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          {holdingsWithPercent.slice(0, 4).map((holding, index) => (
            <div key={holding.ipoId} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: holding.color }}
                />
                <div>
                  <p className="font-medium">{holding.creatorSymbol || 'Unknown'}</p>
                  <p className="text-xs text-axium-gray-500">{holding.percent}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${holding.value?.toLocaleString()}</p>
                <div className={cn(
                  "flex items-center text-xs justify-end",
                  (holding.priceChange || 0) >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {(holding.priceChange || 0) >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {(holding.priceChange || 0) >= 0 ? "+" : ""}{holding.priceChange || 0}%
                </div>
              </div>
            </div>
          ))}
          
          {holdingsWithPercent.length > 4 && (
            <Button 
              variant="outline"
              className="w-full border-axium-gray-200 text-axium-gray-700 hover:bg-axium-gray-100 mt-2"
              onClick={() => navigate('/portfolio')}
            >
              View All Assets
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default PortfolioBreakdown;
