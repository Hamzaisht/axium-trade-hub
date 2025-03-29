
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

// Mock data for charts
const generateDailyData = (days: number, baseValue: number, volatility: number) => {
  return Array(days).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const formattedDate = date.toISOString().split('T')[0];
    
    const randomFactor = Math.random() * volatility - volatility / 2;
    const value = Math.max(0, baseValue + (baseValue * (i / days) * 0.2) + randomFactor);
    
    return {
      date: formattedDate,
      value: Math.round(value)
    };
  });
};

export const AdminAnalytics = () => {
  // Generate mock data
  const [tradeData] = useState(generateDailyData(30, 800, 200));
  const [userData] = useState(generateDailyData(30, 50, 15));
  const [revenueData] = useState(generateDailyData(30, 5000, 1500));
  
  // Mock data for top movers
  const [topMovers] = useState([
    { name: 'EMP', change: 34.5, volume: 253000 },
    { name: 'TIN', change: 18.7, volume: 187000 },
    { name: 'GRT', change: 12.3, volume: 135000 },
    { name: 'MCK', change: -15.8, volume: 112000 },
    { name: 'GXP', change: -8.2, volume: 98000 }
  ]);
  
  // Mock data for platform metrics
  const [platformMetrics] = useState({
    activeUsers: 4820,
    userGrowth: 12.5,
    tradingVolume: 1250000,
    volumeGrowth: 8.3,
    platformRevenue: 87500,
    revenueGrowth: 15.7,
    averageTradeSize: 450,
    tradeSizeGrowth: -2.1
  });
  
  // Mock data for creator revenue distribution
  const [creatorRevenue] = useState([
    { name: 'Tech Innovators', value: 35 },
    { name: 'Emma Wilson', value: 25 },
    { name: 'Global Explorers', value: 15 },
    { name: 'Mia Cooking', value: 10 },
    { name: 'Other Creators', value: 15 }
  ]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            Last 30 Days
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{formatNumber(platformMetrics.activeUsers)}</CardTitle>
              <Badge 
                className={platformMetrics.userGrowth >= 0 
                  ? "bg-green-100 text-green-800 flex items-center gap-1" 
                  : "bg-red-100 text-red-800 flex items-center gap-1"}
              >
                {platformMetrics.userGrowth >= 0 
                  ? <TrendingUp className="h-3 w-3" /> 
                  : <TrendingDown className="h-3 w-3" />}
                {Math.abs(platformMetrics.userGrowth)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Daily Trades</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{formatNumber(tradeData[tradeData.length - 1].value)}</CardTitle>
              <Badge 
                className="bg-green-100 text-green-800 flex items-center gap-1" 
              >
                <TrendingUp className="h-3 w-3" /> 
                14.2%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tradeData}>
                  <defs>
                    <linearGradient id="colorTrades" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorTrades)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Trading Volume</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{formatCurrency(platformMetrics.tradingVolume)}</CardTitle>
              <Badge 
                className={platformMetrics.volumeGrowth >= 0 
                  ? "bg-green-100 text-green-800 flex items-center gap-1" 
                  : "bg-red-100 text-red-800 flex items-center gap-1"}
              >
                {platformMetrics.volumeGrowth >= 0 
                  ? <TrendingUp className="h-3 w-3" /> 
                  : <TrendingDown className="h-3 w-3" />}
                {Math.abs(platformMetrics.volumeGrowth)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffc658" 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Platform Revenue</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{formatCurrency(platformMetrics.platformRevenue)}</CardTitle>
              <Badge 
                className={platformMetrics.revenueGrowth >= 0 
                  ? "bg-green-100 text-green-800 flex items-center gap-1" 
                  : "bg-red-100 text-red-800 flex items-center gap-1"}
              >
                {platformMetrics.revenueGrowth >= 0 
                  ? <TrendingUp className="h-3 w-3" /> 
                  : <TrendingDown className="h-3 w-3" />}
                {Math.abs(platformMetrics.revenueGrowth)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0088FE" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    isAnimationActive={false}
                    scale={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Trading Activity</CardTitle>
            <CardDescription>Number of trades executed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={tradeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatNumber(value as number), 'Trades']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Trades"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue & New Users</CardTitle>
            <CardDescription>Platform revenue and user acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData.map((item, index) => ({
                    ...item,
                    users: userData[index].value
                  }))}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                  <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Revenue') return [formatCurrency(value as number), name];
                      return [formatNumber(value as number), name];
                    }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="value" 
                    name="Revenue" 
                    fill="#82ca9d" 
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="users" 
                    name="New Users" 
                    fill="#8884d8" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Movers */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Movers</CardTitle>
            <CardDescription>Tokens with the highest price changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovers.map((mover, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      ${mover.name}
                    </div>
                    <div>
                      <div className="font-medium">{mover.name}</div>
                      <div className="text-xs text-gray-500">
                        Vol: {formatCurrency(mover.volume)}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold flex items-center ${
                    mover.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mover.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(mover.change)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Creator Revenue Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Creator Revenue Distribution</CardTitle>
            <CardDescription>Revenue share among top creators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creatorRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creatorRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Revenue Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4 flex flex-col justify-center">
                {creatorRevenue.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <span className="font-semibold">{entry.value}%</span>
                  </div>
                ))}
                
                <Button variant="outline" className="mt-4 w-full flex items-center justify-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>View Detailed Report</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
