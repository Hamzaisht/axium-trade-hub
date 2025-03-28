
import { useState } from "react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PortfolioOverview = () => {
  const { portfolio, portfolioHistory, isLoading } = usePortfolio();
  const [timeFrame, setTimeFrame] = useState("6m");
  
  // Calculate the percentage each holding represents
  const calculatePercentages = () => {
    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
      return [];
    }
    
    const totalValue = portfolio.holdings.reduce(
      (sum, holding) => sum + holding.quantity * holding.currentPrice, 
      0
    );
    
    return portfolio.holdings.map((holding, index) => {
      const value = holding.quantity * holding.currentPrice;
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
  
  // Calculate overall growth
  const calculateTotalChange = () => {
    if (!portfolio) return { percent: 0, value: 0 };
    
    const totalValue = portfolio.totalValue;
    const totalInvested = portfolio.invested || 0;
    
    if (totalInvested === 0) return { percent: 0, value: 0 };
    
    const change = totalValue - totalInvested;
    const percentChange = (change / totalInvested) * 100;
    
    return {
      percent: parseFloat(percentChange.toFixed(2)),
      value: parseFloat(change.toFixed(2))
    };
  };
  
  const totalChange = calculateTotalChange();
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-axium-gray-200 rounded-md shadow-sm">
          <p className="font-medium">{`$${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <GlassCard className="md:col-span-2">
        <div className="p-5">
          <div className="animate-pulse">
            <div className="h-8 bg-axium-gray-200 rounded mb-6 w-1/3"></div>
            <div className="h-20 bg-axium-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      </GlassCard>
    );
  }
  
  if (!portfolio) {
    return (
      <GlassCard className="md:col-span-2">
        <div className="flex flex-col items-center justify-center p-5 h-80">
          <p className="text-axium-gray-600 mb-4">No portfolio data available</p>
          <Button>Start Investing</Button>
        </div>
      </GlassCard>
    );
  }
  
  return (
    <GlassCard className="md:col-span-2">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
          <div>
            <p className="text-axium-gray-600 mb-1">Total Portfolio Value</p>
            <div className="flex items-baseline">
              <h2 className="text-3xl font-bold mr-3">${portfolio.totalValue.toLocaleString()}</h2>
              <div className={cn(
                "flex items-center text-sm font-medium",
                totalChange.percent >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {totalChange.percent >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {totalChange.percent >= 0 ? "+" : ""}{totalChange.percent}% (${Math.abs(totalChange.value).toLocaleString()})
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button 
              variant={timeFrame === "1m" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeFrame("1m")}
              className={timeFrame === "1m" ? "bg-axium-blue text-white" : "bg-white"}
            >
              1M
            </Button>
            <Button 
              variant={timeFrame === "6m" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeFrame("6m")}
              className={timeFrame === "6m" ? "bg-axium-blue text-white" : "bg-white"}
            >
              6M
            </Button>
            <Button 
              variant={timeFrame === "1y" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeFrame("1y")}
              className={timeFrame === "1y" ? "bg-axium-blue text-white" : "bg-white"}
            >
              1Y
            </Button>
            <Button 
              variant={timeFrame === "all" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeFrame("all")}
              className={timeFrame === "all" ? "bg-axium-blue text-white" : "bg-white"}
            >
              All
            </Button>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={portfolioHistory}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0050FF" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0050FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EEEEEE" strokeDasharray="5 5" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6C757D' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6C757D' }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value"
                stroke="#0050FF"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0050FF", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#0050FF", strokeWidth: 2, stroke: "#fff" }}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
};

export default PortfolioOverview;
