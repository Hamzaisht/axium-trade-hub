
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropletIcon, TrendingUp, DollarSign } from "lucide-react";

interface LiquidityPoolInfoProps {
  symbol?: string;
}

const LiquidityPoolInfo = ({ symbol }: LiquidityPoolInfoProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for liquidity pool
  const poolData = {
    totalLiquidity: 2450000,
    apr: 12.5,
    yourShare: 2.3,
    yourLiquidity: 56350,
    rewards: 1250,
    composition: [
      { name: "USDC", value: 1225000, color: "#2775CA" },
      { name: symbol || "TOKEN", value: 1225000, color: "#8884d8" },
    ],
    history: [
      { date: "Jan 1", liquidity: 1800000 },
      { date: "Jan 8", liquidity: 1950000 },
      { date: "Jan 15", liquidity: 2100000 },
      { date: "Jan 22", liquidity: 2200000 },
      { date: "Jan 29", liquidity: 2350000 },
      { date: "Feb 5", liquidity: 2450000 },
    ],
  };

  // Format numbers for display
  const formatNumber = (num: number, decimals = 0) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(decimals)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(decimals)}K`;
    } else {
      return `$${num.toFixed(decimals)}`;
    }
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-axium-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p>{formatNumber(payload[0].value)}</p>
          <p>{((payload[0].value / poolData.totalLiquidity) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <DropletIcon className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="text-lg font-semibold">Liquidity Pool</h3>
        </div>
        <Button variant="outline" size="sm">
          Add Liquidity
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-axium-gray-50 p-3 rounded-md">
          <div className="text-sm text-axium-gray-600 mb-1">Total Liquidity</div>
          <div className="text-xl font-semibold">{formatNumber(poolData.totalLiquidity)}</div>
        </div>
        <div className="bg-axium-gray-50 p-3 rounded-md">
          <div className="text-sm text-axium-gray-600 mb-1">Current APR</div>
          <div className="text-xl font-semibold text-green-500">{poolData.apr}%</div>
        </div>
        <div className="bg-axium-gray-50 p-3 rounded-md">
          <div className="text-sm text-axium-gray-600 mb-1">Your Share</div>
          <div className="text-xl font-semibold">{poolData.yourShare}%</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 h-9">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <DollarSign className="h-4 w-4 mr-2" />
            Your Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Pool Composition</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={poolData.composition}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {poolData.composition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Liquidity History</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={poolData.history}>
                    <Bar dataKey="liquidity" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Tooltip
                      formatter={(value) => [formatNumber(value as number), "Liquidity"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="pt-4">
          <div className="space-y-4">
            <div className="bg-axium-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-axium-gray-600">Your Liquidity</span>
                <span className="font-medium">{formatNumber(poolData.yourLiquidity)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-axium-gray-600">Rewards Earned</span>
                <span className="font-medium text-green-500">
                  {formatNumber(poolData.rewards)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-axium-gray-600">Next Reward</span>
                <span className="font-medium">In 2 days</span>
              </div>
            </div>

            <Button className="w-full">Claim Rewards</Button>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default LiquidityPoolInfo;
