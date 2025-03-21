
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Brain,
  Target,
  TrendingDown,
  TrendingUp,
  Star,
  BarChart4,
  AlertTriangle
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AITradingToolsProps {
  symbol?: string;
  currentPrice?: number;
}

export const AITradingTools = ({
  symbol = "$EMW",
  currentPrice = 24.82
}: AITradingToolsProps) => {
  const [riskLevel, setRiskLevel] = useState(50);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [trailingStopEnabled, setTrailingStopEnabled] = useState(false);
  const [stopLossValue, setStopLossValue] = useState((currentPrice * 0.9).toFixed(2));
  const [takeProfitValue, setTakeProfitValue] = useState((currentPrice * 1.1).toFixed(2));
  const [trailingDistance, setTrailingDistance] = useState("5");
  
  // Calculate risk-adjusted values
  const riskAdjustedStopLoss = parseFloat((currentPrice * (1 - (riskLevel / 500))).toFixed(2));
  const riskAdjustedTakeProfit = parseFloat((currentPrice * (1 + (riskLevel / 300))).toFixed(2));
  
  const getRiskLabel = () => {
    if (riskLevel < 30) return "Conservative";
    if (riskLevel < 70) return "Moderate";
    return "Aggressive";
  };
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Brain className="mr-2 h-5 w-5 text-axium-blue" />
          AI Trading Tools <span className="text-axium-gray-500 font-normal ml-1">({symbol})</span>
        </h2>
      </div>
      
      <Tabs defaultValue="automation">
        <TabsList className="w-full">
          <TabsTrigger value="automation" className="flex-1">
            <Target className="h-4 w-4 mr-1" />
            Trade Automation
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex-1">
            <Star className="h-4 w-4 mr-1" />
            AI Strategies
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex-1">
            <BarChart4 className="h-4 w-4 mr-1" />
            Portfolio Balance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="automation" className="space-y-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Risk Tolerance</Label>
              <span className="text-sm font-medium">{getRiskLabel()} ({riskLevel}%)</span>
            </div>
            <Slider 
              value={[riskLevel]} 
              min={10} 
              max={90} 
              step={5}
              onValueChange={(value) => setRiskLevel(value[0])}
              className="mb-6"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingDown className="h-4 w-4 mr-1 text-axium-error" />
                    <Label htmlFor="stop-loss">Stop Loss</Label>
                  </div>
                  <Switch 
                    id="stop-loss"
                    checked={stopLossEnabled}
                    onCheckedChange={setStopLossEnabled}
                  />
                </div>
                
                {stopLossEnabled && (
                  <div className="pl-6">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-7"
                        onClick={() => setStopLossValue(riskAdjustedStopLoss.toFixed(2))}
                      >
                        AI Suggested
                      </Button>
                      <span className="text-sm text-axium-gray-600">${riskAdjustedStopLoss}</span>
                    </div>
                    <div className="mt-2 relative">
                      <Input
                        value={stopLossValue}
                        onChange={(e) => setStopLossValue(e.target.value)}
                        className="pl-6"
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-axium-gray-500">$</span>
                    </div>
                    <p className="text-xs text-axium-gray-500 mt-1">
                      {parseFloat(stopLossValue) < currentPrice * 0.8 && (
                        <span className="flex items-center text-amber-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          High potential loss (-{((1 - parseFloat(stopLossValue) / currentPrice) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-axium-success" />
                    <Label htmlFor="take-profit">Take Profit</Label>
                  </div>
                  <Switch 
                    id="take-profit"
                    checked={takeProfitEnabled}
                    onCheckedChange={setTakeProfitEnabled}
                  />
                </div>
                
                {takeProfitEnabled && (
                  <div className="pl-6">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"  
                        className="text-xs h-7"
                        onClick={() => setTakeProfitValue(riskAdjustedTakeProfit.toFixed(2))}
                      >
                        AI Suggested
                      </Button>
                      <span className="text-sm text-axium-gray-600">${riskAdjustedTakeProfit}</span>
                    </div>
                    <div className="mt-2 relative">
                      <Input
                        value={takeProfitValue}
                        onChange={(e) => setTakeProfitValue(e.target.value)}
                        className="pl-6"
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-axium-gray-500">$</span>
                    </div>
                    <p className="text-xs text-axium-success mt-1">
                      Potential gain: +{((parseFloat(takeProfitValue) / currentPrice - 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1 text-purple-500" />
                  <Label htmlFor="trailing-stop">Trailing Stop</Label>
                </div>
                <Switch 
                  id="trailing-stop"
                  checked={trailingStopEnabled}
                  onCheckedChange={setTrailingStopEnabled}
                />
              </div>
              
              {trailingStopEnabled && (
                <div className="pl-6">
                  <Label className="text-sm mb-1 block">Distance (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={trailingDistance}
                      onChange={(e) => setTrailingDistance(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-axium-gray-600">%</span>
                  </div>
                  <p className="text-xs text-axium-gray-500 mt-1">
                    Stop will move up as price increases, remaining {trailingDistance}% below the highest price
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <Button className="w-full mt-6 bg-axium-blue">
            Apply AI Trading Parameters
          </Button>
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-4">
          <div className="space-y-4">
            <div className="p-4 border border-axium-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 text-amber-500" />
                  Value Averaging
                </h3>
                <Button variant="outline" size="sm">Select</Button>
              </div>
              <p className="text-sm text-axium-gray-600">
                AI calculates optimal investment amounts based on price movements, automatically increasing buys during dips.
              </p>
            </div>
            
            <div className="p-4 border border-axium-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 text-amber-500" />
                  Momentum Trading
                </h3>
                <Button variant="outline" size="sm">Select</Button>
              </div>
              <p className="text-sm text-axium-gray-600">
                Uses AI sentiment analysis and technical indicators to enter positions with price momentum.
              </p>
            </div>
            
            <div className="p-4 border border-axium-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 text-amber-500" />
                  Sentiment-Based
                </h3>
                <Button variant="outline" size="sm">Select</Button>
              </div>
              <p className="text-sm text-axium-gray-600">
                Trades based on real-time AI analysis of creator social metrics and audience engagement.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio" className="mt-4">
          <div className="space-y-4">
            <div className="p-4 bg-axium-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Portfolio Optimization Suggestions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-axium-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Increase {symbol} allocation
                  </span>
                  <span>+5%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-axium-error">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Reduce $MKBHD exposure
                  </span>
                  <span>-3%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-axium-blue">
                    <Target className="h-3 w-3 mr-1" />
                    Add $JAKE exposure
                  </span>
                  <span>2%</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" size="sm">
                Apply Suggestions
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Current Risk Assessment</h3>
              <div className="h-1.5 w-full bg-axium-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
                  style={{ width: `${riskLevel}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
              <p className="text-sm text-axium-gray-600 mt-3">
                Your portfolio is currently at a {getRiskLabel().toLowerCase()} risk level. Based on market conditions and your investment goals, we recommend a more balanced approach.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default AITradingTools;
