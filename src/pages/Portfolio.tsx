
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, CreditCard, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for portfolio
const portfolioData = {
  totalValue: 142580,
  change: 8.3,
  changeValue: 11850,
  invested: 98570,
  holdings: [
    { name: "Taylor Swift", symbol: "$SWIFT", value: 42850, units: 480.32, change: 8.7, color: "#0050FF" },
    { name: "LeBron James", symbol: "$LBJ", value: 30451, units: 536.21, change: 3.4, color: "#3B82F6" },
    { name: "Cristiano Ronaldo", symbol: "$CR7", value: 28860, units: 400.00, change: 4.5, color: "#60A5FA" },
    { name: "Zendaya", symbol: "$ZEN", value: 15640, units: 850.00, change: 5.2, color: "#93C5FD" },
    { name: "Emma Watson", symbol: "$EMW", value: 14950, units: 602.33, change: 12.5, color: "#BFDBFE" },
    { name: "Tom Holland", symbol: "$THLD", value: 9829, units: 460.37, change: -1.8, color: "#DBEAFE" },
  ],
  transactions: [
    { id: 1, type: "buy", symbol: "$SWIFT", units: 10.5, price: 85.32, total: 895.86, date: "2023-05-01T10:15:00" },
    { id: 2, type: "sell", symbol: "$EMW", units: 5.2, price: 23.45, total: 121.94, date: "2023-04-28T14:30:00" },
    { id: 3, type: "buy", symbol: "$CR7", units: 20, price: 71.05, total: 1421.00, date: "2023-04-25T09:45:00" },
    { id: 4, type: "buy", symbol: "$LBJ", units: 15, price: 54.21, total: 813.15, date: "2023-04-22T16:20:00" },
    { id: 5, type: "sell", symbol: "$ZEN", units: 8.5, price: 17.95, total: 152.58, date: "2023-04-20T11:05:00" },
  ],
  performance: [
    { date: "Jan", value: 92500 },
    { date: "Feb", value: 98200 },
    { date: "Mar", value: 105400 },
    { date: "Apr", value: 112800 },
    { date: "May", value: 130700 },
    { date: "Jun", value: 142580 },
  ]
};

