
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradeHistory } from "@/components/market/TradeHistory";
import { Badge } from "@/components/ui/badge";
import { Activity, LineChart, Newspaper, Zap } from "lucide-react";
import { getMockInsights } from "@/mock/insights";
import { format } from "date-fns";

interface TabbedPanelProps {
  creatorId: string;
}

export function TabbedPanel({ creatorId }: TabbedPanelProps) {
  const [insights] = useState(() => getMockInsights(creatorId));
  
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-lg font-medium">Creator Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid grid-cols-4 mb-2 bg-zinc-800/50">
            <TabsTrigger value="insights" className="text-xs flex gap-1.5 items-center">
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs flex gap-1.5 items-center">
              <Newspaper className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">News</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs flex gap-1.5 items-center">
              <Activity className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs flex gap-1.5 items-center">
              <LineChart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="m-0">
            <div className="space-y-3 p-2">
              {insights.map((insight, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <Badge 
                      variant={insight.sentiment === 'positive' ? 'success' : insight.sentiment === 'negative' ? 'destructive' : 'outline'} 
                      className="text-[10px] h-5"
                    >
                      {insight.sentiment === 'positive' ? 'BULLISH' : 
                       insight.sentiment === 'negative' ? 'BEARISH' : 'NEUTRAL'}
                    </Badge>
                    <span className="text-xs text-zinc-400">
                      {format(new Date(insight.timestamp), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm leading-snug text-zinc-100">{insight.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      AI Confidence: {insight.confidence}%
                    </span>
                    <span className="text-xs font-medium text-primary">
                      Source: {insight.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="news" className="m-0">
            <div className="space-y-3 p-2">
              <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
                <div className="flex justify-between items-start mb-1.5">
                  <Badge variant="outline" className="text-[10px] h-5">PRESS</Badge>
                  <span className="text-xs text-zinc-400">2h ago</span>
                </div>
                <p className="text-sm leading-snug">Creator announces new partnership with major brand</p>
                <div className="mt-2">
                  <span className="text-xs font-medium text-primary">Source: Bloomberg</span>
                </div>
              </div>
              <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
                <div className="flex justify-between items-start mb-1.5">
                  <Badge variant="outline" className="text-[10px] h-5">SOCIAL</Badge>
                  <span className="text-xs text-zinc-400">6h ago</span>
                </div>
                <p className="text-sm leading-snug">Engagement metrics trending upward after latest content release</p>
                <div className="mt-2">
                  <span className="text-xs font-medium text-primary">Source: Social Analysis</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="m-0">
            <TradeHistory creatorId={creatorId} limit={7} />
          </TabsContent>
          
          <TabsContent value="analytics" className="m-0">
            <div className="p-4 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Market Cap</span>
                  <span className="font-medium">$14.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">24h Volume</span>
                  <span className="font-medium">$1.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Liquidity</span>
                  <span className="font-medium">$3.7M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Holders</span>
                  <span className="font-medium">4,782</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Avg. Position</span>
                  <span className="font-medium">$3,028</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Volatility (30d)</span>
                  <span className="font-medium">42.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sentiment Score</span>
                  <span className="font-medium text-green-500">78/100</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
