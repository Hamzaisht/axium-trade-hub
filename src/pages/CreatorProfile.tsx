import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIPO } from "@/contexts/IPOContext";
import { useMarketData } from "@/hooks/useMarketData";
import useSentimentAnalysis from "@/hooks/ai/useSentimentAnalysis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { IPO } from "@/utils/mockApi";
import PriceChart from "@/components/dashboard/PriceChart";
import SentimentScoreBadge from "@/components/trading/SentimentScoreBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Eye, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const CreatorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ipos, isLoading: iposLoading } = useIPO();
  const [creator, setCreator] = useState<IPO | null>(null);
  const { isLoading: marketDataLoading, priceUpdates } = useMarketData(id);
  const { sentimentData, isLoading: sentimentLoading } = useSentimentAnalysis({ creatorId: id });

  useEffect(() => {
    if (!iposLoading && ipos.length > 0) {
      const foundCreator = ipos.find(ipo => ipo.id === id);
      if (foundCreator) {
        setCreator(foundCreator);
      } else {
        toast.error("Creator not found");
        navigate("/creators");
      }
    }
  }, [id, ipos, iposLoading, navigate]);

  const engagementData = [
    { date: "Jan", value: 65 },
    { date: "Feb", value: 72 },
    { date: "Mar", value: 78 },
    { date: "Apr", value: 74 },
    { date: "May", value: 82 },
    { date: "Jun", value: 87 },
  ];

  const sentimentChartData = [
    { date: "Jan", positive: 65, negative: 35 },
    { date: "Feb", positive: 72, negative: 28 },
    { date: "Mar", positive: 58, negative: 42 },
    { date: "Apr", positive: 74, negative: 26 },
    { date: "May", positive: 82, negative: 18 },
    { date: "Jun", positive: 77, negative: 23 },
  ];

  if (iposLoading || !creator) {
    return (
      <div className="min-h-screen bg-axium-gray-100/30">
        <Navbar />
        <div className="container max-w-7xl mx-auto px-4 py-8 mt-16">
          <div className="flex items-center justify-center h-96">
            <p className="text-axium-gray-600">Loading creator profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-axium-gray-100/30">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-axium-blue/20 to-axium-blue/40 rounded-lg flex items-center justify-center text-axium-blue font-bold text-2xl">
                {creator.creatorName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{creator.creatorName}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-medium text-axium-blue">
                    ${creator.symbol}
                  </Badge>
                  <Badge variant="secondary" className="bg-axium-gray-200">
                    IPO: ${creator.initialPrice.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-axium-gray-600 max-w-2xl">{creator.description || "No description available."}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-axium-blue text-white hover:bg-axium-blue/90 mr-2"
              onClick={() => navigate(`/trading?ipo=${creator.id}`)}
            >
              Trade Shares
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Watch
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Share Price</h2>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold mr-2">${creator.currentPrice.toFixed(2)}</span>
                  <span className={creator.priceChange >= 0 ? "text-green-500" : "text-red-500"}>
                    {creator.priceChange >= 0 ? "↑" : "↓"} {Math.abs(creator.priceChange).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="h-64">
              <PriceChart 
                symbol={creator.symbol}
                name={creator.creatorName}
                currentPrice={creator.currentPrice}
                ipoId={creator.id}
              />
            </div>
          </GlassCard>
          
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Creator Metrics</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-axium-gray-600 text-sm">Engagement Score</span>
                  <span className="font-medium">{creator.engagementScore}/100</span>
                </div>
                <Progress value={creator.engagementScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-axium-gray-600 text-sm">AI Valuation Score</span>
                  <span className="font-medium">{creator.aiScore}/100</span>
                </div>
                <Progress value={creator.aiScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-axium-gray-600 text-sm">Sentiment Score</span>
                  <div>
                    <SentimentScoreBadge 
                      score={sentimentData?.overallSentiment || creator.sentimentScore || 65} 
                    />
                  </div>
                </div>
                <Progress 
                  value={sentimentData?.overallSentiment || creator.sentimentScore || 65} 
                  className="h-2" 
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-axium-gray-100 rounded-lg">
                  <div className="text-axium-gray-600 text-xs mb-1">Market Cap</div>
                  <div className="font-semibold">${(creator.currentPrice * creator.totalShares).toLocaleString()}</div>
                </div>
                <div className="text-center p-3 bg-axium-gray-100 rounded-lg">
                  <div className="text-axium-gray-600 text-xs mb-1">Total Shares</div>
                  <div className="font-semibold">{creator.totalShares.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 bg-axium-gray-100 rounded-lg">
                  <div className="text-axium-gray-600 text-xs mb-1">24h Volume</div>
                  <div className="font-semibold">${(creator.volume24h || 15200).toLocaleString()}</div>
                </div>
                <div className="text-center p-3 bg-axium-gray-100 rounded-lg">
                  <div className="text-axium-gray-600 text-xs mb-1">Investors</div>
                  <div className="font-semibold">{(creator.investorCount || 328).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <Tabs defaultValue="engagement" className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="engagement">
              <Users className="h-4 w-4 mr-2" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="sentiment">
              <TrendingUp className="h-4 w-4 mr-2" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="financials">
              <BarChart3 className="h-4 w-4 mr-2" />
              Metrics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement" className="mt-0">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-6">Engagement Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Social Media Followers</div>
                  <div className="text-2xl font-semibold">{(creator.followerCount || 2350000).toLocaleString()}</div>
                  <div className="text-green-500 text-xs flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12.5% this month
                  </div>
                </div>
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Monthly Active Users</div>
                  <div className="text-2xl font-semibold">{(creator.activeUserCount || 985000).toLocaleString()}</div>
                  <div className="text-green-500 text-xs flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8.3% this month
                  </div>
                </div>
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Content Engagement Rate</div>
                  <div className="text-2xl font-semibold">{(creator.engagementRate || 4.8).toFixed(1)}%</div>
                  <div className="text-red-500 text-xs flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    0.5% this month
                  </div>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={engagementData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0050FF"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#0050FF" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="sentiment" className="mt-0">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-6">Sentiment Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Overall Sentiment</div>
                  <div className="text-2xl font-semibold">{sentimentData?.overallSentiment || 77}%</div>
                  <div className="text-green-500 text-xs flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    5.3% this month
                  </div>
                </div>
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Positive Mentions</div>
                  <div className="text-2xl font-semibold">{sentimentData?.positiveMentions || 12458}</div>
                  <div className="text-green-500 text-xs flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    15.8% this month
                  </div>
                </div>
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Negative Mentions</div>
                  <div className="text-2xl font-semibold">{sentimentData?.negativeMentions || 3241}</div>
                  <div className="text-red-500 text-xs flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    2.1% this month
                  </div>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sentimentChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="positive"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#10b981" }}
                      activeDot={{ r: 6 }}
                      name="Positive"
                    />
                    <Line
                      type="monotone"
                      dataKey="negative"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#ef4444" }}
                      activeDot={{ r: 6 }}
                      name="Negative"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="financials" className="mt-0">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-6">Financial Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-base font-medium mb-4">Revenue Streams</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">Content Subscriptions</span>
                      <span className="font-medium">${(
                        typeof creator.revenueStreams === 'object' && 
                        !Array.isArray(creator.revenueStreams) && 
                        creator.revenueStreams?.subscriptions || 456000
                      ).toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">Advertising</span>
                      <span className="font-medium">${(
                        typeof creator.revenueStreams === 'object' && 
                        !Array.isArray(creator.revenueStreams) && 
                        creator.revenueStreams?.advertising || 325000
                      ).toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">Merchandising</span>
                      <span className="font-medium">${(
                        typeof creator.revenueStreams === 'object' && 
                        !Array.isArray(creator.revenueStreams) && 
                        creator.revenueStreams?.merchandise || 215000
                      ).toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">Sponsorships</span>
                      <span className="font-medium">${(
                        typeof creator.revenueStreams === 'object' && 
                        !Array.isArray(creator.revenueStreams) && 
                        creator.revenueStreams?.sponsorships || 532000
                      ).toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center border-t border-axium-gray-200 pt-2 mt-2">
                      <span className="font-medium">Total Annual Revenue</span>
                      <span className="font-bold text-axium-blue">${(creator.totalRevenue || 1528000).toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-base font-medium mb-4">Growth Metrics</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">Year-over-Year Growth</span>
                      <span className="font-medium text-green-500">+{(creator.yoyGrowth || 28.5)}%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">New Audience Growth</span>
                      <span className="font-medium text-green-500">+{(creator.audienceGrowth || 18.3)}%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">Content Production</span>
                      <span className="font-medium">+{(creator.contentGrowth || 32.1)}%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-axium-gray-600">Platform Expansion</span>
                      <span className="font-medium">+{(creator.platformExpansion || 15.0)}%</span>
                    </li>
                    <li className="flex justify-between items-center border-t border-axium-gray-200 pt-2 mt-2">
                      <span className="font-medium">Projected Growth (12mo)</span>
                      <span className="font-bold text-axium-blue">+{(creator.projectedGrowth || 22.5)}%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorProfile;