const Portfolio = () => {
  const [timeFrame, setTimeFrame] = useState("6m");
  
  // Format date for the transaction history
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Calculate the percentage each holding represents
  const totalPortfolioValue = portfolioData.holdings.reduce((sum, item) => sum + item.value, 0);
  const holdingsWithPercent = portfolioData.holdings.map(holding => ({
    ...holding,
    percent: (holding.value / totalPortfolioValue * 100).toFixed(1)
  }));
  
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
  
  return (
    <div className="min-h-screen bg-axium-gray-100/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-axium-gray-900 mb-2">My Portfolio</h1>
            <p className="text-axium-gray-600">Track your investments and performance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="md:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                <div>
                  <p className="text-axium-gray-600 mb-1">Total Portfolio Value</p>
                  <div className="flex items-baseline">
                    <h2 className="text-3xl font-bold mr-3">${portfolioData.totalValue.toLocaleString()}</h2>
                    <div className={cn(
                      "flex items-center text-sm font-medium",
                      portfolioData.change >= 0 ? "text-axium-success" : "text-axium-error"
                    )}>
                      {portfolioData.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {portfolioData.change >= 0 ? "+" : ""}{portfolioData.change}% (${portfolioData.changeValue.toLocaleString()})
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
                    data={portfolioData.performance}
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
            </GlassCard>
            
            <GlassCard>
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
                      labelFormatter={(index) => holdingsWithPercent[index].symbol}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                {holdingsWithPercent.slice(0, 4).map((holding, index) => (
                  <div key={holding.symbol} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: holding.color }}
                      />
                      <div>
                        <p className="font-medium">{holding.symbol}</p>
                        <p className="text-xs text-axium-gray-500">{holding.percent}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${holding.value.toLocaleString()}</p>
                      <div className={cn(
                        "flex items-center text-xs justify-end",
                        holding.change >= 0 ? "text-axium-success" : "text-axium-error"
                      )}>
                        {holding.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {holding.change >= 0 ? "+" : ""}{holding.change}%
                      </div>
                    </div>
                  </div>
                ))}
                
                {holdingsWithPercent.length > 4 && (
                  <Button 
                    variant="outline"
                    className="w-full border-axium-gray-200 text-axium-gray-700 hover:bg-axium-gray-100 mt-2"
                  >
                    View All Assets
                  </Button>
                )}
              </div>
            </GlassCard>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="md:col-span-2">
              <Tabs defaultValue="holdings">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">My Assets</h3>
                  <TabsList className="bg-axium-gray-100">
                    <TabsTrigger value="holdings" className="data-[state=active]:bg-axium-blue data-[state=active]:text-white">
                      Holdings
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="data-[state=active]:bg-axium-blue data-[state=active]:text-white">
                      Transactions
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="holdings" className="space-y-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-axium-gray-200">
                          <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Asset</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Amount</th>
                          <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Value</th>
                          <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Change</th>
                          <th className="py-3 px-4 text-center text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-axium-gray-200">
                        {portfolioData.holdings.map((holding) => (
                          <tr key={holding.symbol} className="hover:bg-axium-gray-50">
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div 
                                  className="w-8 h-8 rounded-full mr-3 bg-axium-gray-200 overflow-hidden flex-shrink-0"
                                  style={{ 
                                    background: `linear-gradient(135deg, ${holding.color}20, ${holding.color}50)` 
                                  }}
                                />
                                <div>
                                  <p className="font-medium text-axium-gray-900">{holding.symbol}</p>
                                  <p className="text-sm text-axium-gray-500">{holding.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <p className="font-medium">{holding.units.toFixed(2)}</p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              <p className="font-medium">${holding.value.toLocaleString()}</p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              <div className={cn(
                                "inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-xs font-medium w-[80px]",
                                holding.change >= 0 
                                  ? "bg-axium-success/10 text-axium-success" 
                                  : "bg-axium-error/10 text-axium-error"
                              )}>
                                {holding.change >= 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {holding.change >= 0 ? "+" : ""}{holding.change}%
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-center">
                              <div className="flex justify-center space-x-2">
                                <Button 
                                  size="sm"
                                  className="bg-axium-blue hover:bg-axium-blue/90 text-white"
                                >
                                  Trade
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions" className="space-y-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-axium-gray-200">
                          <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Date</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Type</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Asset</th>
                          <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Amount</th>
                          <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Price</th>
                          <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-axium-gray-200">
                        {portfolioData.transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-axium-gray-50">
                            <td className="py-4 px-4 whitespace-nowrap">
                              <p className="text-sm text-axium-gray-600">{formatDate(transaction.date)}</p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                transaction.type === "buy" 
                                  ? "bg-axium-success/10 text-axium-success" 
                                  : "bg-axium-error/10 text-axium-error"
                              )}>
                                {transaction.type.toUpperCase()}
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <p className="font-medium">{transaction.symbol}</p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              <p className="font-medium">{transaction.units.toFixed(2)}</p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              <p className="font-medium">${transaction.price.toFixed(2)}</p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              <p className="font-medium">${transaction.total.toFixed(2)}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline"
                      className="border-axium-gray-200 text-axium-gray-700 hover:bg-axium-gray-100"
                    >
                      View All Transactions
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </GlassCard>
            
            <div className="space-y-6">
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Account Balance</h3>
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-axium-gray-500 text-sm">Available funds</p>
                    <p className="text-2xl font-semibold mt-1">$5,280.42</p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-axium-success hover:bg-axium-success/90 text-white"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Deposit
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-axium-gray-200 text-axium-gray-700 hover:bg-axium-gray-100"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Pending Orders</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-axium-gray-600 hover:text-axium-blue"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    History
                  </Button>
                </div>
                
                <div className="text-center py-8">
                  <p className="text-axium-gray-500">No pending orders</p>
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Profit/Loss</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-axium-gray-600 hover:text-axium-blue"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
                
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: 'Jan', profit: 2500 },
                        { month: 'Feb', profit: 1800 },
                        { month: 'Mar', profit: 4200 },
                        { month: 'Apr', profit: 3500 },
                        { month: 'May', profit: 5800 },
                        { month: 'Jun', profit: 8300 },
                      ]}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']}
                      />
                      <Bar dataKey="profit" fill="#0050FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-2 pt-4 border-t border-axium-gray-200 flex justify-between">
                  <div>
                    <p className="text-axium-gray-500 text-xs">Total Profit</p>
                    <p className="text-axium-success font-semibold">+$44,010</p>
                  </div>
                  <div>
                    <p className="text-axium-gray-500 text-xs">Return</p>
                    <p className="text-axium-success font-semibold">+44.65%</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
