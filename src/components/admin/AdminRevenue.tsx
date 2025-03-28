
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight,
  Download,
  ChevronDown,
  DollarSign,
  TrendingUp,
  CalendarRange
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';

// Mock creator revenue data
interface CreatorRevenue {
  id: string;
  name: string;
  avatar?: string;
  totalRevenue: number;
  platformFees: number;
  creatorEarnings: number;
  tokenVolume: number;
  growth: number;
  revenueHistory: {
    date: string;
    revenue: number;
  }[];
}

export const AdminRevenue = () => {
  // Mock data for revenue by creator
  const [creatorsRevenue] = useState<CreatorRevenue[]>([
    {
      id: '1',
      name: 'Tech Innovators',
      avatar: 'https://i.pravatar.cc/150?u=tech1',
      totalRevenue: 230000,
      platformFees: 34500,
      creatorEarnings: 195500,
      tokenVolume: 980000,
      growth: 18.5,
      revenueHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: 5000 + (i * 200) + (Math.random() * 1000)
      }))
    },
    {
      id: '2',
      name: 'Emma Wilson',
      avatar: 'https://i.pravatar.cc/150?u=emma',
      totalRevenue: 178000,
      platformFees: 26700,
      creatorEarnings: 151300,
      tokenVolume: 720000,
      growth: 12.3,
      revenueHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: 4500 + (i * 150) + (Math.random() * 800)
      }))
    },
    {
      id: '3',
      name: 'Global Explorers',
      avatar: 'https://i.pravatar.cc/150?u=global',
      totalRevenue: 126000,
      platformFees: 18900,
      creatorEarnings: 107100,
      tokenVolume: 530000,
      growth: 8.7,
      revenueHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: 3200 + (i * 120) + (Math.random() * 600)
      }))
    },
    {
      id: '4',
      name: 'Mia Cooking',
      avatar: 'https://i.pravatar.cc/150?u=mia',
      totalRevenue: 95000,
      platformFees: 14250,
      creatorEarnings: 80750,
      tokenVolume: 410000,
      growth: 15.2,
      revenueHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: 2400 + (i * 100) + (Math.random() * 500)
      }))
    },
    {
      id: '5',
      name: 'Daniel Gaming',
      avatar: 'https://i.pravatar.cc/150?u=daniel',
      totalRevenue: 68000,
      platformFees: 10200,
      creatorEarnings: 57800,
      tokenVolume: 290000,
      growth: -3.5,
      revenueHistory: Array(30).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: 2800 - (i * 20) + (Math.random() * 400)
      }))
    }
  ]);

  // Mock data for platform revenue breakdown
  const [revenueBreakdown] = useState([
    { name: 'Transaction Fees', value: 435000 },
    { name: 'IPO Launch Fees', value: 215000 },
    { name: 'Withdrawal Fees', value: 98000 },
    { name: 'Premium Subscriptions', value: 76000 },
    { name: 'API Access', value: 42000 }
  ]);

  // Mock data for monthly revenue
  const [monthlyRevenue] = useState(
    Array(12).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      
      // Growing trend with some randomness
      const baseValue = 60000 + (i * 8000);
      const randomVariation = Math.random() * 15000 - 7500;
      
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        revenue: Math.max(10000, baseValue + randomVariation),
        transactions: Math.round((baseValue + randomVariation) / 25)
      };
    })
  );

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

  // Calculate total platform revenue
  const totalPlatformRevenue = revenueBreakdown.reduce((total, item) => total + item.value, 0);
  
  // Calculate total creator earnings
  const totalCreatorEarnings = creatorsRevenue.reduce((total, creator) => total + creator.creatorEarnings, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            Last 30 Days
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Platform Revenue</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalPlatformRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 flex justify-between items-center">
              <span>Last 30 days</span>
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 
                15.2%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Creator Earnings</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalCreatorEarnings)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 flex justify-between items-center">
              <span>Last 30 days</span>
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 
                12.8%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Fee Per Transaction</CardDescription>
            <CardTitle className="text-2xl">${(totalPlatformRevenue / 24500).toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 flex justify-between items-center">
              <span>Based on 24,500 transactions</span>
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 
                3.6%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="creators">Top Creators</TabsTrigger>
          <TabsTrigger value="breakdown">Revenue Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Platform revenue over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenue}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        name="Revenue" 
                        fill="#8884d8" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Breakdown of platform revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {revenueBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4 flex flex-col justify-center">
                    {revenueBreakdown.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{entry.name}</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(entry.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="creators" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Generating Creators</CardTitle>
              <CardDescription>
                Creators ranked by total revenue generated through the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {creatorsRevenue.map((creator, index) => (
                  <div key={creator.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-lg text-gray-500">#{index + 1}</div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={creator.avatar} alt={creator.name} />
                          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{creator.name}</div>
                          <div className="text-sm text-gray-500">
                            Volume: {formatCurrency(creator.tokenVolume)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-right">
                          {formatCurrency(creator.totalRevenue)}
                        </div>
                        <div className={`text-sm flex items-center justify-end ${
                          creator.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {creator.growth >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(creator.growth)}% vs. last month
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={creator.revenueHistory}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id={`colorRevenue-${creator.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill={`url(#colorRevenue-${creator.id})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <div className="text-xs text-gray-500">Total Revenue</div>
                        <div className="font-semibold">{formatCurrency(creator.totalRevenue)}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <div className="text-xs text-gray-500">Platform Fees</div>
                        <div className="font-semibold">{formatCurrency(creator.platformFees)}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <div className="text-xs text-gray-500">Creator Earnings</div>
                        <div className="font-semibold">{formatCurrency(creator.creatorEarnings)}</div>
                      </div>
                    </div>
                    
                    {index < creatorsRevenue.length - 1 && <hr className="my-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>How platform revenue is distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Platform Revenue', value: totalPlatformRevenue },
                            { name: 'Creator Earnings', value: totalCreatorEarnings }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#0088FE" />
                          <Cell fill="#00C49F" />
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#0088FE]" />
                        <span className="font-medium">Platform Revenue</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(totalPlatformRevenue)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#00C49F]" />
                        <span className="font-medium">Creator Earnings</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(totalCreatorEarnings)}</span>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="flex items-center justify-between font-bold">
                      <span>Total Volume</span>
                      <span>{formatCurrency(totalPlatformRevenue + totalCreatorEarnings)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Fee Performance</CardTitle>
                <CardDescription>Revenue from different fee types over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', transaction: 35000, ipo: 18000, withdrawal: 7500, subscription: 6000, api: 3200 },
                        { month: 'Feb', transaction: 37500, ipo: 16500, withdrawal: 7800, subscription: 6200, api: 3300 },
                        { month: 'Mar', transaction: 36200, ipo: 17200, withdrawal: 8100, subscription: 6400, api: 3450 },
                        { month: 'Apr', transaction: 38500, ipo: 18800, withdrawal: 8300, subscription: 6500, api: 3500 },
                        { month: 'May', transaction: 39800, ipo: 19500, withdrawal: 8400, subscription: 6800, api: 3600 },
                        { month: 'Jun', transaction: 41200, ipo: 21000, withdrawal: 8700, subscription: 7000, api: 3700 },
                        { month: 'Jul', transaction: 42500, ipo: 22500, withdrawal: 9000, subscription: 7100, api: 3800 },
                        { month: 'Aug', transaction: 43800, ipo: 22000, withdrawal: 9300, subscription: 7300, api: 3900 },
                        { month: 'Sep', transaction: 45200, ipo: 23500, withdrawal: 9500, subscription: 7400, api: 4000 },
                        { month: 'Oct', transaction: 46500, ipo: 24800, withdrawal: 9800, subscription: 7500, api: 4100 },
                        { month: 'Nov', transaction: 48000, ipo: 25000, withdrawal: 10000, subscription: 7600, api: 4200 },
                        { month: 'Dec', transaction: 50000, ipo: 26000, withdrawal: 10200, subscription: 7700, api: 4300 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), '']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="transaction" 
                        name="Transaction Fees" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ipo" 
                        name="IPO Launch Fees" 
                        stroke="#82ca9d" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="withdrawal" 
                        name="Withdrawal Fees" 
                        stroke="#ffc658" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="subscription" 
                        name="Premium Subscriptions" 
                        stroke="#ff8042" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="api" 
                        name="API Access" 
                        stroke="#0088FE" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
