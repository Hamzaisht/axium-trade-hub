import { useState, useEffect } from 'react';
import { useCreatorMarketScore } from '@/hooks/ai/useCreatorMarketScore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  RefreshCw, 
  Zap, 
  DollarSign, 
  Users, 
  MessageSquare, 
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorMarketScoreCardProps {
  ipoId?: string;
  className?: string;
}

export function CreatorMarketScoreCard({ ipoId, className }: CreatorMarketScoreCardProps) {
  const [activeTab, setActiveTab] = useState('score');
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const {
    creatorMarketScore,
    isLoading,
    isError,
    refetch
  } = useCreatorMarketScore({ ipoId });
  
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (autoRefresh && ipoId) {
      intervalId = setInterval(() => {
        refetch();
      }, 15000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, ipoId, refetch]);
  
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => {
      const newState = !prev;
      if (newState) {
        toast.success('Auto-refresh enabled - updates every 15s');
      } else {
        toast.info('Auto-refresh disabled');
      }
      return newState;
    });
  };
  
  const getPieChartData = () => {
    if (!creatorMarketScore) return [];
    
    return [
      { 
        name: 'Revenue', 
        value: creatorMarketScore.revenueInfluence.score * creatorMarketScore.revenueInfluence.weight, 
        fullValue: creatorMarketScore.revenueInfluence.score,
        weight: creatorMarketScore.revenueInfluence.weight,
        color: '#10b981' 
      },
      { 
        name: 'Social', 
        value: creatorMarketScore.socialEngagementInfluence.score * creatorMarketScore.socialEngagementInfluence.weight, 
        fullValue: creatorMarketScore.socialEngagementInfluence.score,
        weight: creatorMarketScore.socialEngagementInfluence.weight,
        color: '#3b82f6' 
      },
      { 
        name: 'Sentiment', 
        value: creatorMarketScore.aiSentimentScore.score * creatorMarketScore.aiSentimentScore.weight, 
        fullValue: creatorMarketScore.aiSentimentScore.score,
        weight: creatorMarketScore.aiSentimentScore.weight,
        color: '#8b5cf6' 
      }
    ];
  };
  
  const getFactorData = (type: 'revenue' | 'social' | 'sentiment') => {
    if (!creatorMarketScore) return [];
    
    let factors;
    
    switch (type) {
      case 'revenue':
        factors = creatorMarketScore.revenueInfluence.factors;
        break;
      case 'social':
        factors = creatorMarketScore.socialEngagementInfluence.factors;
        break;
      case 'sentiment':
        factors = creatorMarketScore.aiSentimentScore.factors;
        break;
    }
    
    return factors.map(factor => ({
      name: factor.name,
      value: Math.round(factor.impact * 100),
      description: factor.description
    }));
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const getPriceBadge = () => {
    if (!creatorMarketScore?.priceImpact) return null;
    
    const { priceChangePercent } = creatorMarketScore.priceImpact;
    
    if (priceChangePercent > 5) {
      return <Badge className="bg-green-500 hover:bg-green-600">Strong Buy</Badge>;
    } else if (priceChangePercent > 2) {
      return <Badge className="bg-green-400 hover:bg-green-500">Buy</Badge>;
    } else if (priceChangePercent < -5) {
      return <Badge className="bg-red-500 hover:bg-red-600">Strong Sell</Badge>;
    } else if (priceChangePercent < -2) {
      return <Badge className="bg-red-400 hover:bg-red-500">Sell</Badge>;
    } else {
      return <Badge className="bg-blue-400 hover:bg-blue-500">Hold</Badge>;
    }
  };
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Creator Market Score
        </h3>
        
        <div className="flex space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoRefresh}
            className={autoRefresh ? "bg-green-500 hover:bg-green-600" : ""}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-1",
              autoRefresh && "animate-spin"
            )} />
            {autoRefresh ? "Live" : "15s"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-1",
              isLoading && "animate-spin"
            )} />
            Refresh
          </Button>
        </div>
      </div>
      
      {isError ? (
        <div className="text-center py-6">
          <AlertTriangle className="h-8 w-8 text-axium-error mx-auto mb-2" />
          <h4 className="text-axium-error font-medium mb-1">Failed to load market score data</h4>
          <p className="text-sm text-axium-gray-600 mb-4">
            There was an error analyzing creator market performance
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading || !creatorMarketScore ? (
        <div className="animate-pulse space-y-4 py-4">
          <div className="h-12 rounded-md bg-axium-gray-200/50 w-1/2 mx-auto"></div>
          <div className="h-24 rounded-md bg-axium-gray-200/50 w-full"></div>
          <div className="h-32 rounded-md bg-axium-gray-200/50 w-full"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <div className={cn(
              "text-4xl font-bold",
              getScoreColor(creatorMarketScore.totalScore)
            )}>
              {creatorMarketScore.totalScore}
            </div>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-sm text-axium-gray-600">Price Target:</span>
              <span className="font-medium">${creatorMarketScore.priceImpact.recommendedPrice}</span>
              {getPriceBadge()}
            </div>
            <p className="text-xs text-axium-gray-600 mt-1">
              Confidence: {creatorMarketScore.priceImpact.confidence}%
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="score">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Score</span>
              </TabsTrigger>
              <TabsTrigger value="breakdown">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Breakdown</span>
              </TabsTrigger>
              <TabsTrigger value="factors">
                <Users className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Factors</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="score" className="pt-2">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieChartData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, fullValue }) => `${name}: ${fullValue}`}
                      labelLine={false}
                    >
                      {getPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${props.payload.fullValue}`, name]}
                      separator=": "
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center text-sm">
                <div>
                  <div className={getScoreColor(creatorMarketScore.revenueInfluence.score)}>
                    {creatorMarketScore.revenueInfluence.score}
                  </div>
                  <div className="text-xs text-axium-gray-600">Revenue</div>
                </div>
                <div>
                  <div className={getScoreColor(creatorMarketScore.socialEngagementInfluence.score)}>
                    {creatorMarketScore.socialEngagementInfluence.score}
                  </div>
                  <div className="text-xs text-axium-gray-600">Social</div>
                </div>
                <div>
                  <div className={getScoreColor(creatorMarketScore.aiSentimentScore.score)}>
                    {creatorMarketScore.aiSentimentScore.score}
                  </div>
                  <div className="text-xs text-axium-gray-600">Sentiment</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="breakdown" className="pt-2">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getPieChartData()}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Score', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      formatter={(value, name, props) => [`${props.payload.fullValue}`, name]}
                      separator=": "
                    />
                    <Bar dataKey="fullValue" radius={[4, 4, 0, 0]}>
                      {getPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-axium-gray-600">Weight Distribution:</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden">
                  {getPieChartData().map((section, i) => (
                    <div 
                      key={i} 
                      className="h-full" 
                      style={{ 
                        width: `${section.weight * 100}%`, 
                        backgroundColor: section.color 
                      }} 
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs pt-1">
                  {getPieChartData().map((section, i) => (
                    <div key={i}>
                      {section.name}: {(section.weight * 100).toFixed(0)}%
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="factors" className="pt-2">
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="revenue" className="pt-2">
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getFactorData('revenue')}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        layout="vertical"
                      >
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="social" className="pt-2">
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getFactorData('social')}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        layout="vertical"
                      >
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="sentiment" className="pt-2">
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getFactorData('sentiment')}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        layout="vertical"
                      >
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
          
          <div className="mt-2 pt-2 border-t border-axium-gray-200 text-xs text-axium-gray-600">
            Last updated: {new Date(creatorMarketScore.lastUpdated).toLocaleTimeString()}
            {autoRefresh && " • Live updates enabled"}
          </div>
        </>
      )}
    </GlassCard>
  );
}

export default CreatorMarketScoreCard;
