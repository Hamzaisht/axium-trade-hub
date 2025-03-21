
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import useSentimentAnalysis from '@/hooks/ai/useSentimentAnalysis';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, AlertCircle, TrendingUp, TrendingDown, Minus,
  Twitter, Instagram, Youtube, Star, Radio, Search, 
  AlertTriangle, BarChart2, Zap, ArrowRight
} from 'lucide-react';
import { useAPIConfiguration } from '@/hooks/useAPIConfiguration';
import { 
  PlatformSentiment, SentimentDirection, 
  SentimentAlert, CreatorMarketScore 
} from '@/services/ai/SentimentAnalysisService';

interface SentimentInsightsProps {
  creatorId?: string;
  className?: string;
}

const SentimentInsights = ({ creatorId, className }: SentimentInsightsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [simulationMode, setSimulationMode] = useState(true);
  
  const { sentimentData, isLoading, isError, refreshSentiment } = useSentimentAnalysis({
    creatorId,
    enabled: !!creatorId
  });
  
  const { apiServiceStatus } = useAPIConfiguration();
  
  // Handle refreshing data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSentiment();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  // Get icon for sentiment direction
  const getDirectionIcon = (direction: SentimentDirection) => {
    switch (direction) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get text color based on sentiment direction
  const getDirectionColor = (direction: SentimentDirection) => {
    switch (direction) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-gray-600';
    }
  };
  
  // Get background color based on sentiment direction
  const getDirectionBgColor = (direction: SentimentDirection) => {
    switch (direction) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get icon for platform
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'tiktok':
        return <Zap className="h-4 w-4" />;
      case 'snapchat':
        return <AlertCircle className="h-4 w-4" />;
      case 'facebook':
        return <Star className="h-4 w-4" />;
      case 'spotify':
        return <Radio className="h-4 w-4" />;
      case 'twitch':
        return <Zap className="h-4 w-4" />;
      case 'kick':
        return <Zap className="h-4 w-4" />;
      case 'rumble':
        return <Zap className="h-4 w-4" />;
      case 'google trends':
        return <Search className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };
  
  // Get emoji for sentiment score
  const getSentimentEmoji = (score: number) => {
    if (score >= 70) return '🟢';
    if (score >= 50) return '🟡';
    return '🔴';
  };
  
  // Get color for CMS strength
  const getCMSColor = (cms: CreatorMarketScore) => {
    switch (cms.category) {
      case 'strong':
        return 'bg-green-500';
      case 'neutral':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Render alert
  const renderAlert = (alert: SentimentAlert) => {
    const isPositive = alert.change > 0;
    const alertIcon = isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
    
    let alertStyle = 'bg-yellow-50 border-yellow-200 text-yellow-800';
    let iconStyle = 'text-yellow-600';
    
    if (alert.type === 'critical') {
      alertStyle = isPositive 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800';
      iconStyle = isPositive ? 'text-green-600' : 'text-red-600';
    } else if (alert.type === 'info') {
      alertStyle = 'bg-blue-50 border-blue-200 text-blue-800';
      iconStyle = 'text-blue-600';
    }
    
    return (
      <Alert key={`${alert.platform}-${alert.timestamp}`} className={`mb-3 ${alertStyle}`}>
        <div className={iconStyle}>
          {alert.type === 'critical' ? <AlertTriangle className="h-4 w-4" /> : alertIcon}
        </div>
        <AlertTitle className="flex items-center text-sm">
          {alert.platform}{' '}
          <span className={`ml-2 flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{alert.change.toFixed(1)}%
          </span>
        </AlertTitle>
        <AlertDescription className="text-xs">{alert.message}</AlertDescription>
      </Alert>
    );
  };
  
  // Render platform sentiment card
  const renderPlatformCard = (platform: PlatformSentiment) => {
    const changeColor = platform.change > 0 ? 'text-green-600' : platform.change < 0 ? 'text-red-600' : 'text-gray-600';
    const changeIcon = platform.change > 0 
      ? <TrendingUp className="h-3 w-3 mr-1" /> 
      : platform.change < 0 
        ? <TrendingDown className="h-3 w-3 mr-1" /> 
        : <Minus className="h-3 w-3 mr-1" />;
        
    return (
      <div key={platform.platform} className="bg-white/50 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium flex items-center">
            <span className="w-5 h-5 mr-2 flex items-center justify-center">
              {getPlatformIcon(platform.platform)}
            </span>
            {platform.platform}
            {platform.isRealData && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                Real
              </span>
            )}
          </div>
          <div className={`flex items-center text-sm ${changeColor}`}>
            {changeIcon}
            {platform.change > 0 ? '+' : ''}{platform.change.toFixed(1)}%
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
            <span>Sentiment Score</span>
            <span className="font-medium">{platform.score.toFixed(1)}</span>
          </div>
          <Progress
            value={platform.score}
            max={100}
            className={cn("h-2", 
              platform.score >= 70 ? "bg-green-100" : 
              platform.score >= 50 ? "bg-yellow-100" : 
              "bg-red-100"
            )}
            indicatorClassName={
              platform.score >= 70 ? "bg-green-500" : 
              platform.score >= 50 ? "bg-yellow-500" : 
              "bg-red-500"
            }
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-600 text-xs">Trend</p>
            <p className={`font-medium ${getDirectionColor(platform.direction)}`}>
              {platform.direction.charAt(0).toUpperCase() + platform.direction.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Keywords</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {platform.keywords.slice(0, 2).map(keyword => (
                <span 
                  key={keyword} 
                  className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render CMS Score section
  const renderCMSScore = () => {
    if (!sentimentData?.cmsScore) return null;
    
    const cms = sentimentData.cmsScore;
    
    return (
      <div className="space-y-4">
        <div className="bg-white/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Creator Market Score (CMS)</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${getCMSColor(cms)}`}></div>
              <span className={cn(
                "text-sm font-medium",
                cms.category === 'strong' ? "text-green-700" :
                cms.category === 'neutral' ? "text-yellow-700" :
                "text-red-700"
              )}>
                {cms.category.charAt(0).toUpperCase() + cms.category.slice(1)} Asset
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Overall Score</span>
              <span className="font-semibold">{cms.score.toFixed(1)}</span>
            </div>
            <Progress
              value={cms.score}
              max={100}
              className="h-3"
              indicatorClassName={
                cms.category === 'strong' ? "bg-green-500" : 
                cms.category === 'neutral' ? "bg-yellow-500" : 
                "bg-red-500"
              }
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Score Components</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                      Sentiment
                    </span>
                    <span>{cms.components.sentiment.toFixed(1)}</span>
                  </div>
                  <Progress value={cms.components.sentiment} max={100} className="h-1.5 bg-blue-100" indicatorClassName="bg-blue-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="flex items-center">
                      <BarChart2 className="h-3 w-3 mr-1 text-purple-500" />
                      Volume
                    </span>
                    <span>{cms.components.volume.toFixed(1)}</span>
                  </div>
                  <Progress value={cms.components.volume} max={100} className="h-1.5 bg-purple-100" indicatorClassName="bg-purple-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="flex items-center">
                      <Zap className="h-3 w-3 mr-1 text-amber-500" />
                      Engagement
                    </span>
                    <span>{cms.components.engagement.toFixed(1)}</span>
                  </div>
                  <Progress value={cms.components.engagement} max={100} className="h-1.5 bg-amber-100" indicatorClassName="bg-amber-500" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-green-500" />
                      Revenue
                    </span>
                    <span>{cms.components.revenue.toFixed(1)}</span>
                  </div>
                  <Progress value={cms.components.revenue} max={100} className="h-1.5 bg-green-100" indicatorClassName="bg-green-500" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Weight Distribution</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Sentiment Weight</span>
                    <span>{cms.sentimentWeight}%</span>
                  </div>
                  <Progress value={cms.sentimentWeight} max={100} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Volume Weight</span>
                    <span>{cms.volumeWeight}%</span>
                  </div>
                  <Progress value={cms.volumeWeight} max={100} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Engagement Weight</span>
                    <span>{cms.engagementWeight}%</span>
                  </div>
                  <Progress value={cms.engagementWeight} max={100} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Revenue Weight</span>
                    <span>{cms.revenueWeight}%</span>
                  </div>
                  <Progress value={cms.revenueWeight} max={100} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (!creatorId) {
    return null;
  }
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Sentiment Insights</h3>
          {apiServiceStatus === 'mock' && (
            <div className="text-xs text-gray-500 mt-1">
              Using simulated sentiment data
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="simulation-mode" 
              checked={simulationMode}
              onCheckedChange={setSimulationMode}
            />
            <Label htmlFor="simulation-mode" className="text-sm">
              Simulation Mode
            </Label>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-1",
              (isLoading || isRefreshing) && "animate-spin"
            )} />
            Refresh
          </Button>
        </div>
      </div>
      
      {isError ? (
        <div className="py-6 text-center text-gray-500">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="mb-2">Failed to load sentiment data</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !sentimentData ? (
        <div className="py-6 text-center text-gray-500">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p>No sentiment data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className={cn(
            "p-4 rounded-lg flex justify-between items-center",
            sentimentData.summary.direction === 'positive' ? "bg-green-50" : 
            sentimentData.summary.direction === 'negative' ? "bg-red-50" : 
            "bg-gray-50"
          )}>
            <div>
              <div className="flex items-center mb-1">
                {getDirectionIcon(sentimentData.summary.direction)}
                <h4 className={cn(
                  "font-medium ml-2",
                  getDirectionColor(sentimentData.summary.direction)
                )}>
                  {sentimentData.summary.direction === 'positive' ? 'Positive' : 
                   sentimentData.summary.direction === 'negative' ? 'Negative' : 
                   'Neutral'} Overall Sentiment
                </h4>
              </div>
              <p className="text-sm text-gray-600">
                Score: {sentimentData.summary.overallScore.toFixed(1)} 
                <span className={cn(
                  "ml-2",
                  sentimentData.summary.overallChange > 0 ? "text-green-600" : 
                  sentimentData.summary.overallChange < 0 ? "text-red-600" : 
                  "text-gray-600"
                )}>
                  {sentimentData.summary.overallChange > 0 ? '↑' : 
                   sentimentData.summary.overallChange < 0 ? '↓' : '–'} 
                  {Math.abs(sentimentData.summary.overallChange).toFixed(1)}%
                </span>
              </p>
            </div>
            
            <div>
              <Badge className={getDirectionBgColor(sentimentData.summary.direction)}>
                {getSentimentEmoji(sentimentData.summary.overallScore)} 
                {sentimentData.summary.overallScore.toFixed(1)}/100
              </Badge>
            </div>
          </div>
          
          {/* Alerts Section if any */}
          {sentimentData.summary.alerts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                Sentiment Alerts
              </h4>
              {sentimentData.summary.alerts.map(alert => renderAlert(alert))}
            </div>
          )}
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="cms">CMS Score</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="pt-2">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 text-gray-700">Strongest Platform</h4>
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        {getPlatformIcon(sentimentData.summary.strongestPlatform)}
                      </span>
                      <div>
                        <p className="font-medium">{sentimentData.summary.strongestPlatform}</p>
                        <p className="text-xs text-gray-500">Driving positive sentiment</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 text-gray-700">Weakest Platform</h4>
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        {getPlatformIcon(sentimentData.summary.weakestPlatform)}
                      </span>
                      <div>
                        <p className="font-medium">{sentimentData.summary.weakestPlatform}</p>
                        <p className="text-xs text-gray-500">Needs attention</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1 text-blue-500" />
                    Platform Sentiment Overview
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sentimentData.platforms.slice(0, 6).map(platform => (
                      <div key={platform.platform} className="flex items-center">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          {getPlatformIcon(platform.platform)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{platform.platform}</p>
                          <div className="flex items-center">
                            <Progress 
                              value={platform.score} 
                              max={100} 
                              className="h-1.5 flex-1 mr-2"
                              indicatorClassName={
                                platform.score >= 70 ? "bg-green-500" : 
                                platform.score >= 50 ? "bg-yellow-500" : 
                                "bg-red-500"
                              }
                            />
                            <span className="text-xs">{platform.score.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setActiveTab('platforms')}>
                      View All Platforms <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 text-amber-500" />
                      Creator Market Score
                    </h4>
                    <Badge className={cn(
                      "text-xs",
                      sentimentData.cmsScore.category === 'strong' ? "bg-green-100 text-green-800" :
                      sentimentData.cmsScore.category === 'neutral' ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {sentimentData.cmsScore.category.charAt(0).toUpperCase() + sentimentData.cmsScore.category.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span>CMS Score</span>
                      <span className="font-medium">{sentimentData.cmsScore.score.toFixed(1)}/100</span>
                    </div>
                    <Progress 
                      value={sentimentData.cmsScore.score} 
                      max={100} 
                      className="h-2"
                      indicatorClassName={
                        sentimentData.cmsScore.category === 'strong' ? "bg-green-500" : 
                        sentimentData.cmsScore.category === 'neutral' ? "bg-yellow-500" : 
                        "bg-red-500"
                      }
                    />
                  </div>
                  
                  <div className="mt-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setActiveTab('cms')}>
                      View Full Analysis <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Platforms Tab */}
            <TabsContent value="platforms" className="pt-2">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Platform-specific Sentiment</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
                  {sentimentData.platforms.map(platform => renderPlatformCard(platform))}
                </div>
              </div>
            </TabsContent>
            
            {/* CMS Score Tab */}
            <TabsContent value="cms" className="pt-2">
              {renderCMSScore()}
            </TabsContent>
          </Tabs>
          
          <div className="text-right text-xs text-gray-500">
            Last updated: {formatDate(sentimentData.summary.lastUpdated)}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default SentimentInsights;
