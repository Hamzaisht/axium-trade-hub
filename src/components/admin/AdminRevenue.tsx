
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Sample revenue data (replace with real API call in production)
const revenueData = [
  { month: 'Jan', revenue: 4000, fees: 2400, growth: 24 },
  { month: 'Feb', revenue: 3000, fees: 1398, growth: 12 },
  { month: 'Mar', revenue: 2000, fees: 9800, growth: 15 },
  { month: 'Apr', revenue: 2780, fees: 3908, growth: 21 },
  { month: 'May', revenue: 1890, fees: 4800, growth: 18 },
  { month: 'Jun', revenue: 2390, fees: 3800, growth: 22 },
  { month: 'Jul', revenue: 3490, fees: 4300, growth: 25 },
];

const creatorRevenueData = [
  { name: 'Creator A', revenue: 25400 },
  { name: 'Creator B', revenue: 18300 },
  { name: 'Creator C', revenue: 15200 },
  { name: 'Creator D', revenue: 12100 },
  { name: 'Creator E', revenue: 9800 },
];

export const AdminRevenue = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Revenue</CardTitle>
          <CardDescription>
            Overview of total revenue, fees collected, and growth metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="revenue" name="Total Revenue" fill="#4f46e5" />
                    <Bar dataKey="fees" name="Platform Fees" fill="#818cf8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$24,950</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-600">↑ 18.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Platform Fees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$6,237</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-600">↑ 12.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">19.6%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-amber-500">→ 0.8%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="quarterly" className="pt-4">
              <div className="flex justify-center items-center h-80">
                <p className="text-muted-foreground">Quarterly data visualization coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="yearly" className="pt-4">
              <div className="flex justify-center items-center h-80">
                <p className="text-muted-foreground">Yearly data visualization coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Creator Revenue</CardTitle>
          <CardDescription>
            Revenue generated by top creators on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={creatorRevenueData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
          <CardDescription>
            Monthly growth rate trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  name="Growth Rate" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenue;
