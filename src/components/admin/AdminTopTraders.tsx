
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ExternalLink,
  AlertOctagon,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Define mock trader data type
interface Trader {
  id: string;
  name: string;
  avatar?: string;
  totalValue: number;
  tradeVolume: number;
  winRate: number;
  avgTradeSize: number;
  performance: number;
  flagged: boolean;
  activityLevel: 'high' | 'medium' | 'low';
  tradingHistory: {
    date: string;
    value: number;
  }[];
}

export const AdminTopTraders = () => {
  // Mock data for top traders
  const [traders] = useState<Trader[]>([
    {
      id: '1',
      name: 'Michael Roberts',
      avatar: 'https://i.pravatar.cc/150?u=trader1',
      totalValue: 560000,
      tradeVolume: 1200000,
      winRate: 0.72,
      avgTradeSize: 5000,
      performance: 28.5,
      flagged: false,
      activityLevel: 'high',
      tradingHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 400000 + Math.random() * 300000
      }))
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=trader2',
      totalValue: 1250000,
      tradeVolume: 3500000,
      winRate: 0.68,
      avgTradeSize: 8500,
      performance: 42.1,
      flagged: false,
      activityLevel: 'high',
      tradingHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 800000 + Math.random() * 600000
      }))
    },
    {
      id: '3',
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?u=trader3',
      totalValue: 890000,
      tradeVolume: 4200000,
      winRate: 0.55,
      avgTradeSize: 12000,
      performance: -5.2,
      flagged: true,
      activityLevel: 'high',
      tradingHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 950000 - (i < 15 ? Math.random() * 100000 : -Math.random() * 50000)
      }))
    },
    {
      id: '4',
      name: 'Emma Davis',
      avatar: 'https://i.pravatar.cc/150?u=trader4',
      totalValue: 340000,
      tradeVolume: 780000,
      winRate: 0.81,
      avgTradeSize: 3500,
      performance: 15.3,
      flagged: false,
      activityLevel: 'medium',
      tradingHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 300000 + Math.random() * 100000
      }))
    },
    {
      id: '5',
      name: 'Daniel Park',
      avatar: 'https://i.pravatar.cc/150?u=trader5',
      totalValue: 1750000,
      tradeVolume: 6800000,
      winRate: 0.64,
      avgTradeSize: 15000,
      performance: 31.7,
      flagged: false,
      activityLevel: 'high',
      tradingHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 1400000 + Math.random() * 800000
      }))
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Top Traders & Whales</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search traders..."
              className="pl-8"
            />
          </div>
          <Button variant="outline" className="flex gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {traders.map((trader) => (
          <Card key={trader.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={trader.avatar} alt={trader.name} />
                    <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base flex items-center">
                      {trader.name}
                      {trader.flagged && (
                        <AlertOctagon className="h-4 w-4 ml-1 text-red-500" />
                      )}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                      Portfolio: {formatCurrency(trader.totalValue)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trader.tradingHistory}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id={`gradient-${trader.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={trader.performance >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={trader.performance >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="date" 
                      tick={false}
                    />
                    <YAxis 
                      domain={['dataMin - 100000', 'dataMax + 100000']}
                      tick={false}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Portfolio Value']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={trader.performance >= 0 ? "#10b981" : "#ef4444"} 
                      fillOpacity={1} 
                      fill={`url(#gradient-${trader.id})`} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                  <div className="font-semibold">{(trader.winRate * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-500 mb-1">Avg Trade</div>
                  <div className="font-semibold">{formatCurrency(trader.avgTradeSize)}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-500 mb-1">Volume (30d)</div>
                  <div className="font-semibold">{formatCurrency(trader.tradeVolume)}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-500 mb-1">Performance</div>
                  <div className={`font-semibold flex items-center ${
                    trader.performance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trader.performance >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(trader.performance).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Badge variant="outline" className={`${
                  trader.activityLevel === 'high' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : trader.activityLevel === 'medium'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {trader.activityLevel.charAt(0).toUpperCase() + trader.activityLevel.slice(1)} Activity
                </Badge>
                <Button size="sm" className="h-7" variant="outline">
                  <span>View Trading History</span>
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
