
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Star, BarChart, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
}

export const CreatorCard = ({ creator, onSelect, selected }: CreatorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <GlassCard
      variant={selected ? "blue" : "default"}
      interactive={!selected}
      className={cn(
        "transition-all duration-300 overflow-visible",
        selected ? "ring-2 ring-axium-blue" : isHovered ? "shadow-glass-blue" : "",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(creator.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-axium-gray-200 overflow-hidden mr-3 flex-shrink-0">
            {/* This would be an actual image in production */}
            <div className="h-full w-full bg-gradient-to-br from-axium-blue/20 to-axium-blue-light/30" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight">{creator.name}</h3>
            <p className={cn(
              "text-sm",
              selected ? "text-axium-blue/80" : "text-axium-gray-600"
            )}>
              {creator.symbol}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-axium-gray-500 hover:text-axium-blue hover:bg-axium-blue/5"
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-axium-gray-500">Current Price</p>
            <div className="flex items-baseline space-x-2">
              <p className="font-semibold text-2xl">${creator.price.toFixed(2)}</p>
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1.5 bg-axium-blue/10 px-2.5 py-1 rounded-full">
                  <BarChart className="h-3.5 w-3.5 text-axium-blue" />
                  <span className="text-xs font-medium text-axium-blue">AI Score: {creator.aiScore}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs">
                  AI Valuation Score based on social engagement, market trends, and growth potential.
                  Higher scores (80+) indicate strong investment potential.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-axium-gray-500">Market Cap</p>
            <p className="font-medium">${(creator.marketCap / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-axium-gray-500">Followers</p>
            <p className="font-medium">{creator.followers}</p>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-axium-gray-500">Engagement Score</p>
            <p className="text-xs font-medium text-axium-gray-700">{creator.engagement}%</p>
          </div>
          <div className="h-2 bg-axium-gray-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                creator.engagement > 75 ? "bg-axium-success" :
                creator.engagement > 50 ? "bg-axium-blue" :
                creator.engagement > 30 ? "bg-axium-warning" : "bg-axium-error"
              )}
              style={{ width: `${creator.engagement}%` }}
            />
          </div>
        </div>
        
        {selected && (
          <div className="pt-2 grid grid-cols-2 gap-2">
            <Button className="w-full bg-axium-blue hover:bg-axium-blue/90 text-white">
              Buy
            </Button>
            <Button variant="outline" className="w-full border-axium-blue text-axium-blue hover:bg-axium-blue/5">
              Trade
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default CreatorCard;
