
import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Star, BarChart, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SentimentScoreBadge from "@/components/trading/SentimentScoreBadge";

interface CreatorCardProps {
  creator: {
    id: string;
    name: string;
    symbol: string;
    image: string;
    price: number;
    change: number;
    marketCap: number;
    followers: string;
    engagement: number;
    aiScore: number;
  };
  onSelect?: (id: string) => void;
  selected?: boolean;
  sentimentEnabled?: boolean;
}

export const CreatorCard = ({ creator, onSelect, selected, sentimentEnabled = false }: CreatorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Random pulse effect to simulate market activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 800);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <GlassCard
      variant={selected ? "blue" : "default"}
      interactive={!selected}
      className={cn(
        "transition-all duration-300 overflow-visible terminal-card",
        selected ? "ring-2 ring-axium-neon-blue shadow-[0_0_15px_rgba(30,174,219,0.2)]" : 
        isHovered ? "shadow-[0_0_20px_rgba(30,174,219,0.15)]" : "",
        isPulsing && "flash-positive"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(creator.id)}
      ref={cardRef}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-axium-blue/20 overflow-hidden mr-3 flex-shrink-0 relative">
            {/* This would be an actual image in production */}
            <div className="h-full w-full bg-gradient-to-br from-axium-blue/40 to-axium-neon-blue/30" />
            {isPulsing && (
              <div className="absolute inset-0 bg-axium-success/10 animate-pulse rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight text-white">{creator.name}</h3>
            <p className={cn(
              "text-sm",
              selected ? "text-axium-neon-blue" : "text-axium-gray-400"
            )}>
              {creator.symbol}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-axium-gray-400 hover:text-axium-neon-blue hover:bg-axium-blue/10"
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-axium-gray-400">Current Price</p>
            <div className="flex items-baseline space-x-2">
              <p className="font-semibold text-2xl text-white">${creator.price.toFixed(2)}</p>
              <div className={cn(
                "flex items-center text-sm font-medium",
                creator.change >= 0 ? "text-axium-success" : "text-axium-error"
              )}>
                {creator.change >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                )}
                {Math.abs(creator.change).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {sentimentEnabled ? (
            <SentimentScoreBadge creatorId={creator.id} size="sm" />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1.5 bg-axium-blue/20 px-2.5 py-1 rounded-full">
                    <BarChart className="h-3.5 w-3.5 text-axium-neon-blue" />
                    <span className="text-xs font-medium text-axium-neon-blue">AI Score: {creator.aiScore}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs bg-axium-dark-bg border-axium-gray-700">
                  <p className="text-xs text-axium-gray-300">
                    AI Valuation Score based on social engagement, market trends, and growth potential.
                    Higher scores (80+) indicate strong investment potential.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-axium-gray-400">Market Cap</p>
            <p className="font-medium text-white">${(creator.marketCap / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-axium-gray-400">Followers</p>
            <p className="font-medium text-white">{creator.followers}</p>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-axium-gray-400">Engagement Score</p>
            <p className="text-xs font-medium text-white">{creator.engagement}%</p>
          </div>
          <div className="h-2 bg-axium-gray-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full relative",
                creator.engagement > 75 ? "bg-axium-success" :
                creator.engagement > 50 ? "bg-axium-blue" :
                creator.engagement > 30 ? "bg-axium-warning" : "bg-axium-error"
              )}
              style={{ width: `${creator.engagement}%` }}
            >
              {/* Animated pulse effect */}
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse-subtle"></div>
            </div>
          </div>
        </div>
        
        {selected && (
          <div className="pt-2 grid grid-cols-2 gap-2">
            <Button className="w-full bg-axium-success hover:bg-axium-success/90 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              Buy
            </Button>
            <Button variant="outline" className="w-full border-axium-neon-blue text-axium-neon-blue hover:bg-axium-blue/10">
              Trade
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default CreatorCard;
