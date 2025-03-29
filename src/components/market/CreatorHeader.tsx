
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IPO } from "@/utils/mockApi";
import { formatCurrency } from "@/lib/utils";
import { HelpCircle, Sparkles, TrendingUp } from "lucide-react";
import { calculateCreatorValuation } from "@/lib/valuationEngine";
import { sampleCreatorMetrics } from "@/mock/creatorMetrics";

interface CreatorHeaderProps {
  creator: IPO | null;
  aiValuation?: number;
}

export function CreatorHeader({ creator, aiValuation }: CreatorHeaderProps) {
  if (!creator) {
    return null;
  }

  const { creatorName, symbol, currentPrice, initialPrice, totalSupply, availableSupply } = creator;
  
  // Calculate change percentage
  const changePercentage = ((currentPrice - initialPrice) / initialPrice) * 100;
  const isPositive = changePercentage >= 0;
  
  // Calculate market cap
  const marketCap = currentPrice * (totalSupply - availableSupply);
  
  // Generate avatar
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorName}`;
  
  // Display followers (mock data)
  const followers = Math.floor(Math.random() * 10000000) + 1000000;
  const formattedFollowers = new Intl.NumberFormat('en-US', { 
    notation: 'compact', 
    maximumFractionDigits: 1 
  }).format(followers);

  // Calculate creator valuation using our engine
  const calculatedValuation = calculateCreatorValuation(sampleCreatorMetrics);
  // Use provided AI valuation or our calculated one
  const displayedValuation = aiValuation || calculatedValuation;

  return (
    <GlassCard className="mb-6 backdrop-blur-md bg-background/70">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/10">
            <AvatarImage src={avatarUrl} alt={creatorName} />
            <AvatarFallback>{creatorName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{creatorName}</h2>
              <Badge variant="outline" className="text-muted-foreground">
                ${symbol}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formattedFollowers} followers</span>
              <span className="text-xs">•</span>
              <span>Market Cap: {formatCurrency(marketCap)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold">
              {formatCurrency(currentPrice)}
            </div>
            <div className={`text-sm ${isPositive ? 'text-axium-positive' : 'text-axium-negative'}`}>
              {isPositive ? '+' : ''}{changePercentage.toFixed(2)}%
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">AI Valuation</span>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(displayedValuation)}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI-powered fair value estimation based on creator performance metrics and market data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </GlassCard>
  );
}
