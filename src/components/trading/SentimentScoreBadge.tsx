
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentScoreBadgeProps {
  creatorId?: string;
  score?: number;
  size?: "sm" | "md" | "lg";
}

const SentimentScoreBadge = ({ creatorId, score = 0, size = "md" }: SentimentScoreBadgeProps) => {
  // Simulated sentiment score (would come from API in real app)
  const sentimentScore = useMemo(() => {
    if (score) return score;
    
    // Mock score generation based on creatorId if no score provided
    if (creatorId) {
      // Generate a consistent score based on creator ID hash
      const hash = creatorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return Math.floor(65 + (hash % 30)); // Scores between 65-95
    }
    
    return 75; // Default score
  }, [creatorId, score]);
  
  // Determine color based on score
  const getColorClass = () => {
    if (sentimentScore >= 80) return "bg-green-500/10 text-green-600 border-green-500/20";
    if (sentimentScore >= 60) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    if (sentimentScore >= 40) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-red-500/10 text-red-600 border-red-500/20";
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "lg":
        return "text-sm px-3 py-1.5";
      case "md":
      default:
        return "text-xs px-2.5 py-1";
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div 
            className={cn(
              "rounded-full border flex items-center font-medium",
              getColorClass(),
              getSizeClasses()
            )}
          >
            <BadgeCheck className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
            <span>Sentiment: {sentimentScore}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs max-w-xs">
            AI-powered sentiment score based on social media mentions, news coverage, and audience engagement.
            Higher scores indicate more positive public perception.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SentimentScoreBadge;
