
import { Badge } from "@/components/ui/badge";
import { getSentimentColor, getSentimentLabel, normalizeSentimentScore } from "./utils";
import { cn } from "@/lib/utils";

interface SentimentScoreDisplayProps {
  score: number;
  eventCount: number;
}

export const SentimentScoreDisplay = ({ score, eventCount }: SentimentScoreDisplayProps) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className={cn(
        "text-4xl font-bold mb-1",
        getSentimentColor(score)
      )}>
        {Math.round(normalizeSentimentScore(score))}%
      </div>
      <Badge variant={score >= 0 ? "default" : "destructive"}>
        {getSentimentLabel(score)}
      </Badge>
      <p className="text-xs text-axium-gray-600 mt-1">
        Based on {eventCount} PR events
      </p>
    </div>
  );
};

export default SentimentScoreDisplay;
