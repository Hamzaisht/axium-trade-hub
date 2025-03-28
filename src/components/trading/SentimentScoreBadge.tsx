
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useSentimentAnalysis from '@/hooks/ai/useSentimentAnalysis';

interface SentimentScoreBadgeProps {
  creatorId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const SentimentScoreBadge = ({ 
  creatorId, 
  className,
  size = 'md',
  showTooltip = true
}: SentimentScoreBadgeProps) => {
  const [score, setScore] = useState<number | null>(null);
  const [direction, setDirection] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [change, setChange] = useState<number>(0);
  
  const { sentimentData } = useSentimentAnalysis({
    creatorId,
    enabled: !!creatorId
  });
  
  useEffect(() => {
    if (sentimentData) {
      setScore(sentimentData.summary.overallScore);
      // Calculate direction based on change
      setDirection(sentimentData.summary.change > 0 ? 'positive' : 
                  sentimentData.summary.change < 0 ? 'negative' : 'neutral');
      setChange(sentimentData.summary.change);
    }
  }, [sentimentData]);
  
  // Show skeleton if no data yet
  if (score === null) {
    return (
      <div className={cn(
        "animate-pulse bg-gray-200 rounded-full",
        size === 'sm' ? "h-5 w-16" : 
        size === 'lg' ? "h-8 w-28" : 
        "h-6 w-24",
        className
      )}></div>
    );
  }
  
  // Get appropriate colors based on score
  const getBgColor = () => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Get emoji based on score
  const getSentimentEmoji = () => {
    if (score >= 70) return '🟢';
    if (score >= 50) return '🟡';
    return '🔴';
  };
  
  // Get change icon
  const getChangeIcon = () => {
    if (change > 0) return <TrendingUp className={cn(
      size === 'sm' ? "h-3 w-3 mr-0.5" : 
      size === 'lg' ? "h-5 w-5 mr-1" : 
      "h-4 w-4 mr-0.5"
    )} />;
    
    if (change < 0) return <TrendingDown className={cn(
      size === 'sm' ? "h-3 w-3 mr-0.5" : 
      size === 'lg' ? "h-5 w-5 mr-1" : 
      "h-4 w-4 mr-0.5"
    )} />;
    
    return <Minus className={cn(
      size === 'sm' ? "h-3 w-3 mr-0.5" : 
      size === 'lg' ? "h-5 w-5 mr-1" : 
      "h-4 w-4 mr-0.5"
    )} />;
  };
  
  const badgeContent = (
    <div className={cn(
      "flex items-center rounded-full px-2 py-0.5",
      getBgColor(),
      size === 'sm' ? "text-xs" : 
      size === 'lg' ? "text-base px-3 py-1" : 
      "text-sm",
      className
    )}>
      <span className={cn(
        "font-medium",
        size === 'sm' ? "mr-1" : 
        size === 'lg' ? "mr-2" : 
        "mr-1.5"
      )}>
        {getSentimentEmoji()} {score.toFixed(0)}
      </span>
      <span className="flex items-center">
        {getChangeIcon()}
        {change > 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  );
  
  if (!showTooltip) {
    return badgeContent;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">
            Sentiment Score: {score.toFixed(1)}/100 ({direction})
            <br />
            {change > 0 ? 'Positive' : change < 0 ? 'Negative' : 'Stable'} trend with {Math.abs(change).toFixed(1)}% change
            <br />
            <span className="italic">Based on social media and platform sentiment analysis</span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SentimentScoreBadge;
